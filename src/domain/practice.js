/* DOMAIN — Pratica diaria e streak.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   PROGRAMMING PRACTICE
   =========================================================== */

function dayEntry(key) {
  const d = state.competitiveProgramming.daily;
  if (!d[key]) d[key] = { easy: 0, medium: 0, hard: 0 };
  return d[key];
}

const dayTotal = (e) => (e.easy || 0) + (e.medium || 0) + (e.hard || 0);
const goalMet = (e) => (e.easy || 0) >= 3 || (e.medium || 0) >= 1 || (e.hard || 0) >= 1;

function addProblem(kind, delta) {
  const key = todayKey();
  const e = dayEntry(key);
  const before = goalMet(e);

  Store.commit([CH.PRACTICE, CH.TODAY], (s) => {
    e[kind] = Math.max(0, (e[kind] || 0) + delta);

    const cp = s.competitiveProgramming;
    cp.easy = cp.medium = cp.hard = 0;
    Object.values(cp.daily).forEach((d) => {
      cp.easy += d.easy || 0; cp.medium += d.medium || 0; cp.hard += d.hard || 0;
    });
    cp.solved = cp.easy + cp.medium + cp.hard;

    if (dayTotal(e) === 0) delete cp.daily[key];
  });
  if (!before && goalMet(e)) toast("Daily goal completed", "ok");
}

function streakInfo() {
  const daily = state.competitiveProgramming.daily;
  const days = Object.keys(daily).filter((k) => goalMet(daily[k]));
  let streak = 0;
  const d = new Date();
  // Se a meta de hoje ainda não foi batida, o streak conta a partir de ontem.
  if (!days.includes(todayKey(d))) d.setDate(d.getDate() - 1);
  while (days.includes(todayKey(d))) { streak++; d.setDate(d.getDate() - 1); }
  return { streak, practiced: Object.keys(daily).length };
}
