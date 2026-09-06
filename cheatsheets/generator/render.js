/* Renders the personalized cheat sheet from `data` (shortcuts) + a bindings config.
 * Each row's pad is generated with padSvg(command) then personalized with applyPadConfig(). */

function ctrlLabel(id, legend) { return deviceLabel(id, legend || "nintendo"); }

// Swap the M8 function names (EDIT/OPTION/SHIFT/PLAY/QUIT) inside a line of text
// for whichever physical button the user mapped them to, e.g. "hold SHIFT + EDIT"
// -> "hold SELECT + A". Only used when cfg.textNames === 'device'.
const FUNCTION_TEXT_MAP = { EDIT: "edit", OPTION: "option", SHIFT: "shift", PLAY: "play", QUIT: "quit" };
function withMappedNames(text, cfg) {
  if (!text || cfg.textNames !== "device") return text || "";
  return text.replace(/\b(EDIT|OPTION|SHIFT|PLAY|QUIT)\b/g, function (word) {
    const fn = FUNCTION_TEXT_MAP[word];
    const id = cfg[fn];
    return id ? ctrlLabel(id, cfg.legend).toUpperCase() : word;
  });
}

// Coloured button-icon badges (Anbernic face-button colours), used instead of
// plain text when cfg.textNames === 'device' && cfg.buttonIcons === 'on'.
const BADGE_FACE_COLORS = { a: "#dd3b32", b: "#e0a800", x: "#2f7fd1", y: "#3a9e50" };
const BADGE_DPAD_ARROW = { up: "▲", down: "▼", left: "◀", right: "▶" };
const BADGE_PILL_LABELS = { select: "Sel", start: "St" };
const WORD_TO_CONTROL = {
  EDIT: (cfg) => cfg.edit,
  OPTION: (cfg) => cfg.option,
  SHIFT: (cfg) => cfg.shift,
  PLAY: (cfg) => cfg.play,
  QUIT: (cfg) => cfg.quit,
  UP: () => "up",
  DOWN: () => "down",
  LEFT: () => "left",
  RIGHT: () => "right",
};

function controlBadge(id, cfg) {
  const span = document.createElement("span");
  if (BADGE_FACE_COLORS[id]) {
    span.className = "btn-badge circle";
    span.style.background = BADGE_FACE_COLORS[id];
    span.style.color = "#fff";
    span.textContent = ctrlLabel(id, cfg.legend).toUpperCase();
  } else if (BADGE_DPAD_ARROW[id]) {
    span.className = "btn-badge dpad";
    span.style.background = "#888f97";
    span.style.color = "#fff";
    span.textContent = BADGE_DPAD_ARROW[id];
  } else {
    span.className = "btn-badge pill";
    span.style.background = "#1a1a1a";
    span.style.color = "#fff";
    span.textContent = BADGE_PILL_LABELS[id] || ctrlLabel(id, cfg.legend).toUpperCase();
  }
  return span;
}

// Turns a line of text into a mix of text nodes and <span class="btn-badge">
// icons wherever an M8 function name or a d-pad direction word appears.
function textWithButtonIcons(text, cfg) {
  const frag = document.createDocumentFragment();
  const re = /\b(EDIT|OPTION|SHIFT|PLAY|QUIT|UP|DOWN|LEFT|RIGHT)\b/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
    const id = WORD_TO_CONTROL[m[1]](cfg);
    frag.appendChild(id ? controlBadge(id, cfg) : document.createTextNode(m[1]));
    last = re.lastIndex;
  }
  if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
  return frag;
}

// Appends `text` into `el`, either as plain (optionally name-mapped) text or,
// when the button-icon option is on, as a mix of text + coloured badges.
function appendMappedText(el, text, cfg) {
  if (!text) return;
  if (cfg.textNames === "device" && cfg.buttonIcons === "on") {
    el.appendChild(textWithButtonIcons(text, cfg));
  } else {
    el.appendChild(document.createTextNode(withMappedNames(text, cfg)));
  }
}

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

  if (cfg.rowStyle !== "text") {
    const btns = document.createElement("div");
    btns.className = "action_buttons";
    btns.innerHTML = padSvg(action.command || "");
    applyPadConfig(btns.firstElementChild, cfg);
    row.appendChild(btns);
  }

  const txt = document.createElement("div");
  txt.className = "action_text";
  const name = document.createElement("span"); name.className = "name"; name.textContent = action.name || "";
  const sec = document.createElement("span"); sec.className = "secondary";
  if (action.secondary) { sec.appendChild(document.createTextNode(" ")); appendMappedText(sec, action.secondary, cfg); }
  const desc = document.createElement("span"); desc.className = "description"; appendMappedText(desc, action.description, cfg);
  const extra = document.createElement("span"); extra.className = "extra"; appendMappedText(extra, action.extra, cfg);
  txt.append(name, sec, desc, extra);

  row.appendChild(txt);
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

/* ---- Fold booklet (4 small pages, cut/fold marks) ---- */

function foldPage(page, cfg) {
  const p = document.createElement("div");
  p.className = "page";
  page.sections.forEach((section) => {
    const s = document.createElement("div");
    s.className = "section";
    s.textContent = section.section || section.name;
    p.appendChild(s);
    // reuse the compact flex row from the single-page card
    section.actions.forEach((a) => p.appendChild(makeAction(a, cfg)));
  });
  return p;
}

function foldLegendBanner(cfg) {
  const L = (id) => ctrlLabel(id, cfg.legend);
  const div = document.createElement("div");
  div.className = "legend";
  div.innerHTML =
    "<div class='maprow'><b>SHIFT</b>=" + L(cfg.shift) + " &middot; <b>PLAY</b>=" + L(cfg.play) +
    " &middot; <b>EDIT</b>=" + L(cfg.edit) + " &middot; <b>OPTION</b>=" + L(cfg.option) +
    " &middot; <b>D-pad</b>=Up/Down/Left/Right &middot; <b>Quit</b>=" + L(cfg.shift) + "+" + L(cfg.quit) +
    " &middot; <span class='note'>icons=your buttons, words=M8 names</span></div>";
  return div;
}

function renderFold(root, cfg) {
  root.innerHTML =
    "<div class='guide'>" +
    "<div class='row'><div class='cut'></div><div class='fold'></div><div class='cut rotate90'></div></div>" +
    "<div class='row'><div class='fold rotate90'></div><div>" +
    "<div class='spread' id='recto'></div><div class='spread' id='verso'></div>" +
    "</div><div class='fold rotate90'></div></div>" +
    "<div class='row'><div class='cut rotate270'></div><div class='fold'></div><div class='cut rotate180'></div></div>" +
    "</div>";
  const recto = root.querySelector("#recto");
  const verso = root.querySelector("#verso");
  recto.appendChild(foldPage(FOLD_PAGES[0], cfg));
  recto.appendChild(foldPage(FOLD_PAGES[3], cfg));
  verso.appendChild(foldPage(FOLD_PAGES[1], cfg));
  verso.appendChild(foldPage(FOLD_PAGES[2], cfg));
  recto.querySelector(".page").prepend(foldLegendBanner(cfg));
}

/* Dispatcher: pick the layout by cfg.format ('single' | 'fold')
   and the paper size by cfg.paper ('letter' | 'a4'). */
function renderInto(root, cfg) {
  root.classList.remove("paper-letter", "paper-a4");
  root.classList.add(cfg.paper === "a4" ? "paper-a4" : "paper-letter");
  root.classList.toggle("rowstyle-text", cfg.rowStyle === "text");
  if (cfg.format === "fold") {
    root.classList.add("fold");
    renderFold(root, cfg);
  } else {
    root.classList.remove("fold");
    renderSheet(root, cfg);
  }
}
