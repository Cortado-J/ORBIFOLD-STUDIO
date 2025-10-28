// === Interactive Wallpaper Evolution UI ===

let palettes;
let pool = []; // main list of all patterns
let gen = 0;

// Visible version tag for easy cache-busting verification
const APP_VERSION = "v1.0.4";

// Parent selection + control panel state
let selectedParents = []; // array of genomes currently selected (max 4)
let mutationRate = 0.25; // 0..1

// Layout caches
let wq, hq;
let thumbH = 100;

// Grid and layout constants
const GRID_COLS = 6;
const GRID_ROWS = 6; // changed from 8 to 6
const HEADER_H = 48; // title bar height
const PANEL_H = 80;  // control panel height

// UI hit regions (computed each frame)
let uiRegions = {
  actionButtons: {},
};

function setup() {
  createCanvas(1000, 1000);
  angleMode(RADIANS);
  noLoop();
  // Also show version in browser tab
  if (typeof document !== 'undefined') {
    document.title = `Pattern Evolution ${APP_VERSION}`;
  }

  wq = width / 2;
  hq = (height * 0.7) / 2;

  palettes = {
    warm: ["#e63946", "#f1faee", "#a8dadc", "#ffbe0b", "#fb5607"],
    cool: ["#457b9d", "#1d3557", "#a8dadc", "#118ab2", "#06d6a0"],
    earth: ["#2a9d8f", "#e9c46a", "#f4a261", "#264653", "#dda15e"],
    vivid: ["#ffb703", "#fb8500", "#023047", "#8ecae6", "#219ebc"]
  };

  // Prime pool with 6 random patterns
  for (let i = 0; i < 6; i++) pool.push(withMeta(randomGenome()));
  drawScreen();
}

function handleAction(action) {
  const created = [];
  switch (action) {
    case "random":
      created.push(withMeta(randomGenome()));
      break;
    case "clone":
      if (selectedParents.length === 0) {
        console.log("Clone requires at least one selected parent.");
        return;
      }
      for (const parent of selectedParents) {
        created.push(withMeta(mutateGenome(parent, mutationRate)));
      }
      break;
    case "average":
      if (selectedParents.length < 2) {
        console.log("Average breeding requires at least two parents.");
        return;
      }
      created.push(withMeta(mixGenomes(selectedParents, {
        method: "average",
        mutationRate,
        paletteOverride: -1,
      })));
      break;
    case "select":
      if (selectedParents.length === 0) {
        console.log("Select breeding requires at least one parent.");
        return;
      }
      created.push(withMeta(mixGenomes(selectedParents, {
        method: "random-trait",
        mutationRate,
        paletteOverride: -1,
      })));
      break;
    default:
      return;
  }

  if (created.length === 0) return;

  for (const child of created) {
    pool.push(child);
  }

  if (selectedParents.length > 0 && action !== "random") {
    for (const parent of selectedParents) {
      parent.selectCount = (parent.selectCount || 0) + 1;
    }
  }

  enforceCapacity(GRID_COLS * GRID_ROWS, selectedParents);
  gen++;
  drawScreen();
}

function keyPressed() {
  if (key === "r" || key === "R") return handleAction("random");
  if (key === "c" || key === "C") return handleAction("clone");
  if (key === "a" || key === "A") return handleAction("average");
  if (key === "s" || key === "S") return handleAction("select");
}
