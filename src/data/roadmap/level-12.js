/* DATA — Roadmap LEVEL 12: Projetos reais
   Carregado por index.html apos roadmap.js (que declara ROADMAP e T).
   Escopo global compartilhado (sem modulos, para que a aplicacao
   continue abrindo via file://). */

"use strict";

ROADMAP.push(
  {
    id: "l12", level: "LEVEL 12", title: "Projetos reais",
    cat: "proj", desc: "A escada de projetos. Veja a aba Project Ladder para o detalhamento e os pré-requisitos.",
    groups: [
      { name: "Marcos", items: [
        T("Projeto 1 — CLI em Python concluído"),
        T("Projeto 2 — Modelagem SQL concluída"),
        T("Projeto 3 — Pipeline API→Postgres→Dashboard concluído"),
        T("Projeto 4 — Pipeline batch com Spark concluído"),
        T("Projeto 5 — Pipeline streaming com Kafka concluído"),
        T("Projeto 6 — Sistema production-grade concluído")
      ]}
    ]
  }
);
