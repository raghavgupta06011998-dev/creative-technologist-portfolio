import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════════════════
//  BACK STREET — dirt outer path connecting the village's outer zones
// ═══════════════════════════════════════════════════════════════════════════
//
//  A secondary, rural dirt path that arcs around the village OUTSIDE the
//  main cobblestone loop.  It gives the player a "service" route through
//  the planned outer zones (market → park → north junction → farm →
//  school) without forcing them through the residential ring.
//
//  Visually it is deliberately HUMBLE compared to the cobble main loop —
//  thinner, warm worn-dirt, no decorative shoulders.  The cobble loop is
//  the formal village street; the back street is a country footpath.
//
//   Material:    grass-path-2 with a warm worn-dirt tint
//   Width:       4u  (vs the 14u cobble loop)
//   y height:    0.045
//                  → above all terrain layers (green 0.02, worn 0.03,
//                    gravel shoulders 0.033–0.035, mud 0.04) so the
//                    path always reads on top of the ground
//                  → BELOW the cobble road (0.05) so the cobble wins
//                    cleanly at the north-road crossing → a natural
//                    rural T-junction with the onward road
//   renderOrder: −3  (between mud −5 and the cobble road's default 0)
//
//  Waypoints verified clear of:
//   • side houses (footprint half-extent ≈12u from house centres)
//   • main loop road (R 28–42)  • approach road (x≈0 ±7 corridor)
//   • outer rocks — notably the behind-house boulders at (±72,−72)
//     and (±54,−98)
//   • Step 2 market cluster centred (−32,−13)
//   • Step 3 farm barn footprint x [70.5,93.5], z [−97.5,−74.5]
//
//  The path PASSES the planned park (−78,−86), threads behind the back
//  side-houses at z≈−100, crosses the north cobble road at (0,−100),
//  loops past the farm on its west side, and curves back to the school
//  exit on the front-right.
// ═══════════════════════════════════════════════════════════════════════════

const BACK_Y     = 0.045
const BACK_RO    = -3
const BACK_WIDTH = 4
const TILE_LEN   = 7      // matches roads.js — same v-axis cadence

// ── Waypoints — front-left market exit → curves around → front-right school
const WAYPOINTS = [
  [ -35,  -5 ],   // 1  market exit  (front-left, in the lawn belt)
  [ -65, -20 ],   // 2  curve west-north through the belt
  [ -78, -50 ],   // 3  by the west side-houses
  [ -80, -80 ],   // 4  by the planned PARK
  [ -48,-100 ],   // 5  curve east, BEHIND house_06 (back-left)
  [   0,-100 ],   // 6  crosses the north cobble road  ← rural T-junction
  [  48,-100 ],   // 7  continue east, BEHIND house_07 (back-right)
  [  78, -78 ],   // 8  west of the FARM barn — clears its footprint
  [  80, -50 ],   // 9  east lawn belt
  [  65, -20 ],   // 10 curve east-south
  [  35,  -5 ],   // 11 school exit  (front-right, in the lawn belt)
]

// ── Texture loader (mirrors roads.js / terrain.js convention) ──────────────
const _tex = new THREE.TextureLoader()
const GP2  = '/assets/textures/terrain/grass-path-2'

function loadDirtTextures() {
  const diff  = _tex.load(`${GP2}/grass_path_2_diff_2k.jpg`)
  const nor   = _tex.load(`${GP2}/grass_path_2_nor_gl_2k.jpg`)
  const rough = _tex.load(`${GP2}/grass_path_2_rough_2k.jpg`)
  for (const t of [diff, nor, rough]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(1.5, 1)
    t.anisotropy = 8
  }
  diff.colorSpace = THREE.SRGBColorSpace
  return { diff, nor, rough }
}

function makeDirtMat() {
  const { diff, nor, rough } = loadDirtTextures()
  return new THREE.MeshStandardMaterial({
    map:          diff,
    normalMap:    nor,
    roughnessMap: rough,
    color:        0xa88c66,   // warm worn-dirt tan — clearly humble vs cobble
    roughness:    1,
    metalness:    0,
  })
}

// ── Ribbon-mesh path builder (same convention as roads.js buildPath) ───────
//   UVs:  u ∈ [0,1] across width  ·  v = distance / TILE_LEN along length
function buildDirtPath(points, width, mat, segments = 120) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(p => new THREE.Vector3(p[0], 0, p[1])),
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

    const lx = c.x + (nx / nl) * hw, lz = c.z + (nz / nl) * hw
    const rx = c.x - (nx / nl) * hw, rz = c.z - (nz / nl) * hw

    if (prev) dist += c.distanceTo(prev)
    prev = c.clone()
    const v = dist / TILE_LEN

    pos.push(lx, BACK_Y, lz, rx, BACK_Y, rz)
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
  mesh.renderOrder   = BACK_RO
  mesh.receiveShadow = true
  return mesh
}

// ═══════════════════════════════════════════════════════════════════════════
export function createBackStreet(ctx) {
  const mat = makeDirtMat()
  ctx.villageGroup.add(buildDirtPath(WAYPOINTS, BACK_WIDTH, mat))
}
