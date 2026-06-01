import * as THREE from 'three'
import { placeAsset } from '../utils/assetLoader.js'
import { WORLD } from '../roads/roads.js'

// ═══════════════════════════════════════════════════════════════════════════
//  HERO HOUSE — house_11, dominant centre of the village
// ═══════════════════════════════════════════════════════════════════════════
//
//  house_11 sits centred in a large circular lawn.  A brown picket fence
//  rings the property near the road edge, with thick brown gate pillars
//  flanking the open entrance toward the player.
//
//  Convention: angle 0 = south (+Z, toward spawn).  Angles increase CW.
//
//  Layout (from centre outward):
//    house_11      at (HERO.x, HERO.z)  — scale 1.55, ~10u footprint radius
//    garden zone   10–26u from hero     — future trees, flowers, paths
//    FENCE_R = 26  property boundary    — 2u inside road inner edge (R=28)
//    RING_INNER=28 ring road edge
// ═══════════════════════════════════════════════════════════════════════════

const HERO = WORLD.HERO               // (0, 0, −48)

// ── House ─────────────────────────────────────────────────────────────────
const HOUSE_KEY = 'house_11'
const HOUSE_S   = 1.55                // landmark scale — visually dominant
const HOUSE_ROT = 0                   // faces +Z (toward spawn)

// ── Fence yard ────────────────────────────────────────────────────────────
//   R=26 sits 2u inside the ring road inner edge (RING_INNER=28).
//   This gives ~16u of garden space between the house and the fence,
//   and a thin green strip between fence and road surface.
const FENCE_R = 26

// ── Garden ────────────────────────────────────────────────────────────────
//   All detailing offsets are dx/dz from HERO; world = HERO + (dx, dz).
const GARDEN = [
  { k: 'kn_flower_red',       dx: -4.0, dz:  9.5 },
  { k: 'kn_flower_yellow',    dx:  4.0, dz:  9.5 },
  { k: 'kn_plant_bush',       dx: -8.5, dz:  6.0 },
  { k: 'kn_plant_bush',       dx:  8.5, dz:  6.0 },
  { k: 'kn_flower_purple',    dx: -7.0, dz: -6.0 },
  { k: 'kn_flower_purple',    dx:  7.0, dz: -6.0 },
  { k: 'kn_plant_bush_small', dx: -11,  dz:  0.0 },
  { k: 'kn_plant_bush_small', dx:  11,  dz:  0.0 },
]

// ── Hero-house detailing — subtle dressing only ───────────────────────────
//   Bushes hugging the inside of the fence (R≈23, gate front kept clear).
const FENCE_BUSHES = [
  { k: 'kn_plant_bush',       dx:  17.6, dz:  14.8 },
  { k: 'kn_plant_bush_small', dx:  22.9, dz:  -2.0 },
  { k: 'kn_plant_bush',       dx:  13.2, dz: -18.8 },
  { k: 'kn_plant_bush',       dx: -17.6, dz:  14.8 },
  { k: 'kn_plant_bush_small', dx: -22.9, dz:  -2.0 },
  { k: 'kn_plant_bush',       dx: -13.2, dz: -18.8 },
]

//   Two small trees flanking the house sides — kept tiny, never overpower it.
const FRONT_TREES = [
  { k: 'apple',  dx: -15, dz: 4, s: 0.50 },
  { k: 'cherry', dx:  15, dz: 4, s: 0.50 },
]

//   Flowers lining the front stepping-stone path.
const PATH_FLOWERS = [
  { k: 'kn_flower_red',    dx: -2.6, dz: 21 },
  { k: 'kn_flower_yellow', dx:  2.6, dz: 21 },
  { k: 'kn_flower_purple', dx: -2.6, dz: 17 },
  { k: 'kn_flower_red',    dx:  2.6, dz: 17 },
  { k: 'kn_flower_yellow', dx: -2.6, dz: 13 },
  { k: 'kn_flower_purple', dx:  2.6, dz: 13 },
]

//   Lanterns flanking the start of the front path, just inside the gate.
const PATH_LAMPS = [
  { dx: -3.2, dz: 24 },
  { dx:  3.2, dz: 24 },
]

// ── Glow lights ────────────────────────────────────────────────────────────
//   Gate post positions are passed in so the warm lantern lights sit on top
//   of the brown gate pillars rather than at hard-coded offsets.
function addGlow(ctx, gateL, gateR) {
  // interior house glow
  const interior = new THREE.PointLight(0xff8c2a, 3.0, 30)
  interior.position.set(HERO.x, 6, HERO.z + 1)
  ctx.scene.add(interior)

  // lantern lights on gate pillars
  if (gateL) {
    const lampL = new THREE.PointLight(0xffa040, 2.0, 20)
    lampL.position.set(gateL.x, 2.8, gateL.z)
    ctx.scene.add(lampL)
  }
  if (gateR) {
    const lampR = new THREE.PointLight(0xffa040, 2.0, 20)
    lampR.position.set(gateR.x, 2.8, gateR.z)
    ctx.scene.add(lampR)
  }
}

// ── Brown wooden picket fence with gate pillars (procedural) ───────────────
//
//  Fence anatomy per panel (between two adjacent posts):
//    • 1 vertical post at each end  (0.30 × 1.60 × 0.30)
//    • 1 top rail + 1 bottom rail   (chord-length along Z after rotation)
//    • 5 vertical pickets            (evenly spaced between posts)
//
//  Gate-adjacent posts are replaced with taller, thicker brown pillars with
//  a decorative cap — matching the reference image.
//
//  Rotation: ry = atan2(dx, dz)  →  local +Z aligns with chord direction.
//  Rail / picket geometries put their length axis on Z.
//
//  Returns { gateL, gateR } — world positions of the two gate pillars
//  so lights can be placed on top.
//
function buildWoodFence(ctx) {
  // ── palette ────────────────────────────────────────────────────────────
  const WOOD_COLOR = 0x6b3f1c           // rich saddle brown
  const mat = new THREE.MeshStandardMaterial({
    color:     WOOD_COLOR,
    roughness: 0.92,
    metalness: 0,
  })

  // ── panel layout ───────────────────────────────────────────────────────
  const N_PANELS  = 32
  const GATE_HALF = 1                   // skip slots within 1 of slot 0
  //   → 3 slots skipped (31, 0, 1)
  //   → gate arc = 3/32 · 360° = 33.75°
  //   → entrance width at R=26: ≈ 15.3 u (slightly wider than 14u road)

  // ── fence piece dimensions ─────────────────────────────────────────────
  const POST_W      = 0.30
  const POST_H      = 1.60
  const RAIL_T      = 0.14              // square cross-section
  const TOP_RAIL_Y  = 1.20
  const BOT_RAIL_Y  = 0.45
  const PICKET_W    = 0.12              // face width (along chord)
  const PICKET_H    = 1.45              // pokes above top rail
  const PICKET_T    = 0.06              // thickness (perpendicular to chord)
  const N_PICKETS   = 5

  // ── gate pillar dimensions ─────────────────────────────────────────────
  const GPILLAR_W   = 0.55              // chunky square pillar
  const GPILLAR_H   = 2.10              // taller than fence → landmark
  const GCAP_W      = 0.68              // cap overhang
  const GCAP_H      = 0.12

  // ── shared geometry ────────────────────────────────────────────────────
  const chord = 2 * FENCE_R * Math.sin(Math.PI / N_PANELS)   // ≈ 5.10 u

  const postGeo    = new THREE.BoxGeometry(POST_W,    POST_H,    POST_W)
  const railGeo    = new THREE.BoxGeometry(RAIL_T,    RAIL_T,    chord)
  const picketGeo  = new THREE.BoxGeometry(PICKET_T,  PICKET_H,  PICKET_W)
  const gPillarGeo = new THREE.BoxGeometry(GPILLAR_W, GPILLAR_H, GPILLAR_W)
  const gCapGeo    = new THREE.BoxGeometry(GCAP_W,    GCAP_H,    GCAP_W)

  const cx = HERO.x, cz = HERO.z
  const group = new THREE.Group()

  // ── helpers ────────────────────────────────────────────────────────────
  function postPos(i) {
    const a = (i / N_PANELS) * Math.PI * 2   // i=0 → south (+Z)
    return { px: cx + Math.sin(a) * FENCE_R, pz: cz + Math.cos(a) * FENCE_R }
  }
  function isGateSlot(i) {
    return Math.min(i, N_PANELS - i) <= GATE_HALF
  }
  function isGateAdjacent(i) {
    const prev = (i - 1 + N_PANELS) % N_PANELS
    const next = (i + 1) % N_PANELS
    return isGateSlot(prev) || isGateSlot(next)
  }

  // ── collect active posts ───────────────────────────────────────────────
  const active = []
  for (let i = 0; i < N_PANELS; i++) {
    if (!isGateSlot(i)) active.push(i)
  }

  // ── place posts (regular + gate pillars) ───────────────────────────────
  let gateL = null, gateR = null

  for (const i of active) {
    const { px, pz } = postPos(i)

    if (isGateAdjacent(i)) {
      // ── gate pillar (taller, thicker, capped) ──────────────────────────
      const pillar = new THREE.Mesh(gPillarGeo, mat)
      pillar.position.set(px, GPILLAR_H * 0.5, pz)
      pillar.castShadow    = true
      pillar.receiveShadow = true
      group.add(pillar)

      const cap = new THREE.Mesh(gCapGeo, mat)
      cap.position.set(px, GPILLAR_H + GCAP_H * 0.5, pz)
      cap.castShadow = true
      group.add(cap)

      // record positions for lantern lights
      if (px < cx) gateL = { x: px, z: pz }
      else         gateR = { x: px, z: pz }
    } else {
      // ── regular fence post ─────────────────────────────────────────────
      const post = new THREE.Mesh(postGeo, mat)
      post.position.set(px, POST_H * 0.5, pz)
      post.castShadow    = true
      post.receiveShadow = true
      group.add(post)
    }
  }

  // ── panels (rails + pickets) between adjacent active posts ─────────────
  for (let j = 0; j < active.length; j++) {
    const iA = active[j]
    const iB = active[(j + 1) % active.length]
    const slotGap = ((iB - iA) + N_PANELS) % N_PANELS
    if (slotGap !== 1) continue          // straddles gate → no panel

    const A = postPos(iA), B = postPos(iB)
    const mx = (A.px + B.px) * 0.5
    const mz = (A.pz + B.pz) * 0.5
    const dx = B.px - A.px, dz = B.pz - A.pz
    const ry = Math.atan2(dx, dz)        // local +Z → chord direction

    // top rail
    const topRail = new THREE.Mesh(railGeo, mat)
    topRail.position.set(mx, TOP_RAIL_Y, mz)
    topRail.rotation.y = ry
    topRail.castShadow    = true
    topRail.receiveShadow = true
    group.add(topRail)

    // bottom rail
    const botRail = new THREE.Mesh(railGeo, mat)
    botRail.position.set(mx, BOT_RAIL_Y, mz)
    botRail.rotation.y = ry
    botRail.castShadow    = true
    botRail.receiveShadow = true
    group.add(botRail)

    // pickets
    const chordLen = Math.hypot(dx, dz)
    const dirX     = dx / chordLen
    const dirZ     = dz / chordLen
    const usable   = chordLen - POST_W - 0.04
    const step     = usable / (N_PICKETS + 1)
    for (let k = 1; k <= N_PICKETS; k++) {
      const t  = -usable * 0.5 + step * k
      const wx = mx + dirX * t
      const wz = mz + dirZ * t
      const picket = new THREE.Mesh(picketGeo, mat)
      picket.position.set(wx, PICKET_H * 0.5, wz)
      picket.rotation.y = ry
      picket.castShadow    = true
      picket.receiveShadow = true
      group.add(picket)
    }
  }

  ctx.villageGroup.add(group)
  return { gateL, gateR }
}

// ── Front stepping-stone path: gate → house entrance ──────────────────────
//   A clean single-file run of flat stones from just inside the gate up to
//   the house porch.  Slight x-jitter + random rotation keeps it natural.
function buildFrontPath(ctx) {
  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x9b9088, roughness: 1.0, metalness: 0,
  })
  const stoneGeo = new THREE.CylinderGeometry(0.82, 0.88, 0.14, 14)

  const START_DZ = 24       // just inside the gate
  const END_DZ   = 11       // house entrance / porch
  const N_STONES = 7
  const group = new THREE.Group()

  for (let i = 0; i < N_STONES; i++) {
    const t  = i / (N_STONES - 1)
    const dz = START_DZ + (END_DZ - START_DZ) * t
    const jitterX = (i % 2 === 0 ? 0.3 : -0.3)
    const stone = new THREE.Mesh(stoneGeo, stoneMat)
    stone.position.set(HERO.x + jitterX, 0.08, HERO.z + dz)
    stone.rotation.y    = (i * 1.7) % Math.PI
    stone.receiveShadow = true
    stone.castShadow    = true
    group.add(stone)
  }
  ctx.villageGroup.add(group)
}

// ── "My Journey" signboard near the front of the estate ───────────────────
function buildJourneySign(ctx) {
  const w = 440, h = 224
  const canvas = document.createElement('canvas')
  canvas.width  = w
  canvas.height = h
  const c = canvas.getContext('2d')

  // wood background with subtle grain
  c.fillStyle = '#5a3318'
  c.fillRect(0, 0, w, h)
  for (let i = 0; i < 16; i++) {
    const y = (i / 16) * h
    c.strokeStyle = `rgba(28,14,4,${0.08 + Math.random() * 0.08})`
    c.lineWidth   = 1 + Math.random() * 2
    c.beginPath(); c.moveTo(0, y); c.lineTo(w, y + (Math.random() - 0.5) * 8); c.stroke()
  }
  // light border
  c.strokeStyle = '#e8c98f'; c.lineWidth = 6
  c.strokeRect(9, 9, w - 18, h - 18)

  // text
  c.textAlign = 'center'; c.textBaseline = 'middle'
  c.fillStyle = '#f5deb3'
  c.font = 'bold 54px serif'
  c.fillText('MY JOURNEY', w / 2, h * 0.40)
  c.fillStyle = '#d8b878'
  c.font = 'italic 26px serif'
  c.fillText('The Beginning', w / 2, h * 0.71)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace

  // board — left of the front path, facing the player (+Z)
  const sx = HERO.x - 7.5
  const sz = HERO.z + 23
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(4.6, 2.0, 0.18),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, metalness: 0, side: THREE.DoubleSide })
  )
  board.position.set(sx, 2.4, sz)
  board.castShadow = true

  // poles
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x5a3318, roughness: 0.9 })
  const poleGeo = new THREE.CylinderGeometry(0.1, 0.12, 3.4, 8)
  const pL = new THREE.Mesh(poleGeo, poleMat); pL.position.set(sx - 1.9, 1.7, sz); pL.castShadow = true
  const pR = new THREE.Mesh(poleGeo, poleMat); pR.position.set(sx + 1.9, 1.7, sz); pR.castShadow = true

  ctx.villageGroup.add(board, pL, pR)
}

// ── Main export ───────────────────────────────────────────────────────────
export function createHeroHouse(ctx) {
  // hero house
  placeAsset(ctx, HOUSE_KEY, HERO.x, 0, HERO.z, HOUSE_S, HOUSE_ROT)

  // fence ring + brown gate pillars (returns pillar positions)
  const { gateL, gateR } = buildWoodFence(ctx)

  // front stepping-stone path: gate → house entrance
  buildFrontPath(ctx)

  // "My Journey" signboard near the front
  buildJourneySign(ctx)

  // garden flowers & bushes
  for (const p of GARDEN) {
    placeAsset(ctx, p.k, HERO.x + p.dx, 0, HERO.z + p.dz, 0.75, 0)
  }
  // bushes hugging the inner fence
  for (const b of FENCE_BUSHES) {
    placeAsset(ctx, b.k, HERO.x + b.dx, 0, HERO.z + b.dz, 0.72, 0)
  }
  // small trees flanking the house
  for (const t of FRONT_TREES) {
    placeAsset(ctx, t.k, HERO.x + t.dx, 0, HERO.z + t.dz, t.s, 0)
  }
  // flowers lining the front path
  for (const f of PATH_FLOWERS) {
    placeAsset(ctx, f.k, HERO.x + f.dx, 0, HERO.z + f.dz, 0.70, 0)
  }
  // lanterns flanking the path start
  for (const l of PATH_LAMPS) {
    placeAsset(ctx, 'kft_lantern', HERO.x + l.dx, 0, HERO.z + l.dz, 1.1, 0)
  }

  // interior + gate lantern lights
  addGlow(ctx, gateL, gateR)
}
