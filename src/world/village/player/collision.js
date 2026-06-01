import * as THREE from 'three'
import { TREE_POSITIONS as SKILLS_FOREST_TREES, TREE_COLLIDER_RADIUS as SF_TREE_R } from '../nature/skillsForestTrees.js'

// ═══════════════════════════════════════════════════════════════════════════
//  COLLISION SYSTEM — simple AABB + circle push-out for the village world
// ═══════════════════════════════════════════════════════════════════════════
//
//  Architecture
//  ─────────────────────────────────────────────────────────────────────────
//  CIRCLES  —  circular exclusion zones (one per building).
//               Push-out is RADIAL from the zone centre, so the player
//               slides naturally along curved building edges.
//
//  AABBS    —  axis-aligned box zones for linear structures (bridge walls).
//               Resolved by finding the shallowest penetration axis.
//
//  resolveCollisions(pos) mutates a THREE.Vector3 to clear all overlaps.
//  Call it every frame after applying horizontal movement.
//
//  PLAYER_R —  half-width of the player "capsule" (0.5 world units).
//               Every zone radius already includes this — no extra math.
//
//  Coordinate system (matches village):
//    +Z = south (toward player spawn)
//    −Z = north (into the village / toward the river)
//    +X = east  (player's RIGHT on approach)
//    −X = west  (player's LEFT on approach)
//
//  Debug
//  ─────────────────────────────────────────────────────────────────────────
//  buildCollisionHelpers() returns THREE.Mesh[] — add them to the scene.
//  All helpers are hidden by default.
//  In playerController.js, press Alt + C to toggle visibility.
//  Or from browser console:  window.__showCollision(true/false)
// ═══════════════════════════════════════════════════════════════════════════

export const PLAYER_R = 0.5   // half-width of player capsule in XZ plane

// ── Circular obstacle zones ────────────────────────────────────────────────
//   Radius = effective blocking distance from building centre.
//   Computed as estimated model half-extent + a small buffer so the player
//   stops cleanly before visually entering the building mesh.
//
//   All positions taken directly from streetHouses.js ringPos() calculations
//   and farm/market placement coordinates.
const CIRCLES = [
  // ── Side houses (scale ≈1.25, visual half-width ≈7u → r=8u) ─────────────
  { x:  41.4, z: -82.7, r:  8 },   // house_07  back-right   a=50°  R=54
  { x:  57.9, z: -63.5, r:  8 },   // house_12  right        a=75°  R=60
  { x:  56.7, z: -35.9, r:  8 },   // house_15  front-right  a=102° R=58
  { x:  42.3, z: -16.1, r:  8 },   // house_10  near-front-right  a=127° R=53
  { x: -42.3, z: -16.1, r:  8 },   // house_16  near-front-left   a=233° R=53
  { x: -56.7, z: -35.9, r:  8 },   // house_03  front-left   a=258° R=58
  { x: -57.9, z: -63.5, r:  8 },   // house_01  left         a=285° R=60
  { x: -41.4, z: -82.7, r:  8 },   // house_06  back-left    a=310° R=54

  // ── Hero house (scale 1.55, visually dominant) ────────────────────────────
  { x:   0,   z: -48,   r: 10 },   // house_11  centre of village

  // ── Farm buildings ────────────────────────────────────────────────────────
  { x:  82,   z: -86,   r: 11 },   // farmbuilding_02  (barn, scale 1.2)
  { x:  68,   z: -80,   r:  4 },   // farmstructure_23 (silo, slender)
  { x:  78,   z: -30,   r:  4 },   // farmstructure_22 (small structure)
  { x:  82,   z: -42,   r:  4 },   // farmstructure_26 (small structure)
  { x: -75,   z: -30,   r: 10 },   // farmbuilding_04 (left-side, gambrel + shed)
  { x: -78,   z: -52,   r:  8 },   // farmbuilding_03 (left-side, gambrel)
  { x: -72,   z: -88,   r: 10 },   // farmbuilding_05 (back-left red barn)
  { x:  76,   z: -72,   r: 11 },   // farmbuilding_08 (back-right large red barn)

  // ── Markets ──────────────────────────────────────────────────────────────
  { x: -48,   z: -18,   r:  8 },   // pp_village_market  (native scale 1.0)
  { x: -60,   z:   2,   r:  8 },   // new_village_market left (scale 7, but stalls cluster ~8u)
  { x:  60,   z:   2,   r:  8 },   // new_village_market right

  // ── Entrance welcome-sign poles (entrance.js GATE_Z=+14) ────────────────
  { x: -3.5,  z:  14,   r:  0.4 },
  { x:  3.5,  z:  14,   r:  0.4 },

  // ── Streetlights — approach road (villageProps.js APPROACH_LIGHTS) ──────
  { x: -9,    z:  20,   r:  0.5 },
  { x:  9,    z:  20,   r:  0.5 },
  { x: -9,    z:   8,   r:  0.5 },
  { x:  9,    z:   8,   r:  0.5 },
  { x: -9,    z:  -4,   r:  0.5 },
  { x:  9,    z:  -4,   r:  0.5 },

  // ── Streetlights — loop road (ring R=45 at 30°/90°/150°/210°/270°/330°) ─
  //   ring(a,R) = (sin(a)*R, -cos(a)*R + HERO_Z), HERO_Z=−48
  { x:  22.5, z: -86.97, r: 0.5 },   // 30°
  { x:  45,   z: -48,    r: 0.5 },   // 90°
  { x:  22.5, z:  -9.03, r: 0.5 },   // 150°
  { x: -22.5, z:  -9.03, r: 0.5 },   // 210°
  { x: -45,   z: -48,    r: 0.5 },   // 270°
  { x: -22.5, z: -86.97, r: 0.5 },   // 330°

  // ── Directional signs (villageProps.js SIGNS) ───────────────────────────
  { x:  12,   z:  -3,    r:  0.5 },
  { x:   9,   z: -86,    r:  0.5 },

  // ── Market town sign & lantern (marketZone.js) ──────────────────────────
  { x: -42,   z:  -8,    r:  0.5 },   // pp_town_sign
  { x: -54,   z: -12,    r:  0.5 },   // pp_post_lantern

  // ── Benches — approach (entrance pair + lawn-belt pair) ─────────────────
  { x: -14,   z:  17,    r:  1.2 },
  { x:  14,   z:  17,    r:  1.2 },
  { x: -44,   z: -48,    r:  1.2 },
  { x:  44,   z: -48,    r:  1.2 },

  // ── Benches — one in front of each side house ───────────────────────────
  { x:  36.8, z: -78.8,  r:  1.2 },   // house_07
  { x:  51.1, z: -61.7,  r:  1.2 },   // house_12
  { x:  50.8, z: -37.2,  r:  1.2 },   // house_15
  { x:  37.5, z: -19.7,  r:  1.2 },   // house_10
  { x: -37.5, z: -19.7,  r:  1.2 },   // house_16
  { x: -50.8, z: -37.2,  r:  1.2 },   // house_03
  { x: -51.1, z: -61.7,  r:  1.2 },   // house_01
  { x: -36.8, z: -78.8,  r:  1.2 },   // house_06

  // ── Market bench + farm-pasture bench ──────────────────────────────────
  { x: -38,   z: -12,    r:  1.2 },   // marketZone bench_b
  { x:  80,   z: -49.5,  r:  1.2 },   // farmZone south-fence bench_a

  // ── Storage barrels + buckets beside side houses ────────────────────────
  { x:  49,   z: -66,    r:  0.9 },   // barrel_b right
  { x:  51.2, z: -64.6,  r:  0.6 },   // bucket_a right
  { x: -49,   z: -66,    r:  0.9 },   // barrel_b left
  { x: -46.8, z: -64.6,  r:  0.6 },   // bucket_a left
  { x:  49,   z: -34,    r:  0.9 },   // barrel_b front-right
  { x:  51.2, z: -32.6,  r:  0.6 },   // bucket_a front-right
  { x: -49,   z: -34,    r:  0.9 },   // barrel_b front-left
  { x: -46.8, z: -32.6,  r:  0.6 },   // bucket_a front-left

  // ── Farm yard barrels + milk tank (farmZone.js) ─────────────────────────
  { x:  80,   z: -73,    r:  0.9 },   // barrel_a
  { x:  83,   z: -74,    r:  0.9 },   // barrel_a
  { x:  78,   z: -72,    r:  1.2 },   // milktank_a

  // ── Farm pasture fence posts (10 from farmZone.js, FARM_CX=80, FARM_CZ=−58) ──
  //   South face (z=−51)
  { x:  73,   z: -51,    r:  0.4 },
  { x:  80,   z: -51,    r:  0.4 },
  { x:  87,   z: -51,    r:  0.4 },
  //   North face (z=−65)
  { x:  73,   z: -65,    r:  0.4 },
  { x:  80,   z: -65,    r:  0.4 },
  { x:  87,   z: -65,    r:  0.4 },
  //   East face (x=91)
  { x:  91,   z: -61.5,  r:  0.4 },
  { x:  91,   z: -54.5,  r:  0.4 },
  //   West face (x=69)
  { x:  69,   z: -61.5,  r:  0.4 },
  { x:  69,   z: -54.5,  r:  0.4 },

  // ── Street trees — trunks only, r=1.2 (28 instances) ───────────────────
  //   Sourced from streetTrees.js — all zones A..G
  // A. Yard accents (2)
  { x: -15,   z: -66,    r:  1.2 },
  { x:  15,   z: -66,    r:  1.2 },
  // B. Estate edge (4)
  { x: -46,   z: -50,    r:  1.2 },
  { x:  46,   z: -50,    r:  1.2 },
  { x: -50,   z: -28,    r:  1.2 },
  { x:  50,   z: -28,    r:  1.2 },
  // C. Side-house groves (4)
  { x:  62,   z: -80,    r:  1.2 },
  { x:  70,   z: -52,    r:  1.2 },
  { x: -62,   z: -80,    r:  1.2 },
  { x: -70,   z: -52,    r:  1.2 },
  // D. Background clusters (4)
  { x: -58,   z: -114,   r:  1.2 },
  { x: -44,   z: -122,   r:  1.2 },
  { x:  44,   z: -120,   r:  1.2 },
  { x:  60,   z: -114,   r:  1.2 },
  // E. House fill (6)
  { x:  68,   z: -40,    r:  1.2 },
  { x:  72,   z: -70,    r:  1.2 },
  { x:  52,   z: -90,    r:  1.2 },
  { x: -68,   z: -40,    r:  1.2 },
  { x: -72,   z: -70,    r:  1.2 },
  { x: -52,   z: -90,    r:  1.2 },
  // F. Mid-back spread (4)
  { x:  76,   z:  -98,   r:  1.2 },
  { x: -78,   z: -100,   r:  1.2 },
  { x:  54,   z: -108,   r:  1.2 },
  { x: -56,   z: -110,   r:  1.2 },
  // G. Front-belt fill (4)
  { x: -32,   z:  -8,    r:  1.2 },
  { x:  32,   z:  -8,    r:  1.2 },
  { x: -38,   z: -20,    r:  1.2 },
  { x:  38,   z: -20,    r:  1.2 },

  // ── Skills-forest trees (~70 instances along the new road) ────────────
  //   Positions come from nature/skillsForestTrees.js — generated with a
  //   deterministic PRNG so the colliders always match the visible trees.
  ...SKILLS_FOREST_TREES.map(p => ({ x: p.x, z: p.z, r: SF_TREE_R })),
]

// ── AABB obstacle zones ────────────────────────────────────────────────────
//   Used for linear structures where circular zones don't fit.
//   Defined as axis-aligned rectangles in XZ (Y is not checked).
//
//   Bridge side walls:
//     The bridge deck is ≈10u wide centred at x=0.
//     South end: z=−130  (matches SOUTH_END in bridge.js approach paths)
//     North end: z=−166  (matches NORTH_START in bridge.js approach paths)
//     Players outside x=[−5,+5] in this Z range are pushed back to the edge.
const AABBS = [
  { minX: -14,  maxX: -5.5, minZ: -166, maxZ: -130 },  // west (left)  railing
  { minX:  5.5, maxX:  14,  minZ: -166, maxZ: -130 },  // east (right) railing
]

// ── Core resolver ──────────────────────────────────────────────────────────
//   Mutates pos (THREE.Vector3).  Call once per frame after movement.
//   Running twice catches rare corner tunnelling but is not required for
//   the village scale of this project.
export function resolveCollisions(pos) {
  const r = PLAYER_R

  // ── circles ───────────────────────────────────────────────────────────────
  //   If player centre is within (zone.r + PLAYER_R) of the zone centre,
  //   push the player radially outward to that distance.
  //   This naturally allows edge-sliding because the push direction is always
  //   away from the building, not blocking perpendicular motion.
  for (const c of CIRCLES) {
    const dx    = pos.x - c.x
    const dz    = pos.z - c.z
    const distSq  = dx * dx + dz * dz
    const minDist = c.r + r
    if (distSq < minDist * minDist) {
      const dist  = Math.sqrt(distSq) || 0.0001   // guard divide-by-zero
      const scale = minDist / dist
      pos.x = c.x + dx * scale
      pos.z = c.z + dz * scale
    }
  }

  // ── AABBs ─────────────────────────────────────────────────────────────────
  //   Expand each box by PLAYER_R on all sides (Minkowski sum approach).
  //   If the player centre is inside the expanded box, find the face with the
  //   smallest penetration depth and push out along that axis only.
  //   This gives clean single-axis sliding against bridge railings.
  for (const b of AABBS) {
    const ex0 = b.minX - r,  ex1 = b.maxX + r
    const ez0 = b.minZ - r,  ez1 = b.maxZ + r

    if (pos.x > ex0 && pos.x < ex1 && pos.z > ez0 && pos.z < ez1) {
      const dLeft  = pos.x - ex0   // depth from west face
      const dRight = ex1   - pos.x  // depth from east face
      const dSouth = pos.z - ez0   // depth from south face
      const dNorth = ez1   - pos.z  // depth from north face
      const min    = Math.min(dLeft, dRight, dSouth, dNorth)

      if      (min === dLeft)  pos.x = ex0
      else if (min === dRight) pos.x = ex1
      else if (min === dSouth) pos.z = ez0
      else                     pos.z = ez1
    }
  }
}

// ── Debug helpers ──────────────────────────────────────────────────────────
//   Returns an array of THREE.Mesh / THREE.LineSegments.
//   Add them to ctx.scene.  Toggle .visible on each to show/hide.
//
//   Red cylinders  = circular zones
//   Blue boxes     = AABB zones
export function buildCollisionHelpers() {
  const helpers = []

  const circleMat = new THREE.MeshBasicMaterial({
    color:     0xff2222,
    wireframe: true,
    transparent: true,
    opacity:   0.55,
  })
  const aabbMat = new THREE.MeshBasicMaterial({
    color:     0x2266ff,
    wireframe: true,
    transparent: true,
    opacity:   0.55,
  })

  for (const c of CIRCLES) {
    const geo  = new THREE.CylinderGeometry(c.r, c.r, 3.5, 24, 1)
    const mesh = new THREE.Mesh(geo, circleMat)
    mesh.position.set(c.x, 1.75, c.z)
    mesh.visible = false
    helpers.push(mesh)
  }

  for (const b of AABBS) {
    const w    = b.maxX - b.minX
    const d    = b.maxZ - b.minZ
    const geo  = new THREE.BoxGeometry(w, 3.5, d)
    const mesh = new THREE.Mesh(geo, aabbMat)
    mesh.position.set((b.minX + b.maxX) * 0.5, 1.75, (b.minZ + b.maxZ) * 0.5)
    mesh.visible = false
    helpers.push(mesh)
  }

  return helpers
}
