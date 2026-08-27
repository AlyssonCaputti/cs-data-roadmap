/* DATA — Roadmap LEVEL 4: Linux e Sistemas Operacionais
   Carregado por index.html apos roadmap.js (que declara ROADMAP e T).
   Escopo global compartilhado (sem modulos, para que a aplicacao
   continue abrindo via file://). */

"use strict";

ROADMAP.push(
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
  }
);
