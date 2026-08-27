/* CORE — Shape do state e valores padrao.
   Carregado por index.html. Escopo global compartilhado (sem modulos,
   para que a aplicacao continue abrindo via file://). */

"use strict";

/* ===========================================================
   STATE
   =========================================================== */

const STORAGE_KEY = "engineering-roadmap-progress";
const STORAGE_VERSION = 1;

const defaultState = () => ({
  version: STORAGE_VERSION,
  topics: {},                 // id -> { completed, mastery:[bool x4], review:bool }
  activeStudies: [],          // [studyId]
  pausedStudies: [],
  completedStudies: [],
  currentBook: null,          // bookId
  bookProgress: 0,            // capítulo atual
  pausedBooks: [],
  completedBooks: [],
  freeStudy: [],              // [{ id, name, done }]
  competitiveProgramming: { solved: 0, easy: 0, medium: 0, hard: 0, daily: {} },
  studyTime: { total: 0, days: {} },   // days: { 'YYYY-MM-DD': minutos }
  notes: {},                  // topicId -> texto
  weekly: {},                 // 'YYYY-Www' -> [bool x8]
  todayChecks: {},            // 'YYYY-MM-DD' -> { key: bool }
  theme: "dark",
  filter: "all",
  openLevels: [],
  cpp: {},                    // nome -> bool
  dsa: {},
  courses: {},                // courseId -> bool
  projectSteps: {}            // 'pid:idx' -> bool
});

let state = defaultState();
