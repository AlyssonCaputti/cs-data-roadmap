/* DOMAIN — Timer de sessao e registro de minutos.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   TIMER
   =========================================================== */

const timer = { mode: 25, remaining: 25 * 60, elapsed: 0, running: false, tick: null };

function renderTimer() {
  const d = $("#timerDisplay");
  const secs = timer.mode === 0 ? timer.elapsed : timer.remaining;
  const m = Math.floor(Math.abs(secs) / 60), s = Math.abs(secs) % 60;
  d.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  d.classList.toggle("is-running", timer.running);
  $("#timerStart").disabled = timer.running;
}

function logStudyMinutes(mins) {
  if (mins <= 0) return;
  const key = todayKey();
  Store.commit([], (s) => {
    s.studyTime.days[key] = (s.studyTime.days[key] || 0) + mins;
    s.studyTime.total = (s.studyTime.total || 0) + mins;
  });
}

function startTimer() {
  if (timer.running) return;
  timer.running = true;
  let acc = 0;
  timer.tick = setInterval(() => {
    acc++;
    timer.elapsed++;
    if (timer.mode > 0) timer.remaining--;
    if (acc >= 60) { logStudyMinutes(1); acc = 0; Store.publish([CH.TIME]); }
    if (timer.mode > 0 && timer.remaining <= 0) {
      stopTimer();
      logStudyMinutes(acc / 60);
      toast("Sessão concluída — " + timer.mode + " min", "ok");
      timer.remaining = timer.mode * 60;
      Store.publish([CH.TIME]);
    }
    renderTimer();
  }, 1000);
  renderTimer();
}

function stopTimer() {
  timer.running = false;
  clearInterval(timer.tick);
  timer.tick = null;
  renderTimer();
}

function resetTimer() {
  stopTimer();
  timer.remaining = timer.mode * 60;
  timer.elapsed = 0;
  renderTimer();
}

function setTimerMode(min) {
  timer.mode = min;
  resetTimer();
  $$("#view-today .timer-modes .chip").forEach((c) => c.classList.toggle("is-on", +c.dataset.min === min));
}
