/* CORE — localStorage: migrar, carregar, salvar.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   STORAGE
   =========================================================== */

function migrate(raw) {
  const s = Object.assign(defaultState(), raw);
  // Preenche chaves aninhadas que possam faltar em versões antigas.
  s.competitiveProgramming = Object.assign(defaultState().competitiveProgramming, raw.competitiveProgramming || {});
  s.studyTime = Object.assign(defaultState().studyTime, raw.studyTime || {});
  s.version = STORAGE_VERSION;
  return s;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === "object") state = migrate(parsed);
  } catch (e) {
    console.warn("Não foi possível carregar o progresso salvo:", e);
  }
}

let saveTimer = null;
function saveState(immediate) {
  const write = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      toast("Falha ao salvar. O armazenamento local pode estar cheio ou bloqueado.", "err");
    }
  };
  if (immediate) { clearTimeout(saveTimer); write(); return; }
  clearTimeout(saveTimer);
  saveTimer = setTimeout(write, 250);
}
