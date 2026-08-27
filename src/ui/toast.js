/* UI — Notificacao efemera.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   TOAST
   =========================================================== */

function toast(msg, kind) {
  const box = $("#toasts");
  const t = el("div", "toast " + (kind || ""));
  const icons = { ok: "✓", warn: "!", err: "×" };
  t.append(el("span", "toast-ico", icons[kind] || "›"), el("span", null, msg));
  box.appendChild(t);
  setTimeout(() => {
    t.classList.add("is-out");
    setTimeout(() => t.remove(), 220);
  }, 3200);
}
