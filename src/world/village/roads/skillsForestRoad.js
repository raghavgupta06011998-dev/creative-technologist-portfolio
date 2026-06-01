import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════════════════
//  SKILLS FOREST ROAD — laterite trail with gravel_sand shoulder strips
// ═══════════════════════════════════════════════════════════════════════════
//
//  Builds THREE ribbons that all share the same CatmullRom centreline:
//    1. Main laterite road — full path, 18u wide
//    2. Left  gravel_sand shoulder — 2u strip just outside left road edge
//    3. Right gravel_sand shoulder — 2u strip just outside right road edge
//
//  Layout (perpendicular distance from road centreline):
//    0     – 9    laterite road surface       (walkable)
//    9     – 11   gravel_sand shoulder strip  (visual border, walkable)
//    11    – 12   forest terrain (small grass gap)
//    12           wooden picket fence         (skillsForestFence.js)
//    12    – 14   forest terrain
//    14    – 28   BUSH band                   (skillsForestTrees.js)
//    28    – 92   TREE band                   (skillsForestTrees.js)
//
//  ── Spatial reference ────────────────────────────────────────────────────
//    Bridge centre              z = −148
//    Bridge north foot          z ≈ −166
//    North cobblestone approach z = −174  (this road starts where that ends)
//    Road end (skills zone)     z ≈ −380
//
//  ── Quick-tune constants ─────────────────────────────────────────────────
//    ROAD_WIDTH     laterite width in world units
//    SHOULDER_WIDTH width of each gravel_sand side strip
//    ROAD_Y         elevation above terrain
//    TILE_LEN       UV cadence along path length
//    ROAD_SEGS      subdivisions — higher = smoother curves
//    LANE_PTS       CatmullRom waypoints (exported for fence reuse)
//    S_SWING        max X deviation at S-curve peaks
// ═══════════════════════════════════════════════════════════════════════════

const ROAD_WIDTH     = 18       // main laterite path
const SHOULDER_WIDTH = 2        // each gravel_sand side strip
const ROAD_Y         = 0.06     // above forest ground (0.025) and base terrain
const TILE_LEN       = 5        // tile cadence along the path
const ROAD_SEGS      = 200      // subdivisions — smooth across extended length
const S_SWING        = 10       // max X deviation at S-curve peaks

// ── Waypoints (south → north) ─────────────────────────────────────────────
//   Bridge exit → straight → S-curve → softer secondary drift → end.
//
//   Curve phases:
//     z=−174 → −192  straight exit off bridge
//     z=−192 → −230  lean LEFT, peak at −S_SWING at z≈−218
//     z=−230 → −268  return to centre, lean RIGHT, peak at +S_SWING at z≈−258
//     z=−268 → −312  ease back to centre
//     z=−312 → −350  softer drift (≈S_SWING/3) — natural meander
//     z=−350 → −380  straighten out and end deep in the forest
//
//   Exported so skillsForestFence + skillsForestTrees rebuild the SAME
//   curve when computing fence positions and tree-exclusion distances.
export const LANE_PTS = [
  [           0, -174 ],   // START — north end of bridge cobblestone approach
  [           0, -192 ],
  [ -S_SWING/2, -205 ],
  [ -S_SWING,   -218 ],
  [ -S_SWING/2, -230 ],
  [           0, -242 ],
  [  S_SWING/2, -255 ],
  [  S_SWING,   -268 ],
  [  S_SWING/2, -280 ],
  [           0, -294 ],
  [           0, -312 ],
  [  S_SWING/3, -325 ],
  [  S_SWING/3, -340 ],
  [           0, -358 ],
  [           0, -380 ],   // END
]

// ── Texture helpers (one set per surface) ────────────────────────────────
const _tex = new THREE.TextureLoader()

function loadTerrainTextures(base, fileName, repeatX = 2) {
  const diff  = _tex.load(`${base}/${fileName}_diffuse.jpg`)
  const nor   = _tex.load(`${base}/${fileName}_normal.jpg`)
  const rough = _tex.load(`${base}/${fileName}_roughness.jpg`)
  for (const t of [diff, nor, rough]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(repeatX, 1)
    t.anisotropy = 8
  }
  diff.colorSpace = THREE.SRGBColorSpace
  return { diff, nor, rough }
}

// ── Materials ─────────────────────────────────────────────────────────────
//   Each material is built lazily inside createSkillsForestRoad() so the
//   textures only fetch when the village world activates.
function makeLateriteMat() {
  const { diff, nor, rough } = loadTerrainTextures(
    '/assets/textures/terrain/laterite',
    'terrain',
    2,   // 2 repeats across an 18u-wide road = ~9u per tile
  )
  return new THREE.MeshStandardMaterial({
    map:          diff,
    normalMap:    nor,
    roughnessMap: rough,
    color:        0xc89a78,       // warm laterite tint
    roughness:    1.0,
    metalness:    0,
    side:         THREE.DoubleSide,
  })
}

function makeGravelMat() {
  const { diff, nor, rough } = loadTerrainTextures(
    '/assets/textures/terrain/gravel_sand',
    'terrain',
    1,   // 1 repeat across a narrow 2u strip = ~2u per tile (small gravel feel)
  )
  return new THREE.MeshStandardMaterial({
    map:          diff,
    normalMap:    nor,
    roughnessMap: rough,
    color:        0xd9c9a8,       // warm sandy tint — distinct from laterite
    roughness:    1.0,
    metalness:    0,
    side:         THREE.DoubleSide,
  })
}

// ── Generic ribbon builder ────────────────────────────────────────────────
//   Builds a planar ribbon following the CatmullRom curve of pts.
//   The ribbon's centreline can be offset perpendicular to the curve via
//   centerOffset — used to place gravel shoulders just outside the laterite.
//
//   opts: {
//     centerOffset = 0,    // perpendicular shift from curve centreline (units)
//                          // positive = LEFT (matches normal vector), negative = RIGHT
//     width        = 18,   // ribbon width
//     y            = 0.06, // elevation
//     renderOrder  = 2,    // draw order vs other ground layers
//     segments     = ROAD_SEGS,
//     tileLen      = TILE_LEN,
//   }
function buildRibbon(pts, mat, opts = {}) {
  const {
    centerOffset = 0,
    width        = ROAD_WIDTH,
    y            = ROAD_Y,
    renderOrder  = 2,
    segments     = ROAD_SEGS,
    tileLen      = TILE_LEN,
  } = opts

  const curve = new THREE.CatmullRomCurve3(
    pts.map(([x, z]) => new THREE.Vector3(x, 0, z)),
    false, 'catmullrom', 0.5
  )

  const pos = [], uv = [], idx = []
  let dist = 0, prev = null
  const hw = width * 0.5

  for (let i = 0; i <= segments; i++) {
    const t  = i / segments
    const c  = curve.getPointAt(t)
    const tg = curve.getTangentAt(t)
    const nx = -tg.z, nz = tg.x
    const nl = Math.hypot(nx, nz) || 1

    // Shift the local centre perpendicular to the tangent by centerOffset.
    const ccx = c.x + (nx / nl) * centerOffset
    const ccz = c.z + (nz / nl) * centerOffset

    // Left and right edges of the ribbon, perpendicular to tangent.
    const lx = ccx + (nx / nl) * hw,  lz = ccz + (nz / nl) * hw
    const rx = ccx - (nx / nl) * hw,  rz = ccz - (nz / nl) * hw

    if (prev) dist += c.distanceTo(prev)
    prev = c.clone()
    const v = dist / tileLen

    pos.push(lx, y, lz,  rx, y, rz)
    uv.push(0, v,  1, v)

    if (i < segments) {
      const a = i * 2
      idx.push(a, a + 1, a + 2,  a + 1, a + 3, a + 2)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uv, 2))
  geo.setIndex(idx)
  geo.computeVertexNormals()

  const mesh = new THREE.Mesh(geo, mat)
  mesh.receiveShadow = true
  mesh.renderOrder   = renderOrder
  return mesh
}

// ═══════════════════════════════════════════════════════════════════════════
export function createSkillsForestRoad(ctx) {
  // Shoulder centre = ROAD_WIDTH/2 + SHOULDER_WIDTH/2 → strip sits exactly
  // adjacent to the laterite road, no gap, no overlap.
  const SHOULDER_OFFSET = ROAD_WIDTH * 0.5 + SHOULDER_WIDTH * 0.5

  // Main laterite road (centred on the curve)
  const lateriteMat = makeLateriteMat()
  ctx.villageGroup.add(buildRibbon(LANE_PTS, lateriteMat, {
    centerOffset: 0,
    width:        ROAD_WIDTH,
    y:            ROAD_Y,
    renderOrder:  2,
  }))

  // Gravel_sand shoulder strips — shared material across both sides
  const gravelMat = makeGravelMat()

  // LEFT shoulder (positive centerOffset = LEFT side, following normal direction)
  ctx.villageGroup.add(buildRibbon(LANE_PTS, gravelMat, {
    centerOffset: +SHOULDER_OFFSET,
    width:        SHOULDER_WIDTH,
    y:            ROAD_Y,
    renderOrder:  2,
  }))

  // RIGHT shoulder
  ctx.villageGroup.add(buildRibbon(LANE_PTS, gravelMat, {
    centerOffset: -SHOULDER_OFFSET,
    width:        SHOULDER_WIDTH,
    y:            ROAD_Y,
    renderOrder:  2,
  }))
}
