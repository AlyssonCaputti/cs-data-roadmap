/* DOMAIN — Livros: no maximo 1 ativo.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   BOOK MANAGEMENT  (regra: 1 livro ativo)
   =========================================================== */

function setBook(id) {
  if (state.currentBook === id) return;
  if (state.currentBook) {
    const cur = bookById(state.currentBook);
    showModal("Você já possui um livro ativo", [
      `Livro atual: ${cur ? cur.name : state.currentBook} — capítulo ${state.bookProgress}/${cur ? cur.chapters : "?"}.`,
      "Finalize ou pause o livro atual antes de começar outro."
    ], [{ label: "Entendi", cls: "btn-primary" }]);
    return;
  }
  Store.commit([CH.BOOKS, CH.TODAY], (s) => {
    s.currentBook = id;
    s.bookProgress = 0;
    s.pausedBooks = s.pausedBooks.filter((b) => b.id !== id);
  });
  toast("Livro iniciado — " + bookById(id).name, "ok");
}

function pauseBook() {
  if (!state.currentBook) return;
  const id = state.currentBook;
  Store.commit([CH.BOOKS, CH.TODAY], (s) => {
    s.pausedBooks = s.pausedBooks.filter((b) => b.id !== id);
    s.pausedBooks.push({ id, chapter: s.bookProgress });
    s.currentBook = null;
    s.bookProgress = 0;
  });
  toast("Livro pausado", "warn");
}

function resumeBook(id) {
  if (state.currentBook) {
    showModal("Você já possui um livro ativo", ["Finalize ou pause o livro atual antes de retomar outro."],
      [{ label: "Entendi", cls: "btn-primary" }]);
    return;
  }
  const p = state.pausedBooks.find((b) => b.id === id);
  Store.commit([CH.BOOKS, CH.TODAY], (s) => {
    s.currentBook = id;
    s.bookProgress = p ? p.chapter : 0;
    s.pausedBooks = s.pausedBooks.filter((b) => b.id !== id);
  });
  toast("Livro retomado", "ok");
}

function completeBook(id) {
  const bid = id || state.currentBook;
  if (!bid) return;
  Store.commit([CH.BOOKS, CH.TODAY], (s) => {
    if (!s.completedBooks.includes(bid)) s.completedBooks.push(bid);
    if (s.currentBook === bid) { s.currentBook = null; s.bookProgress = 0; }
    s.pausedBooks = s.pausedBooks.filter((b) => b.id !== bid);
  });
  toast("Livro concluído — " + bookById(bid).name, "ok");
}

function setChapter(n) {
  const b = bookById(state.currentBook);
  if (!b) return;
  Store.commit([CH.BOOKS], (s) => { s.bookProgress = Math.max(0, Math.min(b.chapters, n)); });
}
