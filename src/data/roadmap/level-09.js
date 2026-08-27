/* DATA — Roadmap LEVEL 9: Cloud
   Carregado por index.html apos roadmap.js (que declara ROADMAP e T).
   Escopo global compartilhado (sem modulos, para que a aplicacao
   continue abrindo via file://). */

"use strict";

ROADMAP.push(
  {
    id: "l9", level: "LEVEL 9", title: "Cloud",
    cat: "cloud", desc: "Compute, storage, rede, identidade e custo — antes de qualquer serviço gerenciado.",
    groups: [
      { name: "Fundamentos", items: [
        T("Compute"),
        T("Storage", { what: "Object storage: chave → blob, com durabilidade altíssima e custo baixo.", when: "Base de todo data lake.", how: "Não é filesystem: não há rename atômico barato nem append.", de: "'Pastas' são só prefixos. Layout de prefixo afeta desempenho de listagem e custo de requisição." }),
        T("Networking"),
        T("IAM", { what: "Quem pode fazer o quê, em qual recurso.", when: "Toda integração. É a causa mais comum de falha em pipeline novo.", how: "Prefira identidades gerenciadas a chaves estáticas; aplique menor privilégio." }),
        T("Secrets"), T("Monitoring"), T("Logging"),
        T("Containers"),
        T("Docker", { id: "docker", what: "Empacota aplicação e dependências em uma imagem reproduzível.", when: "Garantir que o job roda igual em dev e em produção.", how: "Camadas imutáveis; isolamento via namespaces e cgroups do Linux.", req: ["proc"] }),
        T("Kubernetes")
      ]},
      { name: "Azure", items: [
        T("Azure fundamentals"), T("Azure Storage"), T("Azure Compute"),
        T("Azure Networking"), T("Azure Identity"), T("Azure Data services"),
        T("Azure monitoring"), T("Azure security")
      ]}
    ]
  }
);
