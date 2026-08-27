/* APP — Tema, troca de view, sidebar, rail.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   THEME / VIEWS
   =========================================================== */

function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme === "light" ? "light" : "dark");
}

function toggleTheme() {
  Store.commit([], (s) => { s.theme = s.theme === "light" ? "dark" : "light"; });
  applyTheme();
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
  if (name === "mindset") renderMindset();
  renderAll();
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
