import * as THREE from 'three'
import { loadGLBModel } from '../../../utils/loaders.js'

// ═══════════════════════════════════════════════════════════════════════════
//  BRIDGE — bridge_01.glb crossing the river north-south at x=0, z≈−148
// ═══════════════════════════════════════════════════════════════════════════
//
//  Why loadGLBModel is used directly instead of placeAsset:
//    placeAsset → loadModel both apply groundAlign inside the loader, which
//    snaps the model's lowest vertex to local y=0 BEFORE any position offset
//    is honoured.  To sink the base/walls into the terrain while keeping
//    the deck visible, we need to shift the model AFTER groundAlign — that
//    requires an onLoad callback with direct access to the model object.
//
//  Height logic (all values in world units):
//    groundAlign sets model.position.y = −box.min.y → model bottom at y=0
//    BRIDGE_DECK_OFFSET is then added: model.position.y += BRIDGE_DECK_OFFSET
//    → positive value raises the whole model  (floating)
//    → negative value sinks the whole model  (buries base, raises deck above 0)
//
//  bridge_01 approximate geometry (measured from asset preview):
//    bottom of rectangular base  y=0.00  (after groundAlign)
//    top of rectangular base     y≈0.55
//    bridge deck surface         y≈1.00
//    top of railings             y≈1.60
//
//  With BRIDGE_DECK_OFFSET = -0.72:
//    base bottom   →  0.00 − 0.72 = −0.72  (well underground)
//    base top      →  0.55 − 0.72 = −0.17  (just underground)
//    deck surface  →  1.00 − 0.72 = +0.28  (above terrain, ≈ river level 0.30)
//    railings top  →  1.60 − 0.72 = +0.88  (clearly visible)
//
//  ── Quick-tune constants ─────────────────────────────────────────────────
//    BRIDGE_DECK_OFFSET   the ONE value that controls visible bridge height.
//                         More negative → sinks further (hides more base).
//                         Less negative → raises deck (more base shows).
//                         Useful range: −0.60 to −0.85
//
//    BRIDGE_SCALE         uniform scale.  4.5 × native ≈8u = 36u span.
//                         Increase if bridge doesn't reach both banks.
//
//    BRIDGE_ROT_Y         Math.PI/2 = bridge length aligned along Z (crosses
//                         the river).  Change to 0 if it appears sideways.
// ═══════════════════════════════════════════════════════════════════════════

// ── Placement ──────────────────────────────────────────────────────────────
const BRIDGE_X          =   0           // north-road centre
const BRIDGE_Z          = -148          // river centreline at x=0
const BRIDGE_SCALE      =   4.5         // spans 34u river + lands on both banks
const BRIDGE_ROT_Y      =   Math.PI / 2 // bridge_01 is X-aligned → cross Z

// ── THE key variable: vertical offset applied after groundAlign ────────────
const BRIDGE_DECK_OFFSET = -1.55        // sinks base underground, deck at ≈−0.08

// ── Approach paths ─────────────────────────────────────────────────────────
//   South: z=−122 → z=−130  dry cobblestone on south bank → bridge south foot
//   North: z=−166 → z=−174  dry cobblestone on north bank → continues north
const SOUTH_START = -122
const SOUTH_END   = -130
const NORTH_START = -166
const NORTH_END   = -174
const APPROACH_W  =  10    // slightly narrower than main road
const APPROACH_Y  =  0.055 // above all terrain layers

// ── Asset path (matches assetLoader.js ASSETS.bridge_01) ───────────────────
const BRIDGE_GLB = '/assets/models/bridge/bridge_01.glb'

// ─────────────────────────────────────────────────────────────────────────
const _tex = new THREE.TextureLoader()

function makeApproachMaterial() {
  const BASE  = '/assets/textures/roads/cobblestone'
  const diff  = _tex.load(`${BASE}/cobblestone_floor_08_diff_2k.jpg`)
  const nor   = _tex.load(`${BASE}/cobblestone_floor_08_nor_gl_2k.jpg`)
  const rough = _tex.load(`${BASE}/cobblestone_floor_08_rough_2k.jpg`)
  for (const t of [diff, nor, rough]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.anisotropy = 4
  }
  diff.colorSpace = THREE.SRGBColorSpace
  diff.repeat.set(2, 1)
  nor.repeat.set(2, 1)
  rough.repeat.set(2, 1)
  return new THREE.MeshStandardMaterial({
    map: diff, normalMap: nor, roughnessMap: rough,
    roughness: 0.92, metalness: 0,
  })
}

function buildStrip(zStart, zEnd, mat) {
  const length  = Math.abs(zEnd - zStart)
  const centerZ = (zStart + zEnd) / 2
  const geo  = new THREE.PlaneGeometry(APPROACH_W, length)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.rotation.x    = -Math.PI / 2
  mesh.position.set(0, APPROACH_Y, centerZ)
  mesh.receiveShadow = true
  return mesh
}

// ═══════════════════════════════════════════════════════════════════════════
export function createBridge(ctx) {
  const g = ctx.villageGroup

  // ── Approach paths ──────────────────────────────────────────────────────
  const mat = makeApproachMaterial()
  g.add(buildStrip(SOUTH_START, SOUTH_END, mat))
  g.add(buildStrip(NORTH_START, NORTH_END, mat))

  // ── Bridge model ────────────────────────────────────────────────────────
  //   A parent Group controls world position/rotation/scale.
  //   The model is added INSIDE the group after groundAlign, then shifted
  //   by BRIDGE_DECK_OFFSET so only the deck+railings sit above terrain.
  const bridgeGroup = new THREE.Group()
  bridgeGroup.position.set(BRIDGE_X, 0, BRIDGE_Z)
  bridgeGroup.rotation.y = BRIDGE_ROT_Y
  bridgeGroup.scale.setScalar(BRIDGE_SCALE)
  g.add(bridgeGroup)

  loadGLBModel(ctx.scene, BRIDGE_GLB, [0, 0, 0], 1, 0, {
    addToScene:  false,   // we manage placement via bridgeGroup
    center:      false,
    groundAlign: true,    // snaps model bottom to local y=0 first
    onLoad: (model) => {
      // After groundAlign: model.position.y = −box.min.y (bottom at y=0).
      // Apply BRIDGE_DECK_OFFSET to shift the model so:
      //   base/walls  → below terrain (hidden)
      //   deck/rails  → above terrain (visible and walkable)
      model.position.y += BRIDGE_DECK_OFFSET

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow    = true
          child.receiveShadow = true
        }
      })

      bridgeGroup.add(model)

      // Register bridge deck as a walkable Y-raycaster target so the player
      // walks ON the deck instead of falling through to the terrain below.
      if (!ctx.groundObjects) ctx.groundObjects = [ctx.groundMesh]
      ctx.groundObjects.push(bridgeGroup)
    }
  })
}
