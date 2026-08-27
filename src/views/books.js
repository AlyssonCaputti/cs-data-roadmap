/* VIEW — Livros e cursos.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   RENDER — BOOKS
   =========================================================== */

function renderBooks() {
  const box = $("#booksBody");
  box.innerHTML = "";

  BOOKS.forEach((b, i) => {
    const isActive = state.currentBook === b.id;
    const paused = state.pausedBooks.find((p) => p.id === b.id);
    const completed = state.completedBooks.includes(b.id);

    const card = el("div", "book" + (isActive ? " is-active" : ""));
    const info = el("div", "book-info");
    const status = completed ? "✓ Concluído" : isActive ? "● Ativo" : paused ? "Ⅱ Pausado" : "○ Não iniciado";
    info.append(el("h3", null, String(i + 1).padStart(2, "0") + ". " + b.name));
    info.append(el("p", null, status + " · " + b.why));

    if (isActive || paused || completed) {
      const ch = completed ? b.chapters : isActive ? state.bookProgress : paused.chapter;
      const pct = Math.round(ch / b.chapters * 100);
      const pr = el("div", "book-progress");
      const bar = el("div", "bar"); const fill = el("div", "bar-fill" + (pct === 100 ? " is-done" : ""));
      fill.style.width = pct + "%";
      bar.appendChild(fill);
      pr.append(bar, el("span", null, `Capítulo ${ch} / ${b.chapters} — ${pct}%`));
      info.appendChild(pr);
    }
    card.appendChild(info);

    const act = el("div", "book-actions");

    if (isActive) {
      const ctl = el("div", "chapter-ctl");
      const minus = el("button", "btn btn-sm", "−");
      minus.setAttribute("aria-label", "Capítulo anterior");
      minus.addEventListener("click", () => setChapter(state.bookProgress - 1));
      const inp = el("input");
      inp.type = "number"; inp.min = 0; inp.max = b.chapters; inp.value = state.bookProgress;
      inp.setAttribute("aria-label", "Capítulo atual");
      inp.addEventListener("change", () => setChapter(parseInt(inp.value, 10) || 0));
      const plus = el("button", "btn btn-sm", "+");
      plus.setAttribute("aria-label", "Próximo capítulo");
      plus.addEventListener("click", () => setChapter(state.bookProgress + 1));
      ctl.append(minus, inp, plus);
      act.appendChild(ctl);

      const p = el("button", "btn btn-sm", "Pausar");
      p.addEventListener("click", pauseBook);
      const c = el("button", "btn btn-sm btn-primary", "Finalizar");
      c.addEventListener("click", () => completeBook(b.id));
      act.append(p, c);
    } else if (completed) {
      const r = el("button", "btn btn-sm", "Reabrir");
      r.addEventListener("click", () => {
        Store.commit([CH.BOOKS, CH.TODAY], (s) => {
          s.completedBooks = s.completedBooks.filter((x) => x !== b.id);
        });
      });
      act.appendChild(r);
    } else if (paused) {
      const r = el("button", "btn btn-sm btn-primary", "Retomar");
      r.addEventListener("click", () => resumeBook(b.id));
      act.appendChild(r);
    } else {
      const s = el("button", "btn btn-sm btn-primary", "Iniciar livro");
      s.addEventListener("click", () => setBook(b.id));
      act.appendChild(s);
    }

    card.appendChild(act);
    box.appendChild(card);
  });

  box.appendChild(el("p", "note",
    "Não é preciso ler todos simultaneamente — nem é recomendado. Um livro por vez, até o fim."));

  // Cursos
  const cs = el("div", "today-group");
  cs.appendChild(el("h3", null, "Courses"));
  COURSES.forEach((c) => {
    const card = el("div", "project" + (state.courses[c.id] ? " is-unlocked" : ""));
    const head = el("div", "project-head");
    head.appendChild(el("h3", null, c.name));
    const st = studyStatus(c.id);
    head.appendChild(el("span", "badge badge-pct", STATUS_ICON[st] + " " + st.toLowerCase().replace("_", " ")));
    card.appendChild(head);
    card.appendChild(el("p", "project-desc", c.desc));
    const tags = el("div", "prereqs");
    tags.style.marginTop = "9px";
    c.tags.forEach((t) => tags.appendChild(el("span", "prereq", t)));
    card.appendChild(tags);

    const act = el("div", "topic-actions");
    act.style.marginTop = "10px";
    if (STUDIES.some((s) => s.id === c.id)) {
      const btn = el("button", "btn btn-sm" + (st === "ACTIVE" ? "" : " btn-primary"),
        st === "ACTIVE" ? "Pausar estudo" : st === "COMPLETED" ? "Reabrir" : "Ativar como estudo");
      btn.addEventListener("click", () => {
        if (st === "ACTIVE") pauseStudy(c.id);
        else if (st === "COMPLETED") resetStudy(c.id);
        else activateStudy(c.id);
      });
      act.appendChild(btn);
    }
    const fin = el("button", "btn btn-sm", state.courses[c.id] ? "✓ Concluído" : "Marcar concluído");
    fin.addEventListener("click", () => {
      const on = Store.commit([CH.BOOKS], (s) => {
        s.courses[c.id] = !s.courses[c.id];
        return s.courses[c.id];
      });
      if (on) completeStudy(c.id);
    });
    act.appendChild(fin);
    card.appendChild(act);
    cs.appendChild(card);
  });
  cs.appendChild(el("p", "note",
    "CS50, Zoomcamp e DP-700 fazem parte da jornada — mas não definem toda a jornada."));
  box.appendChild(cs);
}
