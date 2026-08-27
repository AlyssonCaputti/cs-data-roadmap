/* APP — Binding de eventos do DOM.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   EVENTS
   =========================================================== */

function bindEvents() {
  // navegação
  $$(".nav-item").forEach((b) => b.addEventListener("click", () => switchView(b.dataset.view)));
  $("#menuToggle").addEventListener("click", () => {
    $("#sidebar").classList.contains("is-open") ? closeSidebar() : openSidebar();
  });
  $("#sidebarScrim").addEventListener("click", closeSidebar);

  // tema
  $("#themeToggle").addEventListener("click", toggleTheme);

  // busca
  let searchTimer = null;
  const input = $("#searchInput");
  input.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = input.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (searchQuery) switchView("roadmap");
      renderLevels();
    }, 160);
  });

  // timer
  $$("#view-today .timer-modes .chip").forEach((c) =>
    c.addEventListener("click", () => setTimerMode(+c.dataset.min)));
  $("#timerStart").addEventListener("click", startTimer);
  $("#timerPause").addEventListener("click", stopTimer);
  $("#timerReset").addEventListener("click", resetTimer);

  // estudo livre
  $("#freeStudyForm").addEventListener("submit", (e) => {
    e.preventDefault();
    addFreeStudy($("#freeStudyInput").value);
    $("#freeStudyInput").value = "";
  });

  // settings
  $("#btnSync").addEventListener("click", syncToRepo);
  $("#btnLoadRepo").addEventListener("click", loadFromRepo);
  $("#btnExport").addEventListener("click", exportProgress);
  $("#btnImport").addEventListener("click", () => $("#importFile").click());
  $("#importFile").addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) importProgress(f);
    e.target.value = "";
  });
  $("#btnReset").addEventListener("click", resetProgress);

  // modal
  $("#modalScrim").addEventListener("click", (e) => {
    if (e.target === $("#modalScrim")) closeModal();
  });

  // atalhos
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!$("#modalScrim").hidden) closeModal();
      else if ($("#sidebar").classList.contains("is-open")) closeSidebar();
      else if (document.activeElement === input) { input.value = ""; input.blur(); searchQuery = ""; renderLevels(); }
    }
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    if (e.key === "/" && !typing) { e.preventDefault(); input.focus(); }
  });

  // salva antes de sair
  window.addEventListener("beforeunload", () => {
    if (timer.running) logStudyMinutes(timer.elapsed / 60 % 1);
    saveState(true);
  });
}
