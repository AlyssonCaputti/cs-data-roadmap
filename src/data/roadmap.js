/* DATA — Roadmap: 14 niveis, 410 topicos.
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

const ROADMAP = [
{
  id: "l0", level: "LEVEL 0", title: "Mentalidade e método",
  cat: "cs", desc: "Antes de qualquer tecnologia: aprender a aprender. Este nível é curto e vale por anos.",
  groups: [
    { name: "Fundamentos de aprendizado", items: [
      T("Aprender a estudar programação", {
        what: "Um método repetível: ler, reproduzir, quebrar, reconstruir e explicar.",
        when: "Sempre. É o multiplicador de todos os outros níveis do roadmap.",
        how: "Leia o conceito, escreva o menor código que o demonstre, quebre-o de propósito e explique em voz alta o que aconteceu.",
        drill: "Pegue um conceito que você acha que domina e explique-o em 5 linhas sem usar jargão."
      }),
      T("Ler documentação", {
        what: "A fonte primária. Tutoriais mostram um caminho; a documentação mostra o espaço de possibilidades.",
        when: "Antes de procurar tutorial ou fórum. Especialmente para stdlib, formatos e APIs.",
        how: "Comece pelo índice, leia a seção de conceitos antes da referência de API e só então os exemplos.",
        drill: "Leia a documentação de `itertools` do Python e escreva um exemplo próprio para 3 funções."
      }),
      T("Usar terminal", {
        what: "A interface mais direta com o sistema operacional.",
        when: "Todo dia. Engenharia de dados vive em servidores sem interface gráfica.",
        how: "Shell interpreta comandos, resolve o binário no PATH, cria um processo e conecta stdin/stdout/stderr.",
        drill: "Sem sair do terminal: baixe um CSV, conte as linhas, filtre uma coluna e ordene o resultado."
      }),
      T("Pesquisar problemas", {
        what: "Transformar um sintoma vago em uma consulta precisa.",
        when: "Ao encontrar um erro que você não reconhece.",
        how: "Busque a mensagem exata, sem seus caminhos locais, mais o nome da biblioteca e a versão.",
        drill: "Pegue seu último erro e reduza-o a uma consulta de menos de 10 palavras."
      }),
      T("Debuggar", {
        what: "O método de localizar a diferença entre o que você acredita e o que o programa faz.",
        when: "Antes de reescrever qualquer coisa. Reescrever sem entender só move o bug.",
        how: "Forme uma hipótese, escolha uma observação que a refute, execute, reduza o espaço de busca pela metade.",
        code: "import pdb; pdb.set_trace()\n# ou, mais moderno:\nbreakpoint()",
        drill: "Resolva um bug usando só `print` e depois o mesmo usando o debugger. Compare o tempo."
      }),
      T("Ler código de terceiros"),
      T("Escrever código legível"),
      T("Usar Git", {
        what: "Um grafo imutável de snapshots de conteúdo, com ponteiros nomeados (branches).",
        when: "Em todo projeto, desde a primeira linha.",
        how: "commit cria um objeto; branch é um ponteiro móvel; merge cria um commit com dois pais.",
        code: "git log --oneline --graph --all\ngit diff --staged\ngit restore --staged <file>",
        drill: "Crie um conflito de merge de propósito e resolva-o sem apagar a branch."
      }),
      T("Fazer pequenos projetos"),
      T("Revisar conceitos", {
        what: "Repetição espaçada: revisar pouco antes de esquecer.",
        when: "Semanalmente, nos tópicos marcados como 'preciso revisar'.",
        how: "Recuperação ativa (tentar lembrar) fixa muito mais que releitura passiva.",
        drill: "Use a Review Queue desta aplicação toda sexta-feira."
      })
    ]}
  ]
},

{
  id: "l1", level: "LEVEL 1", title: "Fundamentos de Computação",
  cat: "cs", desc: "Uma das partes mais importantes do roadmap. Quase todo problema de performance em dados termina aqui.",
  groups: [
    { name: "Computadores", desc: "Como uma máquina executa o que você escreve.", items: [
      T("O que é um computador?", {
        what: "Uma máquina que busca instruções da memória, decodifica e executa, repetidamente.",
        when: "Ao raciocinar sobre por que um programa é lento ou consome memória demais.",
        how: "O ciclo fetch → decode → execute → writeback governa tudo acima dele.",
        drill: "Descreva o que acontece entre digitar `python script.py` e a primeira linha executar."
      }),
      T("CPU", { id: "cpu",
        what: "A unidade que executa instruções, uma por ciclo em cada pipeline.",
        when: "Cargas CPU-bound: serialização, compressão, parsing, cálculo.",
        how: "Busca instruções, usa a ALU, aplica pipelining e execução especulativa.",
        drill: "Meça o tempo de um loop puro em Python vs. a mesma operação em NumPy. Explique a diferença."
      }),
      T("ALU"), T("Control Unit"), T("Registers"),
      T("Clock", {
        what: "O sinal que sincroniza as etapas do processador.",
        when: "Ao comparar CPUs. Clock alto não significa mais trabalho útil por segundo.",
        how: "Trabalho real = IPC × clock. Cache miss zera IPC mesmo com clock alto."
      }),
      T("RAM", { id: "ram",
        what: "Memória volátil de acesso aleatório, ~100× mais lenta que cache L1.",
        when: "Ao dimensionar um job Spark ou decidir entre streaming e carregar tudo na memória.",
        how: "Endereçada por byte; o SO fornece endereços virtuais mapeados em páginas físicas.",
        drill: "Carregue um CSV de 1 GB com pandas e observe o uso de RAM. Compare com leitura em chunks."
      }),
      T("Cache", { id: "cache", deep: true,
        what: "Memória extremamente rápida próxima ao processador.",
        when: "Performance de programas que processam grandes quantidades de dados.",
        how: "A CPU busca dados em níveis de cache (L1 → L2 → L3) antes de acessar a RAM.",
        ex: "Percorrer um array sequencialmente tende a aproveitar locality; percorrer com saltos desperdiça cada linha de cache carregada.",
        code: "# sequencial: aproveita a linha de cache inteira\nfor i in range(n):\n    total += a[i]\n\n# aleatorio: cada acesso pode custar um miss\nfor i in idx_embaralhado:\n    total += a[i]",
        de: "É por isso que formatos colunares (Parquet) vencem: você lê só as colunas necessárias, sequencialmente.",
        drill: "Compare acesso sequencial e acesso aleatório a um array de 10 milhões de elementos."
      }),
      T("Storage"), T("SSD"), T("HDD"),
      T("I/O", { id: "io",
        what: "Qualquer operação que sai da CPU: disco, rede, terminal.",
        when: "A maior parte dos pipelines de dados é I/O-bound, não CPU-bound.",
        how: "A thread bloqueia esperando o dispositivo; o SO troca de contexto para outro processo.",
        de: "Se o job é I/O-bound, adicionar CPU não acelera. Aumente paralelismo ou reduza bytes lidos."
      }),
      T("Barramentos"),
      T("Processo de execução de um programa", {
        what: "Do arquivo-fonte ao processo em execução.",
        when: "Ao investigar erros de import, versões de biblioteca ou binários faltando.",
        how: "Código → compilação/bytecode → carregador → memória (text, data, heap, stack) → execução.",
        drill: "Explique por que o mesmo script funciona em um ambiente virtual e falha em outro."
      })
    ]},

    { name: "Binário e representação de dados", desc: "Todo dado é bytes. Bug de encoding é bug de fundamento.", items: [
      T("Binário", { id: "binario",
        what: "Base 2: a única representação que o hardware manipula.",
        when: "Máscaras de bits, flags, endereços, permissões Linux.",
        how: "Cada posição vale uma potência de 2.",
        code: "bin(42)    # '0b101010'\n0b101010   # 42"
      }),
      T("Hexadecimal", {
        what: "Base 16 — cada dígito representa exatamente 4 bits.",
        when: "Dumps de memória, cores, hashes, endereços.",
        how: "Um byte é sempre dois dígitos hex."
      }),
      T("Bits"), T("Bytes"), T("Inteiros"),
      T("Signed vs Unsigned", {
        what: "Se o bit mais significativo indica sinal ou faz parte da magnitude.",
        when: "Ao definir schemas: um INT unsigned mal mapeado vira negativo no destino.",
        how: "int32 vai de −2.147.483.648 a 2.147.483.647; uint32 vai de 0 a 4.294.967.295."
      }),
      T("Two's Complement", {
        what: "A representação padrão de inteiros negativos.",
        when: "Ao entender overflow silencioso.",
        how: "Inverta todos os bits e some 1. Permite usar o mesmo somador para soma e subtração."
      }),
      T("Floating Point", { id: "float", deep: true,
        what: "Números reais aproximados por sinal, expoente e mantissa.",
        when: "SEMPRE que houver dinheiro, agregações grandes ou comparação de igualdade.",
        how: "A base 2 não representa 0.1 exatamente, então erros se acumulam a cada operação.",
        code: "0.1 + 0.2 == 0.3      # False\n0.1 + 0.2             # 0.30000000000000004\n\nfrom decimal import Decimal\nDecimal('0.1') + Decimal('0.2') == Decimal('0.3')  # True",
        de: "Use DECIMAL/NUMERIC para valores monetários no warehouse. FLOAT em coluna de receita é um bug esperando o fechamento do mês.",
        drill: "Some 0.1 dez milhões de vezes em float e em Decimal. Compare o resultado e o tempo."
      }),
      T("IEEE 754"), T("ASCII"), T("Unicode"),
      T("UTF-8", { id: "utf8",
        what: "Codificação de largura variável (1 a 4 bytes) compatível com ASCII.",
        when: "Toda ingestão de dados textuais. A maior fonte de erros silenciosos em CSV.",
        how: "Bytes ASCII permanecem iguais; caracteres acentuados usam 2+ bytes.",
        code: "len('ação')            # 4 caracteres\nlen('ação'.encode())   # 6 bytes",
        de: "Sempre declare o encoding na leitura. `latin-1` lido como `utf-8` gera mojibake irreversível a jusante."
      }),
      T("Encoding"), T("Serialization")
    ]},

    { name: "Algoritmos — base", desc: "Custo antes de código.", items: [
      T("O que é algoritmo"),
      T("Complexidade temporal", { id: "big-o", deep: true,
        what: "Como o tempo de execução cresce em função do tamanho da entrada.",
        when: "Antes de escrever qualquer loop aninhado sobre dados de produção.",
        how: "Ignoram-se constantes e termos menores; o que importa é a taxa de crescimento.",
        ex: "O(n): percorra uma lista, faça uma operação constante por elemento, o tempo cresce proporcionalmente ao tamanho da entrada.",
        code: "# O(n^2) — 10k itens = 100.000.000 comparacoes\nfor a in lista:\n    for b in lista:\n        if a.id == b.id: ...\n\n# O(n) — mesmo resultado com um dict\nindice = {b.id: b for b in lista}\nfor a in lista:\n    b = indice.get(a.id)",
        de: "Um join O(n²) escondido dentro de um `for` é a causa mais comum de pipeline que 'funcionava em dev'.",
        drill: "Reescreva um loop aninhado usando um dicionário e meça a diferença com 100k registros."
      }),
      T("Complexidade espacial"), T("Big O"), T("Big Theta"), T("Big Omega"),
      T("Amortized Complexity", {
        what: "Custo médio por operação em uma sequência, mesmo com operações pontuais caras.",
        when: "Ao entender por que `list.append` é O(1) apesar do realloc.",
        how: "O array dobra de capacidade; o custo do realloc dilui-se entre as inserções."
      })
    ]}
  ]
},

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
},

{
  id: "l3", level: "LEVEL 3", title: "Data Structures & Algorithms",
  cat: "algo", desc: "Trilha independente de linguagem. Para cada tópico: conceito, quando usar, complexidade, exemplo, exercício.",
  groups: [
    { name: "Estruturas", items: [
      T("Array", { what: "Bloco contíguo de memória com acesso por índice.", when: "Acesso aleatório frequente e iteração sequencial.", how: "Índice é aritmética de ponteiro: O(1). Inserção no meio é O(n)." }),
      T("Dynamic Array"),
      T("Linked List", { what: "Nós ligados por ponteiros.", when: "Inserção/remoção frequente nas pontas, sem acesso por índice.", how: "Inserção O(1), busca O(n). Péssima localidade de cache." }),
      T("Stack"), T("Queue"), T("Deque"),
      T("Hash Table", { id: "hash", deep: true,
        what: "Estrutura que mapeia chave → valor via função de hash.",
        when: "Lookup, deduplicação, agrupamento, joins em memória.",
        how: "hash(chave) define o bucket. Colisões resolvidas por encadeamento ou open addressing.",
        code: "# GROUP BY em memoria — O(n) em vez de O(n^2)\nfrom collections import defaultdict\ntotais = defaultdict(float)\nfor v in vendas:\n    totais[v.cliente] += v.valor",
        de: "É exatamente o que um hash join faz em bancos e no Spark: constrói a hash table do lado menor e varre o maior.",
        drill: "Implemente uma hash table com encadeamento e meça o efeito do fator de carga."
      }),
      T("Set"), T("Tree"), T("Binary Tree"),
      T("BST"),
      T("Heap", { what: "Árvore binária com propriedade de ordem parcial.", when: "Top-K, filas de prioridade, merge de streams ordenados.", how: "push e pop em O(log n); o mínimo/máximo é O(1).",
        code: "import heapq\ntop10 = heapq.nlargest(10, registros, key=lambda r: r.valor)" }),
      T("Trie"),
      T("Graph", { id: "graph", what: "Vértices e arestas.", when: "Dependências entre tarefas, linhagem de dados, redes.", how: "Lista de adjacência é o padrão para grafos esparsos.", de: "Um DAG de Airflow e a linhagem de colunas de um warehouse são grafos." })
    ]},

    { name: "Algoritmos", items: [
      T("Linear Search"),
      T("Binary Search", { what: "Busca em dados ordenados dividindo o espaço pela metade.", when: "Coleção ordenada e consultada muitas vezes.", how: "O(log n). 1 bilhão de itens em ~30 comparações.", de: "É o princípio dos índices B-Tree e do skipping por estatísticas no Parquet.", req: ["big-o"] }),
      T("Sorting"), T("Merge Sort"), T("Quick Sort"), T("Heap Sort"),
      T("BFS"), T("DFS"),
      T("Topological Sort", { what: "Ordenação linear de um DAG respeitando dependências.", when: "Ordem de execução de tarefas e de modelos.", how: "Kahn: remova repetidamente nós sem dependências pendentes.", de: "É literalmente como Airflow e dbt decidem o que roda primeiro.", req: ["graph"] }),
      T("Dijkstra"), T("Union Find"), T("Greedy"), T("Backtracking"),
      T("Dynamic Programming")
    ]}
  ]
},

{
  id: "l4", level: "LEVEL 4", title: "Linux e Sistemas Operacionais",
  cat: "cs", desc: "Onde seus pipelines realmente rodam.",
  groups: [
    { name: "Conceitos", items: [
      T("Terminal"), T("Filesystem"),
      T("Permissions", { what: "Bits de leitura, escrita e execução para dono, grupo e outros.", when: "Erros de 'permission denied' em jobs agendados.", how: "chmod 640 = dono lê/escreve, grupo lê, outros nada.", code: "chmod 600 ~/.ssh/id_rsa   # obrigatorio para o ssh aceitar" }),
      T("Users"),
      T("Processes", { id: "proc", what: "Um programa em execução, com espaço de memória próprio.", when: "Investigar jobs travados, consumo de memória, zumbis.", how: "Cada processo tem PID, memória isolada e descritores de arquivo." }),
      T("Signals", { what: "Notificações assíncronas enviadas a processos.", when: "Shutdown gracioso: salvar offset antes de morrer.", how: "SIGTERM pede parada (capturável); SIGKILL mata sem aviso.", de: "Um consumidor Kafka precisa tratar SIGTERM para commitar o offset e não reprocessar." }),
      T("Threads"), T("Scheduling"),
      T("Virtual Memory", { what: "Abstração que dá a cada processo um espaço de endereços contínuo.", when: "Entender OOM kill e swap em jobs de dados.", how: "MMU traduz endereços virtuais em físicos por páginas.", de: "Quando um executor Spark morre por OOM, o kernel matou o processo — não houve exceção Python." }),
      T("Stack"), T("Heap"),
      T("System Calls", { what: "A fronteira entre programa e kernel.", when: "Toda leitura de arquivo ou envio de rede.", how: "read, write, open, socket. Trocar user↔kernel space custa tempo.", de: "Ler byte a byte faz milhões de syscalls; ler em blocos de 64 KB faz milhares." }),
      T("File Descriptors"),
      T("Pipes", { what: "Canal unidirecional entre processos.", when: "Compor ferramentas de linha de comando.", how: "A saída de um vira a entrada de outro, com buffer no kernel.", code: "cat eventos.log | grep ERROR | awk '{print $4}' | sort | uniq -c | sort -rn | head" }),
      T("Sockets"), T("Environment Variables"),
      T("Processes vs Threads"), T("Context Switching"),
      T("Deadlocks"), T("Concurrency"), T("Memory Management")
    ]},

    { name: "Ferramentas essenciais", desc: "Domine estas antes de qualquer ferramenta de observabilidade sofisticada.", items: [
      T("ps"), T("top"), T("htop"),
      T("lsof", { what: "Lista arquivos abertos por processo.", when: "'Too many open files', porta ocupada, arquivo que não libera espaço.", code: "lsof -p <pid>\nlsof -i :8080" }),
      T("strace", { what: "Rastreia as syscalls de um processo.", when: "Quando o processo trava sem log algum.", code: "strace -p <pid> -f -e trace=network" }),
      T("grep"),
      T("awk", { what: "Processador de texto orientado a colunas.", when: "Inspeção rápida de arquivos grandes sem escrever script.", code: "awk -F',' '{s+=$3} END {print s}' vendas.csv" }),
      T("sed"), T("find"), T("xargs"), T("curl"), T("ssh"), T("chmod"), T("chown")
    ]}
  ]
},

{
  id: "l5", level: "LEVEL 5", title: "Redes",
  cat: "cs", desc: "Dados em movimento sempre atravessam a rede. Latência é física.",
  groups: [
    { name: "Fundamentos", items: [
      T("Network fundamentals"), T("OSI Model"),
      T("TCP/IP", { id: "tcpip" }),
      T("Ethernet"), T("MAC"),
      T("IP", { id: "ip", what: "Endereçamento e roteamento entre redes.", when: "VPCs, firewalls, conectividade de banco.", how: "Endereço identifica interface; máscara separa rede e host." }),
      T("IPv4"), T("IPv6"),
      T("Subnets", { what: "Divisão de uma rede em blocos menores.", when: "Desenhar VPC: subnet pública vs. privada.", how: "/24 = 256 endereços; /16 = 65.536." }),
      T("Routing"), T("ARP"),
      T("DNS", { what: "Tradução de nome para endereço IP.", when: "Falha intermitente de conexão com banco ou API.", how: "Consulta hierárquica com cache em várias camadas — TTL causa propagação lenta." }),
      T("DHCP"),
      T("TCP", { id: "tcp", deep: true,
        what: "Protocolo confiável, orientado a conexão e ordenado.",
        when: "Bancos, HTTP, Kafka — praticamente tudo em engenharia de dados.",
        how: "Three-way handshake, números de sequência, retransmissão e controle de congestionamento.",
        code: "cliente  --SYN-->      servidor\ncliente  <--SYN/ACK--  servidor\ncliente  --ACK-->      servidor\n         [ dados ]",
        de: "Cada conexão nova custa um RTT antes do primeiro byte. Por isso connection pooling importa tanto em jobs que abrem milhares de conexões.",
        req: ["ip"]
      }),
      T("UDP"), T("Ports"), T("Sockets"),
      T("HTTP"), T("HTTPS"),
      T("TLS", { what: "Criptografia e autenticação sobre TCP.", when: "Todo tráfego externo; certificados expirados derrubam pipelines.", how: "Handshake troca certificados e negocia chaves — custa RTTs adicionais." }),
      T("Load Balancers"), T("Proxies"), T("Reverse Proxy")
    ]},

    { name: "Como uma requisição funciona", desc: "Saber narrar este caminho inteiro separa quem usa de quem entende.", items: [
      T("Trace completo de uma requisição", { deep: true,
        what: "O caminho de ponta a ponta de uma requisição HTTPS.",
        when: "Ao depurar latência: cada seta é um lugar onde o tempo pode se esconder.",
        how: "Cada camada adiciona latência própria e pode falhar de forma independente.",
        code: "Browser\n  ↓  resolve o nome\nDNS\n  ↓  handshake (1 RTT)\nTCP\n  ↓  handshake (1-2 RTT)\nTLS\n  ↓  request/response\nHTTP\n  ↓  escolhe o backend\nLoad Balancer\n  ↓\nApplication\n  ↓  query\nDatabase",
        drill: "Explique o caminho de uma requisição HTTPS, camada por camada, sem consultar nada.",
        req: ["tcp"]
      })
    ]}
  ]
},

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
},

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
},

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
},

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
},

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
},

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
},

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
},

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
];
