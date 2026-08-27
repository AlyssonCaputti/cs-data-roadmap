/* VIEW — Dashboard e sidebar.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   RENDER — DASHBOARD & SIDEBAR
   =========================================================== */

function renderDashboard() {
  const o = overallStats();
  $("#statOverall").textContent = o.pct + "%";
  const bar = $("#statOverallBar");
  bar.style.width = o.pct + "%";
  bar.classList.toggle("is-done", o.pct === 100);

  $("#statStudies").textContent = state.activeStudies.length;
  $("#statStudiesHint").textContent = state.activeStudies.length
    ? state.activeStudies.map(studyName).join(" · ")
    : "Nenhum estudo ativo";

  const b = bookById(state.currentBook);
  $("#statBook").textContent = state.currentBook ? 1 : 0;
  $("#statBookHint").textContent = b ? `${b.name.split(":")[0]} — cap ${state.bookProgress}/${b.chapters}` : "Nenhum livro ativo";

  const cp = state.competitiveProgramming;
  $("#statProblems").textContent = cp.solved || 0;
  $("#statProblemsHint").textContent = `easy ${cp.easy || 0} · med ${cp.medium || 0} · hard ${cp.hard || 0}`;

  const si = streakInfo();
  $("#statStreak").firstChild.nodeValue = si.streak;
  $("#statDaysPracticed").textContent = si.practiced + " dias praticados";

  const today = state.studyTime.days[todayKey()] || 0;
  let week = 0;
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    week += state.studyTime.days[todayKey(d)] || 0;
  }
  $("#statTimeToday").textContent = fmtMin(today);
  $("#statTimeHint").textContent = `semana ${fmtMin(week)} · total ${fmtMin(state.studyTime.total)}`;

  // ---- Focus: medidores de slot ----
  const nStudies = state.activeStudies.length;
  const nBook = state.currentBook ? 1 : 0;
  $("#focusStudies").textContent = nStudies + "/2";
  $("#focusBook").textContent = nBook + "/1";

  const slots = (node, used, max) => {
    node.innerHTML = "";
    for (let i = 0; i < max; i++) node.appendChild(el("i", i < used ? "is-on" : ""));
  };
  slots($("#focusSlotsStudies"), nStudies, 2);
  slots($("#focusSlotsBook"), nBook, 1);
  $("#focusRowStudies").classList.toggle("is-full", nStudies >= 2);
  $("#focusRowBook").classList.toggle("is-full", nBook >= 1);

  const full = nStudies >= 2 && nBook >= 1;
  const hint = $("#focusHint");
  hint.textContent = full ? "no limite" : "livre";
  hint.classList.toggle("is-full", full);

  // ---- Contagens na navegação ----
  const reviewCount = ALL_TOPIC_IDS.filter((id) => state.topics[id] && state.topics[id].review).length;
  const badge = $("#reviewBadge");
  badge.hidden = reviewCount === 0;
  badge.textContent = reviewCount;

  $("#navMetaRoadmap").textContent = o.done + "/" + o.total;
  $("#navMetaPractice").textContent = cp.solved ? String(cp.solved) : "";
  $("#navMetaBooks").textContent = state.completedBooks.length
    ? state.completedBooks.length + "/" + BOOKS.length : "";
  $("#navMetaProjects").textContent = (() => {
    const done = PROJECTS.filter((p) =>
      p.steps.every((_, i) => state.projectSteps[p.id + ":" + i])).length;
    return done ? done + "/" + PROJECTS.length : "";
  })();
  $("#navMetaToday").textContent = (() => {
    const e = dayEntry(todayKey());
    return goalMet(e) ? "✓" : "";
  })();
  const wk = state.weekly[weekKey()];
  $("#navMetaWeekly").textContent = wk && wk.some(Boolean)
    ? wk.filter(Boolean).length + "/" + WEEKLY_ITEMS.length : "";

  $("#footerCounts").textContent = `${o.done}/${o.total} tópicos · ${ROADMAP.length} níveis`;
}

function renderSidebar() {
  const box = $("#sideActiveStudies");
  box.innerHTML = "";
  state.activeStudies.forEach((id) => {
    const n = el("div", "side-item");
    const top = el("div", "side-item-top");
    top.append(el("span", "side-dot"), el("h3", null, studyName(id)));
    n.appendChild(top);
    n.appendChild(el("span", "side-kind", "estudo"));
    box.appendChild(n);
  });

  const bb = $("#sideBook");
  bb.innerHTML = "";
  const b = bookById(state.currentBook);
  if (b) {
    const pct = Math.round(state.bookProgress / b.chapters * 100);
    const n = el("div", "side-item");
    const top = el("div", "side-item-top");
    const dot = el("span", "side-dot is-book");
    top.append(dot, el("h3", null, b.name.split(":")[0]),
               el("span", "side-num", state.bookProgress + "/" + b.chapters));
    n.appendChild(top);
    const bar = el("div", "bar"); const fill = el("div", "bar-fill" + (pct === 100 ? " is-done" : ""));
    fill.style.width = pct + "%";
    bar.appendChild(fill);
    n.appendChild(bar);
    bb.appendChild(n);
  }

  // Estado vazio único, só quando não há nada em andamento.
  const block = box.closest(".side-block");
  const empty = block.querySelector(".side-empty");
  if (empty) empty.remove();
  if (!state.activeStudies.length && !b) {
    block.appendChild(el("p", "side-empty",
      "Nada em andamento. Escolha até 2 estudos e 1 livro."));
  }

  // Pontos de status do rail: com a sidebar recolhida, o texto some,
  // mas continua visível que há estudos/livro em andamento.
  const dots = $("#railDots");
  dots.innerHTML = "";
  state.activeStudies.forEach(() => dots.appendChild(el("i", "is-study")));
  if (b) dots.appendChild(el("i", "is-book"));
}
