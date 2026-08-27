/* APP — Sync via Git, export, import, reset.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

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
      Store.replace(migrate(incoming));
      applyTheme();
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
      const next = defaultState();
      next.theme = state.theme;
      Store.replace(next);
      toast("Progresso apagado", "warn");
    }}
  ]);
}
