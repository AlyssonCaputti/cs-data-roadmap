/* DATA — Roadmap LEVEL 1: Fundamentos de Computação
   Carregado por index.html apos roadmap.js (que declara ROADMAP e T).
   Escopo global compartilhado (sem modulos, para que a aplicacao
   continue abrindo via file://). */

"use strict";

ROADMAP.push(
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
  }
);
