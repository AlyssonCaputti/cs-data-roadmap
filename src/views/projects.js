/* VIEW — Escada de projetos.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   RENDER — PROJECTS
   =========================================================== */

function renderProjects() {
  const box = $("#projectsBody");
  box.innerHTML = "";

  PROJECTS.forEach((p) => {
    const missing = p.req.filter((r) => !isDone(r));
    const unlocked = missing.length === 0;
    const card = el("div", "project" + (unlocked ? " is-unlocked" : ""));

    const head = el("div", "project-head");
    head.appendChild(el("h3", null, p.name));
    head.appendChild(el("span", "badge " + (unlocked ? "badge-deep" : "badge-lock"),
      unlocked ? "unlocked" : "🔒 " + missing.length + " pendente" + (missing.length > 1 ? "s" : "")));
    card.appendChild(head);
    card.appendChild(el("p", "project-desc", p.desc));

    if (p.flow) card.appendChild(el("pre", "project-flow", p.flow));

    const steps = el("div", "project-steps mastery-grid");
    p.steps.forEach((s, i) => {
      const key = p.id + ":" + i;
      steps.appendChild(checkRow(s, !!state.projectSteps[key], (v) => {
        Store.commit([CH.PROJECTS], (s) => {
          if (v) s.projectSteps[key] = true; else delete s.projectSteps[key];
        });
      }));
    });
    card.appendChild(steps);

    const doneSteps = p.steps.filter((_, i) => state.projectSteps[p.id + ":" + i]).length;
    const pct = Math.round(doneSteps / p.steps.length * 100);
    const mb = el("div", "mastery-bar");
    const bar = el("div", "bar"); const fill = el("div", "bar-fill" + (pct === 100 ? " is-done" : ""));
    fill.style.width = pct + "%";
    bar.appendChild(fill);
    mb.append(bar, el("span", "mastery-pct", doneSteps + "/" + p.steps.length));
    card.appendChild(mb);

    const pr = el("div", "prereqs");
    pr.style.marginTop = "10px";
    p.req.forEach((r) => {
      const rt = TOPIC_INDEX[r];
      const ok = isDone(r);
      const c = el("span", "prereq" + (ok ? " is-ok" : ""), (ok ? "✓ " : "○ ") + (rt ? rt.t : r));
      if (rt) { c.style.cursor = "pointer"; c.addEventListener("click", () => goToTopic(r)); }
      pr.appendChild(c);
    });
    card.appendChild(pr);

    if (unlocked && pct < 100) {
      const ban = el("div", "unlock-banner");
      ban.append(el("span", null, "PROJECT UNLOCKED — " + p.name));
      card.appendChild(ban);
    }

    box.appendChild(card);
  });
}
