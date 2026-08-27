/* DATA — Roadmap LEVEL 3: Data Structures & Algorithms
   Carregado por index.html apos roadmap.js (que declara ROADMAP e T).
   Escopo global compartilhado (sem modulos, para que a aplicacao
   continue abrindo via file://). */

"use strict";

ROADMAP.push(
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
  }
);
