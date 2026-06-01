import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════════════════
//  TERRAIN — natural mixed village ground
// ═══════════════════════════════════════════════════════════════════════════
//
//  The village floor is NOT one clean green plane.  It is a layered mix of
//  lawn, worn trampled ground, mud and gravel so it reads as a lived-in
//  place, not a stage.
//
//  IMPORTANT texture note:
//    grass-path-2 is a grey-brown WORN DIRT-PATH texture (sparse grass
//    tufts on gravelly earth) — it is NOT a green lawn.  So:
//      • GREEN LAWN  = solid green colour, NO texture maps.  (A
//                      MeshStandardMaterial with normal/roughness maps
//                      but no diffuse map renders wrong — it browned the
//                      lawn — so the lawn is intentionally map-free.)
//                      Variation comes from 8 overlapping organic circles
//                      in two green shades + the worn/mud discs cut in.
//      • WORN GROUND = grass-path-2 full texture — its real look, perfect
//                      for trampled paths and entrances.
//      • GRAVEL      = gravel_sand — dry transition + outer terrain.
//      • MUD         = brown-mud — small high-traffic accents.
//
//  LAYERING — the layers are nearly coplanar, so correct stacking is
//  forced with explicit renderOrder (NOT just tiny Y offsets — near-equal
//  depths make the depth test draw-order dependent).  All terrain uses
//  NEGATIVE renderOrder so it always draws before (under) the roads.
//
//   renderOrder  y       layer
//    −10         0.000   Green base   full 900×900   → ctx.groundMesh
//    −9          0.010   Gravel base  full 900×900   → dry default
//    −8          0.020   Green lawn   organic circles, two green shades
//    −7          0.030   Worn ground  grass-path-2 discs
//    −6          0.033   Gravel shoulders — road ↔ ground blend
//    −5          0.040   Mud patches  brown-mud discs
//
//  Cobblestone roads (roads.js) keep the default renderOrder 0 → they
//  always render on top of every terrain layer.
//
//  Key landmarks (hero at z=−48):
//    Spawn z=+10 · Hero gate z=−22 · Fence R=26 · Loop road R=28–42
//    Side houses R=53–60 · Background trees z=−112…−136
// ═══════════════════════════════════════════════════════════════════════════

const HERO_X = 0
const HERO_Z = -48

// renderOrder per layer — terrain stays negative, roads keep 0
const RO_GRAVEL_BASE = -9
const RO_LAWN        = -8
const RO_WORN        = -7
const RO_SHOULDER    = -6
const RO_MUD         = -5

// ── Texture path roots ─────────────────────────────────────────────────────
const GP2 = '/assets/textures/terrain/grass-path-2'
const GRV = '/assets/textures/terrain/gravel_sand'
const MUD = '/assets/textures/terrain/brown-mud'

// ── Loaders / helpers ──────────────────────────────────────────────────────
const _loader = new THREE.TextureLoader()

function loadTex(path, rx, ry, srgb = true) {
  const t = _loader.load(path)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(rx, ry)
  t.anisotropy = 8
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  return t
}

function mkMat({ diff = null, nor = null, rough = null, color = 0xffffff, roughness = 1 } = {}) {
  return new THREE.MeshStandardMaterial({
    map:          diff,
    normalMap:    nor,
    roughnessMap: rough,
    color,
    roughness,
    metalness:    0,
  })
}

// flat rectangle (w×d in X×Z), centred at (x,y,z)
function rect(w, d, x, y, z, mat, ro) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat)
  m.rotation.x  = -Math.PI / 2
  m.position.set(x, y, z)
  m.renderOrder = ro
  m.receiveShadow = true
  return m
}

// flat circular patch — organic blob outline
function disc(r, x, y, z, mat, ro) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 40), mat)
  m.rotation.x  = -Math.PI / 2
  m.position.set(x, y, z)
  m.renderOrder = ro
  m.receiveShadow = true
  return m
}

// flat ring (annulus) — soft shoulder around the loop road
function annulus(ir, or, x, y, z, mat, ro) {
  const m = new THREE.Mesh(new THREE.RingGeometry(ir, or, 84), mat)
  m.rotation.x  = -Math.PI / 2
  m.position.set(x, y, z)
  m.renderOrder = ro
  m.receiveShadow = true
  return m
}

// ═══════════════════════════════════════════════════════════════════════════
//  PATCH LAYOUT DATA
// ═══════════════════════════════════════════════════════════════════════════

// ── Green lawn — overlapping circles compose one organic grassy mass ───────
//   [x, z, radius, shade]  shade 0/1 picks one of two green tints so the
//   lawn has gentle colour variation instead of one flat green.
const GREEN_CIRCLES = [
  [   0, -48, 42, 0 ],   // hero core — the estate lawn
  [   0,   6, 32, 1 ],   // spawn / approach greenery
  [ -50, -46, 38, 1 ],   // left houses lawn belt
  [  50, -46, 38, 0 ],   // right houses lawn belt
  [   0, -90, 36, 0 ],   // behind hero — back lawn
  [ -28, -18, 24, 0 ],   // connects spawn green ↔ left belt
  [  28, -18, 24, 1 ],   // connects spawn green ↔ right belt
  [   0, -66, 30, 1 ],   // fills hero ↔ back gap
]

// ── Worn ground — trampled dirt-path discs (grass-path-2) ─────────────────
//   Where feet wear the lawn down: entrances, sign, path sides, plus a few
//   natural open-ground patches.  [x, z, radius]
const WORN_DISCS = [
  // 8 side-house entrances (offset ~9u toward the hero from each house)
  [  34.5, -76.9, 10 ],
  [  49.2, -61.2, 10 ],
  [  47.9, -37.8, 10 ],
  [  35.1, -21.5,  9 ],
  [ -34.5, -76.9, 10 ],
  [ -49.2, -61.2, 10 ],
  [ -47.9, -37.8, 10 ],
  [ -35.1, -21.5,  9 ],
  // hero gate entrance + sign area
  [   0,   -29,   11 ],
  [  -8,   -24,    7 ],
  // approach-road sides (worn ground flanking the cobblestone)
  [ -13,    16,    8 ],
  [  13,    11,    8 ],
  [ -13,    -2,    7 ],
  [  13,    -4,    7 ],
  // natural open-ground worn patches — break up the green
  [  24,   -58,    9 ],
  [ -25,   -54,    9 ],
  [  18,   -74,    8 ],
  [ -17,   -70,    8 ],
]

// ── Mud patches — brown-mud discs in the most-walked spots ────────────────
//   Small accents only.  Sit on top of worn ground.  [x, z, radius]
const MUD_DISCS = [
  [   0, -19, 5.5 ],   // just outside the hero gate — trampled mud
  [   4, -25, 3.5 ],
  [  49, -61, 4.5 ],   // busiest side-house entrances
  [ -49, -61, 4.5 ],
  [  48, -38, 4.0 ],
  [ -48, -38, 4.5 ],
  [   9,  16, 3.5 ],   // approach corridor scuffs
  [  -9,   2, 3.2 ],
  [  27, -47, 4.0 ],   // scattered natural mud
  [ -30, -65, 4.0 ],
  [  15, -87, 3.8 ],
]

// ═══════════════════════════════════════════════════════════════════════════
export function createTerrain(ctx) {
  const g = ctx.villageGroup

  // ── Layer 0: Base — full coverage, gravity raycaster target ────────────
  //   renderOrder −10 (lowest) — always drawn first / under everything.
  //   Colour matches the gravel base so there is no green bleed-through.
  const baseMesh = rect(900, 900, 0, 0.0, 0,
    new THREE.MeshStandardMaterial({
      color:     0xcbbd9c,   // warm sandy-beige — matches gravel base
      roughness: 0.98,
      metalness: 0,
    }),
    -10
  )
  ctx.groundMesh = baseMesh
  g.add(baseMesh)

  // ── Layer 1: Gravel base — dry-earth default across the whole world ─────
  const gravelBaseMat = mkMat({
    diff:  loadTex(`${GRV}/terrain_diffuse.jpg`,   60, 60),
    nor:   loadTex(`${GRV}/terrain_normal.jpg`,    60, 60, false),
    rough: loadTex(`${GRV}/terrain_roughness.jpg`, 60, 60, false),
    color: 0xcbbd9c,   // warm sandy-beige — dry open ground
  })
  g.add(rect(900, 900, 0, 0.01, 0, gravelBaseMat, RO_GRAVEL_BASE))

  // ── Layer 2: Green lawn circles — REMOVED ───────────────────────────────
  //   The large solid-green discs (radius 24–42 u) were visually dominant
  //   and made the village ground look like a flat painted surface.
  //   Ground appearance is now driven by the gravel base + worn/mud layers.

  // ── Layer 3: Worn ground — trampled dirt-path discs (grass-path-2) ──────
  const wornMat = mkMat({
    diff:  loadTex(`${GP2}/grass_path_2_diff_2k.jpg`,   3, 3),
    nor:   loadTex(`${GP2}/grass_path_2_nor_gl_2k.jpg`, 3, 3, false),
    rough: loadTex(`${GP2}/grass_path_2_rough_2k.jpg`,  3, 3, false),
    color: 0xc2bca6,   // light warm tint — worn but not muddy-dark
  })
  for (const [x, z, r] of WORN_DISCS) {
    g.add(disc(r, x, 0.03, z, wornMat, RO_WORN))
  }

  // ── Layer 4: Gravel shoulders — soft road ↔ ground blend ────────────────
  const shoulderMat = mkMat({
    diff:  loadTex(`${GRV}/terrain_diffuse.jpg`,   5, 5),
    nor:   loadTex(`${GRV}/terrain_normal.jpg`,    5, 5, false),
    rough: loadTex(`${GRV}/terrain_roughness.jpg`, 5, 5, false),
    color: 0xc6b794,   // warm gravel — the cobblestone's earthy verge
  })
  // approach-road shoulder strip (cobblestone runs z=+26 → −6)
  g.add(rect(22, 38, 0, 0.033, 10, shoulderMat, RO_SHOULDER))
  // north-continuation shoulder strip (cobblestone runs z=−90 → −130)
  g.add(rect(20, 46, 1, 0.033, -110, shoulderMat, RO_SHOULDER))
  // loop-road shoulder: ring slightly wider than the cobblestone (R 28–42).
  // Inner R=27 keeps the hero's fenced yard (R<26) green.
  g.add(annulus(27, 45, HERO_X, 0.035, HERO_Z, shoulderMat, RO_SHOULDER))

  // ── Layer 5: Mud patches — brown-mud accents ────────────────────────────
  const mudMat = mkMat({
    diff:  loadTex(`${MUD}/brown_mud_dry_diff_2k.jpg`,   3, 3),
    nor:   loadTex(`${MUD}/brown_mud_dry_nor_gl_2k.jpg`, 3, 3, false),
    rough: loadTex(`${MUD}/brown_mud_dry_rough_2k.jpg`,  3, 3, false),
    color: 0x8f7355,   // warm damp brown
  })
  for (const [x, z, r] of MUD_DISCS) {
    g.add(disc(r, x, 0.04, z, mudMat, RO_MUD))
  }
}
