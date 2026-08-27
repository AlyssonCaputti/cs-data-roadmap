/* DATA — Roadmap LEVEL 0: Mentalidade e método
   Carregado por index.html apos roadmap.js (que declara ROADMAP e T).
   Escopo global compartilhado (sem modulos, para que a aplicacao
   continue abrindo via file://). */

"use strict";

ROADMAP.push(
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
  }
);
