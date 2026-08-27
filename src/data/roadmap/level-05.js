/* DATA — Roadmap LEVEL 5: Redes
   Carregado por index.html apos roadmap.js (que declara ROADMAP e T).
   Escopo global compartilhado (sem modulos, para que a aplicacao
   continue abrindo via file://). */

"use strict";

ROADMAP.push(
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
  }
);
