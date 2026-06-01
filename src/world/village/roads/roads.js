import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════════════════
//  ROAD SYSTEM — cobblestone village district
// ═══════════════════════════════════════════════════════════════════════════
//
//  Three-tier road hierarchy, all on the same cobblestone-02 material so
//  they read as one continuous village street network:
//
//   1. MAIN APPROACH STREET   spawn → circular district  (14u wide)
//   2. CIRCULAR DISTRICT LOOP ring around the hero estate (14u wide)
//   3. NORTH CONTINUATION     ring → forest depth         (12→14u)
//
//  Material:  /assets/textures/roads/cobblestone-02/  (diff + normal + rough)
//  UV convention (shared by ribbon paths AND ring):
//       u ∈ [0,1] spans road width (14u)
//       v          = distance along road / TILE_LEN (7u)
//  With texture .repeat = (4, 2) → ~3.5u square cobble tiles everywhere.
//
//  +Z = toward the player / spawn (south).  −Z = into the world (north).
//
//  Key positions (hero at z = −48):
//    Ring front face:  hz + RING_OUTER = −48 + 42 = −6
//    Ring back  face:  hz − RING_OUTER = −48 − 42 = −90
//    Hero fence edge:  R=26 inside ring inner (R=28) → 2u green strip
//    Side houses:      R=53–60 from hero, outside ring outer (R=42)
// ═══════════════════════════════════════════════════════════════════════════

export const WORLD = {
  SPAWN:  new THREE.Vector3(  0, 0,  10),
  HERO:   new THREE.Vector3(  0, 0, -48),
  BRIDGE: new THREE.Vector3(  2, 0, -130),
}

// ── Road geometry constants ────────────────────────────────────────────────
const PATH_Y     = 0.05       // slight lift over terrain to avoid z-fighting
const RING_INNER = 28
const RING_OUTER = 42
const APPROACH_W = 14
const TILE_LEN   = 7          // metres per UV unit along path length

// ── Texture loader ─────────────────────────────────────────────────────────
const _texLoader = new THREE.TextureLoader()
const _ROAD_TEX_BASE = '/assets/textures/roads/cobblestone-02'

function loadRoadTextures() {
  const diff  = _texLoader.load(`${_ROAD_TEX_BASE}/cobblestone_floor_02_diff_2k.jpg`)
  const nor   = _texLoader.load(`${_ROAD_TEX_BASE}/cobblestone_floor_02_nor_gl_2k.jpg`)
  const rough = _texLoader.load(`${_ROAD_TEX_BASE}/cobblestone_floor_02_rough_2k.jpg`)

  for (const t of [diff, nor, rough]) {
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.RepeatWrapping
    t.repeat.set(4, 2)         // ~3.5u square cobble tiles for 14u-wide road
    t.anisotropy = 8           // sharp at grazing angles
  }
  diff.colorSpace = THREE.SRGBColorSpace
  return { diff, nor, rough }
}

function makeRoadMat() {
  const { diff, nor, rough } = loadRoadTextures()
  return new THREE.MeshStandardMaterial({
    map:          diff,
    normalMap:    nor,
    roughnessMap: rough,
    color:        0xdcc7a0,   // warm tan tint — warms the cobblestone into a
                              // clear village path; also a visible fallback
                              // colour if the texture is slow / fails to load
    roughness:    1.0,
    metalness:    0,
  })
}

// ── Ribbon-mesh path builder ───────────────────────────────────────────────
//   UVs: u ∈ [0,1] across width, v = distance/TILE_LEN along length.
//   Combined with texture.repeat=(4,2) → ~3.5u square cobble tiles.
function buildPath(points, widthStart, widthEnd, mat, segments = 60) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(p => new THREE.Vector3(p[0], 0, p[1])),
    false, 'catmullrom', 0.5
  )
  const pos = [], uv = [], idx = []
  let dist = 0, prev = null

  for (let i = 0; i <= segments; i++) {
    const t  = i / segments
    const c  = curve.getPointAt(t)
    const tg = curve.getTangentAt(t)
    const nx = -tg.z, nz = tg.x
    const nl = Math.hypot(nx, nz) || 1
    const hw = THREE.MathUtils.lerp(widthStart, widthEnd, t) * 0.5

    const lx = c.x + (nx / nl) * hw, lz = c.z + (nz / nl) * hw
    const rx = c.x - (nx / nl) * hw, rz = c.z - (nz / nl) * hw

    if (prev) dist += c.distanceTo(prev)
    prev = c.clone()
    const v = dist / TILE_LEN

    pos.push(lx, PATH_Y, lz, rx, PATH_Y, rz)
    uv.push(0, v, 1, v)
    if (i < segments) {
      const a = i * 2
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uv, 2))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  const mesh = new THREE.Mesh(geo, mat)
  mesh.receiveShadow = true
  return mesh
}

// ── Ring road with proper tangential UVs ──────────────────────────────────
//   Same UV convention as ribbon paths so cobblestone tiles match in scale.
//   vMax is snapped to a half-integer so the wrap seam aligns cleanly with
//   the (4, 2) texture repeat — no visible discontinuity.
function buildRingRoad(cx, cz, innerR, outerR, mat, segments = 96) {
  const avgR         = (innerR + outerR) * 0.5
  const circumference = 2 * Math.PI * avgR
  const vMaxRaw      = circumference / TILE_LEN
  const vMax         = Math.round(vMaxRaw * 2) / 2   // align to half-tile

  const pos = [], uv = [], idx = []
  for (let i = 0; i <= segments; i++) {
    const t  = i / segments
    const a  = t * Math.PI * 2
    const sx = Math.sin(a), sz = Math.cos(a)
    const ix = cx + sx * innerR, iz = cz + sz * innerR    // inner edge
    const ox = cx + sx * outerR, oz = cz + sz * outerR    // outer edge
    const v  = t * vMax

    pos.push(ix, PATH_Y, iz, ox, PATH_Y, oz)
    uv.push(0, v, 1, v)

    if (i < segments) {
      const a0 = i * 2
      idx.push(a0, a0 + 1, a0 + 2, a0 + 1, a0 + 3, a0 + 2)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uv, 2))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  const mesh = new THREE.Mesh(geo, mat)
  mesh.receiveShadow = true
  return mesh
}

// ── Main export ────────────────────────────────────────────────────────────
export function createRoads(ctx) {
  const mat = makeRoadMat()
  const g   = ctx.villageGroup
  const hx  = WORLD.HERO.x
  const hz  = WORLD.HERO.z

  // 1 ─ main approach street: spawn → ring front ─────────────────────────────
  //
  //   Extended SOUTH well past the spawn (z=+10) so the player is clearly
  //   standing on the road from the moment they appear in the world.  The
  //   entrance starts as a path (11u) and gradually widens to the full
  //   village street width (14u) as it reaches the ring — a guided-journey
  //   feeling.  Soft S-curve so the road never looks like a straight strip.
  //
  //     z = +26   entrance from outside the world (16u behind spawn)
  //     z = +10   AT the player spawn
  //     z =  −6   blends into ring road front face
  //
  g.add(buildPath(
    [
      [  0.0,  26 ],                     // entrance well behind spawn — road clearly starts here
      [  0.2,  16 ],                     // gentle drift, passing the spawn point
      [  0.6,   6 ],                     // soft right curve mid-approach
      [ -0.5,  -1 ],                     // soft counter-curve — natural village feel
      [  0.0, hz + RING_OUTER ],         // z=−6, blends into ring road front
    ],
    11, APPROACH_W, mat, 80              // 11u → 14u (path widens into street)
  ))

  // 2 ─ circular district loop ───────────────────────────────────────────────
  g.add(buildRingRoad(hx, hz, RING_INNER, RING_OUTER, mat))

  // 3 ─ north continuation: ring back → northward ────────────────────────────
  g.add(buildPath(
    [
      [  0, hz - RING_OUTER ],           // z=−90, blends from ring back
      [  1, -102 ],
      [  2, -116 ],
      [  2, -130 ],
    ],
    APPROACH_W - 2, APPROACH_W, mat, 45
  ))

  ctx.worldLayout = WORLD
}
