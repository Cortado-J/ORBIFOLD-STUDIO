// UI state and rendering
function panelHeight() {
  return 220;
}

function drawScreen() {
  background(245);
  drawTitle();
  drawPoolGrid();
  drawControls();
}

function drawPoolGrid() {
  const cols = GRID_COLS;
  const rows = GRID_ROWS;
  const gridH = height - HEADER_H - panelHeight();
  const cellWBase = width / cols;
  const cellHBase = gridH / rows;
  const s = min(cellWBase, cellHBase);
  const gap = max(4, s * 0.08);
  const tile = max(10, s - gap);
  const originX = (width - cols * s) / 2;
  const originY = HEADER_H + (gridH - rows * s) / 2;
  for (let i = 0; i < min(pool.length, cols * rows); i++) {
    const r = floor(i / cols);
    const c = i % cols;
    const x = originX + c * s + (s - tile) / 2;
    const y = originY + r * s + (s - tile) / 2;
    const g = pool[i];
    const isSel = selectedParents.includes(g);
    drawQuadrant(g, x, y, tile, tile, isSel, i);
  }
}

function drawQuadrant(g, x, y, w, h, isSelected = false, idx = 0) {
  let pg = createGraphics(w, h);
  pg.background(240);
  pg.translate(w / 2, h / 2);
  drawWallpaperOn(pg, g);
  image(pg, x, y);
  
  if (isSelected) {
    push();
    noStroke();
    fill(46, 204, 113, 120);
    rect(x + 4, y + 4, w - 8, h - 8, 4);
    pop();
  }

  // Border
  stroke(0);
  strokeWeight(4);
  noFill();
  rect(x, y, w, h, 4);

  // Text label retained for possible reuse; comment out to hide numbers for now.
  // fill(0);
  // noStroke();
  // textAlign(CENTER, CENTER);
  // textSize(18);
  // text(g.group, x + w / 2, y + 16);
}

function drawControls() {
  const h = panelHeight();
  const y = height - h;
  uiRegions.actionButtons = {};

  // Panel background
  noStroke();
  fill(255);
  rect(0, y, width, h);
  stroke(0);
  noFill();
  rect(0, y, width, h);

  // Selected count just beneath the pool
  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);
  textSize(16);
  text(`Selected parents: ${selectedParents.length}`, 16, y + 22);

  // Instructions block
  textSize(14);
  const instructions = [
    "Keyboard shortcuts:",
    "R – Random: create a random child.",
    "C – Clone: mutate each selected parent.",
    "A – Average: average the selected parents.",
    "S – Select: mix traits from selected parents.",
  ];
  let textY = y + 52;
  for (const line of instructions) {
    text(line, 16, textY);
    textY += 20;
  }

  // Action buttons row
  const actions = [
    { key: "R", label: "Random", action: "random", enabled: true },
    { key: "C", label: "Clone", action: "clone", enabled: selectedParents.length > 0 },
    { key: "A", label: "Average", action: "average", enabled: selectedParents.length >= 2 },
    { key: "S", label: "Select", action: "select", enabled: selectedParents.length > 0 },
  ];
  const buttonH = 44;
  const buttonW = 140;
  const buttonGap = 16;
  const totalW = actions.length * buttonW + (actions.length - 1) * buttonGap;
  const startX = (width - totalW) / 2;
  const buttonY = y + h - buttonH - 24;

  textAlign(CENTER, CENTER);
  textSize(16);
  for (let i = 0; i < actions.length; i++) {
    const { action, label, enabled, key } = actions[i];
    const bx = startX + i * (buttonW + buttonGap);
    const region = { x: bx, y: buttonY, w: buttonW, h: buttonH };
    uiRegions.actionButtons[action] = region;
    stroke(0);
    fill(enabled ? "#06d6a0" : 200);
    rect(region.x, region.y, region.w, region.h, 8);
    noStroke();
    fill(enabled ? 255 : 80);
    text(`${label} (${key})`, region.x + region.w / 2, region.y + region.h / 2);
  }

  // Generation counter on the right edge
  fill(0);
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(14);
  text(`Gen ${gen}`, width - 20, y + 22);
}

function drawTitle() {
  // Title bar at the top
  noStroke();
  fill(255);
  rect(0, 0, width, HEADER_H);
  stroke(0);
  noFill();
  rect(0, 0, width, HEADER_H);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(22);
  text(`Pattern Evolution ${APP_VERSION}`, width / 2, HEADER_H / 2);
}

function pointInRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

function toggleParentSelection(g) {
  let i = selectedParents.indexOf(g);
  if (i >= 0) selectedParents.splice(i, 1);
  else selectedParents.push(g);
}

function mousePressed() {
  // Action buttons
  if (uiRegions.actionButtons) {
    for (const [action, region] of Object.entries(uiRegions.actionButtons)) {
      if (region && pointInRect(mouseX, mouseY, region)) {
        handleAction(action);
        return;
      }
    }
  }

  // Grid selection
  const cols = GRID_COLS;
  const rows = GRID_ROWS;
  if (mouseY >= HEADER_H && mouseY < height - panelHeight()) {
    const gridH = height - HEADER_H - panelHeight();
    const cellWBase = width / cols;
    const cellHBase = gridH / rows;
    const s = min(cellWBase, cellHBase);
    const gap = max(4, s * 0.08);
    const originX = (width - cols * s) / 2;
    const originY = HEADER_H + (gridH - rows * s) / 2;
    if (mouseX >= originX && mouseX < originX + cols * s && mouseY >= originY && mouseY < originY + rows * s) {
      const c = floor((mouseX - originX) / s);
      const r = floor((mouseY - originY) / s);
      const localX = (mouseX - originX) - c * s;
      const localY = (mouseY - originY) - r * s;
      if (localX < gap / 2 || localX > s - gap / 2 || localY < gap / 2 || localY > s - gap / 2) {
        return; // click fell in the gutter between tiles
      }
      const idx = r * cols + c;
      if (idx >= 0 && idx < pool.length) {
        toggleParentSelection(pool[idx]);
        return drawScreen();
      }
    }
  }
}
