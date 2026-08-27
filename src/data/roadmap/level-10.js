/* DATA — Roadmap LEVEL 10: Data Platforms
   Carregado por index.html apos roadmap.js (que declara ROADMAP e T).
   Escopo global compartilhado (sem modulos, para que a aplicacao
   continue abrindo via file://). */

"use strict";

ROADMAP.push(
  {
    id: "l10", level: "LEVEL 10", title: "Data Platforms",
    cat: "de", desc: "Da pipeline isolada à plataforma que outras pessoas usam.",
    groups: [
      { name: "Arquiteturas", items: [
        T("Data Warehouse architecture"), T("Data Lake architecture"),
        T("Lakehouse architecture"),
        T("Medallion Architecture", { id: "medallion", deep: true,
          what: "Organização em camadas progressivas de qualidade: bronze, silver, gold.",
          when: "Padrão de organização de lake/lakehouse.",
          how: "Bronze é a cópia fiel do bruto; silver é limpo, tipado e deduplicado; gold é modelado para consumo.",
          code: "BRONZE  raw, append-only, imutavel, historico completo\n   |    (parse, tipos, dedup, qualidade)\nSILVER  limpo, conformado, uma linha por entidade\n   |    (agregacao, joins, regra de negocio)\nGOLD    star schema, marts, pronto para BI",
          de: "Preservar bronze imutável é o que torna o backfill possível: regra nova reprocessa do bruto sem reingerir da fonte.",
          req: ["idem"]
        }),
        T("Bronze"), T("Silver"), T("Gold")
      ]},
      { name: "Governança", items: [
        T("Metadata"), T("Catalog"),
        T("Lineage", { what: "Rastreabilidade de origem e transformação de cada dado.", when: "Análise de impacto e investigação de incidente.", how: "Grafo de dependências entre tabelas e colunas.", req: ["graph"] }),
        T("Governance"),
        T("Data contracts", { what: "Acordo explícito e versionado entre produtor e consumidor.", when: "Quando quebras vindas do upstream causam incidentes recorrentes.", how: "Schema, semântica, SLA de frescor e política de mudança, validados em CI." }),
        T("Schema evolution"), T("Data quality"), T("Observability")
      ]}
    ]
  }
);
