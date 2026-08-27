/* DATA — Cursos, estudos, livros, trilhas, projetos.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

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
