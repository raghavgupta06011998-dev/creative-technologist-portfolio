import * as THREE from 'three'
import { LANE_PTS } from '../roads/skillsForestRoad.js'

// ═══════════════════════════════════════════════════════════════════════════
//  SKILLS-FOREST FENCE — procedural brown picket fence along the road curve
// ═══════════════════════════════════════════════════════════════════════════
//
//  Style: MATCHES THE HERO HOUSE FENCE EXACTLY.
//    Same wood colour (0x6b3f1c saddle brown), same material settings,
//    same per-panel construction (post + top rail + bottom rail + 5 pickets),
//    same piece dimensions.  See heroHouse.js → buildWoodFence().
//    The only difference is the layout: instead of a ring around the hero
//    house, panels follow the forest road's CatmullRom curve.
//
//  Rendering strategy:
//    THREE.InstancedMesh per piece type (posts / rails / pickets) — three
//    draw calls total regardless of fence length.
//    Per-instance matrices encode position + Y-rotation + (for rails)
//    Z-scale to match the local chord length between two samples.
//
//  Curve following:
//    Imports LANE_PTS from skillsForestRoad and rebuilds the SAME
//    CatmullRomCurve3 the road uses.  Samples N points and filters to
//    samples past the bridge cutoff (z ≤ Z_GAP_AFTER_BRIDGE). For each
//    kept sample, places LEFT + RIGHT posts offset by FENCE_OFFSET.
//    Between adjacent same-side posts, places rails + pickets.
//
//  No hard collision — fence is visual framing.  Trees behind the fence
//  provide soft circle-collider resistance if the player wanders.
//
//  ── Quick-tune constants ─────────────────────────────────────────────────
//    FENCE_OFFSET             lateral distance from road centre (each side)
//    N_SAMPLES                curve subdivisions → post count per side
//    Z_GAP_AFTER_BRIDGE       south cutoff — no fence below this z
// ═══════════════════════════════════════════════════════════════════════════

// ── Palette (copied verbatim from heroHouse buildWoodFence) ──────────────
const WOOD_COLOR = 0x6b3f1c           // rich saddle brown

// ── Piece dimensions (copied verbatim) ────────────────────────────────────
const POST_W      = 0.30
const POST_H      = 1.60
const RAIL_T      = 0.14
const TOP_RAIL_Y  = 1.20
const BOT_RAIL_Y  = 0.45
const PICKET_W    = 0.12
const PICKET_H    = 1.45
const PICKET_T    = 0.06
const N_PICKETS   = 5

// ── Layout ────────────────────────────────────────────────────────────────
//   FENCE_OFFSET 12u: road half-width is 9u, so 3u of clear grass between
//   road edge and fence post.  Outside-fence empty buffer extends to the
//   tree band at |x|=28 → 16u of forest-floor space behind the fence.
const FENCE_OFFSET       = 12
const N_SAMPLES          = 60       // post-pair count along the curve
const Z_GAP_AFTER_BRIDGE = -180     // south cutoff (bridge north foot ≈ -166)

// ═══════════════════════════════════════════════════════════════════════════
export function createSkillsForestFence(ctx) {
  // ── Shared material (single allocation, shared across all instances) ───
  const mat = new THREE.MeshStandardMaterial({
    color:     WOOD_COLOR,
    roughness: 0.92,
    metalness: 0,
  })

  // ── Rebuild the same road curve the road geometry uses ────────────────
  const curve = new THREE.CatmullRomCurve3(
    LANE_PTS.map(([x, z]) => new THREE.Vector3(x, 0, z)),
    false,
    'catmullrom',
    0.5
  )

  // ── Sample curve, filter past bridge ──────────────────────────────────
  //   Each kept entry produces ONE left post and ONE right post.
  const samples = []
  for (let i = 0; i <= N_SAMPLES; i++) {
    const t  = i / N_SAMPLES
    const p  = curve.getPointAt(t)
    if (p.z > Z_GAP_AFTER_BRIDGE) continue   // skip — still on bridge area

    const tg = curve.getTangentAt(t)
    const nx = -tg.z, nz = tg.x
    const nl = Math.hypot(nx, nz) || 1

    samples.push({
      lx: p.x + (nx / nl) * FENCE_OFFSET,
      lz: p.z + (nz / nl) * FENCE_OFFSET,
      rx: p.x - (nx / nl) * FENCE_OFFSET,
      rz: p.z - (nz / nl) * FENCE_OFFSET,
    })
  }

  if (samples.length < 2) {
    console.warn('[skillsForestFence] not enough samples past bridge — check Z_GAP_AFTER_BRIDGE')
    return
  }

  // ── Counts ────────────────────────────────────────────────────────────
  const N_PANELS    = samples.length - 1            // panels between consecutive same-side samples
  const N_POSTS     = samples.length * 2            // left + right post per sample
  const N_RAILS     = N_PANELS * 2 * 2              // (top + bot) × (left + right)
  const N_PICKET_IM = N_PANELS * 2 * N_PICKETS      // pickets × (left + right)

  // ── Geometries (unit length on Z for rails so we can scale-Z per-panel) ─
  const postGeo   = new THREE.BoxGeometry(POST_W,   POST_H,   POST_W)
  const railGeo   = new THREE.BoxGeometry(RAIL_T,   RAIL_T,   1.0)     // length set per-instance via scale.z
  const picketGeo = new THREE.BoxGeometry(PICKET_T, PICKET_H, PICKET_W)

  // ── InstancedMesh allocations ─────────────────────────────────────────
  const postMesh   = new THREE.InstancedMesh(postGeo,   mat, N_POSTS)
  const railMesh   = new THREE.InstancedMesh(railGeo,   mat, N_RAILS)
  const picketMesh = new THREE.InstancedMesh(picketGeo, mat, N_PICKET_IM)

  // Shadows: cast disabled (sun shadow pass off scene-wide), receive on.
  for (const m of [postMesh, railMesh, picketMesh]) {
    m.castShadow    = false
    m.receiveShadow = true
  }

  const dummy = new THREE.Object3D()

  // ── 1. Posts ──────────────────────────────────────────────────────────
  let postIdx = 0
  for (const s of samples) {
    // LEFT post
    dummy.position.set(s.lx, POST_H * 0.5, s.lz)
    dummy.rotation.set(0, 0, 0)
    dummy.scale.set(1, 1, 1)
    dummy.updateMatrix()
    postMesh.setMatrixAt(postIdx++, dummy.matrix)

    // RIGHT post
    dummy.position.set(s.rx, POST_H * 0.5, s.rz)
    dummy.updateMatrix()
    postMesh.setMatrixAt(postIdx++, dummy.matrix)
  }
  postMesh.instanceMatrix.needsUpdate = true

  // ── 2. Rails + pickets per panel (both sides) ─────────────────────────
  let railIdx = 0
  let picketIdx = 0

  for (let i = 0; i < N_PANELS; i++) {
    const a = samples[i]
    const b = samples[i + 1]

    // LEFT side panel between a.l and b.l
    fillPanel(dummy, railMesh, picketMesh, a.lx, a.lz, b.lx, b.lz, (idx) => {
      railIdx   = idx.rail
      picketIdx = idx.picket
    }, { rail: railIdx, picket: picketIdx })

    // RIGHT side panel between a.r and b.r
    fillPanel(dummy, railMesh, picketMesh, a.rx, a.rz, b.rx, b.rz, (idx) => {
      railIdx   = idx.rail
      picketIdx = idx.picket
    }, { rail: railIdx, picket: picketIdx })
  }

  railMesh.instanceMatrix.needsUpdate   = true
  picketMesh.instanceMatrix.needsUpdate = true

  // ── Bounding spheres so frustum culling works correctly ───────────────
  postMesh.computeBoundingSphere?.()
  railMesh.computeBoundingSphere?.()
  picketMesh.computeBoundingSphere?.()

  ctx.villageGroup.add(postMesh, railMesh, picketMesh)

  console.log(
    `[skillsForestFence] procedural brown fence — ${samples.length} sample pairs, ` +
    `${N_POSTS} posts + ${N_RAILS} rails + ${N_PICKET_IM} pickets = 3 draw calls total`
  )
}

// ── Per-panel filler: 2 rails (top + bot) + N_PICKETS pickets between A and B
function fillPanel(dummy, railMesh, picketMesh, ax, az, bx, bz, writeBack, idx) {
  const mx = (ax + bx) * 0.5
  const mz = (az + bz) * 0.5
  const dx = bx - ax
  const dz = bz - az
  const chordLen = Math.hypot(dx, dz)
  const ry = Math.atan2(dx, dz)   // matches heroHouse convention: local +Z aligns with chord

  // ── Top rail ────────────────────────────────────────────────────────
  dummy.position.set(mx, TOP_RAIL_Y, mz)
  dummy.rotation.set(0, ry, 0)
  dummy.scale.set(1, 1, chordLen)     // stretch unit Z to chord length
  dummy.updateMatrix()
  railMesh.setMatrixAt(idx.rail++, dummy.matrix)

  // ── Bottom rail ─────────────────────────────────────────────────────
  dummy.position.set(mx, BOT_RAIL_Y, mz)
  dummy.updateMatrix()
  railMesh.setMatrixAt(idx.rail++, dummy.matrix)

  // ── Pickets (5 evenly spaced) ────────────────────────────────────────
  const dirX = dx / chordLen
  const dirZ = dz / chordLen
  const usable = chordLen - POST_W - 0.04
  const step = usable / (N_PICKETS + 1)
  dummy.scale.set(1, 1, 1)
  for (let k = 1; k <= N_PICKETS; k++) {
    const t  = -usable * 0.5 + step * k
    const wx = mx + dirX * t
    const wz = mz + dirZ * t
    dummy.position.set(wx, PICKET_H * 0.5, wz)
    dummy.rotation.set(0, ry, 0)
    dummy.updateMatrix()
    picketMesh.setMatrixAt(idx.picket++, dummy.matrix)
  }

  writeBack(idx)
}
