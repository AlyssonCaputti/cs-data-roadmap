/* UI — Dialogo modal com foco preso.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   MODAL
   =========================================================== */

let modalLastFocus = null;

function showModal(title, bodyNodes, actions) {
  modalLastFocus = document.activeElement;
  $("#modalTitle").textContent = title;
  const body = $("#modalBody");
  body.innerHTML = "";
  (Array.isArray(bodyNodes) ? bodyNodes : [bodyNodes]).forEach((n) => {
    body.appendChild(typeof n === "string" ? el("p", null, n) : n);
  });
  const act = $("#modalActions");
  act.innerHTML = "";
  (actions || [{ label: "OK" }]).forEach((a) => {
    const b = el("button", "btn " + (a.cls || ""), a.label);
    b.addEventListener("click", () => { closeModal(); if (a.onClick) a.onClick(); });
    act.appendChild(b);
  });
  $("#modalScrim").hidden = false;
  const first = act.querySelector("button");
  if (first) first.focus();
}

function closeModal() {
  $("#modalScrim").hidden = true;
  if (modalLastFocus && modalLastFocus.focus) modalLastFocus.focus();
}
