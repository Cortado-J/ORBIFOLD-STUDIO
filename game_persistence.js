(function (global) {
  "use strict";

  const STORAGE_KEYS = {
    progress: "pattern_game_progress",
    runs: "pattern_game_runs", // stores array of run summaries
  };

  const DEFAULT_PROGRESS = (() => {
    const base = {
      unlockedLevels: [],
      confusionMatrix: {},
      featureWeakness: {
        rotations: 0,
        mirrors: 0,
        glides: 0,
      },
    };
    const config = global.GameConfig;
    const mandatory = new Set();
    if (config && Array.isArray(config.ALWAYS_UNLOCKED_LEVEL_IDS)) {
      config.ALWAYS_UNLOCKED_LEVEL_IDS.forEach(id => {
        if (typeof id === "string" && id.trim()) {
          mandatory.add(id);
        }
      });
    }
    if (config && typeof config.DEFAULT_LEVEL_ID === "string" && config.DEFAULT_LEVEL_ID.trim()) {
      mandatory.add(config.DEFAULT_LEVEL_ID);
    }
    base.unlockedLevels = Array.from(mandatory);
    return Object.freeze(base);
  })();

  function safeParse(json, fallback) {
    if (!json) return fallback;
    try {
      const parsed = JSON.parse(json);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch (err) {
      console.warn("GamePersistence.parse error", err);
    }
    return fallback;
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeUnlockedLevels(unlocked) {
    const merged = new Set(DEFAULT_PROGRESS.unlockedLevels || []);
    if (Array.isArray(unlocked)) {
      unlocked.forEach(id => {
        if (typeof id === "string" && id.trim()) {
          merged.add(id);
        }
      });
    }
    const config = global.GameConfig;
    if (config && Array.isArray(config.ALWAYS_UNLOCKED_LEVEL_IDS)) {
      config.ALWAYS_UNLOCKED_LEVEL_IDS.forEach(id => {
        if (typeof id === "string" && id.trim()) {
          merged.add(id);
        }
      });
    }
    if (config && typeof config.DEFAULT_LEVEL_ID === "string" && config.DEFAULT_LEVEL_ID.trim()) {
      merged.add(config.DEFAULT_LEVEL_ID);
    }
    return Array.from(merged);
  }

  function loadProgress() {
    if (typeof window === "undefined" || !window.localStorage) {
      const fallback = deepClone(DEFAULT_PROGRESS);
      fallback.unlockedLevels = mergeUnlockedLevels(fallback.unlockedLevels);
      return fallback;
    }
    const stored = window.localStorage.getItem(STORAGE_KEYS.progress);
    const parsed = safeParse(stored, {});
    const base = deepClone(DEFAULT_PROGRESS);
    const merged = Object.assign({}, base, parsed || {});
    merged.unlockedLevels = mergeUnlockedLevels(merged.unlockedLevels);
    merged.featureWeakness = Object.assign({}, base.featureWeakness, merged.featureWeakness || {});
    merged.confusionMatrix = merged.confusionMatrix || {};
    return merged;
  }

  function saveProgress(progress) {
    if (typeof window === "undefined" || !window.localStorage) {
      return Promise.resolve();
    }
    try {
      const base = deepClone(DEFAULT_PROGRESS);
      const snapshot = Object.assign({}, base, progress || {});
      snapshot.unlockedLevels = mergeUnlockedLevels(snapshot.unlockedLevels);
      snapshot.featureWeakness = Object.assign({}, base.featureWeakness, snapshot.featureWeakness || {});
      snapshot.confusionMatrix = snapshot.confusionMatrix || {};
      window.localStorage.setItem(
        STORAGE_KEYS.progress,
        JSON.stringify(snapshot)
      );
    } catch (err) {
      console.warn("GamePersistence.saveProgress error", err);
    }
    return Promise.resolve();
  }

  function loadRunHistory() {
    if (typeof window === "undefined" || !window.localStorage) {
      return [];
    }
    const stored = window.localStorage.getItem(STORAGE_KEYS.runs);
    return safeParse(stored, []);
  }

  function saveRunSummary(summary) {
    if (typeof window === "undefined" || !window.localStorage) {
      return Promise.resolve();
    }
    try {
      const runs = loadRunHistory();
      runs.push(summary);
      window.localStorage.setItem(STORAGE_KEYS.runs, JSON.stringify(runs));
    } catch (err) {
      console.warn("GamePersistence.saveRunSummary error", err);
    }
    return Promise.resolve();
  }

  function clearAll() {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }
    window.localStorage.removeItem(STORAGE_KEYS.progress);
    window.localStorage.removeItem(STORAGE_KEYS.runs);
  }

  const GamePersistence = Object.freeze({
    loadProgress,
    saveProgress,
    saveRunSummary,
    loadRunHistory,
    clearAll,
    DEFAULT_PROGRESS,
  });

  global.GamePersistence = GamePersistence;
})(typeof window !== "undefined" ? window : this);
