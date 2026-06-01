import { placeAsset } from '../utils/assetLoader.js'

// ═══════════════════════════════════════════════════════════════════════════
//  OUTER ROCKS — rough rocky landscape framing the village
// ═══════════════════════════════════════════════════════════════════════════
//
//  The village is a small, calm, cared-for hub.  Beyond the houses the
//  land turns wild — boulders and stylized rock clusters give the world
//  a believable larger landscape that the village sits inside.
//
//  Assets (all stylized, matched to the existing forest-tree look):
//    boulder_mossy_lg / boulder_plain_lg / boulder_outcrop
//        → forest-pack boulders — same art style as the village trees
//    rocks_01 … rocks_06
//        → stylized low-poly rock clusters — rougher outcrops
//
//  PLACEMENT RULES (per the brief):
//    • far left + far right edges        (x ≈ ±105–125)
//    • behind the outer ring of houses   (R > 66 from hero)
//    • far background, deep north        (z < −150)
//    • outer boundary scatter
//    • NOTHING close to the hero house, NOTHING blocking the main
//      spawn → hero sightline (front corridor kept clear)
//
//  Hero house at (0, −48).  Side houses at R 53–60.  Background trees
//  at z −112…−136 — rocks sit further out than all of them.
//
//  Tight clusters of large boulders read as raised, rough landforms
//  without needing real terrain elevation (ground stays flat for the
//  player's gravity raycaster).
// ═══════════════════════════════════════════════════════════════════════════

// { k: asset key, x, z, s: scale, r: rotationY (radians) }
const ROCKS = [
  // ── back-left landform cluster — big rough mass behind the village ──────
  { k: 'boulder_outcrop',  x:  -96, z: -122, s: 2.6, r: 0.3 },
  { k: 'boulder_mossy_lg', x:  -80, z: -134, s: 2.1, r: 1.1 },
  { k: 'rocks_03',         x: -112, z: -110, s: 3.2, r: 0.7 },
  { k: 'boulder_plain_lg', x: -122, z: -130, s: 1.9, r: 2.4 },
  { k: 'rocks_01',         x:  -90, z: -112, s: 2.0, r: 1.8 },

  // ── back-right landform cluster (mirror) ───────────────────────────────
  { k: 'boulder_outcrop',  x:   96, z: -122, s: 2.6, r: 2.1 },
  { k: 'boulder_mossy_lg', x:   80, z: -134, s: 2.1, r: 0.5 },
  { k: 'rocks_05',         x:  112, z: -110, s: 3.2, r: 1.5 },
  { k: 'boulder_plain_lg', x:  122, z: -130, s: 1.9, r: 0.9 },
  { k: 'rocks_02',         x:   90, z: -112, s: 2.0, r: 2.7 },

  // ── deep background centre — far landform OUTSIDE the forest road ─────
  //   ORIGINAL positions placed these rocks right at the bridge → road
  //   transition (z=−158 to −174, x=−48 to +34), which intruded on the
  //   road corridor and fence line once the forest road was built.
  //   RELOCATED outward (|x| ≥ 65) so they sit deep in the outer rocky
  //   landscape, well beyond the road's fence boundary (|x|=12) and the
  //   forest tree band (|x|=28).
  { k: 'rocks_04',         x:  -70, z: -160, s: 3.4, r: 0.4 },
  { k: 'boulder_outcrop',  x:   70, z: -175, s: 3.0, r: 1.9 },
  { k: 'boulder_mossy_lg', x:   78, z: -158, s: 2.3, r: 2.6 },
  { k: 'rocks_06',         x:  -78, z: -158, s: 2.7, r: 1.2 },

  // ── mid-left edge — rough countryside down the west flank ──────────────
  { k: 'boulder_plain_lg', x: -108, z:  -62, s: 1.9, r: 0.8 },
  { k: 'rocks_02',         x: -120, z:  -88, s: 2.5, r: 2.2 },
  { k: 'boulder_mossy_lg', x: -112, z:  -32, s: 1.7, r: 1.4 },
  { k: 'rocks_04',         x: -124, z:   -6, s: 2.1, r: 0.6 },

  // ── mid-right edge (mirror) ────────────────────────────────────────────
  { k: 'boulder_plain_lg', x:  108, z:  -62, s: 1.9, r: 1.7 },
  { k: 'rocks_01',         x:  120, z:  -88, s: 2.5, r: 0.3 },
  { k: 'boulder_mossy_lg', x:  112, z:  -32, s: 1.7, r: 2.5 },
  { k: 'rocks_05',         x:  124, z:   -6, s: 2.1, r: 1.0 },

  // ── small rocks nestled behind the outer houses ────────────────────────
  { k: 'boulder_plain_lg', x:   72, z:  -72, s: 0.95, r: 1.2 },
  { k: 'boulder_plain_lg', x:  -72, z:  -72, s: 0.95, r: 2.0 },
  { k: 'boulder_mossy_lg', x:   54, z:  -98, s: 1.05, r: 0.5 },
  { k: 'boulder_mossy_lg', x:  -54, z:  -98, s: 1.05, r: 1.6 },

  // ── far-side framing near spawn — small, low, never blocks the view ────
  { k: 'rocks_03',         x:  -74, z:   26, s: 1.3, r: 0.9 },
  { k: 'rocks_06',         x:   74, z:   24, s: 1.3, r: 2.3 },
]

// ═══════════════════════════════════════════════════════════════════════════
export function createOuterRocks(ctx) {
  for (const o of ROCKS) {
    placeAsset(ctx, o.k, o.x, 0, o.z, o.s, o.r)
  }
}
