/* DATA — Roadmap LEVEL 13: Produção e excelência
   Carregado por index.html apos roadmap.js (que declara ROADMAP e T).
   Escopo global compartilhado (sem modulos, para que a aplicacao
   continue abrindo via file://). */

"use strict";

ROADMAP.push(
  {
    id: "l13", level: "LEVEL 13", title: "Produção e excelência",
    cat: "prod", desc: "A diferença entre escrever pipelines e operar uma plataforma.",
    groups: [
      { name: "Production Data Engineering", items: [
        T("CI/CD"), T("Testing"), T("Unit tests"), T("Integration tests"),
        T("Data tests", { what: "Testes sobre os dados, não sobre o código.", when: "A cada execução, antes de publicar na camada de consumo.", how: "Unicidade, not-null, faixa, integridade referencial, frescor.", de: "Código correto com dado errado ainda é um incidente." }),
        T("Contract tests"),
        T("Monitoring"), T("Logging"), T("Metrics"), T("Tracing"),
        T("Alerting", { what: "Notificação acionável de que algo está fora do esperado.", when: "Apenas para o que exige ação humana imediata.", how: "Alerta sem ação clara vira ruído — e ruído produz cegueira operacional." }),
        T("SLAs"), T("SLOs"),
        T("Incident response"), T("Disaster recovery"),
        T("Cost optimization", { what: "Custo é requisito de arquitetura, não detalhe.", when: "Continuamente — em cloud, custo cresce silenciosamente.", how: "Ataque: bytes escaneados, particionamento, formato, retenção, tamanho de cluster.", req: ["parquet", "partition"] }),
        T("Security"), T("Secrets management")
      ]}
    ]
  }
);
