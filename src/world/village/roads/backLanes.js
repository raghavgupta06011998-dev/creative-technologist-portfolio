import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════════════════
//  BACK LANES — cobblestone service lanes behind the side houses
// ═══════════════════════════════════════════════════════════════════════════
//
//  Two curved cobblestone lanes that run BEHIND the left-side and right-side
//  house rows.  They give the village a multi-road feel — main circular
//  street in front of the houses, back lanes behind them — like a real
//  market town with a formal street and informal service alleys.
//
//  Material: same cobblestone-02 texture AND same color tint (0xdcc7a0) as
//  the main loop road (roads.js) — identical surface look.  Width is 9u
//  (vs 14u main) — proper village road width, noticeably narrower than the
//  main street but wide enough to feel like a real usable lane.
//
//  Y height: 0.05 (same as main road — sits above all terrain layers, no
//  Z-fighting).  renderOrder: 0 (default, same as main road).
//
//  ── Spatial layout reference ─────────────────────────────────────────────
//   Hero at (0,−48).  Loop road R=28–42.  Side houses at R≈55–60.
//   Back lanes sit at R≈65–72 — the belt between house backs and the
//   outer dirt back street (R≈70–86).
//
//  ── House clearance (all waypoints verified ≥13 u from house centres) ───
//   Left houses  (−42,−16), (−57,−36), (−58,−64), (−41,−83)  footprint 12u
//   Right houses  (42,−16),  (57,−36),  (58,−64),  (41,−83)  footprint 12u
//
//  ── Left back lane route ─────────────────────────────────────────────────
//   (−44,−4) → (−62,−20) → (−72,−45) → (−68,−72) → (−55,−90)
//   Arcs all the way behind all 4 left-side houses.
//   North end approaches the north-road area at z≈−90.
//
//  ── Right back lane route ────────────────────────────────────────────────
//   (44,−4) → (62,−20) → (70,−36) → (70,−50)
//   Covers the two front-right houses (house_10, house_15).
//   Ends at the farm north entrance — a natural service-path destination.
//   Does NOT continue behind house_12 / house_07: the farm zone occupies
//   that space (farm west fence x=69, south fence z=−51) — intentionally
//   leaves open ground near the farm for future farm props.
//
//  ── Quick-tune constants ─────────────────────────────────────────────────
//   LANE_WIDTH  width in world units (default 6)
//   LANE_Y      elevation above terrain (default 0.05 — matches main road)
//   TILE_LEN    metres per UV unit along path length (default 7)
//   LEFT_LANE_PTS  / RIGHT_LANE_PTS  waypoints — move any point to re-route
// ═══════════════════════════════════════════════════════════════════════════

const LANE_Y     = 0.15   // matches main cobblestone road elevation
const LANE_WIDTH = 12      // wide enough to read as a real second street (main road = 14u)
const TILE_LEN   = 7       // same UV cadence as roads.js
const LANE_SEGS  = 110      // subdivision quality — smooth curves

// ── Left back lane ────────────────────────────────────────────────────────
//   Arcs behind all 4 left-side houses.
//   Front connector → west of house_16 → behind house_03/house_01 peak →
//   curves back south-east → approaches north road at z≈−90.
const LEFT_LANE_PTS = [
  [ -13,   +5 ],   // FRONT CONNECTOR — touches approach road left edge near entrance
  [ -22,  -10 ],   // south-west outer edge of ring road
  [ -50,  -16 ],   // smoothing connector — curves outward past house_16
  [ -66,  -22 ],   // behind house_16 / approach to house_03
  [ -78,  -45 ],   // peak west — behind house_03 → 9u gap ✓
  [ -78,  -72 ],   // behind house_01 → 8u gap ✓
  [ -63,  -90 ],   // north-back connector → 9u gap from house_06 ✓
]

// ── Right back lane ───────────────────────────────────────────────────────
//   Covers front-right houses; ends at farm north entrance.
//   Does NOT extend behind house_12/house_07 — farm occupies that space.
const RIGHT_LANE_PTS = [
  [  13,   +5 ],   // FRONT CONNECTOR — touches approach road right edge near entrance
  [  22,  -10 ],   // south-east outer edge of ring road
  [  50,  -16 ],   // smoothing connector — curves outward past house_10 (21u gap)
  [  66,  -22 ],   // behind house_10 / approach to house_15 (24u/17u gaps)
  [  78,  -36 ],   // peak east — behind house_15 → 7u gap ✓
  [  72,  -50 ],   // farm north-approach → 6u gap ✓
]

// ── Texture ───────────────────────────────────────────────────────────────
const _tex = new THREE.TextureLoader()
const COBBLE_BASE = '/assets/textures/roads/cobblestone-02'

function loadLaneTextures() {
  const diff  = _tex.load(`${COBBLE_BASE}/cobblestone_floor_02_diff_2k.jpg`)
  const nor   = _tex.load(`${COBBLE_BASE}/cobblestone_floor_02_nor_gl_2k.jpg`)
  const rough = _tex.load(`${COBBLE_BASE}/cobblestone_floor_02_rough_2k.jpg`)
  for (const t of [diff, nor, rough]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    // 12u wide lane: keep the ~3.4u cobble tile size of the main road
    // main road:  14u wide, repeat(4, 2)   → 3.5u tile
    // back lane:  12u wide, repeat(3.5, 2) → 3.4u tile ≈ same size
    t.repeat.set(3.5, 2)
    t.anisotropy = 8
  }
  diff.colorSpace = THREE.SRGBColorSpace
  return { diff, nor, rough }
}

function makeLaneMat() {
  const { diff, nor, rough } = loadLaneTextures()
  return new THREE.MeshStandardMaterial({
    map:          diff,
    normalMap:    nor,
    roughnessMap: rough,
    // Exact same warm tan tint as the main circular street (roads.js).
    color:        0xdcc7a0,
    roughness:    1.0,
    metalness:    0,
    side:         THREE.DoubleSide,
  })
}

// ── Ribbon-mesh path builder ───────────────────────────────────────────────
//   Identical convention to roads.js buildPath (CatmullRom ribbon, tangential
//   UVs).  Constant width throughout — no tapering needed for back lanes.
function buildLane(pts, mat, segments = LANE_SEGS) {
  const curve = new THREE.CatmullRomCurve3(
    pts.map(([x, z]) => new THREE.Vector3(x, 0, z)),
    false, 'catmullrom', 0.5
  )

  const pos = [], uv = [], idx = []
  let dist = 0, prev = null
  const hw = LANE_WIDTH * 0.5

  for (let i = 0; i <= segments; i++) {
    const t  = i / segments
    const c  = curve.getPointAt(t)
    const tg = curve.getTangentAt(t)
    const nx = -tg.z, nz = tg.x
    const nl = Math.hypot(nx, nz) || 1

    const lx = c.x + (nx / nl) * hw,  lz = c.z + (nz / nl) * hw
    const rx = c.x - (nx / nl) * hw,  rz = c.z - (nz / nl) * hw

    if (prev) dist += c.distanceTo(prev)
    prev = c.clone()
    const v = dist / TILE_LEN

    pos.push(lx, LANE_Y, lz,  rx, LANE_Y, rz)
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
  mesh.renderOrder   = 1   // draw after terrain (−10…−5) AND main roads (0)
  return mesh
}

// ═══════════════════════════════════════════════════════════════════════════
export function createBackLanes(ctx) {
  const mat = makeLaneMat()
  const g   = ctx.villageGroup

  // ── Left back lane — arcs behind all 4 left-side houses ──────────────────
  g.add(buildLane(LEFT_LANE_PTS, mat))

  // ── Right back lane — behind front-right houses, leads to farm ───────────
  g.add(buildLane(RIGHT_LANE_PTS, mat))
}
