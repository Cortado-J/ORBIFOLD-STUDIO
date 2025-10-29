/*
 * Breeding helpers overview
 * -------------------------
 * UI interactions feed selected parent genomes through this module to produce
 * new offspring previews and manage pool capacity:
 *   - `buildOffspringPreview` generates up to four candidate children based on the
 *     current selection state (random, cloned, or mixed using global controls).
 *   - `sendLiveOffspringToPool` moves user-approved previews into the pool and
 *     updates selection statistics.
 */
function buildOffspringPreview() {
  let children = [];
  if (selectedParents.length === 0) {
    for (let i = 0; i < 4; i++) children.push(randomGenome());
  } else if (selectedParents.length === 1) {
    for (let i = 0; i < 4; i++) children.push(mutateGenome(selectedParents[0], mutationRate));
  } else {
    for (let i = 0; i < 4; i++) {
      children.push(
        mixGenomes(selectedParents, {
          method: combineMethod,
          mutationRate: mutationRate * 0.5,
          paletteOverride: paletteOverride,
        })
      );
    }
  }
  return children;
}

function sendLiveOffspringToPool() {
  let added = 0;
  for (let i = 0; i < 4; i++) {
    if (liveOffspringSelected[i] && liveOffspring && liveOffspring[i]) {
      pool.push(liveOffspring[i]);
      added++;

      if (liveOffspring[i].parents && liveOffspring[i].parents.length > 0) {
        const seen = new Set();
        for (const parent of liveOffspring[i].parents) {
          if (parent && !seen.has(parent)) {
            parent.selectCount = (parent.selectCount || 0) + 1;
            seen.add(parent);
          }
        }
      }
    }
  }

  if (added > 0) {
    gen++;
    console.log(`Added ${added} patterns to the pool`);
    if (typeof scrollPoolToLatest === "function") {
      scrollPoolToLatest();
    }
  }

  liveOffspring = buildOffspringPreview();
  liveOffspringSelected = [false, false, false, false];

  drawScreen();
}
