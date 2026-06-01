import * as THREE from 'three'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'

// ── Sky / Environment settings ────────────────────────────────────────────────
//
//  HDRI is used ONLY for IBL (image-based lighting) — it lights materials but
//  is NOT rendered as the visible background.  This removes the "inside a ball"
//  panorama look.
//
//  The visible background is a simple solid sky colour.  Change SKY_COLOR to
//  tweak the sky tint without touching the lighting.
//
//  Swap HDRI_PATH to change the IBL source:
//    village_sky2.exr    ← bright blue sky (default)
//    village_golden.exr  ← warm golden-hour
//    village_soft.exr    ← softer warm day
//    sunrise.exr         ← cool sunrise
const HDRI_PATH   = '/assets/hdri/village_sky2.exr'
const TONE_EXP    = 1.0
const SKY_COLOR   = 0xa8cce8   // open mid-blue sky — matches village_sky2 palette
const FOG_COLOR   = 0xb8d4e8
const FOG_DENSITY = 0.00012

export function setupEnvironment(ctx) {
  ctx.renderer.toneMappingExposure = TONE_EXP

  // Solid sky background — NO panoramic HDRI wrap
  ctx.scene.background = new THREE.Color(SKY_COLOR)
  ctx.scene.fog        = new THREE.FogExp2(FOG_COLOR, FOG_DENSITY)

  // Load HDRI for IBL ONLY (scene.environment lights materials, not background)
  const pmrem = new THREE.PMREMGenerator(ctx.renderer)
  pmrem.compileEquirectangularShader()

  new EXRLoader().load(
    HDRI_PATH,
    (exrTexture) => {
      exrTexture.mapping  = THREE.EquirectangularReflectionMapping
      const envMap        = pmrem.fromEquirectangular(exrTexture).texture
      // environment  → IBL for PBR materials ✓
      // background   → intentionally NOT set here → solid SKY_COLOR stays
      ctx.scene.environment = envMap
      exrTexture.dispose()
      pmrem.dispose()
    },
    undefined,
    (err) => {
      console.warn('HDRI IBL load failed — falling back to ambient-only lighting:', err)
    }
  )

  // ── Lights ───────────────────────────────────────────────────────────────────
  // HemisphereLight replaces the "free" sky contribution that came from the HDRI
  // background.  Sky (blue-white) from above, warm earth bounce from below.
  const hemi = new THREE.HemisphereLight(0xc8dff0, 0x8b7355, 0.55)
  ctx.scene.add(hemi)
  ctx.hemi = hemi                          // exposed for day/night toggle

  // Soft ambient fill — keeps shadow areas from going too dark
  const ambient = new THREE.AmbientLight(0xffffff, 0.30)
  ctx.scene.add(ambient)
  ctx.ambient = ambient                    // exposed for day/night toggle

  // Main directional sun
  //
  // PERFORMANCE: shadow casting from the sun is DISABLED. With dozens of
  // houses + props + trees, the shadow pass was rendering the whole scene
  // a second time every frame.  The scene is still well-lit by:
  //   • HDRI IBL (scene.environment)
  //   • HemisphereLight (sky/ground bounce)
  //   • AmbientLight
  // Visual cost: no crisp ground shadows under buildings.  Perf gain: huge
  // — eliminates the entire shadow render pass.  Flip castShadow back to
  // true (and bump mapSize) if you want the cast shadows back later.
  const sun = new THREE.DirectionalLight(0xfff8f0, 2.5)
  sun.position.set(60, 80, 40)
  sun.castShadow           = false   // ← PERF: disabled
  sun.shadow.mapSize.set(512, 512)   // halved, only relevant if castShadow re-enabled
  sun.shadow.camera.left   = -80
  sun.shadow.camera.right  =  80
  sun.shadow.camera.top    =  80
  sun.shadow.camera.bottom = -80
  sun.shadow.camera.near   =  1
  sun.shadow.camera.far    =  300
  sun.shadow.bias          = -0.001
  ctx.scene.add(sun)
  ctx.sun = sun                            // exposed for day/night toggle
}

// ── GOLDEN HOUR VERSION (enable when ready) ───────────────────────────────────
// const HDRI_PATH   = '/assets/hdri/village_golden.exr'
// const TONE_EXP    = 1.15
// const FOG_COLOR   = 0xe8d5b0
// const FOG_DENSITY = 0.00006
//
// export function setupEnvironment(ctx) {
//   ctx.renderer.toneMappingExposure = TONE_EXP
//   ctx.scene.fog = new THREE.FogExp2(FOG_COLOR, FOG_DENSITY)
//   const pmrem = new THREE.PMREMGenerator(ctx.renderer)
//   pmrem.compileEquirectangularShader()
//   new EXRLoader().load(HDRI_PATH, (exrTexture) => {
//     exrTexture.mapping = THREE.EquirectangularReflectionMapping
//     const envMap = pmrem.fromEquirectangular(exrTexture).texture
//     ctx.scene.background  = envMap
//     ctx.scene.environment = envMap
//     exrTexture.dispose()
//     pmrem.dispose()
//   })
//   ctx.scene.add(new THREE.AmbientLight(0xffcb88, 0.30))
//   ctx.scene.add(new THREE.HemisphereLight(0xffd4a0, 0x8b6a2a, 0.55))
//   const sun = new THREE.DirectionalLight(0xffb060, 2.8)
//   sun.position.set(90, 22, 40)
//   sun.castShadow = true
//   sun.shadow.mapSize.set(1024, 1024)
//   sun.shadow.camera.left=-80; sun.shadow.camera.right=80
//   sun.shadow.camera.top=80;   sun.shadow.camera.bottom=-80
//   sun.shadow.camera.near=1;   sun.shadow.camera.far=300
//   sun.shadow.bias=-0.001
//   ctx.scene.add(sun)
//   const fill = new THREE.DirectionalLight(0x8ab4d4, 0.30)
//   fill.position.set(-60, 35, -25)
//   ctx.scene.add(fill)
//   const bounce = new THREE.PointLight(0xff8833, 0.50, 80)
//   bounce.position.set(0, 2, -100)
//   ctx.scene.add(bounce)
// }
