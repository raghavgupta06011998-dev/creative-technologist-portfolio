import { placeAsset } from '../utils/assetLoader.js'

// ═══════════════════════════════════════════════════════════════════════════
//  VILLAGE PROPS — detail layer, FIRST PASS (major functional props)
// ═══════════════════════════════════════════════════════════════════════════
//
//  The first pass of the village detail layer.  Only the FUNCTIONAL props
//  that make the village navigable and lived-in — no clutter:
//
//   • Streetlights   line the approach road and ring the loop road, so the
//                    route reads clearly (spawn → hero → village).
//   • Signs          directional posts at the two key decision points.
//   • Benches        rest spots at the entrance + calm lawn-belt viewpoints.
//   • Barrels/buckets light "storage corner" dressing beside side houses.
//
//  The market zone and farm zone are deliberately NOT in this pass — they
//  are full zone-builds and belong in their own focused step.
//
//  Coordinate facts (hero at 0,−48):
//    Approach road  z +26 → −6, x≈0, ~12u wide
//    Loop road      R 28–42 around hero
//    Lawn belt      R 42–53      Side houses R 53–60
//    North road     z −90 → −130
// ═══════════════════════════════════════════════════════════════════════════

const HERO_X = 0
const HERO_Z = -48
const DEG = d => d * Math.PI / 180

// ring position: angle a° clockwise from north of the hero, radius R
function ring(aDeg, R) {
  const a = DEG(aDeg)
  return { x: HERO_X + Math.sin(a) * R, z: HERO_Z - Math.cos(a) * R }
}

// ── Streetlights — approach road ───────────────────────────────────────────
//   Flank the approach road (x≈0, ~12u wide) just outside its edge at x=±9.
//   Three pairs down the route → a lit, welcoming main street.
const APPROACH_LIGHTS = [
  { x: -9, z:  20, ry:  Math.PI / 2 },
  { x:  9, z:  20, ry: -Math.PI / 2 },
  { x: -9, z:   8, ry:  Math.PI / 2 },
  { x:  9, z:   8, ry: -Math.PI / 2 },
  { x: -9, z:  -4, ry:  Math.PI / 2 },
  { x:  9, z:  -4, ry: -Math.PI / 2 },
]

// ── Streetlights — loop road ───────────────────────────────────────────────
//   Six evenly spaced just outside the cobblestone loop (R=45, road is
//   R28–42) → the central district reads as one lit ring.
const LOOP_LIGHT_ANGLES = [30, 90, 150, 210, 270, 330]

// ── Signs — directional posts at decision points ───────────────────────────
const SIGNS = [
  // where the approach road opens into the loop — guides into the village
  { key: 'streetsign_04', x: 12, z:  -3, ry: -0.45 },
  // where the loop's back meets the north road — points to the path ahead
  { key: 'streetsign_04', x:  9, z: -86, ry:  0.20 },
]

// ── Benches — rest spots at calm/social places ─────────────────────────────
//   Original 4 (entrance pair + lawn-belt pair) kept as-is.
//   8 new benches — one in front of each side house, facing inward (toward
//   hero).  Position = 6 u toward hero along the house→hero unit vector.
//   Rotation = house facing angle (they face the same direction as the house,
//   so the bench faces inward toward the road/hero).
const BENCHES = [
  // ── original 4 ────────────────────────────────────────────────────────
  { key: 'bench_b', x: -14,   z:  17,    ry:  Math.PI / 2 },  // entrance, left
  { key: 'bench_b', x:  14,   z:  17,    ry: -Math.PI / 2 },  // entrance, right
  { key: 'bench_a', x: -44,   z: -48,    ry:  Math.PI / 2 },  // west lawn-belt
  { key: 'bench_a', x:  44,   z: -48,    ry: -Math.PI / 2 },  // east lawn-belt

  // ── one per side house (placed ~6 u in front, facing toward hero) ─────
  // house_07  (41.4, −82.7)  back-right   ry = −0.873
  { key: 'bench_a', x:  36.8, z: -78.8,  ry: -0.873 },
  // house_12  (57.9, −63.5)  right        ry = −1.309
  { key: 'bench_a', x:  51.1, z: -61.7,  ry: -1.309 },
  // house_15  (56.7, −35.9)  front-right  ry = −1.780
  { key: 'bench_a', x:  50.8, z: -37.2,  ry: -1.780 },
  // house_10  (42.3, −16.1)  near-front-right ry = −2.218
  { key: 'bench_a', x:  37.5, z: -19.7,  ry: -2.218 },
  // house_16  (−42.3, −16.1) near-front-left  ry = +2.218
  { key: 'bench_a', x: -37.5, z: -19.7,  ry:  2.218 },
  // house_03  (−56.7, −35.9) front-left   ry = +1.780
  { key: 'bench_a', x: -50.8, z: -37.2,  ry:  1.780 },
  // house_01  (−57.9, −63.5) left         ry = +1.309
  { key: 'bench_a', x: -51.1, z: -61.7,  ry:  1.309 },
  // house_06  (−41.4, −82.7) back-left    ry = +0.873
  { key: 'bench_a', x: -36.8, z: -78.8,  ry:  0.873 },
]

// ── Barrel + bucket clusters — "storage corners" beside side houses ────────
//   In the lawn belt next to four side houses, on the loop-facing side so
//   they read from the road.  Wood barrel (village charm) + wooden bucket.
const STORAGE_SPOTS = [
  { x:  49, z: -66 },   // beside house_12 (right)
  { x: -49, z: -66 },   // beside house_01 (left)
  { x:  49, z: -34 },   // beside house_15 (right)
  { x: -49, z: -34 },   // beside house_03 (left)
]

// ── Scales — tuned to the village (player ≈2u, side houses scale 1.25) ─────
//   Asset native heights: streetlight ≈1.9u · sign ≈1.9u · bench ≈1.0–1.3u
//   barrel ≈0.7u · bucket ≈0.45u — so they need scaling up to read.
const SCALE_STREETLIGHT = 2.5    // → ≈4.8u tall lamp post
const SCALE_SIGN        = 2.0    // → ≈3.8u tall signpost
const SCALE_BENCH       = 1.3    // → ≈1.8u long bench
const SCALE_BARREL      = 1.85   // → ≈1.3u tall barrel
const SCALE_BUCKET      = 1.6    // → ≈0.7u tall bucket

// ═══════════════════════════════════════════════════════════════════════════
export function createVillageProps(ctx) {
  // 1 ─ streetlights along the approach road (diagonal-arm lamp) ────────────
  for (const L of APPROACH_LIGHTS) {
    placeAsset(ctx, 'streetlight_01', L.x, 0, L.z, SCALE_STREETLIGHT, L.ry)
  }

  // 2 ─ streetlights ringing the loop road (upright lamp) ───────────────────
  for (const a of LOOP_LIGHT_ANGLES) {
    const p = ring(a, 45)
    placeAsset(ctx, 'streetlight_04', p.x, 0, p.z, SCALE_STREETLIGHT, 0)
  }

  // 3 ─ directional signs at decision points ────────────────────────────────
  for (const S of SIGNS) {
    placeAsset(ctx, S.key, S.x, 0, S.z, SCALE_SIGN, S.ry)
  }

  // 4 ─ benches at calm / social spots ──────────────────────────────────────
  for (const B of BENCHES) {
    placeAsset(ctx, B.key, B.x, 0, B.z, SCALE_BENCH, B.ry)
  }

  // 5 ─ barrel + bucket storage clusters beside houses ──────────────────────
  for (const S of STORAGE_SPOTS) {
    placeAsset(ctx, 'barrel_b', S.x,        0, S.z,        SCALE_BARREL, 0.0)
    placeAsset(ctx, 'bucket_a', S.x + 2.2,  0, S.z + 1.4,  SCALE_BUCKET, 0.6)
  }
}
