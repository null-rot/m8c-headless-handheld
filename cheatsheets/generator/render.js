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

/* Dispatcher: pick the layout by cfg.format ('single' | 'fold'). */
function renderInto(root, cfg) {
  if (cfg.format === "fold") {
    root.classList.add("fold");
    renderFold(root, cfg);
  } else {
    root.classList.remove("fold");
    renderSheet(root, cfg);
  }
}
