/* DATA — Roadmap LEVEL 2: Programação — Python
   Carregado por index.html apos roadmap.js (que declara ROADMAP e T).
   Escopo global compartilhado (sem modulos, para que a aplicacao
   continue abrindo via file://). */

"use strict";

ROADMAP.push(
  {
    id: "l2", level: "LEVEL 2", title: "Programação — Python",
    cat: "prog", desc: "Não basta sintaxe. Cada conceito precisa responder: o que é, quando usar, quando NÃO usar, como funciona, qual o custo.",
    groups: [
      { name: "Fundamentos", items: [
        T("Variáveis", { id: "py-var",
          what: "Nomes que apontam para objetos — não caixas que guardam valores.",
          when: "Sempre. Entender referência vs. cópia evita bugs de mutação compartilhada.",
          how: "`a = b` copia a referência, não o objeto.",
          code: "a = [1, 2]\nb = a\nb.append(3)\na          # [1, 2, 3] — mesmo objeto"
        }),
        T("Tipos"), T("int"), T("float"), T("bool"), T("str"), T("None"),
        T("Lists", { id: "py-list",
          what: "Array dinâmico ordenado e mutável.",
          when: "Ordem importa e você acessa por índice.",
          how: "Índice é O(1); `in` é O(n); append é O(1) amortizado.",
          de: "Nunca use `if x in lista` dentro de um loop sobre milhões de linhas — troque por set."
        }),
        T("Tuples"),
        T("Sets", { id: "py-set",
          what: "Coleção não ordenada de elementos únicos e hasheáveis.",
          when: "Deduplicação e testes de pertencimento.",
          how: "Hash table: `in` é O(1) médio contra O(n) da lista.",
          code: "vistos = set(df_antigo['id'])\nnovos = [r for r in registros if r.id not in vistos]"
        }),
        T("Dictionaries", { id: "py-dict",
          what: "Mapeamento chave → valor com hash table.",
          when: "Lookups por chave, agregações, índices em memória.",
          how: "Busca O(1) médio. Preserva ordem de inserção desde o Python 3.7.",
          de: "É a estrutura por trás de praticamente todo join feito manualmente em Python."
        }),
        T("if"), T("for"), T("while"), T("Functions"), T("Arguments"), T("Return"),
        T("Scope"),
        T("Exceptions", {
          what: "Mecanismo de sinalização de erro que interrompe o fluxo normal.",
          when: "Em pipelines: distinguir falha recuperável (retry) de falha de dados (quarentena).",
          how: "Capture exceções específicas. `except Exception: pass` esconde falhas em produção.",
          code: "try:\n    resp = api.get(url, timeout=10)\nexcept requests.Timeout:\n    raise  # deixa o orquestrador fazer retry\nexcept requests.HTTPError as e:\n    if e.response.status_code == 404:\n        return None\n    raise"
        }),
        T("Modules"), T("Packages"), T("Virtual environments")
      ]},
  
      { name: "Python intermediário", items: [
        T("List comprehensions"), T("Dict comprehensions"), T("Iterators"),
        T("Generators", { id: "py-gen", deep: true,
          what: "Uma forma de produzir valores sob demanda.",
          when: "Quando não é necessário manter todos os elementos na memória simultaneamente.",
          how: "`yield` suspende a função e devolve o controle; o estado é retomado na próxima iteração.",
          code: "def numbers():\n    for i in range(10):\n        yield i",
          de: "Útil para processamento incremental e pipelines que lidam com grandes volumes: você processa um arquivo de 50 GB com memória constante.",
          drill: "Crie um generator que leia um arquivo linha por linha sem carregar o arquivo inteiro na memória.",
          req: ["py-list"]
        }),
        T("Decorators", {
          what: "Uma função que recebe outra função e devolve uma versão modificada.",
          when: "Retry, logging, cache, métricas — comportamento transversal.",
          how: "`@deco` é açúcar sintático para `f = deco(f)`.",
          code: "from functools import wraps\n\ndef retry(n=3):\n    def deco(fn):\n        @wraps(fn)\n        def wrapper(*a, **kw):\n            for i in range(n):\n                try:\n                    return fn(*a, **kw)\n                except Exception:\n                    if i == n - 1:\n                        raise\n        return wrapper\n    return deco"
        }),
        T("Context managers", {
          what: "Protocolo que garante setup e teardown, mesmo com exceção.",
          when: "Arquivos, conexões, locks, transações.",
          how: "`with` chama `__enter__` e garante `__exit__` mesmo em erro.",
          code: "with conn.begin():         # commit ou rollback garantido\n    conn.execute(insert)"
        }),
        T("Dataclasses"), T("Type hints"), T("Protocols"), T("Abstract classes"),
        T("Testing"), T("Logging"), T("Debugging"),
        T("Profiling", {
          what: "Medir onde o tempo realmente é gasto.",
          when: "Antes de otimizar. Intuição sobre performance costuma estar errada.",
          how: "cProfile para CPU, memory_profiler para RAM, py-spy para processos em produção.",
          code: "python -m cProfile -s cumtime script.py | head -30"
        }),
        T("Concurrency", { id: "py-conc",
          what: "Executar tarefas de forma sobreposta.",
          when: "I/O-bound: muitas chamadas de API, leituras de arquivos.",
          how: "O GIL impede paralelismo real de CPU em threads, mas threads liberam o GIL durante I/O.",
          de: "Regra prática: I/O-bound → threads/async. CPU-bound → multiprocessing ou saia do Python."
        }),
        T("Multiprocessing"), T("AsyncIO")
      ]},
  
      { name: "Python para Data Engineering", items: [
        T("CSV", {
          what: "Texto delimitado, sem schema, sem tipos.",
          when: "Interoperabilidade e ingestão de sistemas legados.",
          how: "Não há padrão único: delimitador, quoting, encoding e newline variam.",
          de: "Nunca é o formato final. Converta para Parquet assim que entrar no lake."
        }),
        T("JSON"),
        T("Parquet", { id: "parquet", deep: true,
          what: "Formato colunar, comprimido, com schema embutido e estatísticas por row group.",
          when: "Formato padrão do data lake para cargas analíticas.",
          how: "Armazena coluna a coluna, permitindo ler só as colunas necessárias e pular row groups pelas estatísticas (predicate pushdown).",
          code: "df.to_parquet('s3://lake/eventos/dt=2026-08-25/parte.parquet',\n              compression='snappy', index=False)",
          de: "Um SELECT de 2 colunas em uma tabela de 80 lê ~2,5% dos bytes. É a diferença entre um job de 4 minutos e um de 3 horas.",
          drill: "Salve o mesmo dataset em CSV e Parquet. Compare tamanho e tempo de leitura de uma coluna.",
          req: ["cache"]
        }),
        T("Avro"), T("APIs"), T("HTTP"), T("Filesystems"), T("Compression"),
        T("Serialization"),
        T("Pandas", {
          what: "DataFrames em memória, single-node.",
          when: "Dados que cabem confortavelmente na RAM (regra prática: até ~1/3 da memória disponível).",
          how: "Baseado em NumPy; muitas operações copiam o DataFrame inteiro.",
          de: "Quando o dataset não cabe: Polars, DuckDB ou Spark. Não force pandas com swap."
        }),
        T("Polars"), T("PyArrow"), T("SQLAlchemy"),
        T("Pydantic", {
          what: "Validação de dados em runtime a partir de type hints.",
          when: "Fronteiras do pipeline: payloads de API, configs, contratos de dados.",
          how: "Valida e converte tipos, falhando cedo com mensagem clara.",
          de: "É a base prática para implementar data contracts na ingestão."
        }),
        T("pytest")
      ]}
    ]
  }
);
