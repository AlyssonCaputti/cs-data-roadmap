/* ===========================================================
   ENGINEERING ROADMAP — app.js
   Personal Engineering Operating System
   Fundamento -> Entendimento -> Implementacao -> Exercicio -> Projeto -> Producao
   =========================================================== */

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

/* ===========================================================
   DATA — CURSOS, LIVROS, PROJETOS, C++, EXTRAS
   =========================================================== */

const COURSES = [
  { id: "cs50", name: "CS50 — Harvard", tags: ["C", "Algorithms", "Memory", "Data Structures", "Computer Architecture", "Python", "SQL", "Web"],
    desc: "A melhor porta de entrada para fundamentos de computação de verdade." },
  { id: "zoomcamp", name: "Data Engineering Zoomcamp", tags: ["Docker", "SQL", "Data Warehouse", "Terraform", "GCP", "dbt", "Airflow", "Spark", "Kafka"],
    desc: "Prática de ponta a ponta com o stack moderno de engenharia de dados." },
  { id: "dp700", name: "DP-700 — Microsoft", tags: ["Microsoft Fabric", "OneLake", "Data Factory", "Lakehouse", "Warehouse", "Spark", "Streaming", "Governance"],
    desc: "Certification track. Complementa — nunca substitui — os fundamentos." }
];

const STUDIES = [
  { id: "cs50", name: "CS50" },
  { id: "py-fund", name: "Python Fundamentals" },
  { id: "sql-fund", name: "SQL Fundamentals" },
  { id: "linux", name: "Linux" },
  { id: "dsa", name: "DSA" },
  { id: "db", name: "Databases" },
  { id: "de-fund", name: "Data Engineering Fundamentals" },
  { id: "zoomcamp", name: "Data Engineering Zoomcamp" },
  { id: "dist", name: "Distributed Systems" },
  { id: "spark-kafka", name: "Spark / Kafka" },
  { id: "cloud", name: "Cloud" },
  { id: "dp700", name: "DP-700 / Fabric" },
  { id: "prod-de", name: "Production Data Engineering" },
  { id: "sysdesign", name: "System Design" }
];

const FIRST_PATH = ["cs50", "py-fund", "sql-fund", "linux", "dsa", "db", "de-fund",
                    "zoomcamp", "dist", "spark-kafka", "cloud", "dp700", "prod-de", "sysdesign"];

const BOOKS = [
  { id: "csapp", name: "Computer Systems: A Programmer's Perspective", chapters: 12,
    why: "Conecta hardware, memória e código. Transforma como você lê performance." },
  { id: "ddia", name: "Designing Data-Intensive Applications", chapters: 12,
    why: "O livro definitivo de sistemas de dados. Leia depois de ter alguma prática." },
  { id: "dbint", name: "Database Internals", chapters: 13,
    why: "Como bancos realmente armazenam, indexam e replicam." },
  { id: "ostep", name: "Operating Systems: Three Easy Pieces", chapters: 14,
    why: "Processos, memória virtual e concorrência com clareza rara." },
  { id: "netbook", name: "Computer Networking: A Top-Down Approach", chapters: 9,
    why: "Da aplicação ao link. Fecha a lacuna de rede da maioria dos engenheiros de dados." }
];

const CPP_TRACK = ["Sintaxe básica", "Variáveis e tipos", "References", "Pointers", "Struct",
  "Class", "Constructors", "RAII", "Stack vs Heap", "STL", "vector", "string", "unordered_map",
  "map", "set", "priority_queue", "stack", "queue", "deque", "iterators", "algorithms", "sort",
  "binary_search", "lower_bound", "upper_bound", "lambda", "recursion", "complexity", "memory"];

const DSA_TRACK = ["Arrays", "Strings", "Hashing", "Two Pointers", "Sliding Window", "Stack",
  "Queue", "Linked List", "Binary Search", "Trees", "BST", "Heap", "Graphs", "BFS", "DFS",
  "Topological Sort", "Union Find", "Recursion", "Backtracking", "Greedy", "Dynamic Programming"];

const PROJECTS = [
  { id: "p1", name: "Projeto 1 — CLI em Python", req: ["py-list", "py-gen"],
    desc: "Uma ferramenta de linha de comando que lê arquivos, processa dados e gera um relatório.",
    steps: ["CLI em Python", "Ler arquivos", "Processar dados", "Gerar relatório", "Testes"] },
  { id: "p2", name: "Projeto 2 — SQL", req: ["sql", "index"],
    desc: "Modelar do zero e provar que você entende o plano de execução.",
    steps: ["Modelar banco", "Criar schema", "Inserir dados", "Queries", "Índices", "EXPLAIN"] },
  { id: "p3", name: "Projeto 3 — Pipeline", req: ["sql", "idem", "py-gen"],
    desc: "Primeiro pipeline de ponta a ponta.",
    steps: ["API", "Python", "PostgreSQL", "Transformação", "Dashboard"],
    flow: "API\n ↓\nPython\n ↓\nPostgreSQL\n ↓\nTransformação\n ↓\nDashboard" },
  { id: "p4", name: "Projeto 4 — Batch", req: ["spark", "parquet", "medallion"],
    desc: "Processamento distribuído sobre object storage.",
    steps: ["Raw data", "Object Storage", "Spark", "Data Lake", "Warehouse"],
    flow: "Raw data\n ↓\nObject Storage\n ↓\nSpark\n ↓\nData Lake\n ↓\nWarehouse" },
  { id: "p5", name: "Projeto 5 — Streaming", req: ["kafka", "idem"],
    desc: "Eventos em tempo real, com semântica de entrega explícita.",
    steps: ["Producer", "Kafka", "Consumer", "Processing", "Storage"],
    flow: "Producer\n ↓\nKafka\n ↓\nConsumer\n ↓\nProcessing\n ↓\nStorage" },
  { id: "p6", name: "Projeto 6 — Production-grade", req: ["docker", "idem", "dag", "cdc", "medallion"],
    desc: "O projeto que muda o seu nível. Tudo junto, operável por outra pessoa.",
    steps: ["Docker", "Cloud", "CI/CD", "Data Quality", "Orchestration", "Monitoring",
            "Logging", "Retry", "Idempotency", "Backfill", "Documentation"] }
];

const FREE_SUGGESTIONS = ["Linux Internals", "C", "Compiladores", "TCP/IP", "Assembly",
  "Banco de dados interno", "Rust", "GPU", "Distributed Systems"];

const WEEKLY_ITEMS = [
  "Revisei o que estudei",
  "Resolvi problemas",
  "Fiz pelo menos um exercício de implementação",
  "Avancei no projeto",
  "Li o livro",
  "Fiz estudo livre",
  "Documentei o que aprendi",
  "Identifiquei minhas lacunas"
];

const MASTERY_STEPS = ["Entendi o conceito", "Consigo explicar", "Fiz o exercício", "Implementei"];

const CATEGORIES = [
  { id: "all",   label: "All" },
  { id: "cs",    label: "Computer Science" },
  { id: "prog",  label: "Programming" },
  { id: "algo",  label: "Algorithms" },
  { id: "db",    label: "Databases" },
  { id: "de",    label: "Data Engineering" },
  { id: "dist",  label: "Distributed Systems" },
  { id: "cloud", label: "Cloud" },
  { id: "arch",  label: "Architecture" },
  { id: "proj",  label: "Projects" },
  { id: "prod",  label: "Production" }
];

/* ===========================================================
   ÍNDICE DE TÓPICOS  (id estável -> topico)
   =========================================================== */

const slug = (s) => s.toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const TOPIC_INDEX = {};   // id -> { ...topic, levelId, levelTitle, groupName, cat }
const ALL_TOPIC_IDS = [];

ROADMAP.forEach((lv) => {
  lv.groups.forEach((g) => {
    g.items.forEach((it) => {
      if (!it.id) it.id = slug(lv.id + "-" + it.t);
      it.levelId = lv.id;
      it.levelTitle = lv.title;
      it.levelTag = lv.level;
      it.groupName = g.name;
      it.cat = lv.cat;
      TOPIC_INDEX[it.id] = it;
      ALL_TOPIC_IDS.push(it.id);
    });
  });
});

const hasDetail = (t) => !!(t.what || t.how || t.code || t.drill || t.de || t.when || t.ex);

/* ===========================================================
   STATE
   =========================================================== */

const STORAGE_KEY = "engineering-roadmap-progress";
const STORAGE_VERSION = 1;

const defaultState = () => ({
  version: STORAGE_VERSION,
  topics: {},                 // id -> { completed, mastery:[bool x4], review:bool }
  activeStudies: [],          // [studyId]
  pausedStudies: [],
  completedStudies: [],
  currentBook: null,          // bookId
  bookProgress: 0,            // capítulo atual
  pausedBooks: [],
  completedBooks: [],
  freeStudy: [],              // [{ id, name, done }]
  competitiveProgramming: { solved: 0, easy: 0, medium: 0, hard: 0, daily: {} },
  studyTime: { total: 0, days: {} },   // days: { 'YYYY-MM-DD': minutos }
  notes: {},                  // topicId -> texto
  weekly: {},                 // 'YYYY-Www' -> [bool x8]
  todayChecks: {},            // 'YYYY-MM-DD' -> { key: bool }
  theme: "dark",
  filter: "all",
  openLevels: [],
  cpp: {},                    // nome -> bool
  dsa: {},
  courses: {},                // courseId -> bool
  projectSteps: {}            // 'pid:idx' -> bool
});

let state = defaultState();

/* ===========================================================
   STORAGE
   =========================================================== */

function migrate(raw) {
  const s = Object.assign(defaultState(), raw);
  // Preenche chaves aninhadas que possam faltar em versões antigas.
  s.competitiveProgramming = Object.assign(defaultState().competitiveProgramming, raw.competitiveProgramming || {});
  s.studyTime = Object.assign(defaultState().studyTime, raw.studyTime || {});
  s.version = STORAGE_VERSION;
  return s;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === "object") state = migrate(parsed);
  } catch (e) {
    console.warn("Não foi possível carregar o progresso salvo:", e);
  }
}

let saveTimer = null;
function saveState(immediate) {
  const write = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      toast("Falha ao salvar. O armazenamento local pode estar cheio ou bloqueado.", "err");
    }
  };
  if (immediate) { clearTimeout(saveTimer); write(); return; }
  clearTimeout(saveTimer);
  saveTimer = setTimeout(write, 250);
}

/* ===========================================================
   HELPERS
   =========================================================== */

const $  = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

function todayKey(d) {
  const x = d || new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`;
}

function weekKey(d) {
  const x = new Date(d || Date.now());
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() + 4 - (x.getDay() || 7));      // quinta da semana ISO
  const jan1 = new Date(x.getFullYear(), 0, 1);
  const wk = Math.ceil((((x - jan1) / 86400000) + 1) / 7);
  return `${x.getFullYear()}-W${String(wk).padStart(2, "0")}`;
}

function fmtMin(m) {
  const mins = Math.round(m || 0);
  if (mins < 60) return mins + "m";
  return Math.floor(mins / 60) + "h" + (mins % 60 ? String(mins % 60).padStart(2, "0") : "");
}

const topicState = (id) => {
  if (!state.topics[id]) state.topics[id] = { completed: false, mastery: [false, false, false, false], review: false };
  const t = state.topics[id];
  if (!Array.isArray(t.mastery) || t.mastery.length !== 4) t.mastery = [false, false, false, false];
  return t;
};

const isDone = (id) => !!(state.topics[id] && state.topics[id].completed);

function levelStats(lv) {
  let total = 0, done = 0;
  lv.groups.forEach((g) => g.items.forEach((it) => { total++; if (isDone(it.id)) done++; }));
  return { total, done, pct: total ? Math.round(done / total * 100) : 0 };
}

function overallStats() {
  const total = ALL_TOPIC_IDS.length;
  const done = ALL_TOPIC_IDS.filter(isDone).length;
  return { total, done, pct: total ? Math.round(done / total * 100) : 0 };
}

const studyName = (id) => (STUDIES.find((s) => s.id === id) || { name: id }).name;
const bookById  = (id) => BOOKS.find((b) => b.id === id);

/* ===========================================================
   TOAST
   =========================================================== */

function toast(msg, kind) {
  const box = $("#toasts");
  const t = el("div", "toast " + (kind || ""));
  const icons = { ok: "✓", warn: "!", err: "×" };
  t.append(el("span", "toast-ico", icons[kind] || "›"), el("span", null, msg));
  box.appendChild(t);
  setTimeout(() => {
    t.classList.add("is-out");
    setTimeout(() => t.remove(), 220);
  }, 3200);
}

/* ===========================================================
   MODAL
   =========================================================== */

let modalLastFocus = null;

function showModal(title, bodyNodes, actions) {
  modalLastFocus = document.activeElement;
  $("#modalTitle").textContent = title;
  const body = $("#modalBody");
  body.innerHTML = "";
  (Array.isArray(bodyNodes) ? bodyNodes : [bodyNodes]).forEach((n) => {
    body.appendChild(typeof n === "string" ? el("p", null, n) : n);
  });
  const act = $("#modalActions");
  act.innerHTML = "";
  (actions || [{ label: "OK" }]).forEach((a) => {
    const b = el("button", "btn " + (a.cls || ""), a.label);
    b.addEventListener("click", () => { closeModal(); if (a.onClick) a.onClick(); });
    act.appendChild(b);
  });
  $("#modalScrim").hidden = false;
  const first = act.querySelector("button");
  if (first) first.focus();
}

function closeModal() {
  $("#modalScrim").hidden = true;
  if (modalLastFocus && modalLastFocus.focus) modalLastFocus.focus();
}

/* ===========================================================
   STUDY MANAGEMENT  (regra: máximo 2 ativos)
   =========================================================== */

function activateStudy(id) {
  if (state.activeStudies.includes(id)) return;
  if (state.activeStudies.length >= 2) {
    const list = el("ul", "modal-list");
    state.activeStudies.forEach((s) => list.appendChild(el("li", null, "● " + studyName(s))));
    showModal("Focus protection", [
      "Você está tentando adicionar mais uma frente de estudo. Atualmente:",
      list,
      el("p", null, `${state.activeStudies.length} estudos ativos · ${state.currentBook ? 1 : 0} livro ativo`),
      "Finalize ou pause algo antes de adicionar outra coisa."
    ], [{ label: "Entendi", cls: "btn-primary" }]);
    return;
  }
  state.pausedStudies = state.pausedStudies.filter((s) => s !== id);
  state.completedStudies = state.completedStudies.filter((s) => s !== id);
  state.activeStudies.push(id);
  saveState(); renderAll();
  toast("Study activated — " + studyName(id), "ok");
}

function pauseStudy(id) {
  state.activeStudies = state.activeStudies.filter((s) => s !== id);
  if (!state.pausedStudies.includes(id)) state.pausedStudies.push(id);
  saveState(); renderAll();
  toast("Estudo pausado — " + studyName(id), "warn");
}

function completeStudy(id) {
  state.activeStudies = state.activeStudies.filter((s) => s !== id);
  state.pausedStudies = state.pausedStudies.filter((s) => s !== id);
  if (!state.completedStudies.includes(id)) state.completedStudies.push(id);
  saveState(); renderAll();
  toast("Estudo concluído — " + studyName(id), "ok");
}

function resetStudy(id) {
  state.activeStudies = state.activeStudies.filter((s) => s !== id);
  state.pausedStudies = state.pausedStudies.filter((s) => s !== id);
  state.completedStudies = state.completedStudies.filter((s) => s !== id);
  saveState(); renderAll();
}

const studyStatus = (id) =>
  state.activeStudies.includes(id) ? "ACTIVE"
  : state.pausedStudies.includes(id) ? "PAUSED"
  : state.completedStudies.includes(id) ? "COMPLETED"
  : "NOT_STARTED";

const STATUS_ICON = { NOT_STARTED: "○", ACTIVE: "●", PAUSED: "Ⅱ", COMPLETED: "✓" };

/* ===========================================================
   BOOK MANAGEMENT  (regra: 1 livro ativo)
   =========================================================== */

function setBook(id) {
  if (state.currentBook === id) return;
  if (state.currentBook) {
    const cur = bookById(state.currentBook);
    showModal("Você já possui um livro ativo", [
      `Livro atual: ${cur ? cur.name : state.currentBook} — capítulo ${state.bookProgress}/${cur ? cur.chapters : "?"}.`,
      "Finalize ou pause o livro atual antes de começar outro."
    ], [{ label: "Entendi", cls: "btn-primary" }]);
    return;
  }
  state.currentBook = id;
  state.bookProgress = 0;
  state.pausedBooks = state.pausedBooks.filter((b) => b.id !== id);
  saveState(); renderAll();
  toast("Livro iniciado — " + bookById(id).name, "ok");
}

function pauseBook() {
  if (!state.currentBook) return;
  const id = state.currentBook;
  state.pausedBooks = state.pausedBooks.filter((b) => b.id !== id);
  state.pausedBooks.push({ id, chapter: state.bookProgress });
  state.currentBook = null;
  state.bookProgress = 0;
  saveState(); renderAll();
  toast("Livro pausado", "warn");
}

function resumeBook(id) {
  if (state.currentBook) {
    showModal("Você já possui um livro ativo", ["Finalize ou pause o livro atual antes de retomar outro."],
      [{ label: "Entendi", cls: "btn-primary" }]);
    return;
  }
  const p = state.pausedBooks.find((b) => b.id === id);
  state.currentBook = id;
  state.bookProgress = p ? p.chapter : 0;
  state.pausedBooks = state.pausedBooks.filter((b) => b.id !== id);
  saveState(); renderAll();
  toast("Livro retomado", "ok");
}

function completeBook(id) {
  const bid = id || state.currentBook;
  if (!bid) return;
  if (!state.completedBooks.includes(bid)) state.completedBooks.push(bid);
  if (state.currentBook === bid) { state.currentBook = null; state.bookProgress = 0; }
  state.pausedBooks = state.pausedBooks.filter((b) => b.id !== bid);
  saveState(); renderAll();
  toast("Livro concluído — " + bookById(bid).name, "ok");
}

function setChapter(n) {
  const b = bookById(state.currentBook);
  if (!b) return;
  state.bookProgress = Math.max(0, Math.min(b.chapters, n));
  saveState(); renderAll();
}

/* ===========================================================
   PROGRAMMING PRACTICE
   =========================================================== */

function dayEntry(key) {
  const d = state.competitiveProgramming.daily;
  if (!d[key]) d[key] = { easy: 0, medium: 0, hard: 0 };
  return d[key];
}

const dayTotal = (e) => (e.easy || 0) + (e.medium || 0) + (e.hard || 0);
const goalMet = (e) => (e.easy || 0) >= 3 || (e.medium || 0) >= 1 || (e.hard || 0) >= 1;

function addProblem(kind, delta) {
  const key = todayKey();
  const e = dayEntry(key);
  const before = goalMet(e);
  e[kind] = Math.max(0, (e[kind] || 0) + delta);

  const cp = state.competitiveProgramming;
  cp.easy = cp.medium = cp.hard = 0;
  Object.values(cp.daily).forEach((d) => {
    cp.easy += d.easy || 0; cp.medium += d.medium || 0; cp.hard += d.hard || 0;
  });
  cp.solved = cp.easy + cp.medium + cp.hard;

  if (dayTotal(e) === 0) delete cp.daily[key];

  saveState(); renderAll();
  if (!before && goalMet(e)) toast("Daily goal completed", "ok");
}

function streakInfo() {
  const daily = state.competitiveProgramming.daily;
  const days = Object.keys(daily).filter((k) => goalMet(daily[k]));
  let streak = 0;
  const d = new Date();
  // Se a meta de hoje ainda não foi batida, o streak conta a partir de ontem.
  if (!days.includes(todayKey(d))) d.setDate(d.getDate() - 1);
  while (days.includes(todayKey(d))) { streak++; d.setDate(d.getDate() - 1); }
  return { streak, practiced: Object.keys(daily).length };
}

/* ===========================================================
   TIMER
   =========================================================== */

const timer = { mode: 25, remaining: 25 * 60, elapsed: 0, running: false, tick: null };

function renderTimer() {
  const d = $("#timerDisplay");
  const secs = timer.mode === 0 ? timer.elapsed : timer.remaining;
  const m = Math.floor(Math.abs(secs) / 60), s = Math.abs(secs) % 60;
  d.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  d.classList.toggle("is-running", timer.running);
  $("#timerStart").disabled = timer.running;
}

function logStudyMinutes(mins) {
  if (mins <= 0) return;
  const key = todayKey();
  state.studyTime.days[key] = (state.studyTime.days[key] || 0) + mins;
  state.studyTime.total = (state.studyTime.total || 0) + mins;
  saveState();
}

function startTimer() {
  if (timer.running) return;
  timer.running = true;
  let acc = 0;
  timer.tick = setInterval(() => {
    acc++;
    timer.elapsed++;
    if (timer.mode > 0) timer.remaining--;
    if (acc >= 60) { logStudyMinutes(1); acc = 0; renderDashboard(); }
    if (timer.mode > 0 && timer.remaining <= 0) {
      stopTimer();
      logStudyMinutes(acc / 60);
      toast("Sessão concluída — " + timer.mode + " min", "ok");
      timer.remaining = timer.mode * 60;
      renderDashboard();
    }
    renderTimer();
  }, 1000);
  renderTimer();
}

function stopTimer() {
  timer.running = false;
  clearInterval(timer.tick);
  timer.tick = null;
  renderTimer();
}

function resetTimer() {
  stopTimer();
  timer.remaining = timer.mode * 60;
  timer.elapsed = 0;
  renderTimer();
}

function setTimerMode(min) {
  timer.mode = min;
  resetTimer();
  $$("#view-today .timer-modes .chip").forEach((c) => c.classList.toggle("is-on", +c.dataset.min === min));
}

/* ===========================================================
   RENDER — DASHBOARD & SIDEBAR
   =========================================================== */

function renderDashboard() {
  const o = overallStats();
  $("#statOverall").textContent = o.pct + "%";
  const bar = $("#statOverallBar");
  bar.style.width = o.pct + "%";
  bar.classList.toggle("is-done", o.pct === 100);

  $("#statStudies").textContent = state.activeStudies.length;
  $("#statStudiesHint").textContent = state.activeStudies.length
    ? state.activeStudies.map(studyName).join(" · ")
    : "Nenhum estudo ativo";

  const b = bookById(state.currentBook);
  $("#statBook").textContent = state.currentBook ? 1 : 0;
  $("#statBookHint").textContent = b ? `${b.name.split(":")[0]} — cap ${state.bookProgress}/${b.chapters}` : "Nenhum livro ativo";

  const cp = state.competitiveProgramming;
  $("#statProblems").textContent = cp.solved || 0;
  $("#statProblemsHint").textContent = `easy ${cp.easy || 0} · med ${cp.medium || 0} · hard ${cp.hard || 0}`;

  const si = streakInfo();
  $("#statStreak").firstChild.nodeValue = si.streak;
  $("#statDaysPracticed").textContent = si.practiced + " dias praticados";

  const today = state.studyTime.days[todayKey()] || 0;
  let week = 0;
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    week += state.studyTime.days[todayKey(d)] || 0;
  }
  $("#statTimeToday").textContent = fmtMin(today);
  $("#statTimeHint").textContent = `semana ${fmtMin(week)} · total ${fmtMin(state.studyTime.total)}`;

  // ---- Focus: medidores de slot ----
  const nStudies = state.activeStudies.length;
  const nBook = state.currentBook ? 1 : 0;
  $("#focusStudies").textContent = nStudies + "/2";
  $("#focusBook").textContent = nBook + "/1";

  const slots = (node, used, max) => {
    node.innerHTML = "";
    for (let i = 0; i < max; i++) node.appendChild(el("i", i < used ? "is-on" : ""));
  };
  slots($("#focusSlotsStudies"), nStudies, 2);
  slots($("#focusSlotsBook"), nBook, 1);
  $("#focusRowStudies").classList.toggle("is-full", nStudies >= 2);
  $("#focusRowBook").classList.toggle("is-full", nBook >= 1);

  const full = nStudies >= 2 && nBook >= 1;
  const hint = $("#focusHint");
  hint.textContent = full ? "no limite" : "livre";
  hint.classList.toggle("is-full", full);

  // ---- Contagens na navegação ----
  const reviewCount = ALL_TOPIC_IDS.filter((id) => state.topics[id] && state.topics[id].review).length;
  const badge = $("#reviewBadge");
  badge.hidden = reviewCount === 0;
  badge.textContent = reviewCount;

  $("#navMetaRoadmap").textContent = o.done + "/" + o.total;
  $("#navMetaPractice").textContent = cp.solved ? String(cp.solved) : "";
  $("#navMetaBooks").textContent = state.completedBooks.length
    ? state.completedBooks.length + "/" + BOOKS.length : "";
  $("#navMetaProjects").textContent = (() => {
    const done = PROJECTS.filter((p) =>
      p.steps.every((_, i) => state.projectSteps[p.id + ":" + i])).length;
    return done ? done + "/" + PROJECTS.length : "";
  })();
  $("#navMetaToday").textContent = (() => {
    const e = dayEntry(todayKey());
    return goalMet(e) ? "✓" : "";
  })();
  const wk = state.weekly[weekKey()];
  $("#navMetaWeekly").textContent = wk && wk.some(Boolean)
    ? wk.filter(Boolean).length + "/" + WEEKLY_ITEMS.length : "";

  $("#footerCounts").textContent = `${o.done}/${o.total} tópicos · ${ROADMAP.length} níveis`;
}

function renderSidebar() {
  const box = $("#sideActiveStudies");
  box.innerHTML = "";
  state.activeStudies.forEach((id) => {
    const n = el("div", "side-item");
    const top = el("div", "side-item-top");
    top.append(el("span", "side-dot"), el("h3", null, studyName(id)));
    n.appendChild(top);
    n.appendChild(el("span", "side-kind", "estudo"));
    box.appendChild(n);
  });

  const bb = $("#sideBook");
  bb.innerHTML = "";
  const b = bookById(state.currentBook);
  if (b) {
    const pct = Math.round(state.bookProgress / b.chapters * 100);
    const n = el("div", "side-item");
    const top = el("div", "side-item-top");
    const dot = el("span", "side-dot is-book");
    top.append(dot, el("h3", null, b.name.split(":")[0]),
               el("span", "side-num", state.bookProgress + "/" + b.chapters));
    n.appendChild(top);
    const bar = el("div", "bar"); const fill = el("div", "bar-fill" + (pct === 100 ? " is-done" : ""));
    fill.style.width = pct + "%";
    bar.appendChild(fill);
    n.appendChild(bar);
    bb.appendChild(n);
  }

  // Estado vazio único, só quando não há nada em andamento.
  const block = box.closest(".side-block");
  const empty = block.querySelector(".side-empty");
  if (empty) empty.remove();
  if (!state.activeStudies.length && !b) {
    block.appendChild(el("p", "side-empty",
      "Nada em andamento. Escolha até 2 estudos e 1 livro."));
  }

  // Pontos de status do rail: com a sidebar recolhida, o texto some,
  // mas continua visível que há estudos/livro em andamento.
  const dots = $("#railDots");
  dots.innerHTML = "";
  state.activeStudies.forEach(() => dots.appendChild(el("i", "is-study")));
  if (b) dots.appendChild(el("i", "is-book"));
}

/* ===========================================================
   RENDER — TODAY
   =========================================================== */

function todayChecks() {
  const k = todayKey();
  if (!state.todayChecks[k]) state.todayChecks[k] = {};
  // limpa dias antigos para não crescer indefinidamente
  const keys = Object.keys(state.todayChecks);
  if (keys.length > 30) keys.sort().slice(0, keys.length - 30).forEach((x) => delete state.todayChecks[x]);
  return state.todayChecks[k];
}

function checkRow(label, checked, onChange, meta) {
  const row = el("label", "check-row");
  const cb = el("input");
  cb.type = "checkbox";
  cb.checked = !!checked;
  cb.addEventListener("change", () => onChange(cb.checked));
  row.append(cb, el("span", "check-label", label));
  if (meta) row.appendChild(el("span", "check-meta", meta));
  return row;
}

function renderToday() {
  const d = new Date();
  $("#todayDate").textContent = d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });

  const body = $("#todayBody");
  body.innerHTML = "";
  const chk = todayChecks();
  let anything = false;

  // Estudos
  if (state.activeStudies.length) {
    anything = true;
    const g = el("div", "today-group");
    g.appendChild(el("h3", null, "Estudos"));
    state.activeStudies.forEach((id) => {
      const key = "study:" + id;
      g.appendChild(checkRow(studyName(id), chk[key], (v) => {
        chk[key] = v; saveState();
        if (v) toast("Sessão de estudo registrada", "ok");
      }, "sessão"));
    });
    body.appendChild(g);
  }

  // Programming
  const g2 = el("div", "today-group");
  g2.appendChild(el("h3", null, "Programming"));
  const e = dayEntry(todayKey());
  if (goalMet(e)) {
    g2.appendChild(el("p", "today-done", "✓ Meta diária concluída"));
  }
  const mini = el("p", "note");
  mini.textContent = `hoje: ${e.easy || 0} easy · ${e.medium || 0} medium · ${e.hard || 0} hard`;
  g2.appendChild(mini);
  const go = el("button", "btn btn-sm", "Registrar em Programming Practice →");
  go.addEventListener("click", () => switchView("practice"));
  g2.appendChild(go);
  body.appendChild(g2);
  anything = true;

  // Livro
  const b = bookById(state.currentBook);
  if (b) {
    const g3 = el("div", "today-group");
    g3.appendChild(el("h3", null, "Livro"));
    g3.appendChild(checkRow(b.name, chk["book"], (v) => { chk["book"] = v; saveState(); }, "leitura"));
    body.appendChild(g3);
  }

  // Estudo livre
  const pend = state.freeStudy.filter((f) => !f.done);
  if (pend.length) {
    const g4 = el("div", "today-group");
    g4.appendChild(el("h3", null, "Estudo livre"));
    pend.slice(0, 3).forEach((f) => {
      const key = "free:" + f.id;
      g4.appendChild(checkRow(f.name, chk[key], (v) => { chk[key] = v; saveState(); }, "opcional"));
    });
    body.appendChild(g4);
  }

  if (!anything || (!state.activeStudies.length && !b)) {
    const hint = el("p", "today-empty",
      "Sem estudo ou livro ativo. Escolha até 2 estudos e 1 livro — e então volte para cá todos os dias.");
    body.appendChild(hint);
  }

  // Estudo livre — lista
  const list = $("#freeStudyList");
  list.innerHTML = "";
  state.freeStudy.forEach((f) => {
    const li = el("li", "free-item" + (f.done ? " is-done" : ""));
    const cb = el("input"); cb.type = "checkbox"; cb.checked = f.done;
    cb.setAttribute("aria-label", "Marcar " + f.name + " como explorado");
    cb.addEventListener("change", () => { f.done = cb.checked; saveState(); renderToday(); });
    li.append(cb, el("span", "free-name", f.name));
    const x = el("button", "icon-x", "×");
    x.setAttribute("aria-label", "Remover " + f.name);
    x.addEventListener("click", () => {
      state.freeStudy = state.freeStudy.filter((z) => z.id !== f.id);
      saveState(); renderToday();
    });
    li.appendChild(x);
    list.appendChild(li);
  });

  const sug = $("#freeSuggest");
  sug.innerHTML = "";
  FREE_SUGGESTIONS.filter((s) => !state.freeStudy.some((f) => f.name === s)).forEach((s) => {
    const c = el("button", "chip", s);
    c.addEventListener("click", () => addFreeStudy(s));
    sug.appendChild(c);
  });

  // First path
  const fp = $("#firstPathList");
  fp.innerHTML = "";
  FIRST_PATH.forEach((id) => {
    const st = studyStatus(id);
    const li = el("li", st === "COMPLETED" ? "is-done" : "");
    li.appendChild(el("span", null, studyName(id)));
    const tag = el("span", "path-pct", STATUS_ICON[st] + " " + st.toLowerCase().replace("_", " "));
    li.appendChild(tag);
    const btn = el("button", "btn btn-sm btn-ghost",
      st === "ACTIVE" ? "Pausar" : st === "COMPLETED" ? "Reabrir" : "Ativar");
    btn.addEventListener("click", () => {
      if (st === "ACTIVE") pauseStudy(id);
      else if (st === "COMPLETED") resetStudy(id);
      else activateStudy(id);
    });
    li.appendChild(btn);
    fp.appendChild(li);
  });
}

function addFreeStudy(name) {
  const n = String(name || "").trim();
  if (!n) return;
  if (state.freeStudy.some((f) => f.name.toLowerCase() === n.toLowerCase())) {
    toast("Esse estudo livre já está na lista", "warn"); return;
  }
  state.freeStudy.push({ id: slug(n) + "-" + state.freeStudy.length, name: n, done: false });
  saveState(); renderToday();
  toast("Estudo livre adicionado", "ok");
}

/* ===========================================================
   RENDER — ROADMAP (timeline, filtros, níveis, tópicos)
   =========================================================== */

function renderTimeline() {
  const tl = $("#timeline");
  tl.innerHTML = "";
  ROADMAP.forEach((lv, i) => {
    const st = levelStats(lv);
    const row = el("button", "tl-row");
    row.type = "button";
    row.setAttribute("aria-label", `${lv.title} — ${st.pct}% concluído`);
    row.append(el("span", "tl-idx", String(i).padStart(2, "0")));
    row.append(el("span", "tl-name", lv.title));
    const bar = el("span", "tl-bar");
    const fill = el("span", "tl-fill" + (st.pct === 100 ? " is-done" : ""));
    fill.style.width = st.pct + "%";
    bar.appendChild(fill);
    row.append(bar, el("span", "tl-pct", st.pct + "%"));
    row.addEventListener("click", () => {
      if (!state.openLevels.includes(lv.id)) state.openLevels.push(lv.id);
      saveState(); renderLevels();
      const node = document.getElementById("level-" + lv.id);
      if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    tl.appendChild(row);
  });
}

function renderFilters() {
  const f = $("#filters");
  f.innerHTML = "";
  CATEGORIES.forEach((c) => {
    const b = el("button", "chip" + (state.filter === c.id ? " is-on" : ""), c.label);
    b.setAttribute("aria-pressed", state.filter === c.id ? "true" : "false");
    b.addEventListener("click", () => {
      state.filter = c.id; saveState(); renderFilters(); renderLevels();
    });
    f.appendChild(b);
  });
}

let searchQuery = "";

function matchesSearch(topic, lv) {
  if (!searchQuery) return true;
  const q = searchQuery;
  const hay = [topic.t, topic.what, topic.when, topic.how, topic.de, topic.drill,
               topic.groupName, lv.title, lv.level].filter(Boolean).join(" ").toLowerCase();
  return hay.normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q);
}

function buildTopic(topic, lv) {
  const ts = topicState(topic.id);
  const wrap = el("article", "topic" + (ts.completed ? " is-done" : ""));
  wrap.id = "topic-" + topic.id;

  const row = el("div", "topic-row");

  const cb = el("input", "cbx");
  cb.type = "checkbox";
  cb.id = "cb-" + topic.id;
  cb.checked = ts.completed;
  const doneCount = ts.mastery.filter(Boolean).length;
  cb.indeterminate = !ts.completed && doneCount > 0;
  cb.setAttribute("aria-label", "Marcar " + topic.t + " como dominado");
  cb.addEventListener("change", () => toggleTopic(topic.id, cb.checked));
  row.appendChild(cb);

  const detailed = hasDetail(topic);
  const toggle = el("button", "topic-toggle");
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "detail-" + topic.id);
  toggle.appendChild(el("span", "topic-title", topic.t));

  if (topic.deep) toggle.appendChild(el("span", "badge badge-deep", "deep dive"));
  if (ts.review) toggle.appendChild(el("span", "badge badge-review", "revisar"));
  if (state.notes[topic.id]) toggle.appendChild(el("span", "badge badge-note", "nota"));

  // pré-requisitos
  const missing = (topic.req || []).filter((r) => !isDone(r));
  if (missing.length && !ts.completed) {
    const lock = el("span", "badge badge-lock", "🔒 pré-requisitos");
    lock.title = "Recomendado antes: " + missing.map((m) => (TOPIC_INDEX[m] || {}).t || m).join(", ");
    toggle.appendChild(lock);
  }
  if (doneCount > 0 && !ts.completed) {
    toggle.appendChild(el("span", "badge badge-pct", Math.round(doneCount / 4 * 100) + "%"));
  }

  const caret = el("span", "topic-caret");
  caret.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  toggle.appendChild(caret);

  toggle.addEventListener("click", () => {
    const open = wrap.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  row.appendChild(toggle);
  wrap.appendChild(row);

  // ---- detalhe ----
  const detail = el("div", "topic-detail");
  detail.id = "detail-" + topic.id;
  const dl = el("div", "dl");

  const block = (title, text, muted) => {
    if (!text) return;
    const b = el("div", "dl-block" + (muted ? " is-muted" : ""));
    b.append(el("h4", null, title), el("p", null, text));
    dl.appendChild(b);
  };

  if (detailed) {
    block("O que é", topic.what);
    block("Quando importa", topic.when);
    block("Como funciona", topic.how);
    block("Exemplo", topic.ex);
    if (topic.code) {
      const b = el("div", "dl-block");
      b.appendChild(el("h4", null, "Código"));
      b.appendChild(el("pre", "code", topic.code));
      dl.appendChild(b);
    }
    block("Em Data Engineering", topic.de);
    block("Exercício", topic.drill);
  } else {
    const b = el("div", "dl-block is-muted");
    b.append(el("h4", null, "Checklist"),
      el("p", null, "Item de checklist. Marque apenas quando conseguir explicar o conceito sem consultar material."));
    dl.appendChild(b);
  }

  // pré-requisitos
  if (topic.req && topic.req.length) {
    const b = el("div", "dl-block");
    b.appendChild(el("h4", null, "Pré-requisitos"));
    const ps = el("div", "prereqs");
    topic.req.forEach((r) => {
      const rt = TOPIC_INDEX[r];
      const ok = isDone(r);
      const c = el("span", "prereq" + (ok ? " is-ok" : ""), (ok ? "✓ " : "○ ") + (rt ? rt.t : r));
      if (rt) {
        c.style.cursor = "pointer";
        c.title = "Ir para " + rt.t;
        c.addEventListener("click", () => goToTopic(r));
      }
      ps.appendChild(c);
    });
    b.appendChild(ps);
    b.appendChild(el("p", "prereq-note",
      "A dependência é uma recomendação, não uma prisão. Você nunca é impedido de estudar algo."));
    dl.appendChild(b);
  }

  // mastery
  const mast = el("div", "mastery");
  mast.appendChild(el("h4", null, "Critério de conclusão — ☑ dominado, não ☑ li sobre isso"));
  const grid = el("div", "mastery-grid");
  MASTERY_STEPS.forEach((label, i) => {
    grid.appendChild(checkRow(label, ts.mastery[i], (v) => {
      ts.mastery[i] = v;
      const n = ts.mastery.filter(Boolean).length;
      if (n === 4 && !ts.completed) toggleTopic(topic.id, true);
      else { saveState(); renderLevels(); renderDashboard(); }
    }));
  });
  mast.appendChild(grid);
  const mb = el("div", "mastery-bar");
  const bar = el("div", "bar"); const fill = el("div", "bar-fill");
  const mpct = Math.round(ts.mastery.filter(Boolean).length / 4 * 100);
  fill.style.width = mpct + "%";
  if (mpct === 100) fill.classList.add("is-done");
  bar.appendChild(fill);
  mb.append(bar, el("span", "mastery-pct", mpct + "%"));
  mast.appendChild(mb);
  dl.appendChild(mast);

  // ações
  const act = el("div", "topic-actions");
  const rev = el("button", "btn btn-sm" + (ts.review ? " btn-primary" : ""),
    ts.review ? "✓ Na review queue" : "Preciso revisar");
  rev.addEventListener("click", () => {
    ts.review = !ts.review; saveState(); renderLevels(); renderDashboard(); renderReview();
    toast(ts.review ? "Adicionado à Review Queue" : "Removido da Review Queue", ts.review ? "warn" : "ok");
  });
  act.appendChild(rev);
  dl.appendChild(act);

  // notas
  const nb = el("div", "dl-block");
  nb.appendChild(el("h4", null, "My notes"));
  const ta = el("textarea", "notes-area");
  ta.value = state.notes[topic.id] || "";
  ta.placeholder = "O que você entendeu, com suas palavras. O que ainda não fechou.";
  ta.setAttribute("aria-label", "Notas sobre " + topic.t);
  ta.addEventListener("input", () => {
    if (ta.value.trim()) state.notes[topic.id] = ta.value;
    else delete state.notes[topic.id];
    saveState();
  });
  nb.appendChild(ta);
  dl.appendChild(nb);

  detail.appendChild(dl);
  wrap.appendChild(detail);
  return wrap;
}

function toggleTopic(id, value) {
  const ts = topicState(id);
  ts.completed = value;
  if (value) ts.mastery = [true, true, true, true];
  saveState();
  renderLevels(); renderDashboard(); renderTimeline(); renderProjects(); renderReview();
  if (value) toast("✓ Topic completed — " + (TOPIC_INDEX[id] ? TOPIC_INDEX[id].t : id), "ok");
}

function renderLevels() {
  const box = $("#levels");
  box.innerHTML = "";
  let shown = 0, total = 0;

  ROADMAP.forEach((lv) => {
    if (state.filter !== "all" && lv.cat !== state.filter) return;

    const groups = [];
    lv.groups.forEach((g) => {
      const items = g.items.filter((it) => matchesSearch(it, lv));
      total += g.items.length;
      if (items.length) groups.push({ g, items });
      shown += items.length;
    });
    if (!groups.length) return;

    const st = levelStats(lv);
    const isOpen = state.openLevels.includes(lv.id) || !!searchQuery;

    const lvl = el("section", "level" + (isOpen ? " is-open" : ""));
    lvl.id = "level-" + lv.id;

    const head = el("button", "level-head");
    head.type = "button";
    head.setAttribute("aria-expanded", isOpen ? "true" : "false");
    head.appendChild(el("span", "level-tag", lv.level));
    const titles = el("div", "level-titles");
    titles.append(el("h2", null, lv.title), el("p", null, lv.desc));
    head.appendChild(titles);

    const meter = el("div", "level-meter");
    const bar = el("div", "bar"); const fill = el("div", "bar-fill" + (st.pct === 100 ? " is-done" : ""));
    fill.style.width = st.pct + "%";
    bar.appendChild(fill);
    meter.append(bar, el("span", "level-pct", st.done + "/" + st.total));
    head.appendChild(meter);

    const caret = el("span", "caret");
    caret.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
    head.appendChild(caret);

    head.addEventListener("click", () => {
      const open = lvl.classList.toggle("is-open");
      head.setAttribute("aria-expanded", open ? "true" : "false");
      state.openLevels = open
        ? state.openLevels.concat([lv.id])
        : state.openLevels.filter((x) => x !== lv.id);
      saveState();
    });
    lvl.appendChild(head);

    const body = el("div", "level-body");
    groups.forEach(({ g, items }) => {
      const gr = el("div", "group");
      const gh = el("div", "group-head");
      gh.appendChild(el("h3", null, g.name));
      const gdone = g.items.filter((i) => isDone(i.id)).length;
      gh.appendChild(el("span", "group-count", gdone + " / " + g.items.length));
      gr.appendChild(gh);
      if (g.desc) gr.appendChild(el("p", "group-desc", g.desc));
      items.forEach((it) => gr.appendChild(buildTopic(it, lv)));
      body.appendChild(gr);
    });
    lvl.appendChild(body);
    box.appendChild(lvl);
  });

  const info = $("#resultInfo");
  if (searchQuery) {
    info.hidden = false;
    info.textContent = shown ? `${shown} tópicos encontrados para "${searchQuery}"` : "";
  } else {
    info.hidden = true;
  }

  if (!box.children.length) {
    box.appendChild(el("div", "empty", searchQuery
      ? `Nenhum tópico encontrado para "${searchQuery}".`
      : "Nenhum tópico nesta categoria."));
  }
}

function goToTopic(id) {
  const t = TOPIC_INDEX[id];
  if (!t) return;
  switchView("roadmap");
  state.filter = "all";
  searchQuery = "";
  $("#searchInput").value = "";
  if (!state.openLevels.includes(t.levelId)) state.openLevels.push(t.levelId);
  saveState();
  renderFilters(); renderLevels();
  const node = document.getElementById("topic-" + id);
  if (node) {
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    const tg = node.querySelector(".topic-toggle");
    if (tg && !node.classList.contains("is-open")) tg.click();
    node.animate(
      [{ background: "var(--primary-soft)" }, { background: "transparent" }],
      { duration: 1200, easing: "ease-out" }
    );
  }
}

/* ===========================================================
   RENDER — PRACTICE
   =========================================================== */

function counterRow(label, kind, value) {
  const row = el("div", "free-item");
  row.appendChild(el("span", "free-name", label));
  const minus = el("button", "btn btn-sm", "−");
  minus.setAttribute("aria-label", "Remover um problema " + label);
  minus.addEventListener("click", () => addProblem(kind, -1));
  const val = el("span", "check-meta", String(value));
  val.style.minWidth = "20px";
  val.style.textAlign = "center";
  const plus = el("button", "btn btn-sm btn-primary", "+");
  plus.setAttribute("aria-label", "Adicionar um problema " + label);
  plus.addEventListener("click", () => addProblem(kind, +1));
  row.append(minus, val, plus);
  return row;
}

function renderPractice() {
  const box = $("#practiceToday");
  box.innerHTML = "";
  const e = dayEntry(todayKey());

  if (goalMet(e)) {
    const g = el("div", "goal-done");
    g.append(el("span", null, "✓"), el("span", null, "Meta diária concluída"));
    box.appendChild(g);
  }

  const g1 = el("div", "today-group");
  g1.appendChild(el("h3", null, "3 problemas simples"));
  for (let i = 0; i < 3; i++) {
    const filled = (e.easy || 0) > i;
    g1.appendChild(checkRow("Problema " + (i + 1) + " — Easy", filled, (v) => {
      addProblem("easy", v ? +1 : -1);
    }));
  }
  box.appendChild(g1);

  box.appendChild(el("div", "or-sep", "ou"));

  const g2 = el("div", "today-group");
  g2.appendChild(el("h3", null, "1 problema médio ou difícil"));
  g2.appendChild(counterRow("Medium", "medium", e.medium || 0));
  g2.appendChild(counterRow("Hard", "hard", e.hard || 0));
  box.appendChild(g2);

  box.appendChild(el("p", "note",
    "Registrar aqui é o suficiente. Não persiga o streak — persiga o hábito de resolver problemas."));

  // stats
  const cp = state.competitiveProgramming;
  const si = streakInfo();
  const stats = $("#practiceStats");
  stats.innerHTML = "";
  [["Resolvidos", cp.solved || 0], ["Streak", si.streak], ["Dias", si.practiced],
   ["Easy", cp.easy || 0], ["Medium", cp.medium || 0], ["Hard", cp.hard || 0]]
   .forEach(([l, v]) => {
     const m = el("div", "mini");
     m.append(el("b", null, String(v)), el("span", null, l));
     stats.appendChild(m);
   });

  // heatmap 84 dias
  const heat = $("#practiceHeat");
  heat.innerHTML = "";
  const now = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    const k = todayKey(d);
    const entry = cp.daily[k];
    const n = entry ? dayTotal(entry) : 0;
    const cell = el("i", n >= 3 ? "l3" : n === 2 ? "l2" : n === 1 ? "l1" : "");
    if (i === 0) cell.classList.add("today");
    cell.title = `${k} — ${n} problema${n === 1 ? "" : "s"}`;
    heat.appendChild(cell);
  }

  // C++ / DSA
  const cpp = $("#cppTrack");
  cpp.innerHTML = "";

  const mkTrack = (title, list, store) => {
    const g = el("div", "today-group");
    const done = list.filter((x) => store[x]).length;
    const h = el("div", "group-head");
    h.append(el("h3", null, title), el("span", "group-count", done + " / " + list.length));
    g.appendChild(h);
    const grid = el("div", "mastery-grid");
    list.forEach((name) => {
      grid.appendChild(checkRow(name, !!store[name], (v) => {
        if (v) store[name] = true; else delete store[name];
        saveState(); renderPractice();
      }));
    });
    g.appendChild(grid);
    return g;
  };

  cpp.appendChild(mkTrack("C++ Quick Track", CPP_TRACK, state.cpp));
  cpp.appendChild(mkTrack("DSA", DSA_TRACK, state.dsa));
  cpp.appendChild(el("p", "note",
    "A trilha de C++ é propositalmente curta. Não a transforme em uma segunda graduação."));
}

/* ===========================================================
   RENDER — BOOKS
   =========================================================== */

function renderBooks() {
  const box = $("#booksBody");
  box.innerHTML = "";

  BOOKS.forEach((b, i) => {
    const isActive = state.currentBook === b.id;
    const paused = state.pausedBooks.find((p) => p.id === b.id);
    const completed = state.completedBooks.includes(b.id);

    const card = el("div", "book" + (isActive ? " is-active" : ""));
    const info = el("div", "book-info");
    const status = completed ? "✓ Concluído" : isActive ? "● Ativo" : paused ? "Ⅱ Pausado" : "○ Não iniciado";
    info.append(el("h3", null, String(i + 1).padStart(2, "0") + ". " + b.name));
    info.append(el("p", null, status + " · " + b.why));

    if (isActive || paused || completed) {
      const ch = completed ? b.chapters : isActive ? state.bookProgress : paused.chapter;
      const pct = Math.round(ch / b.chapters * 100);
      const pr = el("div", "book-progress");
      const bar = el("div", "bar"); const fill = el("div", "bar-fill" + (pct === 100 ? " is-done" : ""));
      fill.style.width = pct + "%";
      bar.appendChild(fill);
      pr.append(bar, el("span", null, `Capítulo ${ch} / ${b.chapters} — ${pct}%`));
      info.appendChild(pr);
    }
    card.appendChild(info);

    const act = el("div", "book-actions");

    if (isActive) {
      const ctl = el("div", "chapter-ctl");
      const minus = el("button", "btn btn-sm", "−");
      minus.setAttribute("aria-label", "Capítulo anterior");
      minus.addEventListener("click", () => setChapter(state.bookProgress - 1));
      const inp = el("input");
      inp.type = "number"; inp.min = 0; inp.max = b.chapters; inp.value = state.bookProgress;
      inp.setAttribute("aria-label", "Capítulo atual");
      inp.addEventListener("change", () => setChapter(parseInt(inp.value, 10) || 0));
      const plus = el("button", "btn btn-sm", "+");
      plus.setAttribute("aria-label", "Próximo capítulo");
      plus.addEventListener("click", () => setChapter(state.bookProgress + 1));
      ctl.append(minus, inp, plus);
      act.appendChild(ctl);

      const p = el("button", "btn btn-sm", "Pausar");
      p.addEventListener("click", pauseBook);
      const c = el("button", "btn btn-sm btn-primary", "Finalizar");
      c.addEventListener("click", () => completeBook(b.id));
      act.append(p, c);
    } else if (completed) {
      const r = el("button", "btn btn-sm", "Reabrir");
      r.addEventListener("click", () => {
        state.completedBooks = state.completedBooks.filter((x) => x !== b.id);
        saveState(); renderAll();
      });
      act.appendChild(r);
    } else if (paused) {
      const r = el("button", "btn btn-sm btn-primary", "Retomar");
      r.addEventListener("click", () => resumeBook(b.id));
      act.appendChild(r);
    } else {
      const s = el("button", "btn btn-sm btn-primary", "Iniciar livro");
      s.addEventListener("click", () => setBook(b.id));
      act.appendChild(s);
    }

    card.appendChild(act);
    box.appendChild(card);
  });

  box.appendChild(el("p", "note",
    "Não é preciso ler todos simultaneamente — nem é recomendado. Um livro por vez, até o fim."));

  // Cursos
  const cs = el("div", "today-group");
  cs.appendChild(el("h3", null, "Courses"));
  COURSES.forEach((c) => {
    const card = el("div", "project" + (state.courses[c.id] ? " is-unlocked" : ""));
    const head = el("div", "project-head");
    head.appendChild(el("h3", null, c.name));
    const st = studyStatus(c.id);
    head.appendChild(el("span", "badge badge-pct", STATUS_ICON[st] + " " + st.toLowerCase().replace("_", " ")));
    card.appendChild(head);
    card.appendChild(el("p", "project-desc", c.desc));
    const tags = el("div", "prereqs");
    tags.style.marginTop = "9px";
    c.tags.forEach((t) => tags.appendChild(el("span", "prereq", t)));
    card.appendChild(tags);

    const act = el("div", "topic-actions");
    act.style.marginTop = "10px";
    if (STUDIES.some((s) => s.id === c.id)) {
      const btn = el("button", "btn btn-sm" + (st === "ACTIVE" ? "" : " btn-primary"),
        st === "ACTIVE" ? "Pausar estudo" : st === "COMPLETED" ? "Reabrir" : "Ativar como estudo");
      btn.addEventListener("click", () => {
        if (st === "ACTIVE") pauseStudy(c.id);
        else if (st === "COMPLETED") resetStudy(c.id);
        else activateStudy(c.id);
      });
      act.appendChild(btn);
    }
    const fin = el("button", "btn btn-sm", state.courses[c.id] ? "✓ Concluído" : "Marcar concluído");
    fin.addEventListener("click", () => {
      state.courses[c.id] = !state.courses[c.id];
      if (state.courses[c.id]) completeStudy(c.id);
      saveState(); renderBooks(); renderDashboard();
    });
    act.appendChild(fin);
    card.appendChild(act);
    cs.appendChild(card);
  });
  cs.appendChild(el("p", "note",
    "CS50, Zoomcamp e DP-700 fazem parte da jornada — mas não definem toda a jornada."));
  box.appendChild(cs);
}

/* ===========================================================
   RENDER — PROJECTS
   =========================================================== */

function renderProjects() {
  const box = $("#projectsBody");
  box.innerHTML = "";

  PROJECTS.forEach((p) => {
    const missing = p.req.filter((r) => !isDone(r));
    const unlocked = missing.length === 0;
    const card = el("div", "project" + (unlocked ? " is-unlocked" : ""));

    const head = el("div", "project-head");
    head.appendChild(el("h3", null, p.name));
    head.appendChild(el("span", "badge " + (unlocked ? "badge-deep" : "badge-lock"),
      unlocked ? "unlocked" : "🔒 " + missing.length + " pendente" + (missing.length > 1 ? "s" : "")));
    card.appendChild(head);
    card.appendChild(el("p", "project-desc", p.desc));

    if (p.flow) card.appendChild(el("pre", "project-flow", p.flow));

    const steps = el("div", "project-steps mastery-grid");
    p.steps.forEach((s, i) => {
      const key = p.id + ":" + i;
      steps.appendChild(checkRow(s, !!state.projectSteps[key], (v) => {
        if (v) state.projectSteps[key] = true; else delete state.projectSteps[key];
        saveState(); renderProjects();
      }));
    });
    card.appendChild(steps);

    const doneSteps = p.steps.filter((_, i) => state.projectSteps[p.id + ":" + i]).length;
    const pct = Math.round(doneSteps / p.steps.length * 100);
    const mb = el("div", "mastery-bar");
    const bar = el("div", "bar"); const fill = el("div", "bar-fill" + (pct === 100 ? " is-done" : ""));
    fill.style.width = pct + "%";
    bar.appendChild(fill);
    mb.append(bar, el("span", "mastery-pct", doneSteps + "/" + p.steps.length));
    card.appendChild(mb);

    const pr = el("div", "prereqs");
    pr.style.marginTop = "10px";
    p.req.forEach((r) => {
      const rt = TOPIC_INDEX[r];
      const ok = isDone(r);
      const c = el("span", "prereq" + (ok ? " is-ok" : ""), (ok ? "✓ " : "○ ") + (rt ? rt.t : r));
      if (rt) { c.style.cursor = "pointer"; c.addEventListener("click", () => goToTopic(r)); }
      pr.appendChild(c);
    });
    card.appendChild(pr);

    if (unlocked && pct < 100) {
      const ban = el("div", "unlock-banner");
      ban.append(el("span", null, "PROJECT UNLOCKED — " + p.name));
      card.appendChild(ban);
    }

    box.appendChild(card);
  });
}

/* ===========================================================
   RENDER — REVIEW / WEEKLY / MINDSET
   =========================================================== */

function renderReview() {
  const box = $("#reviewBody");
  box.innerHTML = "";
  const ids = ALL_TOPIC_IDS.filter((id) => state.topics[id] && state.topics[id].review);

  if (!ids.length) {
    box.appendChild(el("div", "empty",
      "Nada na fila. Marque um tópico como “preciso revisar” para ele aparecer aqui."));
    return;
  }

  ids.forEach((id) => {
    const t = TOPIC_INDEX[id];
    const row = el("div", "free-item");
    const name = el("div", "free-name");
    name.append(el("div", null, t.t));
    const sub = el("div", "note", t.levelTag + " · " + t.groupName);
    name.appendChild(sub);
    row.appendChild(name);

    const go = el("button", "btn btn-sm", "Abrir");
    go.addEventListener("click", () => goToTopic(id));
    const ok = el("button", "btn btn-sm btn-primary", "Revisado");
    ok.addEventListener("click", () => {
      state.topics[id].review = false;
      saveState(); renderReview(); renderLevels(); renderDashboard();
      toast("Removido da Review Queue", "ok");
    });
    row.append(go, ok);
    box.appendChild(row);
  });
}

function renderWeekly() {
  const wk = weekKey();
  $("#weeklyRange").textContent = "Semana " + wk;
  if (!state.weekly[wk]) state.weekly[wk] = WEEKLY_ITEMS.map(() => false);
  const arr = state.weekly[wk];

  const box = $("#weeklyBody");
  box.innerHTML = "";
  const grid = el("div", "mastery-grid");
  WEEKLY_ITEMS.forEach((label, i) => {
    grid.appendChild(checkRow(label, arr[i], (v) => {
      arr[i] = v; saveState(); renderWeekly(); renderDashboard();
    }));
  });
  box.appendChild(grid);

  const done = arr.filter(Boolean).length;
  const mb = el("div", "mastery-bar");
  const bar = el("div", "bar"); const fill = el("div", "bar-fill" + (done === arr.length ? " is-done" : ""));
  fill.style.width = Math.round(done / arr.length * 100) + "%";
  bar.appendChild(fill);
  mb.append(bar, el("span", "mastery-pct", done + "/" + arr.length));
  box.appendChild(mb);

  box.appendChild(el("p", "note",
    "Revisão semanal é opcional — mas é ela que transforma esforço disperso em progresso composto."));
}

function renderMindset() {
  const chain = $("#mindsetChain");
  if (chain.children.length) return;
  const steps = ["entender o computador", "entender o código", "entender os dados",
    "entender os sistemas", "construir pipelines", "construir plataformas",
    "projetar sistemas distribuídos", "operar sistemas em produção"];
  steps.forEach((s, i) => {
    const line = el("div");
    line.appendChild(el("b", null, s));
    chain.appendChild(line);
    if (i < steps.length - 1) chain.appendChild(el("div", null, "↓"));
  });
}

/* ===========================================================
   EXPORT / IMPORT / RESET
   =========================================================== */

/* ---- Sincronização via Git ----
   O progresso vive no localStorage, que é por navegador e por máquina.
   Estes dois botões o transformam num arquivo versionável: você exporta
   para progress.json, commita, e na outra máquina dá pull e carrega. */

const SYNC_FILE = "progress.json";

function syncToRepo() {
  const payload = Object.assign({}, state, { savedAt: new Date().toISOString() });
  downloadJSON(JSON.stringify(payload, null, 2), SYNC_FILE);
  showModal("Progresso salvo", [
    el("p", null, `Baixado como ${SYNC_FILE}. Para versionar:`),
    (() => {
      const pre = el("pre", "code");
      pre.textContent =
        "# mova o arquivo para a pasta do projeto, entao:\n" +
        "git add study-roadmap/progress.json\n" +
        'git commit -m "progresso: ' + todayKey() + '"\n' +
        "git push";
      return pre;
    })(),
    el("p", null, "Na outra máquina: git pull → Settings → Carregar do repo.")
  ], [{ label: "Entendi", cls: "btn-primary" }]);
}

function loadFromRepo() {
  // Lê o progress.json ao lado do index.html. Em file:// o fetch é
  // bloqueado pelo CORS, então caímos no seletor de arquivo.
  fetch(SYNC_FILE, { cache: "no-store" })
    .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then((data) => confirmMerge(data, "do repositório"))
    .catch(() => {
      toast("Não foi possível ler o arquivo automaticamente — selecione-o.", "warn");
      $("#importFile").click();
    });
}

/* Mescla por recência em vez de sobrescrever: sem isso, carregar um
   progresso mais antigo apagaria o trabalho feito nesta máquina. */
function confirmMerge(incoming, origem) {
  if (!incoming || typeof incoming !== "object" || !incoming.topics) {
    toast("Arquivo de progresso inválido", "err"); return;
  }
  const mine = ALL_TOPIC_IDS.filter(isDone).length;
  const theirs = Object.values(incoming.topics).filter((t) => t && t.completed).length;
  const when = incoming.savedAt
    ? new Date(incoming.savedAt).toLocaleString("pt-BR")
    : "data desconhecida";

  const list = el("ul", "modal-list");
  list.appendChild(el("li", null, `nesta máquina : ${mine} tópicos concluídos`));
  list.appendChild(el("li", null, `no arquivo    : ${theirs} tópicos concluídos`));
  list.appendChild(el("li", null, `salvo em      : ${when}`));

  showModal("Carregar progresso " + origem, [
    "Isto substituirá o progresso desta máquina pelo conteúdo do arquivo.",
    list,
    theirs < mine
      ? el("p", null, "Atenção: o arquivo tem MENOS tópicos concluídos que esta máquina. Você perderia progresso.")
      : el("p", null, "")
  ], [
    { label: "Cancelar" },
    { label: "Carregar", cls: theirs < mine ? "btn-danger" : "btn-primary", onClick: () => {
      state = migrate(incoming);
      saveState(true);
      applyTheme();
      renderAll();
      toast("Progresso carregado", "ok");
    }}
  ]);
}

function downloadJSON(text, filename) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportProgress() {
  const payload = Object.assign({}, state, { savedAt: new Date().toISOString() });
  downloadJSON(JSON.stringify(payload, null, 2), `engineering-roadmap-${todayKey()}.json`);
  toast("Progresso exportado", "ok");
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      confirmMerge(JSON.parse(reader.result), "do arquivo");
    } catch (e) {
      toast("Arquivo inválido: " + e.message, "err");
    }
  };
  reader.onerror = () => toast("Não foi possível ler o arquivo", "err");
  reader.readAsText(file);
}

function resetProgress() {
  showModal("Reset progress", [
    "Isso apagará todo o seu progresso local.",
    "Não há como desfazer. Exporte um backup antes, se quiser preservar."
  ], [
    { label: "Cancel" },
    { label: "Reset", cls: "btn-danger", onClick: () => {
      const theme = state.theme;
      state = defaultState();
      state.theme = theme;
      saveState(true);
      renderAll();
      toast("Progresso apagado", "warn");
    }}
  ]);
}

/* ===========================================================
   THEME / VIEWS
   =========================================================== */

function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme === "light" ? "light" : "dark");
}

function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  applyTheme(); saveState();
}

function switchView(name) {
  $$(".view").forEach((v) => v.classList.toggle("is-visible", v.id === "view-" + name));
  $$(".nav-item").forEach((b) => {
    const on = b.dataset.view === name;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-current", on ? "page" : "false");
  });
  closeSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (name === "practice") renderPractice();
  if (name === "books") renderBooks();
  if (name === "projects") renderProjects();
  if (name === "review") renderReview();
  if (name === "weekly") renderWeekly();
  if (name === "mindset") renderMindset();
  if (name === "settings") renderStorageInfo();
}

function renderStorageInfo() {
  let bytes = 0;
  try { bytes = new Blob([localStorage.getItem(STORAGE_KEY) || ""]).size; } catch (e) { /* ignore */ }
  const o = overallStats();
  $("#storageInfo").textContent =
    `chave: ${STORAGE_KEY} · versão ${STORAGE_VERSION} · ${(bytes / 1024).toFixed(1)} KB · ` +
    `${o.done}/${o.total} tópicos · ${Object.keys(state.notes).length} notas`;

  $("#syncHint").textContent =
    "Ao terminar de estudar: Salvar p/ repo → git commit → git push. " +
    "Ao começar em outra máquina: git pull → Carregar do repo. " +
    "Sempre carregue antes de estudar, para não sobrescrever progresso.";
}

/* ---- Rail (desktop) ----
   A sidebar só expande quando o ponteiro entra pela faixa estreita do rail.
   Sem essa checagem, mover o mouse da direita para um botão próximo à borda
   esquerda atravessaria a área expandida, abrindo a sidebar em cima do alvo
   e roubando o clique. */
function bindRail() {
  const sb = $("#sidebar");
  const isDesktop = () => window.matchMedia("(min-width: 901px)").matches;
  const railW = () =>
    parseInt(getComputedStyle(document.documentElement).getPropertyValue("--rail-w"), 10) || 56;

  // Modo "empurra": a sidebar e a coluna do grid crescem juntas, então
  // o conteúdo desloca em vez de ficar coberto. `rail-open` no <body>
  // é o que informa o grid — ele não é ancestral da sidebar e portanto
  // não enxerga o hover dela.
  const peek = (on) => {
    sb.classList.toggle("is-peek", on);
    document.body.classList.toggle("rail-open", on);
  };

  // Uma única fonte de verdade: a cada movimento decide-se pela posição
  // do ponteiro. Abre na faixa do rail; fecha ao passar da borda direita
  // da sidebar. Não depende de mouseenter/mouseleave, que o navegador
  // pode não emitir quando o ponteiro "salta" (scroll, troca de foco,
  // automação) em vez de percorrer o caminho.
  document.addEventListener("mousemove", (e) => {
    if (!isDesktop()) return;
    const top = sb.getBoundingClientRect().top;
    if (e.clientY < top) { peek(false); return; }   // ponteiro na topbar
    if (sb.classList.contains("is-peek")) {
      if (e.clientX > sb.getBoundingClientRect().right) peek(false);
    } else if (e.clientX <= railW()) {
      peek(true);
    }
  }, { passive: true });

  // Redundância barata para os casos em que o evento chega: sair da
  // sidebar ou da janela recolhe imediatamente.
  sb.addEventListener("mouseleave", () => peek(false));
  document.addEventListener("mouseleave", () => peek(false));

  // O ponteiro entrar em qualquer elemento fora da sidebar recolhe.
  // `pointerover` dispara mesmo quando o cursor "salta" para o alvo sem
  // percorrer o caminho (scroll, troca de aba, automação) — casos em que
  // mousemove/mouseleave podem não ocorrer e a sidebar ficaria presa
  // aberta por cima do conteúdo.
  document.addEventListener("pointerover", (e) => {
    if (isDesktop() && !sb.contains(e.target)) peek(false);
  }, true);

  // Clique fora também recolhe, como rede de segurança final.
  document.addEventListener("pointerdown", (e) => {
    if (isDesktop() && !sb.contains(e.target)) peek(false);
  }, true);

  // Navegação por teclado: o CSS expande via :has(:focus-visible), mas o
  // grid depende da classe no <body> — daí sincronizar aqui também.
  document.addEventListener("focusin", () => {
    if (!isDesktop()) return;
    const inSidebar = sb.contains(document.activeElement) &&
                      document.activeElement.matches(":focus-visible");
    document.body.classList.toggle("rail-open", inSidebar || sb.classList.contains("is-peek"));
  });

  // Ao trocar para mobile, limpa o estado de rail.
  window.addEventListener("resize", () => {
    if (!isDesktop()) sb.classList.remove("is-peek");
  });
}

function openSidebar() {
  $("#sidebar").classList.add("is-open");
  $("#sidebarScrim").hidden = false;
  $("#menuToggle").setAttribute("aria-expanded", "true");
}

function closeSidebar() {
  $("#sidebar").classList.remove("is-open");
  $("#sidebarScrim").hidden = true;
  $("#menuToggle").setAttribute("aria-expanded", "false");
}

/* ===========================================================
   RENDER ALL
   =========================================================== */

function renderAll() {
  renderDashboard();
  renderSidebar();
  renderToday();
  renderTimeline();
  renderFilters();
  renderLevels();
  const visible = $(".view.is-visible");
  const name = visible ? visible.id.replace("view-", "") : "today";
  if (name === "practice") renderPractice();
  if (name === "books") renderBooks();
  if (name === "projects") renderProjects();
  if (name === "review") renderReview();
  if (name === "weekly") renderWeekly();
  if (name === "settings") renderStorageInfo();
}

/* ===========================================================
   EVENTS
   =========================================================== */

function bindEvents() {
  // navegação
  $$(".nav-item").forEach((b) => b.addEventListener("click", () => switchView(b.dataset.view)));
  $("#menuToggle").addEventListener("click", () => {
    $("#sidebar").classList.contains("is-open") ? closeSidebar() : openSidebar();
  });
  $("#sidebarScrim").addEventListener("click", closeSidebar);

  // tema
  $("#themeToggle").addEventListener("click", toggleTheme);

  // busca
  let searchTimer = null;
  const input = $("#searchInput");
  input.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = input.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (searchQuery) switchView("roadmap");
      renderLevels();
    }, 160);
  });

  // timer
  $$("#view-today .timer-modes .chip").forEach((c) =>
    c.addEventListener("click", () => setTimerMode(+c.dataset.min)));
  $("#timerStart").addEventListener("click", startTimer);
  $("#timerPause").addEventListener("click", stopTimer);
  $("#timerReset").addEventListener("click", resetTimer);

  // estudo livre
  $("#freeStudyForm").addEventListener("submit", (e) => {
    e.preventDefault();
    addFreeStudy($("#freeStudyInput").value);
    $("#freeStudyInput").value = "";
  });

  // settings
  $("#btnSync").addEventListener("click", syncToRepo);
  $("#btnLoadRepo").addEventListener("click", loadFromRepo);
  $("#btnExport").addEventListener("click", exportProgress);
  $("#btnImport").addEventListener("click", () => $("#importFile").click());
  $("#importFile").addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) importProgress(f);
    e.target.value = "";
  });
  $("#btnReset").addEventListener("click", resetProgress);

  // modal
  $("#modalScrim").addEventListener("click", (e) => {
    if (e.target === $("#modalScrim")) closeModal();
  });

  // atalhos
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!$("#modalScrim").hidden) closeModal();
      else if ($("#sidebar").classList.contains("is-open")) closeSidebar();
      else if (document.activeElement === input) { input.value = ""; input.blur(); searchQuery = ""; renderLevels(); }
    }
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    if (e.key === "/" && !typing) { e.preventDefault(); input.focus(); }
  });

  // salva antes de sair
  window.addEventListener("beforeunload", () => {
    if (timer.running) logStudyMinutes(timer.elapsed / 60 % 1);
    saveState(true);
  });
}

/* ===========================================================
   INIT
   =========================================================== */

function init() {
  loadState();
  applyTheme();
  bindEvents();
  bindRail();
  setTimerMode(25);
  renderMindset();
  renderAll();

  const o = overallStats();
  if (o.done === 0 && !state.activeStudies.length) {
    setTimeout(() => {
      toast("Comece escolhendo até 2 estudos em Your first path.", "ok");
    }, 700);
  }
}

document.addEventListener("DOMContentLoaded", init);
