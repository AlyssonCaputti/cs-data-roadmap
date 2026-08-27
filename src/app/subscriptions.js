/* APP — Tabela de dependencia view -> canais.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   SUBSCRIPTIONS

   Cada view declara de que canais depende. Uma mutacao publica o
   canal; quem depende dele redesenha. Views fora de tela sao
   puladas e redesenhadas ao voltar (switchView).
   =========================================================== */

const currentView = () => {
  const v = $(".view.is-visible");
  return v ? v.id.replace("view-", "") : "today";
};

/* [canais, render, view]. view null = sempre montado; caso contrario
   o render so roda com aquela view na tela. */
const VIEWS = [
  [CH.ALL,                                            renderDashboard,   null],
  [[CH.TOPICS, CH.STUDIES, CH.BOOKS, CH.REVIEW, CH.UI], renderSidebar,   null],
  [[CH.TOPICS],                                       renderTimeline,    null],
  [[CH.UI],                                           renderFilters,     null],
  [[CH.TOPICS, CH.UI],                                renderLevels,      null],
  [[CH.STUDIES, CH.BOOKS, CH.PRACTICE, CH.TODAY],     renderToday,       "today"],
  [[CH.PRACTICE],                                     renderPractice,    "practice"],
  [[CH.BOOKS, CH.STUDIES],                            renderBooks,       "books"],
  [[CH.PROJECTS, CH.TOPICS],                          renderProjects,    "projects"],
  [[CH.REVIEW, CH.TOPICS],                            renderReview,      "review"],
  [[CH.WEEKLY],                                       renderWeekly,      "weekly"],
  [[CH.UI],                                           renderStorageInfo, "settings"]
];

const guard = (fn, view) => () => { if (!view || currentView() === view) fn(); };

function bindSubscriptions() {
  VIEWS.forEach(([channels, fn, view]) => Store.on(channels, guard(fn, view)));
}

/* Primeiro paint e troca de view: redesenha o que esta na tela. */
function renderAll() {
  VIEWS.forEach(([, fn, view]) => guard(fn, view)());
}
