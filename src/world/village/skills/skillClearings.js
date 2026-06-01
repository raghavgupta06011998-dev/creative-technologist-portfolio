// ═══════════════════════════════════════════════════════════════════════════
//  SKILL CLEARINGS — exclusion zones for pool-placed forest trees/bushes
// ═══════════════════════════════════════════════════════════════════════════
//
//  Consumed by skillsForestTrees.js → isInClearing(x, z) so the pool
//  doesn't drop a tree on top of a skill pillar boulder or the campfire.
//
//  Phase 1 holds:
//    • 1 clearing for Pillar 1 (Design)
//    • 1 clearing for the campfire
//
//  Phase 2 will add 4 more clearings (one per remaining pillar) to match
//  the additional pillar positions defined in skillPillars.js.
//
//  Coordinates here approximate the trail-pos output for each pillar's
//  (z, side, outset=16). Radius 5 covers the boulder + halo footprint
//  comfortably; trees outside the halo can still spawn naturally.
// ═══════════════════════════════════════════════════════════════════════════

export const CLEARING_EXCLUSION_ZONES = [
  // Pillar 1 — Design (LEFT, z=-205)
  { x: -19, z: -205, r: 5.0, label: 'pillar_design' },

  // Phase 2 — uncomment when adding the other pillars:
  // { x:  20, z: -240, r: 5.0, label: 'pillar_ai' },
  // { x: -19, z: -275, r: 5.0, label: 'pillar_workflow' },
  // { x:  18, z: -310, r: 5.0, label: 'pillar_data' },
  // { x: -16, z: -345, r: 5.0, label: 'pillar_creative' },

  // Campfire — atmospheric clearing deeper off-road
  { x: -28, z: -360, r: 8.0, label: 'campfire' },
]
