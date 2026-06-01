import * as THREE from 'three'
import { loadGLBModel } from '../../../utils/loaders.js'
import { LANE_PTS } from '../roads/skillsForestRoad.js'
import { CLEARING_EXCLUSION_ZONES } from '../skills/skillClearings.js'

// ═══════════════════════════════════════════════════════════════════════════
//  SKILLS-FOREST TREES & BUSHES — individual mesh extraction
// ═══════════════════════════════════════════════════════════════════════════
//
//  WHY THIS REWRITE
//  ─────────────────────────────────────────────────────────────────────────
//    Previous version cloned the whole low_poly_forest_tree_pack.glb as a
//    single unit. The pack contains many tree+bush meshes at different
//    offsets from the pack origin, so random rotation per clone caused
//    individual trees to swing onto the road regardless of how far the
//    placement origin was pushed.
//
//    This version:
//      1. Loads the pack once.
//      2. Traverses the scene graph, collecting EVERY leaf mesh.
//      3. Bakes each mesh's pack-local transform into its own geometry
//         and re-centres it (XZ origin = mesh centre, base = y=0).
//      4. Classifies each baked mesh by height:
//             height > TREE_HEIGHT_THRESHOLD → tree pool
//             else                          → bush pool
//      5. Generates placements via rejection sampling against the road
//         curve — any candidate within EXCLUSION distance of the road
//         centreline is rejected and re-rolled.
//      6. Groups placements by which mesh they picked, then builds ONE
//         THREE.InstancedMesh per unique mesh used → ~5–10 draw calls.
//
//    Net result: no tree or bush can possibly land on the road, bridge,
//    or gravel shoulders.  Each placement is a single, controlled mesh.
//
//  CLEARANCE LAYOUT (perpendicular distance from road centreline)
//  ─────────────────────────────────────────────────────────────────────────
//        0   – 9    laterite road            (cleared)
//        9   – 11   gravel_sand shoulder     (cleared)
//        12         picket fence
//       14   – 90   BUSH band                (BUSH_EXCLUSION=13 from curve)
//       28   – 92   TREE band                (TREE_EXCLUSION=18 from curve)
//
//    Z range:  bushes/trees only between Z_START=−180 and Z_END=−380.
//    Bridge ends at z≈−166; cobblestone approach ends z=−174.  Z_START=−180
//    keeps everything 6u north of the laterite-road entry → bridge and
//    bridge exit are guaranteed clear.
//
//  ── Quick-tune constants ─────────────────────────────────────────────────
//    TREE_HEIGHT_THRESHOLD   meters — splits the pack into trees vs bushes
//    TREE_EXCLUSION          min distance from road curve for any tree
//    BUSH_EXCLUSION          min distance from road curve for any bush
//    NEAR_TREE_*             close-to-road tree layer (band, count, scale)
//    FAR_TREE_*              tall background tree layer
//    NEAR_BUSH_*             fence-line bush understory
//    MID_BUSH_*              filler bushes between near and far trees
// ═══════════════════════════════════════════════════════════════════════════

const PACK_GLB = '/assets/new assets/low_poly_forest_tree_pack.glb'

// ── Ground level (matches skillsForestTerrain) ────────────────────────────
const GROUND_Y = 0.025

// ── Z range ───────────────────────────────────────────────────────────────
//   Z_START = −180 keeps a 14u buffer past the bridge north foot (z≈−166)
//   and 6u past the laterite-road start (z=−174), so the bridge and
//   bridge-approach are fully clear.
const Z_START = -180
const Z_END   = -380

// ── LAYERED PLACEMENT BANDS — "Amazon-forest" density ────────────────────
//
//   Earlier versions used one tree band + one bush band, both spread across
//   a wide X range.  The result read as "scattered trees" from the road,
//   not "deep forest".  This version uses FOUR explicit layers per side:
//
//     1. NEAR BUSH  (|x| 14–30) — heavy ground cover just outside the fence
//                                  (200/side, scale 0.9–1.5 — visible foliage
//                                  at eye level from the road)
//     2. NEAR TREE  (|x| 28–55) — close tree wall, medium height
//                                  (120/side, scale 0.7–1.1)
//     3. MID BUSH   (|x| 28–70) — bushes mixed into the inner tree band
//                                  (150/side, scale 0.7–1.3 — fills gaps
//                                  between near and far trees)
//     4. FAR TREE   (|x| 55–95) — TALL background canopy that fills the
//                                  horizon  (150/side, scale 0.9–1.5)
//
//   Every layer reuses the same generatePlacements() helper and the same
//   curve-distance exclusion logic, so road/bridge/shoulders/fenced corridor
//   stay clear regardless of how many layers we stack.
//
//   Totals: 540 trees + 700 bushes = 1,240 placements per side-pair.
//
//   InstancedMesh keeps draw calls flat (~5–10) regardless of count.  The
//   only growing cost is GPU vertex throughput, which is light for these
//   low-poly meshes with castShadow=false.
// ═══════════════════════════════════════════════════════════════════════════

// ── Shared exclusion radii (unchanged from prior pass) ────────────────────
const TREE_EXCLUSION = 18    // metres from nearest road curve sample
const BUSH_EXCLUSION = 13    // metres from nearest road curve sample

// ── Layer 3: NEAR TREE (close to road / fence) ────────────────────────────
const NEAR_TREE_X_MIN     = 28
const NEAR_TREE_X_MAX     = 55
const NEAR_TREE_COUNT     = 120    // per side → 240 total
const NEAR_TREE_SCALE_MIN = 0.70
const NEAR_TREE_SCALE_MAX = 1.10

// ── Layer 4: FAR TREE (tall background canopy) ────────────────────────────
const FAR_TREE_X_MIN      = 55
const FAR_TREE_X_MAX      = 95
const FAR_TREE_COUNT      = 150    // per side → 300 total
const FAR_TREE_SCALE_MIN  = 0.90
const FAR_TREE_SCALE_MAX  = 1.50   // tall trees dominate the skyline

// ── Layer 1: NEAR BUSH (fence-line understory) ────────────────────────────
const NEAR_BUSH_X_MIN     = 14
const NEAR_BUSH_X_MAX     = 30
const NEAR_BUSH_COUNT     = 200    // per side → 400 total (heaviest layer)
const NEAR_BUSH_SCALE_MIN = 0.90
const NEAR_BUSH_SCALE_MAX = 1.50

// ── Layer 2: MID BUSH (filler between near + far) ─────────────────────────
const MID_BUSH_X_MIN      = 28
const MID_BUSH_X_MAX      = 70
const MID_BUSH_COUNT      = 150    // per side → 300 total
const MID_BUSH_SCALE_MIN  = 0.70
const MID_BUSH_SCALE_MAX  = 1.30

// ── Classification ────────────────────────────────────────────────────────
//   After baking each leaf mesh's pack-transform, anything taller than
//   TREE_HEIGHT_THRESHOLD becomes a tree; everything else is a bush.
//   The pack's actual heights are logged on load — adjust this value if
//   the split looks wrong in-game (try 3.0 to favour bushes, 5.0 trees).
const TREE_HEIGHT_THRESHOLD = 4.0

// ── Collision (trees only; bushes are walk-through) ───────────────────────
const TREE_COLLIDER_R = 2.0

// ── Deterministic PRNG (Mulberry32) ──────────────────────────────────────
function mkRng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return (((t ^ (t >>> 14)) >>> 0) / 4294967296)
  }
}
const rng = mkRng(20260601)

// ── Road curve samples for exclusion checks ──────────────────────────────
//   200 evenly spaced points along the same CatmullRom curve the road uses.
//   distToRoadCurve(x, z) returns min distance from (x, z) to any sample —
//   used to reject placements that would land too close to the road.
const ROAD_SAMPLES = (() => {
  const curve = new THREE.CatmullRomCurve3(
    LANE_PTS.map(([x, z]) => new THREE.Vector3(x, 0, z)),
    false, 'catmullrom', 0.5
  )
  const out = []
  for (let i = 0; i <= 200; i++) {
    const p = curve.getPointAt(i / 200)
    out.push({ x: p.x, z: p.z })
  }
  return out
})()

function distToRoadCurve(x, z) {
  let minSq = Infinity
  for (const s of ROAD_SAMPLES) {
    const dx = x - s.x, dz = z - s.z
    const d = dx * dx + dz * dz
    if (d < minSq) minSq = d
  }
  return Math.sqrt(minSq)
}

// ── Clearing membership check ────────────────────────────────────────────
//   Returns true if (x, z) falls inside ANY clearing exclusion zone.
//   Skill clearings are open spaces for hand-placed content — pool-placed
//   trees and bushes must avoid them.  Imported from skillClearings.js so
//   adding/removing clearings is a single-file change.
function isInClearing(x, z) {
  for (const c of CLEARING_EXCLUSION_ZONES) {
    const dx = x - c.x
    const dz = z - c.z
    if (dx * dx + dz * dz < c.r * c.r) return true
  }
  return false
}

// ── Placement generator ──────────────────────────────────────────────────
//   For each side (left = −1, right = +1), keep rolling random positions
//   until we accumulate countPerSide valid ones or hit the attempt cap.
//   A valid position is one whose distance to the road curve is ≥ exclusion.
function generatePlacements(countPerSide, xMin, xMax, exclusion, scaleMin, scaleMax) {
  const list = []
  for (const side of [-1, +1]) {
    let placed = 0
    let attempt = 0
    const cap = countPerSide * 40   // generous budget — rejection ratio is low
    while (placed < countPerSide && attempt < cap) {
      const x = side * (xMin + rng() * (xMax - xMin))
      const z = Z_START + rng() * (Z_END - Z_START)
      // Accept ONLY if outside the road exclusion zone AND outside all
      // skill clearings.  Clearings carve open pockets in the forest where
      // hand-placed content sits.
      if (distToRoadCurve(x, z) >= exclusion && !isInClearing(x, z)) {
        list.push({
          x, z,
          scale: scaleMin + rng() * (scaleMax - scaleMin),
          rotY:  rng() * Math.PI * 2,
        })
        placed++
      }
      attempt++
    }
  }
  return list
}

// ── Build layered placement lists ─────────────────────────────────────────
//   Each call returns positions for BOTH sides of the road.  Combining
//   multiple layers gives the deep, immersive forest read.

// TREES = near layer + far layer
const TREE_PLACEMENTS = [
  ...generatePlacements(
    NEAR_TREE_COUNT,
    NEAR_TREE_X_MIN, NEAR_TREE_X_MAX,
    TREE_EXCLUSION,
    NEAR_TREE_SCALE_MIN, NEAR_TREE_SCALE_MAX,
  ),
  ...generatePlacements(
    FAR_TREE_COUNT,
    FAR_TREE_X_MIN, FAR_TREE_X_MAX,
    TREE_EXCLUSION,
    FAR_TREE_SCALE_MIN, FAR_TREE_SCALE_MAX,
  ),
]

// BUSHES = near (fence-line) + mid (filler)
const BUSH_PLACEMENTS = [
  ...generatePlacements(
    NEAR_BUSH_COUNT,
    NEAR_BUSH_X_MIN, NEAR_BUSH_X_MAX,
    BUSH_EXCLUSION,
    NEAR_BUSH_SCALE_MIN, NEAR_BUSH_SCALE_MAX,
  ),
  ...generatePlacements(
    MID_BUSH_COUNT,
    MID_BUSH_X_MIN, MID_BUSH_X_MAX,
    BUSH_EXCLUSION,
    MID_BUSH_SCALE_MIN, MID_BUSH_SCALE_MAX,
  ),
]

// ── Collision exports ─────────────────────────────────────────────────────
//   collision.js imports TREE_POSITIONS and TREE_COLLIDER_RADIUS.
//   Only trees export colliders — bushes are walkable.
export const TREE_POSITIONS = TREE_PLACEMENTS.map(p => ({ x: p.x, z: p.z }))
export const TREE_COLLIDER_RADIUS = TREE_COLLIDER_R

// ═══════════════════════════════════════════════════════════════════════════
export function createSkillsForestTrees(ctx) {
  loadGLBModel(
    ctx.scene,
    PACK_GLB,
    [0, 0, 0],
    1,
    0,
    {
      addToScene:  false,
      center:      false,
      groundAlign: false,
      onLoad: (template) => extractAndPlace(ctx, template),
    },
  )
}

// ── Mesh extraction + placement pipeline ─────────────────────────────────
function extractAndPlace(ctx, template) {
  // Update world matrices so each leaf mesh's matrixWorld is the full
  // transform from the loaded scene root → that mesh.
  template.updateMatrixWorld(true)

  // Build per-mesh "standalone" entries: each has its OWN geometry whose
  // vertices have the pack-local transform baked in and are re-centred
  // (XZ origin at mesh centre, base at y=0).  This lets us place each
  // mesh anywhere in the world without inheriting any pack offsets.
  const treePool = []
  const bushPool = []
  const heightLog = []

  template.traverse((c) => {
    if (!c.isMesh) return

    // Bake matrixWorld into a fresh cloned geometry.
    const geo = c.geometry.clone()
    geo.applyMatrix4(c.matrixWorld)
    geo.computeBoundingBox()

    // Re-centre: shift verts so XZ centre = (0,0,0) and base = y=0.
    const b  = geo.boundingBox
    const cx = (b.min.x + b.max.x) * 0.5
    const cz = (b.min.z + b.max.z) * 0.5
    const my = b.min.y
    geo.applyMatrix4(new THREE.Matrix4().makeTranslation(-cx, -my, -cz))
    geo.computeBoundingBox()
    geo.computeBoundingSphere()

    const height = geo.boundingBox.max.y - geo.boundingBox.min.y
    heightLog.push(height.toFixed(2))

    const entry = {
      geometry: geo,
      material: c.material,   // shared, never cloned
      height,
    }
    if (height > TREE_HEIGHT_THRESHOLD) treePool.push(entry)
    else                                bushPool.push(entry)
  })

  console.log(
    `[skillsForestTrees] pack analysis — ` +
    `${treePool.length} tree meshes (h > ${TREE_HEIGHT_THRESHOLD}), ` +
    `${bushPool.length} bush meshes, ` +
    `all heights: [${heightLog.join(', ')}]`,
  )

  if (treePool.length === 0) {
    console.warn('[skillsForestTrees] no tree meshes — lower TREE_HEIGHT_THRESHOLD')
  }
  if (bushPool.length === 0) {
    console.warn('[skillsForestTrees] no bush meshes — raise TREE_HEIGHT_THRESHOLD')
  }

  buildInstancedGroups(ctx, TREE_PLACEMENTS, treePool, 'trees')
  buildInstancedGroups(ctx, BUSH_PLACEMENTS, bushPool, 'bushes')
}

// ── Group placements by chosen mesh, build one InstancedMesh per group ───
function buildInstancedGroups(ctx, placements, pool, label) {
  if (pool.length === 0 || placements.length === 0) return

  // Assign each placement to a random mesh from the pool, bucketing them.
  const groups = new Map()   // poolIdx → [placements]
  for (const p of placements) {
    const idx = Math.floor(rng() * pool.length)
    if (!groups.has(idx)) groups.set(idx, [])
    groups.get(idx).push(p)
  }

  const dummy = new THREE.Object3D()
  let drawCalls = 0

  for (const [poolIdx, plist] of groups) {
    const { geometry, material } = pool[poolIdx]

    const inst = new THREE.InstancedMesh(geometry, material, plist.length)
    inst.castShadow    = false
    inst.receiveShadow = true

    for (let i = 0; i < plist.length; i++) {
      const p = plist[i]
      // geometry is already centred with base at y=0 → place at GROUND_Y.
      dummy.position.set(p.x, GROUND_Y, p.z)
      dummy.rotation.set(0, p.rotY, 0)
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
    }
    inst.instanceMatrix.needsUpdate = true
    inst.computeBoundingSphere?.()

    ctx.villageGroup.add(inst)
    drawCalls++
  }

  console.log(
    `[skillsForestTrees] ${label} — ${placements.length} placements, ` +
    `${drawCalls} InstancedMesh draw calls`,
  )
}
