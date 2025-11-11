(function (global) {
  "use strict";

  const ORBIFOLDS = Object.freeze([
    "632",
    "442",
    "333",
    "2222",
    "*632",
    "*442",
    "*333",
    "*2222",
    "2*22",
    "**",
    "4*2",
    "3*3",
    "22*",
    "o",
    "*×",
    "××",
    "22×",
  ]);

  const ORBIFOLD_GRID_LAYOUT = Object.freeze([
    ["632", "442", "333", "2222", null],
    ["*632", "*442", "*333", "*2222", "2*22"],
    ["**", "4*2", "3*3", "22*", null],
    ["o", "*×", "××", "22×", null],
  ]);

  const TRAINING_MODES = Object.freeze({
    guided: Object.freeze({
      id: "guided",
      label: "Guided Train Mode",
      description: "Step-by-step onboarding from basics to mastery.",
      order: 1,
      default: true,
      stages: Object.freeze([
        Object.freeze({
          id: "guided-stage-0",
          code: "T0",
          label: "Stage 0 — Orientation & Controls",
          order: 0,
          levels: Object.freeze([]),
        }),
        Object.freeze({
          id: "guided-stage-1",
          code: "I1",
          label: "Stage 1 — Introduction to Wallpaper Groups",
          order: 1,
          levels: Object.freeze([
            Object.freeze({
              code: "I1.1",
              label: "I1.1 · Spot basic symmetries",
              summary: "Identify obvious rotations and mirrors with generous hinting.",
              allowed: Object.freeze(["333", "o"]),
              poolSize: 8,
              runSeconds: 120,
              gate: Object.freeze({ minAccuracy: 0.7, maxMedianItemSeconds: 6 }),
              autoRevealFirstHint: true,
              order: 1,
            }),
            Object.freeze({
              code: "I1.2",
              label: "I1.2 · Mirrors appear",
              summary: "Differentiate between simple rotations and a first starred group.",
              allowed: Object.freeze(["333", "*2222"]),
              poolSize: 8,
              runSeconds: 110,
              gate: Object.freeze({ minAccuracy: 0.75, maxMedianItemSeconds: 5.5 }),
              autoRevealFirstHint: true,
              order: 2,
            }),
            Object.freeze({
              code: "I1.3",
              label: "I1.3 · Intro drill",
              summary: "Shuffle of 333, *2222, and o with optional hints.",
              allowed: Object.freeze(["333", "*2222", "o"]),
              poolSize: 10,
              runSeconds: 100,
              gate: Object.freeze({ minAccuracy: 0.78, maxMedianItemSeconds: 5 }),
              order: 3,
            }),
          ]),
        }),
        Object.freeze({
          id: "guided-stage-2",
          code: "R2",
          label: "Stage 2 — Pure rotations",
          order: 2,
          levels: Object.freeze([
            Object.freeze({
              code: "R2.1",
              label: "R2.1 · Count the centres",
              summary: "Focus on 6-fold and 4-fold motifs with rotation guides enabled.",
              allowed: Object.freeze(["632", "442"]),
              poolSize: 10,
              runSeconds: 100,
              gate: Object.freeze({ minAccuracy: 0.8, maxMedianItemSeconds: 4.8 }),
              autoRevealFirstHint: true,
              order: 1,
            }),
            Object.freeze({
              code: "R2.2",
              label: "R2.2 · Mixed rotations",
              summary: "Introduce 3-fold and 2-fold rotations without auto-hints.",
              allowed: Object.freeze(["632", "442", "333", "2222"]),
              poolSize: 10,
              runSeconds: 90,
              gate: Object.freeze({ minAccuracy: 0.82, maxMedianItemSeconds: 4.5 }),
              order: 2,
            }),
            Object.freeze({
              code: "R2.3",
              label: "R2.3 · Timed rotation sprint",
              summary: "Time-pressured classification across all rotation groups.",
              allowed: Object.freeze(["632", "442", "333", "2222"]),
              poolSize: 12,
              runSeconds: 75,
              gate: Object.freeze({ minAccuracy: 0.85, maxMedianItemSeconds: 4 }),
              order: 3,
            }),
          ]),
        }),
        Object.freeze({
          id: "guided-stage-3",
          code: "M3",
          label: "Stage 3 — Mirror families",
          order: 3,
          levels: Object.freeze([
            Object.freeze({
              code: "M3.1",
              label: "M3.1 · Vertical mirrors",
              summary: "Spot parallel mirrors and differentiate ** from starred groups.",
              allowed: Object.freeze(["**", "*632"]),
              poolSize: 10,
              runSeconds: 100,
              gate: Object.freeze({ minAccuracy: 0.82, maxMedianItemSeconds: 4.5 }),
              autoRevealFirstHint: true,
              order: 1,
            }),
            Object.freeze({
              code: "M3.2",
              label: "M3.2 · Mirrors with rotations",
              summary: "Contrast ** with *442 and *333 using hint overlays.",
              allowed: Object.freeze(["**", "*632", "*442", "*333"]),
              poolSize: 10,
              runSeconds: 95,
              gate: Object.freeze({ minAccuracy: 0.84, maxMedianItemSeconds: 4.4 }),
              order: 2,
            }),
            Object.freeze({
              code: "M3.3",
              label: "M3.3 · Timed mirror drill",
              summary: "Reduce hint usage while classifying mirror-laden groups.",
              allowed: Object.freeze(["**", "*632", "*442", "*333", "*2222"]),
              poolSize: 12,
              runSeconds: 85,
              gate: Object.freeze({ minAccuracy: 0.85, maxMedianItemSeconds: 4.2 }),
              order: 3,
            }),
            Object.freeze({
              code: "M3.4",
              label: "M3.4 · Mirror mastery quiz",
              summary: "No auto-hints; mirrors + rotations fully mixed.",
              allowed: Object.freeze(["**", "*632", "*442", "*333", "*2222"]),
              poolSize: 12,
              runSeconds: 90,
              gate: Object.freeze({ minAccuracy: 0.88, maxMedianItemSeconds: 4 }),
              order: 4,
            }),
          ]),
        }),
        Object.freeze({
          id: "guided-stage-4",
          code: "M4",
          label: "Stage 4 — Mirrors with offset rotations",
          order: 4,
          levels: Object.freeze([
            Object.freeze({
              code: "M4.1",
              label: "M4.1 · Two-fold ladders",
              summary: "Introduce two-fold centres on mirror lines.",
              allowed: Object.freeze(["2*22", "4*2"]),
              poolSize: 10,
              runSeconds: 100,
              gate: Object.freeze({ minAccuracy: 0.84, maxMedianItemSeconds: 4.5 }),
              order: 1,
            }),
            Object.freeze({
              code: "M4.2",
              label: "M4.2 · Diagonal mirror puzzles",
              summary: "Compare 3*3 and 22* with existing knowledge.",
              allowed: Object.freeze(["3*3", "22*", "2*22", "4*2"]),
              poolSize: 10,
              runSeconds: 95,
              gate: Object.freeze({ minAccuracy: 0.86, maxMedianItemSeconds: 4.3 }),
              order: 2,
            }),
            Object.freeze({
              code: "M4.3",
              label: "M4.3 · Offset rotation drill",
              summary: "Faster cadence across the offset rotation families.",
              allowed: Object.freeze(["2*22", "4*2", "3*3", "22*"]),
              poolSize: 12,
              runSeconds: 85,
              gate: Object.freeze({ minAccuracy: 0.88, maxMedianItemSeconds: 4.1 }),
              order: 3,
            }),
          ]),
        }),
        Object.freeze({
          id: "guided-stage-5",
          code: "G5",
          label: "Stage 5 — Glide reflection families",
          order: 5,
          levels: Object.freeze([
            Object.freeze({
              code: "G5.1",
              label: "G5.1 · Translation baseline",
              summary: "Reinforce the pure translation group before glides.",
              allowed: Object.freeze(["o", "*×"]),
              poolSize: 10,
              runSeconds: 95,
              gate: Object.freeze({ minAccuracy: 0.84, maxMedianItemSeconds: 4.4 }),
              autoRevealFirstHint: true,
              order: 1,
            }),
            Object.freeze({
              code: "G5.2",
              label: "G5.2 · Glide contrasts",
              summary: "Differentiate single glides (*×) from perpendicular glides (××).",
              allowed: Object.freeze(["*×", "××"]),
              poolSize: 10,
              runSeconds: 90,
              gate: Object.freeze({ minAccuracy: 0.86, maxMedianItemSeconds: 4.2 }),
              order: 2,
            }),
            Object.freeze({
              code: "G5.3",
              label: "G5.3 · Double-glide focus",
              summary: "Emphasise the rotation centres emergent in 22×.",
              allowed: Object.freeze(["××", "22×"]),
              poolSize: 10,
              runSeconds: 90,
              gate: Object.freeze({ minAccuracy: 0.88, maxMedianItemSeconds: 4 }),
              order: 3,
            }),
            Object.freeze({
              code: "G5.4",
              label: "G5.4 · Glide mastery quiz",
              summary: "Full glide family without auto-hints.",
              allowed: Object.freeze(["o", "*×", "××", "22×"]),
              poolSize: 12,
              runSeconds: 85,
              gate: Object.freeze({ minAccuracy: 0.9, maxMedianItemSeconds: 3.8 }),
              order: 4,
            }),
          ]),
        }),
        Object.freeze({
          id: "guided-stage-6",
          code: "X6",
          label: "Stage 6 — Mixed mastery",
          order: 6,
          levels: Object.freeze([
            Object.freeze({
              code: "X6.1",
              label: "X6.1 · Mixed circuit",
              summary: "All groups appear with optional hints at a time penalty.",
              allowed: Object.freeze(ORBIFOLDS.slice()),
              poolSize: 15,
              runSeconds: 120,
              gate: Object.freeze({ minAccuracy: 0.88, maxMedianItemSeconds: 4.2 }),
              order: 1,
            }),
            Object.freeze({
              code: "X6.2",
              label: "X6.2 · No-hint gauntlet",
              summary: "Hints disabled by default; accuracy bonuses applied.",
              allowed: Object.freeze(ORBIFOLDS.slice()),
              poolSize: 15,
              runSeconds: 110,
              gate: Object.freeze({ minAccuracy: 0.9, maxMedianItemSeconds: 4 }),
              hintsLocked: true,
              order: 2,
            }),
            Object.freeze({
              code: "X6.3",
              label: "X6.3 · Adaptive mastery",
              summary: "Adaptive repeats of missed groups until mastered.",
              allowed: Object.freeze(ORBIFOLDS.slice()),
              poolSize: 15,
              runSeconds: 110,
              gate: Object.freeze({ minAccuracy: 0.92, maxMedianItemSeconds: 3.8 }),
              order: 3,
            }),
          ]),
        }),
      ]),
    }),
    practice: Object.freeze({
      id: "practice",
      label: "Practice Mode",
      description: "Jump into drills without walkthroughs; hints off by default.",
      order: 2,
      stages: Object.freeze([
        Object.freeze({
          id: "practice-stage-1",
          code: "P1",
          label: "Practice rotations",
          order: 1,
          levels: Object.freeze([
            Object.freeze({
              code: "P1.1",
              label: "P1.1 · Rotation refresh",
              allowed: Object.freeze(["632", "442", "333", "2222"]),
              poolSize: 12,
              runSeconds: 90,
              unlockStrategy: "always",
              order: 1,
            }),
          ]),
        }),
        Object.freeze({
          id: "practice-stage-2",
          code: "P2",
          label: "Practice mirrors",
          order: 2,
          levels: Object.freeze([
            Object.freeze({
              code: "P2.1",
              label: "P2.1 · Mirror refresh",
              allowed: Object.freeze(["**", "*632", "*442", "*333", "*2222"]),
              poolSize: 12,
              runSeconds: 90,
              unlockStrategy: "always",
              order: 1,
            }),
          ]),
        }),
        Object.freeze({
          id: "practice-stage-3",
          code: "P3",
          label: "Practice offset rotations",
          order: 3,
          levels: Object.freeze([
            Object.freeze({
              code: "P3.1",
              label: "P3.1 · Offset refresh",
              allowed: Object.freeze(["2*22", "4*2", "3*3", "22*"]),
              poolSize: 12,
              runSeconds: 90,
              unlockStrategy: "always",
              order: 1,
            }),
          ]),
        }),
        Object.freeze({
          id: "practice-stage-4",
          code: "P4",
          label: "Practice glides",
          order: 4,
          levels: Object.freeze([
            Object.freeze({
              code: "P4.1",
              label: "P4.1 · Glide refresh",
              allowed: Object.freeze(["o", "*×", "××", "22×"]),
              poolSize: 12,
              runSeconds: 90,
              unlockStrategy: "always",
              order: 1,
            }),
          ]),
        }),
        Object.freeze({
          id: "practice-stage-5",
          code: "P5",
          label: "Practice mastery mix",
          order: 5,
          levels: Object.freeze([
            Object.freeze({
              code: "P5.1",
              label: "P5.1 · Full rotation",
              allowed: Object.freeze(ORBIFOLDS.slice()),
              poolSize: 15,
              runSeconds: 105,
              unlockStrategy: "always",
              order: 1,
            }),
          ]),
        }),
      ]),
    }),
    challenge: Object.freeze({
      id: "challenge",
      label: "Challenge Mode",
      description: "Expert gauntlet with strict timing and minimal assistance.",
      order: 3,
      stages: Object.freeze([
        Object.freeze({
          id: "challenge-stage-1",
          code: "C1",
          label: "Challenge circuits",
          order: 1,
          levels: Object.freeze([
            Object.freeze({
              code: "C1.1",
              label: "C1.1 · Rapid classification",
              allowed: Object.freeze(ORBIFOLDS.slice()),
              poolSize: 18,
              runSeconds: 75,
              unlockStrategy: "always",
              hintsLocked: true,
              order: 1,
            }),
            Object.freeze({
              code: "C1.2",
              label: "C1.2 · Endurance marathon",
              allowed: Object.freeze(ORBIFOLDS.slice()),
              poolSize: 20,
              runSeconds: 120,
              unlockStrategy: "always",
              hintsLocked: true,
              order: 2,
            }),
          ]),
        }),
      ]),
    }),
  });

  function sanitizeLevelCode(modeId, code) {
    return `${modeId}-${code}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  function deepFreeze(obj) {
    if (!obj || typeof obj !== "object") return obj;
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach((key) => {
      const value = obj[key];
      if (value && typeof value === "object" && !Object.isFrozen(value)) {
        deepFreeze(value);
      }
    });
    return obj;
  }

  deepFreeze(TRAINING_MODES);

  function flattenLevels(modes) {
    const levels = [];
    let sequence = 0;
    modes.forEach((mode) => {
      const stages = (mode.stages || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
      stages.forEach((stage) => {
        const specs = (stage.levels || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
        specs.forEach((spec) => {
          const id = spec.id || sanitizeLevelCode(mode.id, spec.code || `level-${sequence + 1}`);
          const gate = spec.gate ? Object.freeze(Object.assign({}, spec.gate)) : null;
          const allowed = Object.freeze((spec.allowed || ORBIFOLDS.slice()).slice());
          const level = Object.freeze({
            id,
            code: spec.code || id,
            label: spec.label || spec.code || id,
            summary: spec.summary || "",
            allowed,
            poolSize: spec.poolSize || 10,
            runSeconds: spec.runSeconds || 90,
            gate,
            unlockStrategy: spec.unlockStrategy || stage.unlockStrategy || mode.unlockStrategy || "progression",
            autoRevealFirstHint: Boolean(spec.autoRevealFirstHint || stage.autoRevealFirstHint || mode.autoRevealFirstHint),
            hintsLocked: Boolean(spec.hintsLocked || stage.hintsLocked || mode.hintsLocked),
            modeId: mode.id,
            modeLabel: mode.label,
            stageId: stage.id,
            stageCode: stage.code,
            stageLabel: stage.label,
            modeOrder: mode.order || 0,
            stageOrder: stage.order || 0,
            order: ++sequence,
          });
          levels.push(level);
        });
      });
    });
    return levels;
  }

  const MODES_IN_ORDER = Object.freeze(Object.values(TRAINING_MODES).slice().sort((a, b) => (a.order || 0) - (b.order || 0)));
  const LEVELS = Object.freeze(flattenLevels(MODES_IN_ORDER));
  const ALWAYS_UNLOCKED_LEVEL_IDS = Object.freeze(LEVELS.filter((level) => level.unlockStrategy === "always").map((level) => level.id));
  const DEFAULT_LEVEL_ID = LEVELS.length ? LEVELS[0].id : null;

  const LEVEL_LOOKUP = (() => {
    const map = {};
    LEVELS.forEach((level) => {
      map[level.id] = level;
    });
    return Object.freeze(map);
  })();

  const LEVELS_BY_MODE = (() => {
    const map = {};
    MODES_IN_ORDER.forEach((mode) => {
      map[mode.id] = Object.freeze(LEVELS.filter((lvl) => lvl.modeId === mode.id));
    });
    return Object.freeze(map);
  })();

  const DEFAULT_MODE_ID = MODES_IN_ORDER.find((mode) => mode.default) ? MODES_IN_ORDER.find((mode) => mode.default).id : MODES_IN_ORDER[0]?.id;

  function getLevel(levelId) {
    return levelId ? LEVEL_LOOKUP[levelId] || null : null;
  }

  function getLevelsForMode(modeId) {
    return modeId ? LEVELS_BY_MODE[modeId] || [] : [];
  }

  function getModes() {
    return MODES_IN_ORDER;
  }

  const DEFAULT_RUN_CONFIG = Object.freeze({
    timeConstantTauSec: 6,
    basePoints: 100,
    wrongTapPenalty: 5,
    maxWrongsPerItem: 3,
    hintTimePenaltySec: 15,
    hintRunDeductSec: 15,
    streakStart: 5,
    streakBonusPerItem: 10,
  });

  const FEATURE_TOGGLES = {
    timer: true,
    hints: true,
    penalties: true,
    streaks: true,
    gating: true,
    persistence: true,
    telemetry: false,
    overlays: true,
  };

  function cloneRunConfig(overrides) {
    return Object.assign({}, DEFAULT_RUN_CONFIG, overrides || {});
  }

  function getFeatureToggles() {
    return FEATURE_TOGGLES;
  }

  function setFeatureToggle(name, enabled) {
    if (!Object.prototype.hasOwnProperty.call(FEATURE_TOGGLES, name)) {
      throw new Error(`Unknown game feature toggle: ${name}`);
    }
    FEATURE_TOGGLES[name] = Boolean(enabled);
  }

  function isFeatureEnabled(name) {
    return Boolean(FEATURE_TOGGLES[name]);
  }

  function ensureOrbifold(value) {
    if (!value) return value;
    const normalized = String(value).replace(/x/g, "×");
    return ORBIFOLDS.includes(normalized) ? normalized : value;
  }

  global.GameConfig = Object.freeze({
    ORBIFOLDS,
    ORBIFOLD_GRID_LAYOUT,
    TRAINING_MODES,
    MODES_IN_ORDER,
    LEVELS,
    LEVEL_LOOKUP,
    LEVELS_BY_MODE,
    DEFAULT_MODE_ID,
    DEFAULT_LEVEL_ID,
    ALWAYS_UNLOCKED_LEVEL_IDS,
    DEFAULT_RUN_CONFIG,
    cloneRunConfig,
    getFeatureToggles,
    setFeatureToggle,
    isFeatureEnabled,
    ensureOrbifold,
    getLevel,
    getLevelsForMode,
    getModes,
  });
})(typeof window !== "undefined" ? window : this);
