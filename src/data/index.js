/* DATA — Indice derivado do roadmap (id -> topico).
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   ÍNDICE DE TÓPICOS  (id estável -> topico)
   =========================================================== */

const slug = (s) => s.toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const TOPIC_INDEX = {};   // id -> { ...topic, levelId, levelTitle, groupName, cat }
const ALL_TOPIC_IDS = [];

ROADMAP.forEach((lv) => {
  lv.groups.forEach((g) => {
    g.items.forEach((it) => {
      if (!it.id) it.id = slug(lv.id + "-" + it.t);
      it.levelId = lv.id;
      it.levelTitle = lv.title;
      it.levelTag = lv.level;
      it.groupName = g.name;
      it.cat = lv.cat;
      TOPIC_INDEX[it.id] = it;
      ALL_TOPIC_IDS.push(it.id);
    });
  });
});

const hasDetail = (t) => !!(t.what || t.how || t.code || t.drill || t.de || t.when || t.ex);
