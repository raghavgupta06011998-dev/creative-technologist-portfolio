import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════════════════
//  SKILLS-FOREST GROUND
//  ONE continuous forest-floor disc behind the bridge.  Replaces the earlier
//  two-rectangle layout that read as "blocky separate patches."
//
//  Why a CircleGeometry (not two rectangles)
//  ────────────────────────────────────────────────────────────────────────
//    • No 90° corners → no visible rectangle edges in the camera view.
//    • One mesh, one material → one draw call.
//    • The skills road runs straight through it; together they read as
//        "road in the middle + one connected piece of land on both sides."
//
//  Coverage
//  ────────────────────────────────────────────────────────────────────────
//    Radius:        160u   → diameter 320u
//    Centre:        (0, 0.025, −240)
//    Spans roughly  x ∈ [−160, +160],  z ∈ [−80, −400]
//    Bridge north exit (z ≈ −166) is well inside the circle's south edge,
//    so the player walks off the bridge directly onto this ground.
//
//  Heights (avoid bumps — see file headers in bridge.js / skillsForestRoad.js)
//  ────────────────────────────────────────────────────────────────────────
//    Bridge deck:        y ≈ 0.28   (highest)
//    Skills road:        y =  0.06  (above this ground)
//    Forest ground:      y =  0.025 (this file)
//    Backing land plane: y = −0.10  (sits below, from finalForest.js)
//
//  Walkability
//  ────────────────────────────────────────────────────────────────────────
//    Registered in ctx.groundObjects so the gravity raycaster lands here
//    when the player walks off the road into the surrounding forest area.
//
//  ── Quick-tune constants ─────────────────────────────────────────────────
//    GROUND_RADIUS    radius of the disc
//    GROUND_X / Z     centre position
//    GROUND_Y         elevation
//    GROUND_COLOR     warm forest-floor tint
//    TEX_REPEAT       how many tiles across the diameter — higher = finer
// ═══════════════════════════════════════════════════════════════════════════

const GROUND_RADIUS = 160
const GROUND_X      =   0
const GROUND_Z      = -240
const GROUND_Y      =   0.025
const GROUND_COLOR  = 0x9b8a6b       // warm earthy forest tint
const TEX_REPEAT    =  30            // tile count across the disc — natural fine detail

const FOREST_BASE = '/assets/textures/terrain/forest-ground'

// ═══════════════════════════════════════════════════════════════════════════
export function createSkillsForestTerrain(ctx) {
  const _tex = new THREE.TextureLoader()
  const diff  = _tex.load(`${FOREST_BASE}/forrest_ground_01_diff_2k.jpg`)
  const nor   = _tex.load(`${FOREST_BASE}/forrest_ground_01_nor_gl_2k.jpg`)
  const rough = _tex.load(`${FOREST_BASE}/forrest_ground_01_rough_2k.jpg`)
  for (const t of [diff, nor, rough]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(TEX_REPEAT, TEX_REPEAT)
    t.anisotropy = 8
  }
  diff.colorSpace = THREE.SRGBColorSpace

  const mat = new THREE.MeshStandardMaterial({
    map:          diff,
    normalMap:    nor,
    roughnessMap: rough,
    color:        GROUND_COLOR,
    roughness:    1.0,
    metalness:    0,
  })

  //   64 radial segments → smooth circular outline that never reads as a
  //   polygon-edged shape from the camera distance.
  const geo  = new THREE.CircleGeometry(GROUND_RADIUS, 64)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.rotation.x    = -Math.PI / 2
  mesh.position.set(GROUND_X, GROUND_Y, GROUND_Z)
  mesh.receiveShadow = true
  mesh.renderOrder   = 0           // above terrain layers (−10…−5), below the road (renderOrder 2)
  mesh.name          = 'skills_forest_ground'
  ctx.villageGroup.add(mesh)

  // Register as a walkable surface for the gravity raycaster.
  if (!ctx.groundObjects) ctx.groundObjects = [ctx.groundMesh]
  ctx.groundObjects.push(mesh)
}
