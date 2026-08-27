/* DATA — Roadmap LEVEL 6: Bancos de Dados
   Carregado por index.html apos roadmap.js (que declara ROADMAP e T).
   Escopo global compartilhado (sem modulos, para que a aplicacao
   continue abrindo via file://). */

"use strict";

ROADMAP.push(
  {
    id: "l6", level: "LEVEL 6", title: "Bancos de Dados",
    cat: "db", desc: "Onde os dados descansam. Entender internals é o que permite otimizar de verdade.",
    groups: [
      { name: "Relacionais", items: [
        T("Relational model"), T("Tables"), T("Primary keys"), T("Foreign keys"),
        T("Constraints"), T("Normalization"),
        T("SQL", { id: "sql", what: "Linguagem declarativa: você descreve o resultado, não o algoritmo.", when: "Sempre. É a linguagem franca da engenharia de dados.", how: "O planner escolhe o plano físico — por isso o mesmo resultado pode ter custos muito diferentes." }),
        T("JOIN", { what: "Combina linhas de tabelas por uma condição.", when: "Todo modelo dimensional.", how: "Estratégias: nested loop, hash join, merge join. O planner escolhe pelo tamanho e pelos índices.", req: ["hash"] }),
        T("GROUP BY"),
        T("Window Functions", { id: "window", deep: true,
          what: "Cálculos sobre um conjunto de linhas relacionadas, sem colapsar o resultado.",
          when: "Rankings, acumulados, comparação com a linha anterior, deduplicação.",
          how: "PARTITION BY define o grupo; ORDER BY define a ordem dentro dele; o frame define a janela.",
          code: "SELECT cliente_id, data, valor,\n       SUM(valor) OVER (\n           PARTITION BY cliente_id ORDER BY data\n           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n       ) AS acumulado,\n       ROW_NUMBER() OVER (\n           PARTITION BY cliente_id ORDER BY data DESC\n       ) AS rn\nFROM vendas;",
          de: "ROW_NUMBER() com PARTITION BY chave e ORDER BY timestamp DESC é o padrão para pegar a versão mais recente de cada registro em CDC.",
          drill: "Calcule vendas acumuladas por cliente e encontre o segundo maior salário por departamento.",
          req: ["sql"]
        }),
        T("CTE"), T("Subqueries"),
        T("Transactions"),
        T("ACID", { id: "acid", what: "Atomicidade, Consistência, Isolamento, Durabilidade.", when: "Ao decidir se o pipeline pode aceitar leitura suja ou escrita parcial.", how: "O banco garante que a transação é tudo ou nada e sobrevive a falhas." }),
        T("Isolation levels", { what: "Quanto uma transação enxerga do trabalho não commitado de outras.", when: "Extrações concorrentes com escrita no OLTP.", how: "Read Committed → Repeatable Read → Serializable: mais garantia, menos concorrência.", de: "Uma extração longa em Read Committed pode ler dados inconsistentes entre tabelas." }),
        T("Locks"),
        T("MVCC", { what: "Multiversão: leitores não bloqueiam escritores.", when: "Postgres, Oracle, warehouses modernos.", how: "Cada transação vê um snapshot consistente; versões antigas são limpas depois (VACUUM)." })
      ]},
  
      { name: "Performance", items: [
        T("Indexes", { id: "index", deep: true,
          what: "Estrutura auxiliar que acelera a localização de linhas.",
          when: "Colunas usadas em WHERE, JOIN e ORDER BY com alta seletividade.",
          how: "Normalmente uma B-Tree: busca em O(log n) em vez de varrer a tabela inteira.",
          code: "-- antes: Seq Scan, 8s\nEXPLAIN ANALYZE SELECT * FROM pedidos WHERE cliente_id = 42;\n\nCREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);\n-- depois: Index Scan, 3ms",
          de: "Todo índice tem custo de escrita e de espaço. Em tabela com ingestão pesada, índice demais degrada o load.",
          drill: "Analise uma query com EXPLAIN, crie um índice e compare os planos.",
          req: ["sql", "hash"]
        }),
        T("B-Trees", { what: "Árvore balanceada de alta ramificação, otimizada para disco.", when: "Estrutura padrão de índices relacionais.", how: "Cada nó ocupa uma página; poucos níveis cobrem bilhões de linhas." }),
        T("Query Planner"),
        T("EXPLAIN", { what: "Mostra o plano de execução escolhido pelo banco.", when: "Antes de tentar otimizar qualquer query.", how: "Leia de dentro para fora; compare linhas estimadas vs. reais.", code: "EXPLAIN (ANALYZE, BUFFERS) SELECT ...;" }),
        T("Query optimization"),
        T("Partitioning", { id: "partition", what: "Divisão física de uma tabela em partes menores.", when: "Tabelas grandes com filtro recorrente por data.", how: "O planner elimina partições irrelevantes (partition pruning).", de: "Particionar por data e filtrar por ela é a otimização de maior retorno em warehouse." })
      ]},
  
      { name: "Internals", items: [
        T("Pages"),
        T("WAL", { id: "wal", what: "Write-Ahead Log: toda alteração é registrada antes de ser aplicada.", when: "Durabilidade, replicação e CDC.", how: "O log sequencial é rápido; a aplicação nas páginas pode ser assíncrona.", de: "Ferramentas de CDC (Debezium) leem exatamente esse log para capturar mudanças sem impactar a tabela." }),
        T("Buffer Pool"), T("Storage Engine"),
        T("Replication", { id: "repl", what: "Cópias dos dados em outros nós.", when: "Alta disponibilidade e réplicas de leitura para extração.", how: "Síncrona garante consistência com custo de latência; assíncrona é rápida mas tem lag.", de: "Extrair da réplica protege o OLTP — mas cuidado com o lag em pipelines quase-real-time." }),
        T("Sharding")
      ]},
  
      { name: "NoSQL", items: [
        T("Key-value"), T("Document"), T("Column"), T("Graph"),
        T("Quando usar NoSQL", { what: "Modelos que abrem mão de partes do relacional em troca de escala ou flexibilidade.", when: "Acesso por chave conhecida, schema muito variável, escala horizontal extrema.", how: "Você modela a partir das queries, não das entidades." }),
        T("Quando NÃO usar", { what: "O caso mais comum: quando você precisa de joins ad-hoc e consistência forte.", when: "Analytics exploratório, relatórios, integridade referencial.", how: "Sem schema, a validação apenas migra para a aplicação — e costuma ser esquecida." })
      ]}
    ]
  }
);
