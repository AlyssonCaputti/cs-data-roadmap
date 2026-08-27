/* DATA — Roadmap: declaracoes base.
   Os 14 niveis vivem em src/data/roadmap/level-00.js .. level-13.js e se
   registram via ROADMAP.push(). Este arquivo precisa ser carregado antes
   deles no index.html.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   DATA — ROADMAP
   Cada topico: { t: titulo, id?, what, when, how, ex?, code?, de?, drill?,
                  req?: [ids de pre-requisito], deep?: true }
   Topicos sem detalhe sao itens de checklist simples.
   =========================================================== */

const T = (t, extra) => Object.assign({ t }, extra || {});

const ROADMAP = [];
