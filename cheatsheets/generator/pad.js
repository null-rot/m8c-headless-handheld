/* Full gamepad pad generator.
 *
 * Draws EVERY physical control once, each as a <g class="ctrl ctrl-<id>"> with the
 * standard highlight layers (placeholder / bkg / hold / first / second / double_tap)
 * plus an always-visible label. At render time applyPadConfig() assigns the M8
 * FUNCTION classes (edit_button/option_button/shift_button/play_button/quit_button and
 * the fixed up/down/left/right_button) onto whichever controls the user picked, so the
 * existing token-highlight CSS lights up the right button.
 */

const PAD_VIEWBOX = "0 0 60 36";

// Every physical control. Direction controls are fixed to the D-pad.
const PAD_CONTROLS = [
  // shoulders (two per side)
  { id: "l2", shape: "rect", x: 1,   y: 0.5, w: 7, h: 3, rx: 1, num: 2.2, label: { t: "L2", x: 4.5,  y: 6.0, a: "middle" } },
  { id: "l1", shape: "rect", x: 8.5, y: 0.5, w: 7, h: 3, rx: 1, num: 2.2, label: { t: "L1", x: 12,   y: 6.0, a: "middle" } },
  { id: "r1", shape: "rect", x: 44.5,y: 0.5, w: 7, h: 3, rx: 1, num: 2.2, label: { t: "R1", x: 48,   y: 6.0, a: "middle" } },
  { id: "r2", shape: "rect", x: 52,  y: 0.5, w: 7, h: 3, rx: 1, num: 2.2, label: { t: "R2", x: 55.5, y: 6.0, a: "middle" } },

  // d-pad (fixed directions)
  { id: "up",    shape: "rect", x: 6, y: 12, w: 5, h: 5, rx: 0.6, num: 3.2, dpad: true },
  { id: "left",  shape: "rect", x: 1, y: 17, w: 5, h: 5, rx: 0.6, num: 3.2, dpad: true },
  { id: "right", shape: "rect", x: 11,y: 17, w: 5, h: 5, rx: 0.6, num: 3.2, dpad: true },
  { id: "down",  shape: "rect", x: 6, y: 22, w: 5, h: 5, rx: 0.6, num: 3.2, dpad: true },

  // face buttons (X top, Y left, A right, B bottom)
  { id: "x", shape: "circle", cx: 47,   cy: 13,   r: 2.7, num: 3.2, label: { t: "X", x: 47,   y: 9.6,  a: "middle" } },
  { id: "y", shape: "circle", cx: 41.5, cy: 18.5, r: 2.7, num: 3.2, label: { t: "Y", x: 38,   y: 19.4, a: "end" } },
  { id: "a", shape: "circle", cx: 52.5, cy: 18.5, r: 2.7, num: 3.2, label: { t: "A", x: 56,   y: 19.4, a: "start" } },
  { id: "b", shape: "circle", cx: 47,   cy: 24,   r: 2.7, num: 3.2, label: { t: "B", x: 47,   y: 28.2, a: "middle" } },

  // select / start
  { id: "select", shape: "rect", x: 19.5, y: 28, w: 7, h: 3.2, rx: 1.2, num: 2.2, label: { t: "SELECT", x: 23, y: 33.7, a: "middle", s: 1.8 } },
  { id: "start",  shape: "rect", x: 29.5, y: 28, w: 7, h: 3.2, rx: 1.2, num: 2.2, label: { t: "START",  x: 33, y: 33.7, a: "middle", s: 1.8 } },

  // stick clicks
  { id: "l3", shape: "circle", cx: 9,  cy: 31, r: 2.3, num: 2.6, label: { t: "L3", x: 9,  y: 35.4, a: "middle", s: 1.8 } },
  { id: "r3", shape: "circle", cx: 51, cy: 31, r: 2.3, num: 2.6, label: { t: "R3", x: 51, y: 35.4, a: "middle", s: 1.8 } },
];

const PAD_CONTROL_IDS = PAD_CONTROLS.filter((c) => !c.dpad).map((c) => c.id);

function _shape(c, cls, fill) {
  if (c.shape === "circle")
    return `<circle class="${cls}" cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="${fill}"/>`;
  return `<rect class="${cls}" x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="${c.rx}" fill="${fill}"/>`;
}

function _center(c) {
  if (c.shape === "circle") return { x: c.cx, y: c.cy };
  return { x: c.x + c.w / 2, y: c.y + c.h / 2 };
}

function _topRight(c) {
  if (c.shape === "circle") return { x: c.cx + c.r, y: c.cy - c.r };
  return { x: c.x + c.w, y: c.y };
}

function _ctrlGroup(c) {
  const ctr = _center(c);
  const num = c.num || 3;
  const tri = `M ${ctr.x - 1.1} ${ctr.y - 0.4} L ${ctr.x + 1.1} ${ctr.y - 0.4} L ${ctr.x} ${ctr.y + 1.2} Z`;
  const tr = _topRight(c);
  const bx = tr.x - 3.6, by = tr.y - 1.6;
  const label = c.label
    ? `<text class="ctrl-label" x="${c.label.x}" y="${c.label.y}" font-size="${c.label.s || 2.4}" text-anchor="${c.label.a}">${c.label.t}</text>`
    : "";
  const holdShape =
    c.shape === "circle"
      ? `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="#000"/>`
      : `<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="${c.rx}" fill="#000"/>`;
  return `
  <g class="ctrl ctrl-${c.id}">
    ${_shape(c, "placeholder", "#CCC")}
    ${_shape(c, "bkg", "#000")}
    <g class="hold">${holdShape}<path d="${tri}" fill="#fff"/></g>
    <text class="first" x="${ctr.x}" y="${ctr.y + num * 0.35}" font-size="${num}" fill="#fff" text-anchor="middle">1</text>
    <text class="second" x="${ctr.x}" y="${ctr.y + num * 0.35}" font-size="${num}" fill="#fff" text-anchor="middle">2</text>
    <g class="double_tap"><rect x="${bx}" y="${by}" width="4" height="2.9" rx="0.7" fill="#000"/><text x="${bx + 2}" y="${by + 2.2}" font-size="2.2" fill="#fff" text-anchor="middle">x2</text></g>
    ${label}
  </g>`;
}

// D-pad cluster label
function _dpadLabel() {
  return `<text class="ctrl-label dpad-label" x="8.5" y="10.8" font-size="2.4" text-anchor="middle">D-PAD</text>`;
}

function padSvg(extraClass) {
  const groups = PAD_CONTROLS.map(_ctrlGroup).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${PAD_VIEWBOX}" fill="none" class="buttons ${extraClass || ""}">
  <g class="button_pad">
  ${_dpadLabel()}
  ${groups}
  </g>
</svg>`;
}

// Map M8 functions to the function-class the highlight CSS expects.
const FUNCTION_CLASS = {
  edit: "edit_button",
  option: "option_button",
  shift: "shift_button",
  play: "play_button",
  quit: "quit_button",
};

/* Apply a binding config to a rendered pad element (in place).
 * cfg = { edit:'a', option:'b', shift:'select', play:'start', quit:'l1' }
 * Direction functions are always the D-pad. Controls with no function are dimmed.
 */
function applyPadConfig(svgEl, cfg) {
  // reset
  svgEl.querySelectorAll(".ctrl").forEach((g) => {
    g.classList.remove(
      "edit_button", "option_button", "shift_button", "play_button", "quit_button",
      "up_button", "down_button", "left_button", "right_button", "assigned"
    );
    g.classList.add("unused");
  });
  // fixed directions
  const dirs = { up: "up_button", down: "down_button", left: "left_button", right: "right_button" };
  Object.entries(dirs).forEach(([id, cls]) => {
    const g = svgEl.querySelector(`.ctrl-${id}`);
    if (g) { g.classList.add(cls, "assigned"); g.classList.remove("unused"); }
  });
  // assigned functions
  Object.entries(FUNCTION_CLASS).forEach(([fn, cls]) => {
    const id = cfg[fn];
    if (!id) return;
    const g = svgEl.querySelector(`.ctrl-${id}`);
    if (g) { g.classList.add(cls, "assigned"); g.classList.remove("unused"); }
  });
}

if (typeof module !== "undefined") module.exports = { padSvg, applyPadConfig, PAD_CONTROLS, PAD_CONTROL_IDS };
