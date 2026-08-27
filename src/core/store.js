/* CORE — Store observer: commit, publish, canais.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   STORE — Observer

   Ponto unico de mutacao. commit() aplica a mudanca, persiste e
   publica os canais afetados; cada view assina os canais que a
   afetam e se redesenha sozinha.

   Sem isso, cada mutacao tinha de listar a mao os renders a
   chamar — esquecer um deixava a UI dessincronizada do state.
   =========================================================== */

const Store = (() => {
  const subs = new Map();          // canal -> Set<fn>
  let queued = null;               // canais pendentes no frame atual
  let frame = null;

  function on(channels, fn) {
    channels.forEach((c) => {
      if (!subs.has(c)) subs.set(c, new Set());
      subs.get(c).add(fn);
    });
    return fn;
  }

  /* Coalescido em um frame: N commits na mesma interacao = 1 render. */
  function flush() {
    frame = null;
    const channels = queued;
    queued = null;
    if (!channels) return;

    const seen = new Set();
    channels.forEach((c) => {
      const set = subs.get(c);
      if (set) set.forEach((fn) => seen.add(fn));
    });
    seen.forEach((fn) => fn());
  }

  function publish(channels) {
    if (!queued) queued = new Set();
    channels.forEach((c) => queued.add(c));
    if (frame == null) frame = requestAnimationFrame(flush);
  }

  /* mutator roda sobre o state; channels dizem o que ficou obsoleto. */
  function commit(channels, mutator, opts) {
    const out = typeof mutator === "function" ? mutator(state) : undefined;
    saveState(opts && opts.immediate);
    publish(channels);
    return out;
  }

  /* Troca do state inteiro (import, load do repo, reset). */
  function replace(next) {
    state = next;
    saveState(true);
    publish(CH.ALL);
    return true;
  }

  return { on, commit, publish, replace };
})();

/* Canais. CH.ALL cobre tudo — usado por troca de state inteiro. */
const CH = {
  TOPICS:   "topics",
  STUDIES:  "studies",
  BOOKS:    "books",
  PRACTICE: "practice",
  PROJECTS: "projects",
  REVIEW:   "review",
  WEEKLY:   "weekly",
  TODAY:    "today",
  TIME:     "time",
  UI:       "ui"
};
CH.ALL = Object.keys(CH).map((k) => CH[k]);   // fixado antes de ALL existir
