/* DATA — Roadmap LEVEL 8: Sistemas Distribuídos
   Carregado por index.html apos roadmap.js (que declara ROADMAP e T).
   Escopo global compartilhado (sem modulos, para que a aplicacao
   continue abrindo via file://). */

"use strict";

ROADMAP.push(
  {
    id: "l8", level: "LEVEL 8", title: "Sistemas Distribuídos",
    cat: "dist", desc: "Uma das seções mais profundas. Tudo em escala é distribuído — e falha parcialmente.",
    groups: [
      { name: "Conceitos", items: [
        T("O que é sistema distribuído", { what: "Componentes em máquinas distintas que se coordenam por rede.", when: "Spark, Kafka, warehouses, object storage — todos são.", how: "A rede é não confiável, assíncrona e tem latência variável." }),
        T("Failure"),
        T("Partial failure", { id: "partial", deep: true,
          what: "Parte do sistema falha enquanto o resto continua funcionando.",
          when: "Sempre, em qualquer sistema distribuído.",
          how: "Você envia uma requisição e não recebe resposta. Não há como distinguir: pedido perdido, pedido processado com resposta perdida, ou destino apenas lento.",
          de: "É exatamente por isso que retry sem idempotência é perigoso: você pode reenviar algo que já foi aplicado.",
          req: ["idem"]
        }),
        T("Latency"), T("Throughput"), T("Availability"), T("Consistency"),
        T("Partition tolerance"),
        T("CAP theorem", { id: "cap", what: "Sob partição de rede, escolha entre consistência e disponibilidade.", when: "Ao escolher um datastore distribuído.", how: "Partição não é opcional; a escolha real é CP ou AP.", de: "Na prática o trade-off é gradual — latência vs. consistência mesmo sem partição (PACELC)." }),
        T("Replication (dist)"),
        T("Leader/Follower"), T("Quorum"),
        T("Consensus"), T("Raft"),
        T("Consistent hashing", { what: "Distribuição de chaves em um anel para minimizar remapeamento.", when: "Sharding com nós entrando e saindo.", how: "Adicionar um nó move apenas 1/n das chaves, não todas.", req: ["hash"] }),
        T("Sharding"), T("Load balancing"), T("Fault tolerance"),
        T("Retry"), T("Timeout", { what: "Limite de espera por uma resposta.", when: "Toda chamada de rede — sem exceção.", how: "Sem timeout, uma thread pode ficar presa indefinidamente e travar o pipeline inteiro." }),
        T("Circuit breaker", { what: "Para de chamar um serviço que está falhando de forma consistente.", when: "Dependência instável.", how: "Após N falhas, abre o circuito e falha rápido; testa periodicamente." }),
        T("Backpressure", { what: "Mecanismo para o consumidor sinalizar que não acompanha o produtor.", when: "Streaming em que o lag cresce continuamente.", how: "Limitar taxa, bufferizar com limite ou descartar deliberadamente." })
      ]}
    ]
  }
);
