/* DOMAIN — Estudos: no maximo 2 ativos.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   STUDY MANAGEMENT  (regra: máximo 2 ativos)
   =========================================================== */

function activateStudy(id) {
  if (state.activeStudies.includes(id)) return;
  if (state.activeStudies.length >= 2) {
    const list = el("ul", "modal-list");
    state.activeStudies.forEach((s) => list.appendChild(el("li", null, "● " + studyName(s))));
    showModal("Focus protection", [
      "Você está tentando adicionar mais uma frente de estudo. Atualmente:",
      list,
      el("p", null, `${state.activeStudies.length} estudos ativos · ${state.currentBook ? 1 : 0} livro ativo`),
      "Finalize ou pause algo antes de adicionar outra coisa."
    ], [{ label: "Entendi", cls: "btn-primary" }]);
    return;
  }
  Store.commit([CH.STUDIES, CH.TODAY], (s) => {
    s.pausedStudies = s.pausedStudies.filter((x) => x !== id);
    s.completedStudies = s.completedStudies.filter((x) => x !== id);
    s.activeStudies.push(id);
  });
  toast("Study activated — " + studyName(id), "ok");
}

function pauseStudy(id) {
  Store.commit([CH.STUDIES, CH.TODAY], (s) => {
    s.activeStudies = s.activeStudies.filter((x) => x !== id);
    if (!s.pausedStudies.includes(id)) s.pausedStudies.push(id);
  });
  toast("Estudo pausado — " + studyName(id), "warn");
}

function completeStudy(id) {
  Store.commit([CH.STUDIES, CH.TODAY], (s) => {
    s.activeStudies = s.activeStudies.filter((x) => x !== id);
    s.pausedStudies = s.pausedStudies.filter((x) => x !== id);
    if (!s.completedStudies.includes(id)) s.completedStudies.push(id);
  });
  toast("Estudo concluído — " + studyName(id), "ok");
}

function resetStudy(id) {
  Store.commit([CH.STUDIES, CH.TODAY], (s) => {
    s.activeStudies = s.activeStudies.filter((x) => x !== id);
    s.pausedStudies = s.pausedStudies.filter((x) => x !== id);
    s.completedStudies = s.completedStudies.filter((x) => x !== id);
  });
}

const studyStatus = (id) =>
  state.activeStudies.includes(id) ? "ACTIVE"
  : state.pausedStudies.includes(id) ? "PAUSED"
  : state.completedStudies.includes(id) ? "COMPLETED"
  : "NOT_STARTED";

const STATUS_ICON = { NOT_STARTED: "○", ACTIVE: "●", PAUSED: "Ⅱ", COMPLETED: "✓" };
