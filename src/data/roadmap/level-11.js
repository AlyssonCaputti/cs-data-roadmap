/* DATA — Roadmap LEVEL 11: Arquitetura — Data System Design
   Carregado por index.html apos roadmap.js (que declara ROADMAP e T).
   Escopo global compartilhado (sem modulos, para que a aplicacao
   continue abrindo via file://). */

"use strict";

ROADMAP.push(
  {
    id: "l11", level: "LEVEL 11", title: "Arquitetura — Data System Design",
    cat: "arch", desc: "Aprender a desenhar sistemas. Para cada exercício: requisitos, escala, arquitetura, trade-offs, custo, failures, observabilidade, segurança.",
    groups: [
      { name: "Exercícios de design", desc: "Escreva a resposta. Um desenho que você não consegue defender não está pronto.", items: [
        T("Projetar um pipeline batch", { deep: true,
          what: "Ingestão diária de um OLTP para um warehouse, com histórico.",
          when: "O caso mais comum da profissão.",
          how: "Defina janela, watermark, estratégia de carga e idempotência antes de escolher ferramenta.",
          code: "REQUISITOS   volume, frescor, retencao, quem consome\nESCALA       linhas/dia, GB/dia, pico\nARQUITETURA  fonte -> extracao -> bronze -> silver -> gold\nTRADE-OFFS   full refresh vs incremental; custo vs frescor\nCUSTO        storage + compute + egress\nFAILURES     fonte fora, schema mudou, dados atrasados\nOBSERV.      frescor, volume, taxa de erro, duracao\nSEGURANCA    PII, criptografia, acesso minimo",
          req: ["idem"]
        }),
        T("Projetar um pipeline streaming", { req: ["kafka"] }),
        T("Projetar um data warehouse", { req: ["dim"] }),
        T("Projetar um data lake"),
        T("Projetar uma plataforma de dados"),
        T("Projetar um sistema de ingestão"),
        T("Projetar CDC", { req: ["cdc"] }),
        T("Projetar processamento de milhões de eventos", {
          what: "Dimensionar throughput de ponta a ponta.",
          when: "1M eventos/min ≈ 16.700/s — cada camada precisa sustentar isso.",
          how: "Calcule bytes/s, defina partições pelo paralelismo desejado e verifique o consumidor mais lento.",
          drill: "Projete um sistema que processe 1 milhão de eventos por minuto. Justifique o número de partições."
        }),
        T("Projetar sistema tolerante a falhas", { req: ["partial"] }),
        T("Projetar sistema observável")
      ]}
    ]
  }
);
