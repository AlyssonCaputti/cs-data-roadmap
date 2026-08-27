/* VIEW — Hoje e estudo livre.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   RENDER — TODAY
   =========================================================== */

function todayChecks() {
  const k = todayKey();
  if (!state.todayChecks[k]) state.todayChecks[k] = {};
  // limpa dias antigos para não crescer indefinidamente
  const keys = Object.keys(state.todayChecks);
  if (keys.length > 30) keys.sort().slice(0, keys.length - 30).forEach((x) => delete state.todayChecks[x]);
  return state.todayChecks[k];
}

function checkRow(label, checked, onChange, meta) {
  const row = el("label", "check-row");
  const cb = el("input");
  cb.type = "checkbox";
  cb.checked = !!checked;
  cb.addEventListener("change", () => onChange(cb.checked));
  row.append(cb, el("span", "check-label", label));
  if (meta) row.appendChild(el("span", "check-meta", meta));
  return row;
}

function renderToday() {
  const d = new Date();
  $("#todayDate").textContent = d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });

  const body = $("#todayBody");
  body.innerHTML = "";
  const chk = todayChecks();
  let anything = false;

  // Estudos
  if (state.activeStudies.length) {
    anything = true;
    const g = el("div", "today-group");
    g.appendChild(el("h3", null, "Estudos"));
    state.activeStudies.forEach((id) => {
      const key = "study:" + id;
      g.appendChild(checkRow(studyName(id), chk[key], (v) => {
        Store.commit([], () => { chk[key] = v; });
        if (v) toast("Sessão de estudo registrada", "ok");
      }, "sessão"));
    });
    body.appendChild(g);
  }

  // Programming
  const g2 = el("div", "today-group");
  g2.appendChild(el("h3", null, "Programming"));
  const e = dayEntry(todayKey());
  if (goalMet(e)) {
    g2.appendChild(el("p", "today-done", "✓ Meta diária concluída"));
  }
  const mini = el("p", "note");
  mini.textContent = `hoje: ${e.easy || 0} easy · ${e.medium || 0} medium · ${e.hard || 0} hard`;
  g2.appendChild(mini);
  const go = el("button", "btn btn-sm", "Registrar em Programming Practice →");
  go.addEventListener("click", () => switchView("practice"));
  g2.appendChild(go);
  body.appendChild(g2);
  anything = true;

  // Livro
  const b = bookById(state.currentBook);
  if (b) {
    const g3 = el("div", "today-group");
    g3.appendChild(el("h3", null, "Livro"));
    g3.appendChild(checkRow(b.name, chk["book"], (v) => Store.commit([], () => { chk["book"] = v; }), "leitura"));
    body.appendChild(g3);
  }

  // Estudo livre
  const pend = state.freeStudy.filter((f) => !f.done);
  if (pend.length) {
    const g4 = el("div", "today-group");
    g4.appendChild(el("h3", null, "Estudo livre"));
    pend.slice(0, 3).forEach((f) => {
      const key = "free:" + f.id;
      g4.appendChild(checkRow(f.name, chk[key], (v) => Store.commit([], () => { chk[key] = v; }), "opcional"));
    });
    body.appendChild(g4);
  }

  if (!anything || (!state.activeStudies.length && !b)) {
    const hint = el("p", "today-empty",
      "Sem estudo ou livro ativo. Escolha até 2 estudos e 1 livro — e então volte para cá todos os dias.");
    body.appendChild(hint);
  }

  // Estudo livre — lista
  const list = $("#freeStudyList");
  list.innerHTML = "";
  state.freeStudy.forEach((f) => {
    const li = el("li", "free-item" + (f.done ? " is-done" : ""));
    const cb = el("input"); cb.type = "checkbox"; cb.checked = f.done;
    cb.setAttribute("aria-label", "Marcar " + f.name + " como explorado");
    cb.addEventListener("change", () => Store.commit([CH.TODAY], () => { f.done = cb.checked; }));
    li.append(cb, el("span", "free-name", f.name));
    const x = el("button", "icon-x", "×");
    x.setAttribute("aria-label", "Remover " + f.name);
    x.addEventListener("click", () => {
      Store.commit([CH.TODAY], (s) => { s.freeStudy = s.freeStudy.filter((z) => z.id !== f.id); });
    });
    li.appendChild(x);
    list.appendChild(li);
  });

  const sug = $("#freeSuggest");
  sug.innerHTML = "";
  FREE_SUGGESTIONS.filter((s) => !state.freeStudy.some((f) => f.name === s)).forEach((s) => {
    const c = el("button", "chip", s);
    c.addEventListener("click", () => addFreeStudy(s));
    sug.appendChild(c);
  });

  // First path
  const fp = $("#firstPathList");
  fp.innerHTML = "";
  FIRST_PATH.forEach((id) => {
    const st = studyStatus(id);
    const li = el("li", st === "COMPLETED" ? "is-done" : "");
    li.appendChild(el("span", null, studyName(id)));
    const tag = el("span", "path-pct", STATUS_ICON[st] + " " + st.toLowerCase().replace("_", " "));
    li.appendChild(tag);
    const btn = el("button", "btn btn-sm btn-ghost",
      st === "ACTIVE" ? "Pausar" : st === "COMPLETED" ? "Reabrir" : "Ativar");
    btn.addEventListener("click", () => {
      if (st === "ACTIVE") pauseStudy(id);
      else if (st === "COMPLETED") resetStudy(id);
      else activateStudy(id);
    });
    li.appendChild(btn);
    fp.appendChild(li);
  });
}

function addFreeStudy(name) {
  const n = String(name || "").trim();
  if (!n) return;
  if (state.freeStudy.some((f) => f.name.toLowerCase() === n.toLowerCase())) {
    toast("Esse estudo livre já está na lista", "warn"); return;
  }
  Store.commit([CH.TODAY], (s) => {
    s.freeStudy.push({ id: slug(n) + "-" + s.freeStudy.length, name: n, done: false });
  });
  toast("Estudo livre adicionado", "ok");
}
