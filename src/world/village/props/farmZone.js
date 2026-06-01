import * as THREE from 'three'
import { placeAsset } from '../utils/assetLoader.js'

// ═══════════════════════════════════════════════════════════════════════════
//  FARM ZONE — dedicated farmland on the RIGHT side of the village
// ═══════════════════════════════════════════════════════════════════════════
//
//  Location: BACK-RIGHT outer area (player's RIGHT looking into the village).
//  Layout:
//    • Back row (north):   barn at (82,−86) · silo at (68,−80)
//    • Service yard:       storage drums + milk tank at z=−70..−72
//    • Big pasture (south of yard, larger than first pass):
//        centre (80,−58)   size 22 × 14 units
//        fence around full perimeter
//        2 cows grazing INSIDE the pasture
//    • The back-street already loops past (80,−50) — that waypoint is
//      directly south of the new pasture, so the right-side back-street
//      naturally leads the player to the farm.  No road changes needed.
//
//  REMOVED in this pass (performance + design):
//    • horse at (75,−67) → was the 9 MB animals/horse.glb; appeared loose
//      outside any enclosure.  Removing it saves the biggest download in
//      the scene and keeps animals only inside the pasture.
//
//  Performance summary:
//    • Pasture: ONE PlaneGeometry mesh (single draw call)
//    • Fence:   10 clones of the cached kn_fence_planks (no extra download)
//    • Cows:    cow.gltf (3 MB) downloaded once, cloned for the 2nd instance
//    • No new heavy farm buildings added — the existing barn already covers
//      the "farm building" requirement and farmbuilding_04+ are 800+ KB each
// ═══════════════════════════════════════════════════════════════════════════

// ── Scales (retuned for the GLB native sizes) ─────────────────────────────
const SCALE_BARN      = 1.2    // barn ≈23u wide — matches the side houses
const SCALE_SILO      = 0.95   // silo ≈11.5u tall — vertical landmark
const SCALE_BARREL    = 1.85
const SCALE_MILKTANK  = 1.9
const SCALE_BENCH     = 1.3
const FENCE_SCALE     = 2.6
const SCALE_FARMSTRUC = 1.0    // small farm structures aligned along back lane

// ── Pasture geometry constants ────────────────────────────────────────────
const FARM_CX = 80      // pasture centre X (player's right)
const FARM_CZ = -58     // pasture centre Z (south of the storage yard)
const FARM_W  = 22      // east-west size (big farmland)
const FARM_D  = 14      // north-south size

// ── Farmland soil constants ───────────────────────────────────────────────
//   Left of the north approach road (road centre x=0, edge x=−7).
//   Sits between the left back lane terminus (−55,−90) and the bridge
//   approach start (z=−122), directly "behind" the hero house.
const SOIL_CX   = -32    // centre X — clear of north road
const SOIL_CZ   = -105   // centre Z — between house backs and bridge
const SOIL_W    = 30     // east-west span
const SOIL_D    = 22     // north-south span

// ═══════════════════════════════════════════════════════════════════════════
export function createFarmZone(ctx) {
  // ── 0a. Left-side farm buildings — along the left back lane ───────────────
  //   Both sit just west of the left back lane (which passes through −72,−45),
  //   mirroring the relationship side houses have with the main loop road.
  //   Front facades face east (Math.PI/2) toward the lane and village centre.
  //
  //   farmbuilding_04 (wider gambrel barn + attached shed wing) — first building
  //     along the lane heading north, paired with the market zone at the front.
  //     Clearance: 19u from house_03 (−57,−36); 30u from pp_village_market (−48,−18).
  placeAsset(ctx, 'farmbuilding_04', -75, 0, -30, 1.2, Math.PI * 0.5)

  //   farmbuilding_03 (compact 2-story gambrel barn) — second building,
  //     deeper along the lane. 22u south of farmbuilding_04.
  //     Clearance: 27u from house_03 (−57,−36); 23u from house_01 (−58,−64).
  placeAsset(ctx, 'farmbuilding_03', -78, 0, -52, 1.2, Math.PI * 0.5)

  // ── 0b. Back-corner farm buildings ────────────────────────────────────────
  //   Left-back: farmbuilding_05 (red barn + open shed) at (−72, −88)
  placeAsset(ctx, 'farmbuilding_05', -72, 0, -88, 1.2, Math.PI * 0.5)

  //   Right-back: farmbuilding_08 (large red barn + attached section) at (76, −72)
  placeAsset(ctx, 'farmbuilding_08',  76, 0, -72, 1.2, Math.PI)

  // ── 1. Back row: barn + silo ────────────────────────────────────────────
  placeAsset(ctx, 'farmbuilding_02',  82, 0, -86, SCALE_BARN, 2.4)
  placeAsset(ctx, 'farmstructure_23', 68, 0, -80, SCALE_SILO, 0)

  // ── 1b. Front row: 2 small farm structures aligned ALONG the right
  //         back lane (lane runs through (62,−20) → (70,−36) → (70,−50)).
  //         Sit EAST of the lane, ~12 u from the lane curve — same
  //         relationship that side houses have with the main loop road.
  //         Both face WEST (toward the lane), so their fronts read as the
  //         player walks the lane.
  //         Clearances:  ≥13 u from any house centre; ≥9 u from lane.
  placeAsset(ctx, 'farmstructure_22', 78, 0, -30, SCALE_FARMSTRUC,  Math.PI)
  placeAsset(ctx, 'farmstructure_26', 82, 0, -42, SCALE_FARMSTRUC,  Math.PI)

  // ── 2. Service yard (between barn row and pasture) ─────────────────────
  placeAsset(ctx, 'barrel_a',   80, 0, -73, SCALE_BARREL,   0.3)
  placeAsset(ctx, 'barrel_a',   83, 0, -74, SCALE_BARREL,   1.1)
  placeAsset(ctx, 'milktank_a', 78, 0, -72, SCALE_MILKTANK, 0.6)

  // ── 3. Farmland plot — single brown earth plane ────────────────────────
  const soilGeo = new THREE.PlaneGeometry(FARM_W, FARM_D)
  const soilMat = new THREE.MeshStandardMaterial({
    color:     0x6b4a2f,
    roughness: 0.98,
    metalness: 0,
  })
  const soil = new THREE.Mesh(soilGeo, soilMat)
  soil.rotation.x    = -Math.PI / 2
  soil.position.set(FARM_CX, 0.045, FARM_CZ)
  soil.receiveShadow = true
  ctx.villageGroup.add(soil)

  // ── 3b. Farmland soil patch — behind the hero house ────────────────────
  //   Left of the north road (road edge x=−7), between house backs and the
  //   bridge approach.  One draw call, no fence yet — open space for future
  //   crops, animals, and fencing.
  const backSoilGeo = new THREE.PlaneGeometry(SOIL_W, SOIL_D)
  const backSoilMat = new THREE.MeshStandardMaterial({
    color:     0x6b4a2f,   // same warm brown as the pasture soil
    roughness: 0.98,
    metalness: 0,
  })
  const backSoil = new THREE.Mesh(backSoilGeo, backSoilMat)
  backSoil.rotation.x    = -Math.PI / 2
  backSoil.position.set(SOIL_CX, 0.045, SOIL_CZ)
  backSoil.receiveShadow = true
  ctx.villageGroup.add(backSoil)

  // ── 4. Fence perimeter around the pasture (10 clones) ──────────────────
  //   Long sides (north/south): 3 segments each, spaced ≈7u apart
  //   Short sides (east/west):  2 segments each
  const fW = FARM_W / 2   // 11
  const fD = FARM_D / 2   // 7

  // South side (toward village ring road) — z = FARM_CZ + fD = −51
  placeAsset(ctx, 'kn_fence_planks', FARM_CX - 7, 0, FARM_CZ + fD, FENCE_SCALE, 0)
  placeAsset(ctx, 'kn_fence_planks', FARM_CX,     0, FARM_CZ + fD, FENCE_SCALE, 0)
  placeAsset(ctx, 'kn_fence_planks', FARM_CX + 7, 0, FARM_CZ + fD, FENCE_SCALE, 0)

  // North side (toward barn yard) — z = FARM_CZ − fD = −65
  placeAsset(ctx, 'kn_fence_planks', FARM_CX - 7, 0, FARM_CZ - fD, FENCE_SCALE, 0)
  placeAsset(ctx, 'kn_fence_planks', FARM_CX,     0, FARM_CZ - fD, FENCE_SCALE, 0)
  placeAsset(ctx, 'kn_fence_planks', FARM_CX + 7, 0, FARM_CZ - fD, FENCE_SCALE, 0)

  // East side — x = FARM_CX + fW = 91 (rotated 90°)
  placeAsset(ctx, 'kn_fence_planks', FARM_CX + fW, 0, FARM_CZ - 3.5, FENCE_SCALE, Math.PI / 2)
  placeAsset(ctx, 'kn_fence_planks', FARM_CX + fW, 0, FARM_CZ + 3.5, FENCE_SCALE, Math.PI / 2)

  // West side — x = FARM_CX − fW = 69 (rotated 90°)
  placeAsset(ctx, 'kn_fence_planks', FARM_CX - fW, 0, FARM_CZ - 3.5, FENCE_SCALE, Math.PI / 2)
  placeAsset(ctx, 'kn_fence_planks', FARM_CX - fW, 0, FARM_CZ + 3.5, FENCE_SCALE, Math.PI / 2)

  // ── 5. Viewing bench by the south fence (outside the pasture) ──────────
  placeAsset(ctx, 'bench_a', FARM_CX, 0, FARM_CZ + fD + 2.5, SCALE_BENCH, Math.PI)
}
