/* UI — Seletores, criacao de elementos, datas, stats.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   HELPERS
   =========================================================== */

const $  = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

function todayKey(d) {
  const x = d || new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`;
}

function weekKey(d) {
  const x = new Date(d || Date.now());
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() + 4 - (x.getDay() || 7));      // quinta da semana ISO
  const jan1 = new Date(x.getFullYear(), 0, 1);
  const wk = Math.ceil((((x - jan1) / 86400000) + 1) / 7);
  return `${x.getFullYear()}-W${String(wk).padStart(2, "0")}`;
}

function fmtMin(m) {
  const mins = Math.round(m || 0);
  if (mins < 60) return mins + "m";
  return Math.floor(mins / 60) + "h" + (mins % 60 ? String(mins % 60).padStart(2, "0") : "");
}

const topicState = (id) => {
  if (!state.topics[id]) state.topics[id] = { completed: false, mastery: [false, false, false, false], review: false };
  const t = state.topics[id];
  if (!Array.isArray(t.mastery) || t.mastery.length !== 4) t.mastery = [false, false, false, false];
  return t;
};

const isDone = (id) => !!(state.topics[id] && state.topics[id].completed);

function levelStats(lv) {
  let total = 0, done = 0;
  lv.groups.forEach((g) => g.items.forEach((it) => { total++; if (isDone(it.id)) done++; }));
  return { total, done, pct: total ? Math.round(done / total * 100) : 0 };
}

function overallStats() {
  const total = ALL_TOPIC_IDS.length;
  const done = ALL_TOPIC_IDS.filter(isDone).length;
  return { total, done, pct: total ? Math.round(done / total * 100) : 0 };
}

const studyName = (id) => (STUDIES.find((s) => s.id === id) || { name: id }).name;
const bookById  = (id) => BOOKS.find((b) => b.id === id);
