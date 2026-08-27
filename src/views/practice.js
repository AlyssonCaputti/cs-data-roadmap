/* VIEW — Pratica, C++ e DSA.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   RENDER — PRACTICE
   =========================================================== */

function counterRow(label, kind, value) {
  const row = el("div", "free-item");
  row.appendChild(el("span", "free-name", label));
  const minus = el("button", "btn btn-sm", "−");
  minus.setAttribute("aria-label", "Remover um problema " + label);
  minus.addEventListener("click", () => addProblem(kind, -1));
  const val = el("span", "check-meta", String(value));
  val.style.minWidth = "20px";
  val.style.textAlign = "center";
  const plus = el("button", "btn btn-sm btn-primary", "+");
  plus.setAttribute("aria-label", "Adicionar um problema " + label);
  plus.addEventListener("click", () => addProblem(kind, +1));
  row.append(minus, val, plus);
  return row;
}

function renderPractice() {
  const box = $("#practiceToday");
  box.innerHTML = "";
  const e = dayEntry(todayKey());

  if (goalMet(e)) {
    const g = el("div", "goal-done");
    g.append(el("span", null, "✓"), el("span", null, "Meta diária concluída"));
    box.appendChild(g);
  }

  const g1 = el("div", "today-group");
  g1.appendChild(el("h3", null, "3 problemas simples"));
  for (let i = 0; i < 3; i++) {
    const filled = (e.easy || 0) > i;
    g1.appendChild(checkRow("Problema " + (i + 1) + " — Easy", filled, (v) => {
      addProblem("easy", v ? +1 : -1);
    }));
  }
  box.appendChild(g1);

  box.appendChild(el("div", "or-sep", "ou"));

  const g2 = el("div", "today-group");
  g2.appendChild(el("h3", null, "1 problema médio ou difícil"));
  g2.appendChild(counterRow("Medium", "medium", e.medium || 0));
  g2.appendChild(counterRow("Hard", "hard", e.hard || 0));
  box.appendChild(g2);

  box.appendChild(el("p", "note",
    "Registrar aqui é o suficiente. Não persiga o streak — persiga o hábito de resolver problemas."));

  // stats
  const cp = state.competitiveProgramming;
  const si = streakInfo();
  const stats = $("#practiceStats");
  stats.innerHTML = "";
  [["Resolvidos", cp.solved || 0], ["Streak", si.streak], ["Dias", si.practiced],
   ["Easy", cp.easy || 0], ["Medium", cp.medium || 0], ["Hard", cp.hard || 0]]
   .forEach(([l, v]) => {
     const m = el("div", "mini");
     m.append(el("b", null, String(v)), el("span", null, l));
     stats.appendChild(m);
   });

  // heatmap 84 dias
  const heat = $("#practiceHeat");
  heat.innerHTML = "";
  const now = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    const k = todayKey(d);
    const entry = cp.daily[k];
    const n = entry ? dayTotal(entry) : 0;
    const cell = el("i", n >= 3 ? "l3" : n === 2 ? "l2" : n === 1 ? "l1" : "");
    if (i === 0) cell.classList.add("today");
    cell.title = `${k} — ${n} problema${n === 1 ? "" : "s"}`;
    heat.appendChild(cell);
  }

  // C++ / DSA
  const cpp = $("#cppTrack");
  cpp.innerHTML = "";

  const mkTrack = (title, list, store) => {
    const g = el("div", "today-group");
    const done = list.filter((x) => store[x]).length;
    const h = el("div", "group-head");
    h.append(el("h3", null, title), el("span", "group-count", done + " / " + list.length));
    g.appendChild(h);
    const grid = el("div", "mastery-grid");
    list.forEach((name) => {
      grid.appendChild(checkRow(name, !!store[name], (v) => {
        Store.commit([CH.PRACTICE], () => {
          if (v) store[name] = true; else delete store[name];
        });
      }));
    });
    g.appendChild(grid);
    return g;
  };

  cpp.appendChild(mkTrack("C++ Quick Track", CPP_TRACK, state.cpp));
  cpp.appendChild(mkTrack("DSA", DSA_TRACK, state.dsa));
  cpp.appendChild(el("p", "note",
    "A trilha de C++ é propositalmente curta. Não a transforme em uma segunda graduação."));
}
