/* VIEW — Timeline, filtros, niveis e topicos.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   RENDER — ROADMAP (timeline, filtros, níveis, tópicos)
   =========================================================== */

function renderTimeline() {
  const tl = $("#timeline");
  tl.innerHTML = "";
  ROADMAP.forEach((lv, i) => {
    const st = levelStats(lv);
    const row = el("button", "tl-row");
    row.type = "button";
    row.setAttribute("aria-label", `${lv.title} — ${st.pct}% concluído`);
    row.append(el("span", "tl-idx", String(i).padStart(2, "0")));
    row.append(el("span", "tl-name", lv.title));
    const bar = el("span", "tl-bar");
    const fill = el("span", "tl-fill" + (st.pct === 100 ? " is-done" : ""));
    fill.style.width = st.pct + "%";
    bar.appendChild(fill);
    row.append(bar, el("span", "tl-pct", st.pct + "%"));
    row.addEventListener("click", () => {
      Store.commit([CH.TOPICS], (s) => {
        if (!s.openLevels.includes(lv.id)) s.openLevels.push(lv.id);
      });
      const node = document.getElementById("level-" + lv.id);
      if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    tl.appendChild(row);
  });
}

function renderFilters() {
  const f = $("#filters");
  f.innerHTML = "";
  CATEGORIES.forEach((c) => {
    const b = el("button", "chip" + (state.filter === c.id ? " is-on" : ""), c.label);
    b.setAttribute("aria-pressed", state.filter === c.id ? "true" : "false");
    b.addEventListener("click", () => {
      Store.commit([CH.UI, CH.TOPICS], (s) => { s.filter = c.id; });
    });
    f.appendChild(b);
  });
}

let searchQuery = "";

function matchesSearch(topic, lv) {
  if (!searchQuery) return true;
  const q = searchQuery;
  const hay = [topic.t, topic.what, topic.when, topic.how, topic.de, topic.drill,
               topic.groupName, lv.title, lv.level].filter(Boolean).join(" ").toLowerCase();
  return hay.normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q);
}

function buildTopic(topic, lv) {
  const ts = topicState(topic.id);
  const wrap = el("article", "topic" + (ts.completed ? " is-done" : ""));
  wrap.id = "topic-" + topic.id;

  const row = el("div", "topic-row");

  const cb = el("input", "cbx");
  cb.type = "checkbox";
  cb.id = "cb-" + topic.id;
  cb.checked = ts.completed;
  const doneCount = ts.mastery.filter(Boolean).length;
  cb.indeterminate = !ts.completed && doneCount > 0;
  cb.setAttribute("aria-label", "Marcar " + topic.t + " como dominado");
  cb.addEventListener("change", () => toggleTopic(topic.id, cb.checked));
  row.appendChild(cb);

  const detailed = hasDetail(topic);
  const toggle = el("button", "topic-toggle");
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "detail-" + topic.id);
  toggle.appendChild(el("span", "topic-title", topic.t));

  if (topic.deep) toggle.appendChild(el("span", "badge badge-deep", "deep dive"));
  if (ts.review) toggle.appendChild(el("span", "badge badge-review", "revisar"));
  if (state.notes[topic.id]) toggle.appendChild(el("span", "badge badge-note", "nota"));

  // pré-requisitos
  const missing = (topic.req || []).filter((r) => !isDone(r));
  if (missing.length && !ts.completed) {
    const lock = el("span", "badge badge-lock", "🔒 pré-requisitos");
    lock.title = "Recomendado antes: " + missing.map((m) => (TOPIC_INDEX[m] || {}).t || m).join(", ");
    toggle.appendChild(lock);
  }
  if (doneCount > 0 && !ts.completed) {
    toggle.appendChild(el("span", "badge badge-pct", Math.round(doneCount / 4 * 100) + "%"));
  }

  const caret = el("span", "topic-caret");
  caret.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  toggle.appendChild(caret);

  toggle.addEventListener("click", () => {
    const open = wrap.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  row.appendChild(toggle);
  wrap.appendChild(row);

  // ---- detalhe ----
  const detail = el("div", "topic-detail");
  detail.id = "detail-" + topic.id;
  const dl = el("div", "dl");

  const block = (title, text, muted) => {
    if (!text) return;
    const b = el("div", "dl-block" + (muted ? " is-muted" : ""));
    b.append(el("h4", null, title), el("p", null, text));
    dl.appendChild(b);
  };

  if (detailed) {
    block("O que é", topic.what);
    block("Quando importa", topic.when);
    block("Como funciona", topic.how);
    block("Exemplo", topic.ex);
    if (topic.code) {
      const b = el("div", "dl-block");
      b.appendChild(el("h4", null, "Código"));
      b.appendChild(el("pre", "code", topic.code));
      dl.appendChild(b);
    }
    block("Em Data Engineering", topic.de);
    block("Exercício", topic.drill);
  } else {
    const b = el("div", "dl-block is-muted");
    b.append(el("h4", null, "Checklist"),
      el("p", null, "Item de checklist. Marque apenas quando conseguir explicar o conceito sem consultar material."));
    dl.appendChild(b);
  }

  // pré-requisitos
  if (topic.req && topic.req.length) {
    const b = el("div", "dl-block");
    b.appendChild(el("h4", null, "Pré-requisitos"));
    const ps = el("div", "prereqs");
    topic.req.forEach((r) => {
      const rt = TOPIC_INDEX[r];
      const ok = isDone(r);
      const c = el("span", "prereq" + (ok ? " is-ok" : ""), (ok ? "✓ " : "○ ") + (rt ? rt.t : r));
      if (rt) {
        c.style.cursor = "pointer";
        c.title = "Ir para " + rt.t;
        c.addEventListener("click", () => goToTopic(r));
      }
      ps.appendChild(c);
    });
    b.appendChild(ps);
    b.appendChild(el("p", "prereq-note",
      "A dependência é uma recomendação, não uma prisão. Você nunca é impedido de estudar algo."));
    dl.appendChild(b);
  }

  // mastery
  const mast = el("div", "mastery");
  mast.appendChild(el("h4", null, "Critério de conclusão — ☑ dominado, não ☑ li sobre isso"));
  const grid = el("div", "mastery-grid");
  MASTERY_STEPS.forEach((label, i) => {
    grid.appendChild(checkRow(label, ts.mastery[i], (v) => {
      const n = Store.commit([CH.TOPICS], () => {
        ts.mastery[i] = v;
        return ts.mastery.filter(Boolean).length;
      });
      if (n === 4 && !ts.completed) toggleTopic(topic.id, true);
    }));
  });
  mast.appendChild(grid);
  const mb = el("div", "mastery-bar");
  const bar = el("div", "bar"); const fill = el("div", "bar-fill");
  const mpct = Math.round(ts.mastery.filter(Boolean).length / 4 * 100);
  fill.style.width = mpct + "%";
  if (mpct === 100) fill.classList.add("is-done");
  bar.appendChild(fill);
  mb.append(bar, el("span", "mastery-pct", mpct + "%"));
  mast.appendChild(mb);
  dl.appendChild(mast);

  // ações
  const act = el("div", "topic-actions");
  const rev = el("button", "btn btn-sm" + (ts.review ? " btn-primary" : ""),
    ts.review ? "✓ Na review queue" : "Preciso revisar");
  rev.addEventListener("click", () => {
    Store.commit([CH.TOPICS, CH.REVIEW], () => { ts.review = !ts.review; });
    toast(ts.review ? "Adicionado à Review Queue" : "Removido da Review Queue", ts.review ? "warn" : "ok");
  });
  act.appendChild(rev);
  dl.appendChild(act);

  // notas
  const nb = el("div", "dl-block");
  nb.appendChild(el("h4", null, "My notes"));
  const ta = el("textarea", "notes-area");
  ta.value = state.notes[topic.id] || "";
  ta.placeholder = "O que você entendeu, com suas palavras. O que ainda não fechou.";
  ta.setAttribute("aria-label", "Notas sobre " + topic.t);
  ta.addEventListener("input", () => {
    Store.commit([], (s) => {
      if (ta.value.trim()) s.notes[topic.id] = ta.value;
      else delete s.notes[topic.id];
    });
  });
  nb.appendChild(ta);
  dl.appendChild(nb);

  detail.appendChild(dl);
  wrap.appendChild(detail);
  return wrap;
}

function toggleTopic(id, value) {
  const ts = topicState(id);
  Store.commit([CH.TOPICS, CH.PROJECTS, CH.REVIEW], () => {
    ts.completed = value;
    if (value) ts.mastery = [true, true, true, true];
  });
  if (value) toast("✓ Topic completed — " + (TOPIC_INDEX[id] ? TOPIC_INDEX[id].t : id), "ok");
}

function renderLevels() {
  const box = $("#levels");
  box.innerHTML = "";
  let shown = 0, total = 0;

  ROADMAP.forEach((lv) => {
    if (state.filter !== "all" && lv.cat !== state.filter) return;

    const groups = [];
    lv.groups.forEach((g) => {
      const items = g.items.filter((it) => matchesSearch(it, lv));
      total += g.items.length;
      if (items.length) groups.push({ g, items });
      shown += items.length;
    });
    if (!groups.length) return;

    const st = levelStats(lv);
    const isOpen = state.openLevels.includes(lv.id) || !!searchQuery;

    const lvl = el("section", "level" + (isOpen ? " is-open" : ""));
    lvl.id = "level-" + lv.id;

    const head = el("button", "level-head");
    head.type = "button";
    head.setAttribute("aria-expanded", isOpen ? "true" : "false");
    head.appendChild(el("span", "level-tag", lv.level));
    const titles = el("div", "level-titles");
    titles.append(el("h2", null, lv.title), el("p", null, lv.desc));
    head.appendChild(titles);

    const meter = el("div", "level-meter");
    const bar = el("div", "bar"); const fill = el("div", "bar-fill" + (st.pct === 100 ? " is-done" : ""));
    fill.style.width = st.pct + "%";
    bar.appendChild(fill);
    meter.append(bar, el("span", "level-pct", st.done + "/" + st.total));
    head.appendChild(meter);

    const caret = el("span", "caret");
    caret.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
    head.appendChild(caret);

    head.addEventListener("click", () => {
      const open = lvl.classList.toggle("is-open");
      head.setAttribute("aria-expanded", open ? "true" : "false");
      Store.commit([], (s) => {
        s.openLevels = open ? s.openLevels.concat([lv.id]) : s.openLevels.filter((x) => x !== lv.id);
      });
    });
    lvl.appendChild(head);

    const body = el("div", "level-body");
    groups.forEach(({ g, items }) => {
      const gr = el("div", "group");
      const gh = el("div", "group-head");
      gh.appendChild(el("h3", null, g.name));
      const gdone = g.items.filter((i) => isDone(i.id)).length;
      gh.appendChild(el("span", "group-count", gdone + " / " + g.items.length));
      gr.appendChild(gh);
      if (g.desc) gr.appendChild(el("p", "group-desc", g.desc));
      items.forEach((it) => gr.appendChild(buildTopic(it, lv)));
      body.appendChild(gr);
    });
    lvl.appendChild(body);
    box.appendChild(lvl);
  });

  const info = $("#resultInfo");
  if (searchQuery) {
    info.hidden = false;
    info.textContent = shown ? `${shown} tópicos encontrados para "${searchQuery}"` : "";
  } else {
    info.hidden = true;
  }

  if (!box.children.length) {
    box.appendChild(el("div", "empty", searchQuery
      ? `Nenhum tópico encontrado para "${searchQuery}".`
      : "Nenhum tópico nesta categoria."));
  }
}

function goToTopic(id) {
  const t = TOPIC_INDEX[id];
  if (!t) return;
  switchView("roadmap");
  searchQuery = "";
  $("#searchInput").value = "";
  Store.commit([CH.UI, CH.TOPICS], (s) => {
    s.filter = "all";
    if (!s.openLevels.includes(t.levelId)) s.openLevels.push(t.levelId);
  });
  const node = document.getElementById("topic-" + id);
  if (node) {
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    const tg = node.querySelector(".topic-toggle");
    if (tg && !node.classList.contains("is-open")) tg.click();
    node.animate(
      [{ background: "var(--primary-soft)" }, { background: "transparent" }],
      { duration: 1200, easing: "ease-out" }
    );
  }
}
