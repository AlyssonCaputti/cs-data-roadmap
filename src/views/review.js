/* VIEW — Review queue, revisao semanal, mindset.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

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
      Store.commit([CH.REVIEW, CH.TOPICS], (s) => { s.topics[id].review = false; });
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
      Store.commit([CH.WEEKLY], () => { arr[i] = v; });
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
