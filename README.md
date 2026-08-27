# Engineering Roadmap — Computer Science × Data Engineering

Aplicação de acompanhamento de estudos para formação em engenharia de dados com base
sólida em ciência da computação. Não é um checklist: cada tópico importante traz
conceito, quando importa, como funciona, exemplo em código, aplicação em engenharia
de dados e exercício.

**Filosofia:** Fundamento → Entendimento → Implementação → Exercício → Projeto → Produção.

## Rodando

Não há build, backend nem dependências. Abra o arquivo:

```bash
git clone https://github.com/AlyssonCaputti/<repo>.git
cd <repo>/data-engineer
start index.html          # Windows
```

Para usar a sincronização automática de progresso (ver abaixo), sirva por HTTP:

```bash
cd data-engineer
python -m http.server 8000
# abra http://localhost:8000
```

## O que a aplicação faz

**410 tópicos em 14 níveis** (LEVEL 0 → 13), do modelo de execução de um computador
até operação de plataformas de dados em produção. 115 têm conteúdo pedagógico completo;
18 são deep dives (Cache, Floating Point, Big O, Generators, Parquet, Window Functions,
Indexes, SCD, Idempotency, Shuffle, Kafka, Medallion, Partial failure, entre outros).

**Regras de foco** — o ponto central do sistema:

- no máximo **2 estudos ativos**
- no máximo **1 livro ativo**
- estudo livre sem limite, porque curiosidade não deve virar obrigação

Tentar exceder é bloqueado. A ideia é impedir dispersão: profundidade acima de amplitude.

**Critério de conclusão** — um tópico não é dado como concluído por ter sido lido.
Cada um tem quatro sub-checks: entendi o conceito, consigo explicar, fiz o exercício,
implementei. O checkbox principal significa *dominado*.

**Outras áreas:** prática diária de programação (3 fáceis ou 1 médio/difícil, com streak
e heatmap), trilha curta de C++ e DSA, 5 livros com controle de capítulo, escada de 6
projetos com pré-requisitos, fila de revisão, revisão semanal, timer e busca.

Pré-requisitos entre tópicos são **recomendação, nunca bloqueio** — você pode estudar
o que quiser, na ordem que quiser.

## Sincronizando entre máquinas

O progresso fica em `localStorage`, que é **por navegador e por máquina**. Para levá-lo
de um computador a outro, ele é versionado no próprio repositório como
`data-engineer/progress.json`.

**Ao terminar de estudar:**

1. Settings → **Salvar p/ repo** (baixa `progress.json`)
2. mova o arquivo baixado para `data-engineer/`, substituindo o existente
3. commite:

```bash
git add data-engineer/progress.json
git commit -m "progresso: 2026-08-25"
git push
```

**Ao começar em outra máquina:**

```bash
git pull
```

Depois, Settings → **Carregar do repo**.

> Carregue **antes** de estudar. O app compara quantos tópicos há de cada lado e avisa
> se o arquivo tem menos progresso que a máquina atual, mas ele não faz merge automático —
> a última carga vence.

Servido por HTTP, o botão lê o arquivo direto. Aberto via `file://`, o navegador bloqueia
a leitura por CORS e o app abre o seletor de arquivos — funciona igual, com um clique a mais.

Cada commit do `progress.json` vira um ponto no histórico: dá para ver a evolução dos
estudos ao longo do tempo com `git log`.

## Estrutura

```
index.html          # estrutura semântica; carrega os scripts na ordem
styles.css          # tema claro/escuro, responsivo, sidebar em rail
progress.json       # progresso versionado
skill.md            # especificação que originou a aplicação
src/
├── data/           # roadmap, catálogo e índice de tópicos — só dados
│   ├── roadmap.js      declara ROADMAP (vazio) e o helper T
│   ├── roadmap/        410 tópicos, um arquivo por nível
│   │   └── level-00.js … level-13.js   cada um faz ROADMAP.push(…)
│   ├── catalog.js      cursos, livros, trilhas, projetos
│   └── index.js        id estável -> tópico
├── core/           # estado e o Store observer
│   ├── state.js        shape e valores padrão
│   ├── persistence.js  localStorage: migrar, carregar, salvar
│   └── store.js        commit / publish / canais
├── ui/             # primitivos sem regra de negócio
│   ├── dom.js          seletores, criação de elementos, datas
│   ├── toast.js
│   └── modal.js
├── domain/         # as regras: foco, livro único, prática, timer
│   ├── studies.js      máximo 2 ativos
│   ├── books.js        máximo 1 ativo
│   ├── practice.js     meta diária e streak
│   └── timer.js
├── views/          # render puro; assinam canais do Store
│   ├── dashboard.js  today.js  roadmap.js  practice.js
│   └── books.js  projects.js  review.js
└── app/            # composição
    ├── sync.js         Git sync, export, import, reset
    ├── shell.js        tema, troca de view, sidebar
    ├── subscriptions.js  tabela view -> canais
    ├── events.js       binding do DOM
    └── main.js         bootstrap
```

Sem framework, sem backend, sem build. HTML5, CSS3 e JavaScript moderno.

### Arquitetura

O fluxo é unidirecional. Nenhuma view chama outra view:

```
interação → domain (regra) → Store.commit(canais) → persiste → publica
                                                                  ↓
                                              views que assinam o canal redesenham
```

`Store` ([src/core/store.js](src/core/store.js)) é o **único ponto de mutação**. Cada
`commit` diz *quais canais* ficaram obsoletos (`topics`, `books`, `practice`…); quem
depende deles se redesenha sozinho. Os renders são agrupados num frame — várias
mutações na mesma interação resultam em um repaint — e views fora da tela são puladas.

A tabela de dependência vive inteira em [src/app/subscriptions.js](src/app/subscriptions.js).

As dependências apontam numa direção só: `data → core → ui → domain → views → app`.
Os scripts são clássicos, não módulos ES, justamente para que `index.html` continue
abrindo direto do disco via `file://` sem precisar de servidor.

Por isso o roadmap é dividido em `roadmap.js` + `roadmap/level-NN.js`: o primeiro
declara `ROADMAP = []` e o helper `T`, e cada nível se registra com `ROADMAP.push(…)`.
Sem `import`, a ordem no `index.html` é o que garante que `T` exista quando cada nível
é avaliado — **`roadmap.js` precisa vir antes de `roadmap/`**. Para adicionar um nível,
crie o arquivo e acrescente a tag `<script>` correspondente.

## Backup

Além do fluxo com Git, Settings tem **Export**/**Import** para backups avulsos datados
(ignorados pelo `.gitignore`), e **Reset** para zerar tudo com confirmação.
