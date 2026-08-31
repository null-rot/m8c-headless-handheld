/* Renders the personalized cheat sheet from `data` (shortcuts) + a bindings config.
 * Each row's pad is generated with padSvg(command) then personalized with applyPadConfig(). */

function ctrlLabel(id, legend) { return deviceLabel(id, legend || "nintendo"); }

// Build the "Your Controls" legend section from the current bindings.
function buildLegend(cfg) {
  const L = (id) => ctrlLabel(id, cfg.legend);
  return {
    column: 1,
    section: "Your Controls",
    legend: true,
    actions: [
      { name: "EDIT",   secondary: "= " + L(cfg.edit),   description: "Select / Enter", command: "edit" },
      { name: "OPTION", secondary: "= " + L(cfg.option), description: "Cancel / Back",  command: "option" },
      { name: "SHIFT",  secondary: "= " + L(cfg.shift),  description: "Shift / Alt",     command: "shift" },
      { name: "PLAY",   secondary: "= " + L(cfg.play),   description: "Start / Stop",    command: "play" },
      { name: "D-PAD",  description: "Navigate / change values", command: "up down left right" },
      { name: "Quit m8c", secondary: "= " + L(cfg.shift) + " + " + L(cfg.quit), description: "exit the app", command: "shifthold quit" },
      { name: "Selection Mode Only", description: "the grey-shaded rows", command: "", selection: true },
    ],
  };
}

function makeAction(action, cfg) {
  const row = document.createElement("div");
  row.className = "action" + (action.selection ? " selection-mode" : "");

  const btns = document.createElement("div");
  btns.className = "action_buttons";
  btns.innerHTML = padSvg(action.command || "");
  applyPadConfig(btns.firstElementChild, cfg);

  const txt = document.createElement("div");
  txt.className = "action_text";
  const name = document.createElement("span"); name.className = "name"; name.textContent = action.name || "";
  const sec = document.createElement("span"); sec.className = "secondary"; sec.textContent = action.secondary ? " " + action.secondary : "";
  const desc = document.createElement("span"); desc.className = "description"; desc.textContent = action.description || "";
  const extra = document.createElement("span"); extra.className = "extra"; extra.textContent = action.extra || "";
  txt.append(name, sec, desc, extra);

  row.append(btns, txt);
  return row;
}

function renderSheet(root, cfg) {
  root.innerHTML = "";
  const content = document.createElement("div");
  content.className = "content";
  const cols = [1, 2, 3].map((n) => {
    const d = document.createElement("div");
    d.className = "column";
    content.appendChild(d);
    return d;
  });
  root.appendChild(content);

  const sections = data.concat([buildLegend(cfg)]);
  sections.forEach((section) => {
    const target = cols[(section.column || 1) - 1] || cols[0];
    const sc = document.createElement("div");
    sc.className = "section_container" + (section.legend ? " legend-section" : "");
    const header = document.createElement("div");
    header.className = "section_header";
    header.textContent = section.section;
    sc.appendChild(header);
    section.actions.forEach((a) => sc.appendChild(makeAction(a, cfg)));
    target.appendChild(sc);
  });
}
