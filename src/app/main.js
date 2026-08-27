/* APP — Bootstrap.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   INIT
   =========================================================== */

function init() {
  loadState();
  applyTheme();
  bindSubscriptions();
  bindEvents();
  bindRail();
  setTimerMode(25);
  renderMindset();
  renderAll();

  const o = overallStats();
  if (o.done === 0 && !state.activeStudies.length) {
    setTimeout(() => {
      toast("Comece escolhendo até 2 estudos em Your first path.", "ok");
    }, 700);
  }
}

document.addEventListener("DOMContentLoaded", init);
