import { placeAsset } from '../utils/assetLoader.js'
import { WORLD } from '../roads/roads.js'

// ═══════════════════════════════════════════════════════════════════════════
//  VILLAGE RING HOUSES — circular arrangement around the hero house
// ═══════════════════════════════════════════════════════════════════════════
//
//  Houses are placed on an arc that wraps the sides and back of the hero
//  yard.  The front (south, toward spawn) is kept open so the player's
//  first view always terminates on the hero house.
//
//  GEOMETRY:
//    Centre = WORLD.HERO (0, 0, −48)
//    Houses sit OUTSIDE the circular district loop (loop outer R=42).
//    Per-house radii 52–64 → 10–22u lawn buffer beyond the road.
//    Angles measured CLOCKWISE from north (−Z direction from hero).
//      a = 0°  → directly behind hero house (north)
//      a = 90° → east (+X)
//      a = 180° → directly in front of hero (south, toward player)
//      a = 270° → west (−X)
//
//  INWARD FACING:
//    ry = −(angleDeg × π / 180)
//    Verification:
//      a=0°   (north) → ry=0  → faces +Z (south, toward player)  ✓
//      a=90°  (east)  → ry=−π/2 → faces −X (west, toward hero)   ✓
//      a=270° (west)  → ry=+π/2 → faces +X (east, toward hero)   ✓
//
//  FRONT ARC GAP:
//    a = 145°–215° is left empty — this is the player's approach corridor.
// ═══════════════════════════════════════════════════════════════════════════

const HERO = WORLD.HERO           // (0, 0, −48)
const S    = 1.25                 // side house base scale (hero house is 1.55)
                                  // 1.25 → actual range 1.15–1.25, hero at 1.55
                                  // hero stays ~24% larger — clearly dominant
const DEG  = d => d * Math.PI / 180

// ── Per-house radii (52–64) create organic setback variation ──────────────
// Loop road outer edge is at R=42. Houses sit 10–22u beyond it in the
// surrounding lawn — a neighbourhood ring around the central estate.
// Radii are NOT uniform — intentional for a "grown" village.

// position helper: angle a° CW from north, radius R from hero
function ringPos(aDeg, R) {
  const a = DEG(aDeg)
  return {
    x:  HERO.x + Math.sin(a) * R,
    z:  HERO.z - Math.cos(a) * R,
    ry: -a,                        // inward-facing
  }
}

// ── 8 side houses with individual radii for organic setback variation ─────
//
//   Front gap: 127°–233° left clear (106° opening) — approach corridor,
//   so the player's sightline up the main street lands on the hero house.
//   Right arc: 50°→127°   Left arc: 233°→310°
//
//   Radii varied 53–60 so houses are NOT on a perfect ring.
//   All sit well outside the loop (R=42).
//
//   Hero z=−48. Back houses (a≈50°, R=54):
//     z = −48 − 54·cos(50°) = −82.7  →  forest row 1 at z≈−100 = 17u clear ✓

const { x: rx1, z: rz1, ry: rry1 } = ringPos( 50, 54)   // back-right
const { x: rx2, z: rz2, ry: rry2 } = ringPos( 75, 60)   // right, pushed out
const { x: rx3, z: rz3, ry: rry3 } = ringPos(102, 58)   // front-right
const { x: rx4, z: rz4, ry: rry4 } = ringPos(127, 53)   // near-front right

const { x: lx1, z: lz1, ry: lry1 } = ringPos(233, 53)   // near-front left
const { x: lx2, z: lz2, ry: lry2 } = ringPos(258, 58)   // front-left
const { x: lx3, z: lz3, ry: lry3 } = ringPos(285, 60)   // left, pushed out
const { x: lx4, z: lz4, ry: lry4 } = ringPos(310, 54)   // back-left

const RING_HOUSES = [
  // ── right arc (east) ───────────────────────────────────────────────────
  // a=50°, R=54 → x=41.4, z=−82.7   (back-right)
  { key: 'house_07', x: rx1, z: rz1, s: S * 0.95, ry: rry1 },
  // a=75°, R=60 → x=57.9, z=−63.5   (right)
  { key: 'house_12', x: rx2, z: rz2, s: S,        ry: rry2 },
  // a=102°, R=58 → x=56.7, z=−35.9  (front-right)
  { key: 'house_15', x: rx3, z: rz3, s: S,        ry: rry3 },
  // a=127°, R=53 → x=42.3, z=−16.1  (near-front, flanks approach)
  { key: 'house_10', x: rx4, z: rz4, s: S * 0.92, ry: rry4 },

  // ── left arc (west) ────────────────────────────────────────────────────
  // a=233°, R=53 → x=−42.3, z=−16.1 (near-front, flanks approach)
  { key: 'house_16', x: lx1, z: lz1, s: S * 0.92, ry: lry1 },
  // a=258°, R=58 → x=−56.7, z=−35.9 (front-left)
  { key: 'house_03', x: lx2, z: lz2, s: S,        ry: lry2 },
  // a=285°, R=60 → x=−57.9, z=−63.5 (left)
  { key: 'house_01', x: lx3, z: lz3, s: S,        ry: lry3 },
  // a=310°, R=54 → x=−41.4, z=−82.7 (back-left)
  { key: 'house_06', x: lx4, z: lz4, s: S * 0.95, ry: lry4 },
]

// ── Greenery infill — in the lawn belt between loop road and houses ────────
// Placed at R≈47–49 (loop outer is R=42, houses at R=53+), in the gaps.
const DRESSING = [
  // right side lawn belt
  { k: 'kn_plant_bush',       x:  37, z: -67 },
  { k: 'kn_flower_yellow',    x:  47, z: -48 },
  { k: 'kn_plant_bush_small', x:  45, z: -28 },
  { k: 'kn_flower_red',       x:  34, z: -13 },
  // left side lawn belt
  { k: 'kn_plant_bush',       x: -37, z: -67 },
  { k: 'kn_flower_red',       x: -47, z: -48 },
  { k: 'kn_plant_bush_small', x: -45, z: -28 },
  { k: 'kn_flower_yellow',    x: -34, z: -13 },
]

export function createStreetHouses(ctx) {
  for (const h of RING_HOUSES) {
    placeAsset(ctx, h.key, h.x, 0, h.z, h.s, h.ry)
  }
  for (const d of DRESSING) {
    placeAsset(ctx, d.k, d.x, 0, d.z, 0.78, 0)
  }
}
