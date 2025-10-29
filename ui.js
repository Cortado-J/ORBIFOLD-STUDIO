// UI state and rendering
// Coordinates top-level layout, pool grid drawing, and control panel composition.
const TILE_SCALE = 0.9;
function panelHeight() {
  return 220;
}

function calculatePoolLayout() {
  const cols = GRID_COLS;
  const visibleRows = GRID_ROWS;
  const gridH = height - HEADER_H - panelHeight();
  const cellWBase = width / cols;
  const cellHBase = gridH / visibleRows;
  const cellSize = min(cellWBase, cellHBase);
  const gap = max(4, cellSize * 0.08);
  const tileBase = max(10, cellSize - gap);
  const tile = max(10, tileBase * TILE_SCALE);
  const originX = (width - cols * cellSize) / 2;
  const originYBase = HEADER_H + gap / 2;
  const maxOriginY = HEADER_H + gridH - visibleRows * cellSize;
  const viewportTop = min(originYBase, maxOriginY);
  const viewportHeight = visibleRows * cellSize;
  const totalRows = max(1, ceil(pool.length / cols));
  const contentHeight = totalRows * cellSize;
  const maxScroll = max(0, contentHeight - viewportHeight);
  const scrollbarWidth = 12;
  const scrollbarX = originX + cols * cellSize + gap * 0.4;

  return {
    cols,
    visibleRows,
    gap,
    tile,
    cellSize,
    originX,
    viewportTop,
    viewportHeight,
    totalRows,
    contentHeight,
    maxScroll,
    scrollbarWidth,
    scrollbarX,
  };
}

function getPoolScrollbarMetrics(layout) {
  const track = {
    x: layout.scrollbarX,
    y: layout.viewportTop,
    w: layout.scrollbarWidth,
    h: layout.viewportHeight,
  };

  const knobHeight = layout.maxScroll <= 0
    ? track.h
    : max(24, track.h * (track.h / layout.contentHeight));
  const knobTravel = max(0, track.h - knobHeight);
  const knobY = knobTravel === 0
    ? track.y
    : track.y + knobTravel * (poolScroll / layout.maxScroll || 0);

  return {
    track,
    knob: {
      x: track.x,
      y: knobY,
      w: track.w,
      h: knobHeight,
    },
    knobTravel,
  };
}

function scrollPoolToLatest() {
  const layout = calculatePoolLayout();
  poolScroll = constrain(layout.maxScroll, 0, layout.maxScroll);
}

function drawScreen() {
  background(245);
  drawTitle();
  drawPoolGrid();
  drawControls();
}

function drawPoolGrid() {
  const layout = calculatePoolLayout();
  poolScroll = constrain(poolScroll, 0, layout.maxScroll);

  const firstRow = floor(poolScroll / layout.cellSize);
  const rowOffset = poolScroll - firstRow * layout.cellSize;
  const remainingRows = max(0, layout.totalRows - firstRow);
  const rowsToDraw = min(layout.visibleRows + 1, remainingRows);

  for (let row = 0; row < rowsToDraw; row++) {
    const globalRow = firstRow + row;
    const yBase = layout.viewportTop + row * layout.cellSize - rowOffset;
    const idxBase = globalRow * layout.cols;

    for (let col = 0; col < layout.cols; col++) {
      const idx = idxBase + col;
      if (idx >= pool.length) break;
      const x = layout.originX + col * layout.cellSize + (layout.cellSize - layout.tile) / 2;
      const y = yBase + (layout.cellSize - layout.tile) / 2;
      const g = pool[idx];
      const isSel = selectedParents.includes(g);
      drawQuadrant(g, x, y, layout.tile, layout.tile, isSel, idx);
      drawGenomeSummaryLabel(genomeSummary(g), x, y + layout.tile + 4, layout.tile);
    }
  }

  drawPoolScrollbar(layout);
}

function drawPoolScrollbar(layout) {
  const metrics = getPoolScrollbarMetrics(layout);
  const track = metrics.track;
  const knob = metrics.knob;

  push();
  stroke(0);
  strokeWeight(2);
  fill(230);
  rect(track.x, track.y, track.w, track.h, track.w / 2);

  if (layout.maxScroll <= 0) {
    fill(120);
    rect(track.x, track.y, track.w, track.h, track.w / 2);
  } else {
    fill(80);
    rect(knob.x, knob.y, knob.w, knob.h, track.w / 2);
  }

  pop();
}

function drawQuadrant(g, x, y, w, h, isSelected = false, idx = 0) {
  let pg = createGraphics(w, h);
  pg.background(240);
  pg.translate(w / 2, h / 2);
  const baseScale = displayScaleForPattern ? displayScaleForPattern(g, w, h, 3) : 1;
  if (baseScale !== 1) pg.scale(baseScale);
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

function drawGenomeSummaryLabel(summary, x, y, width) {
  if (!summary) return;
  push();
  noStroke();
  fill(32);
  textSize(15);
  textAlign(CENTER, TOP);
  text(summary, x + width / 2, y);
  pop();
}

function drawControls() {
  const layout = computeControlPanelLayout();
  uiRegions.actionButtons = {};

  drawControlPanelContainer(layout);

  const actions = [
    { key: "R", label: "Random", action: "random" },
    { key: "C", label: "Clone", action: "clone" },
    { key: "A", label: "Average", action: "average" },
    { key: "S", label: "Select", action: "select" },
    { key: "D", label: "Delete", action: "delete" }
  ];

  const buttonMetrics = renderActionButtonGrid(actions, layout, { buttonCols: 2 });
  drawMutationSliderSection(layout, buttonMetrics);

  const previewSpacing = max(24, buttonMetrics.buttonW * 0.2);
  const previewX = buttonMetrics.columnX + buttonMetrics.buttonAreaWidth + previewSpacing;
  const previewY = layout.innerY;
  const previewW = layout.innerX + layout.innerW - previewX;
  const previewH = layout.innerH;

  stroke(0);
  fill(240);
  rect(previewX, previewY, previewW, previewH, 8);

  noStroke();
  fill(0);
  textAlign(LEFT, TOP);
  textSize(14);
  const genY = previewY + 16;
  text(`Gen ${gen}`, previewX + 16, genY);

  textSize(16);
  const parentsY = genY + 22;
  text(`Selected parents: ${selectedParents.length}`, previewX + 16, parentsY);

  textSize(14);
  const infoY = parentsY + 30;
  if (previewActive()) {
    const total = pendingPreview ? pendingPreview.items.length : 1;
    const index = pendingPreview ? pendingPreview.index + 1 : 1;
    const label = pendingPreview ? pendingPreview.label : "Preview";
    text(`${label} offspring ${index}/${total}`, previewX + 16, infoY);
    text("Press Space to add, any other key to cancel.", previewX + 16, infoY + 20);

    const item = currentPreviewItem();
    if (item && item.genome) {
      const artSize = layout.tile;
      const artX = previewX + (previewW - artSize) / 2;
      const artY = previewY + previewH - artSize - 20;
      const pg = createGraphics(artSize, artSize);
      pg.background(240);
      pg.translate(pg.width / 2, pg.height / 2);
      const scaleFactor = displayScaleForPattern ? displayScaleForPattern(item.genome, artSize, artSize, 3) : 1;
      if (scaleFactor !== 1) pg.scale(scaleFactor);
      drawWallpaperOn(pg, item.genome);
      image(pg, artX, artY);
      stroke(0);
      strokeWeight(4);
      noFill();
      rect(artX, artY, artSize, artSize, 4);
      strokeWeight(1);
      drawGenomeSummaryLabel(genomeSummary(item.genome), artX, artY + artSize + 6, artSize);
    }
  } else {
    text("Choose an action or press R/C/A/S to preview.", previewX + 16, infoY);
    text("Press Space to confirm a preview when shown.", previewX + 16, infoY + 20);
  }

  // Generation counter on the right edge within preview panel
  textAlign(RIGHT, TOP);
  textSize(14);
  text(`Gen ${gen}`, previewX + previewW - 16, previewY + 16);
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

