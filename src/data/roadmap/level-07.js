/* DATA — Roadmap LEVEL 7: Engenharia de Dados
   Carregado por index.html apos roadmap.js (que declara ROADMAP e T).
   Escopo global compartilhado (sem modulos, para que a aplicacao
   continue abrindo via file://). */

"use strict";

ROADMAP.push(
  {
    id: "l7", level: "LEVEL 7", title: "Engenharia de Dados",
    cat: "de", desc: "O núcleo da profissão. Fundamentos antes de ferramentas.",
    groups: [
      { name: "Fundamentos", items: [
        T("O que é Data Engineering", { what: "Construir e operar sistemas que tornam dados confiáveis, acessíveis e úteis.", when: "É o enquadramento de tudo que vem a seguir.", how: "Ingestão, armazenamento, transformação, disponibilização e operação." }),
        T("ETL"),
        T("ELT", { what: "Extrair, carregar e só então transformar dentro do warehouse.", when: "Padrão moderno, quando o destino tem poder computacional.", how: "O dado bruto fica preservado; a transformação vira código versionado (dbt).", de: "Permite reprocessar o histórico com regra nova sem reingerir da fonte." }),
        T("Batch"), T("Streaming"), T("Data Pipeline"),
        T("Data Warehouse"), T("Data Lake"),
        T("Lakehouse", { what: "Camada transacional (Delta, Iceberg, Hudi) sobre arquivos no object storage.", when: "Quando se quer ACID, time travel e schema evolution sem abrir mão do custo do lake.", how: "Um log de metadados versiona quais arquivos compõem a tabela em cada instante." }),
        T("Data Mart"),
        T("OLTP"), T("OLAP", { what: "OLTP serve transações curtas; OLAP serve agregações sobre muitas linhas.", when: "Ao escolher onde uma carga deve rodar.", how: "OLTP é orientado a linha; OLAP é colunar.", de: "Rodar relatório pesado direto no OLTP de produção é o erro clássico de quem está começando." })
      ]},
  
      { name: "Data Modeling", items: [
        T("Dimensional Modeling", { id: "dim", what: "Modelagem orientada a consulta analítica: fatos e dimensões.", when: "Camada de consumo do warehouse.", how: "Fato guarda métricas e chaves; dimensão guarda o contexto descritivo." }),
        T("Star Schema", { what: "Um fato central ligado diretamente a dimensões desnormalizadas.", when: "Padrão para BI: menos joins, mais performance.", how: "Desnormalização deliberada troca espaço por velocidade.", req: ["dim"] }),
        T("Snowflake Schema"), T("Facts"), T("Dimensions"),
        T("Slowly Changing Dimensions", { id: "scd", deep: true,
          what: "Como tratar mudanças em atributos de dimensão ao longo do tempo.",
          when: "Sempre que o histórico importar — cliente que mudou de cidade, produto que mudou de categoria.",
          how: "Tipo 1 sobrescreve (perde histórico). Tipo 2 cria nova linha com validade e flag de atual.",
          code: "-- SCD Tipo 2\nsk  | cliente_id | cidade     | valid_from | valid_to   | is_current\n1   | 100        | Sao Paulo  | 2024-01-01 | 2026-03-14 | false\n2   | 100        | Recife     | 2026-03-15 | 9999-12-31 | true",
          de: "Sem SCD2, um relatório de vendas por cidade reescreve o passado a cada mudança de cadastro. É a causa nº1 de 'o número de ontem mudou'.",
          drill: "Implemente um merge SCD2 idempotente que possa rodar duas vezes sem duplicar linhas.",
          req: ["dim", "window"]
        }),
        T("Surrogate Keys"), T("Data Vault")
      ]},
  
      { name: "File Formats", desc: "row-oriented vs column-oriented, compression, schema, schema evolution, predicate pushdown, partition pruning.", items: [
        T("CSV"), T("JSON"), T("Avro", { what: "Formato binário orientado a linha com schema explícito.", when: "Transporte de eventos e streaming (Kafka + Schema Registry).", how: "Schema separado do dado permite evolução controlada." }),
        T("Parquet (formato)", { req: ["parquet"], what: "Colunar, comprimido, com estatísticas por row group.", when: "Armazenamento analítico.", how: "Column pruning + predicate pushdown reduzem drasticamente os bytes lidos." }),
        T("ORC"),
        T("row vs column oriented", { deep: true,
          what: "A diferença fundamental entre formato transacional e analítico.",
          when: "Ao escolher formato de armazenamento — decisão de maior impacto em custo de query.",
          how: "Row: todos os campos de um registro juntos. Column: todos os valores de um campo juntos.",
          code: "ROW  (OLTP):  [id1,nome1,valor1][id2,nome2,valor2]\nCOL  (OLAP):  [id1,id2][nome1,nome2][valor1,valor2]\n\nSELECT SUM(valor)  -> row: le tudo | col: le 1 coluna",
          de: "Colunar comprime muito melhor porque valores de um mesmo tipo ficam juntos e se repetem."
        }),
        T("Schema evolution"), T("Predicate pushdown"), T("Partition pruning")
      ]},
  
      { name: "Pipelines", items: [
        T("Extraction"), T("Transformation"), T("Loading"),
        T("Orchestration"), T("Scheduling"),
        T("Retries", { what: "Repetir automaticamente uma operação que falhou.", when: "Falhas transitórias: timeout, rate limit, indisponibilidade.", how: "Backoff exponencial com jitter evita derrubar a fonte com retentativas sincronizadas.", de: "Retry sem idempotência duplica dados. As duas propriedades andam juntas." }),
        T("Idempotency", { id: "idem", deep: true,
          what: "Executar a mesma operação N vezes produz o mesmo resultado de uma execução.",
          when: "Toda tarefa que pode ser reexecutada — ou seja, todas.",
          how: "Substitua APPEND cego por DELETE+INSERT da partição, ou por MERGE com chave.",
          code: "-- NAO idempotente: rodar 2x duplica\nINSERT INTO vendas SELECT * FROM staging;\n\n-- idempotente: rodar N vezes da o mesmo estado\nDELETE FROM vendas WHERE dt = '2026-08-25';\nINSERT INTO vendas SELECT * FROM staging WHERE dt = '2026-08-25';\n\n-- idempotente por chave\nMERGE INTO vendas t USING staging s ON t.id = s.id\nWHEN MATCHED THEN UPDATE SET ...\nWHEN NOT MATCHED THEN INSERT ...;",
          de: "Em produção isso aparece toda vez que: o retry dispara, alguém pede backfill, o scheduler executa em duplicidade, ou o job morre no meio da escrita. Sem idempotência, cada um desses vira incidente de dados duplicados.",
          drill: "Pegue um pipeline seu e torne-o idempotente. Rode três vezes e prove que a contagem não muda.",
          req: ["acid"]
        }),
        T("Backfills", { what: "Reprocessar períodos passados.", when: "Correção de bug, regra nova, fonte que chegou atrasada.", how: "Só é seguro se o pipeline for idempotente e parametrizado por data.", req: ["idem"] }),
        T("Incremental processing", { what: "Processar apenas o que mudou.", when: "Volume grande e janela curta.", how: "Watermark por timestamp/ID, ou CDC.", de: "Cuidado com late arriving data: reprocesse uma janela de segurança." }),
        T("Full refresh"),
        T("CDC", { id: "cdc", what: "Change Data Capture: capturar inserts, updates e deletes da fonte.", when: "Replicar OLTP sem consultas pesadas e sem perder deletes.", how: "Lê o log de transações (WAL/binlog) em vez de consultar a tabela.", de: "Query incremental por updated_at perde deletes físicos e registros com clock atrasado. CDC não.", req: ["wal"] }),
        T("Data validation"),
        T("Data quality", { what: "Verificações automatizadas sobre completude, unicidade, faixa e frescor.", when: "Em cada fronteira do pipeline, antes de publicar.", how: "Falhar cedo e alto: melhor um pipeline parado que um dashboard errado." })
      ]},
  
      { name: "Apache Airflow", items: [
        T("DAG", { id: "dag", what: "Grafo acíclico dirigido de tarefas.", when: "Orquestração com dependências e agendamento.", how: "O scheduler faz ordenação topológica e dispara o que está pronto.", req: ["graph"] }),
        T("Task"), T("Operator"), T("Scheduler"), T("Executor"), T("Worker"),
        T("XCom", { what: "Canal para passar pequenos valores entre tarefas.", when: "Metadados: contagens, caminhos, IDs.", how: "Trafega pelo banco de metadados.", de: "Nunca passe DataFrames por XCom. Passe o caminho do arquivo." }),
        T("Sensors"), T("Retries (Airflow)"), T("Backfill"), T("Scheduling (Airflow)"),
        T("Task dependencies"), T("Dynamic task mapping"),
        T("Testing"), T("Deployment"), T("Observability")
      ]},
  
      { name: "Apache Spark", items: [
        T("Spark architecture", { id: "spark", what: "Motor distribuído de processamento em memória.", when: "Dados que não cabem em um nó.", how: "Driver planeja, cluster manager aloca, executors processam partições.", req: ["py-conc"] }),
        T("Driver"), T("Executors"), T("Cluster Manager"),
        T("RDD"), T("DataFrame"), T("Dataset"),
        T("Transformations"), T("Actions"),
        T("Lazy evaluation", { what: "Transformações só constroem o plano; nada executa até uma action.", when: "Entender por que o erro aparece só no `.count()`.", how: "O Catalyst otimiza o plano inteiro antes de executar — daí ganhos como pushdown e column pruning." }),
        T("DAG (Spark)"), T("Stages"), T("Tasks"),
        T("Shuffle", { id: "shuffle", deep: true,
          what: "Redistribuição de dados entre executors quando a operação exige reagrupamento.",
          when: "groupBy, join, distinct, repartition, orderBy.",
          how: "Cada task escreve arquivos por partição de destino em disco; as tasks seguintes buscam esses blocos pela rede.",
          code: "# 1 shuffle\ndf.groupBy('cliente').sum('valor')\n\n# 0 shuffle — tabela pequena replicada\nfrom pyspark.sql.functions import broadcast\ngrande.join(broadcast(pequena), 'id')",
          de: "Por que shuffle é caro: escrita em disco + serialização + tráfego de rede + espera do estágio inteiro. Por isso um job Spark é executado em estágios separados exatamente nos pontos de shuffle.",
          drill: "Rode um join com e sem broadcast em tabelas assimétricas e compare o Spark UI.",
          req: ["spark"]
        }),
        T("Partition"), T("Repartition"), T("Coalesce"),
        T("Broadcast"), T("Join strategies"),
        T("Caching"), T("Serialization"), T("Spark SQL"),
        T("Performance tuning", { what: "Por que Spark é rápido: processamento em memória, paralelismo por partição, plano otimizado e execução colunar vetorizada.", when: "Sempre que o job custar mais que o valor que entrega.", how: "Ataque nesta ordem: bytes lidos → shuffle → skew → paralelismo → memória." })
      ]},
  
      { name: "Streaming", items: [
        T("Event"), T("Producer"), T("Consumer"), T("Message Broker"),
        T("Kafka", { id: "kafka", deep: true,
          what: "Log distribuído, particionado e replicado de eventos.",
          when: "Desacoplar produtores de consumidores e permitir reprocessamento a partir de um offset.",
          how: "Um tópico é dividido em partições; cada partição é um log ordenado e append-only. Consumers guardam o offset.",
          code: "topic: pedidos  (3 particoes)\n\nP0: [0][1][2][3][4]  <- consumer A (offset 3)\nP1: [0][1][2]        <- consumer B (offset 2)\nP2: [0][1][2][3]     <- consumer B (offset 1)",
          de: "Ordenação é garantida apenas dentro de uma partição. Se a ordem por cliente importa, use o cliente_id como chave de particionamento.",
          drill: "Explique o que acontece com o consumer group quando um consumidor cai.",
          req: ["tcp", "repl"]
        }),
        T("Topic"), T("Partition (Kafka)"), T("Offset"), T("Consumer Group"),
        T("Ordering"),
        T("Delivery semantics", { what: "Que garantia o sistema dá sobre entregar cada mensagem.", when: "Ao decidir o custo aceitável de duplicata ou perda.", how: "At-most-once: pode perder. At-least-once: pode duplicar. Exactly-once: caro, exige transação ou idempotência.", de: "Na prática: at-least-once + consumidor idempotente resolve a maioria dos casos com menos complexidade.", req: ["idem"] }),
        T("At-most-once"), T("At-least-once"), T("Exactly-once"),
        T("Event time"), T("Processing time"),
        T("Watermarks", { what: "Estimativa de até quando os eventos já chegaram.", when: "Agregações por janela com eventos atrasados.", how: "Define quando fechar a janela e o que fazer com o que chegar depois." }),
        T("Windows"), T("Late events")
      ]}
    ]
  }
);
