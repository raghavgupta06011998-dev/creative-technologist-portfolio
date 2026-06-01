import * as THREE from 'three'
import { loadGLBModel } from '../../../utils/loaders.js'

// ═══════════════════════════════════════════════════════════════════════════
//  VILLAGE TREES — Instanced fir + jacaranda from optimized 1K Draco assets
// ═══════════════════════════════════════════════════════════════════════════
//
//  Rendering optimization (rewritten):
//    Previous pass used placeAsset → loadModel → .clone(true) for all 28
//    trees. Each clone is a deep copy of a Poly Haven Draco GLB with 3–5
//    sub-meshes → ~84–140 draw calls JUST for village trees, every frame.
//
//    New approach: THREE.InstancedMesh per sub-mesh, per species.
//    Two species (fir + jacaranda) × ~3 sub-meshes each = ~6 draw calls
//    total, regardless of placement count. Roughly 20–30× draw call
//    reduction near spawn.
//
//  Shadows:
//    castShadow = false on all instances. Sun shadow pass is disabled
//    scene-wide (environment.js). Foliage shadows on Draco trees were
//    the single biggest shadow cost in the prior build.
//
//  Asset keys (public/assets/forest/forest/optimized/):
//    forest_jacaranda  — warm flowering tree (8 MB Draco GLB)
//    forest_fir        — tall conifer (12 MB Draco GLB)
//
//  Layout zones (28 trees total):
//    A  Yard accents       2  (hero lawn back corners)        — jacaranda
//    B  Estate edge        4  (ring road exterior, sides)
//    C  Side-house groves  4  (between houses)
//    D  Background         4  (outer back clusters — east/west, centre gap)
//    E  House fill         6  (one fir per house, behind/beside)
//    F  Mid-back spread    4  (outer edges z=−98→−110)
//    G  Front-belt         4  (flanking entrance road, sides only)
//                          ─
//                         28  total instances
//
//  Rules preserved from old layout:
//    • Nothing past z=−125
//    • Bridge approach corridor (x≈0, z=−130→−148) is clear
//    • Front approach corridor (|x|<22) stays open
// ═══════════════════════════════════════════════════════════════════════════

const FIR_GLB  = '/assets/forest/forest/optimized/fir_1k_draco.glb'
const JACA_GLB = '/assets/forest/forest/optimized/jacaranda_1k_draco.glb'

// ── Global scale multiplier (applied to every tree's `s` value) ──────────
//   1.5 = 50% taller than the original per-tree scales — village trees
//   read clearly above the houses.
const SCALE_MULT = 1.5

// Marker for "FIR" vs "JACA" placement — species partitioned at run-time
const F = 'FIR', J = 'JACA'

// ── A. Hero yard accents (2) ──────────────────────────────────────────────
const YARD_ACCENTS = [
  { k: J, x: -15, z: -66, s: 0.38, r: 0.4 },
  { k: J, x:  15, z: -66, s: 0.36, r: 5.0 },
]

// ── B. Estate edge (4) ────────────────────────────────────────────────────
const ESTATE_EDGE = [
  { k: J, x: -46, z: -50, s: 0.55, r: 0.8 },
  { k: J, x:  46, z: -50, s: 0.52, r: 3.7 },
  { k: F, x: -50, z: -28, s: 0.46, r: 1.2 },
  { k: F, x:  50, z: -28, s: 0.44, r: 4.8 },
]

// ── C. Side-house groves (4) ──────────────────────────────────────────────
const SIDE_HOUSE_GROVES = [
  { k: F, x:  62, z: -80, s: 0.60, r: 2.1 },
  { k: J, x:  70, z: -52, s: 0.55, r: 0.6 },
  { k: F, x: -62, z: -80, s: 0.60, r: 1.5 },
  { k: J, x: -70, z: -52, s: 0.55, r: 5.3 },
]

// ── D. Background clusters (4) ────────────────────────────────────────────
const BACKGROUND_CLUSTERS = [
  { k: F, x: -58, z: -114, s: 0.82, r: 0.3 },
  { k: F, x: -44, z: -122, s: 0.86, r: 1.8 },
  { k: F, x:  44, z: -120, s: 0.86, r: 2.9 },
  { k: F, x:  60, z: -114, s: 0.82, r: 4.6 },
]

// ── E. House fill (6) ─────────────────────────────────────────────────────
const HOUSE_FILL = [
  { k: F, x:  68, z: -40, s: 0.56, r: 0.4 },
  { k: F, x:  72, z: -70, s: 0.62, r: 3.3 },
  { k: F, x:  52, z: -90, s: 0.68, r: 1.7 },
  { k: F, x: -68, z: -40, s: 0.56, r: 2.9 },
  { k: F, x: -72, z: -70, s: 0.62, r: 4.8 },
  { k: F, x: -52, z: -90, s: 0.68, r: 2.5 },
]

// ── F. Mid-back spread (4) ────────────────────────────────────────────────
const MID_BACK_FILL = [
  { k: F, x:  76, z:  -98, s: 0.64, r: 0.8 },
  { k: F, x: -78, z: -100, s: 0.66, r: 3.1 },
  { k: F, x:  54, z: -108, s: 0.74, r: 2.2 },
  { k: F, x: -56, z: -110, s: 0.72, r: 5.5 },
]

// ── G. Front-belt fill (4) ────────────────────────────────────────────────
const FRONT_BELT_FILL = [
  { k: F, x: -32, z:  -8, s: 0.40, r: 1.8 },
  { k: F, x:  32, z:  -8, s: 0.38, r: 3.5 },
  { k: J, x: -38, z: -20, s: 0.44, r: 5.0 },
  { k: J, x:  38, z: -20, s: 0.42, r: 0.9 },
]

const ALL_TREES = [
  ...YARD_ACCENTS,
  ...ESTATE_EDGE,
  ...SIDE_HOUSE_GROVES,
  ...BACKGROUND_CLUSTERS,
  ...HOUSE_FILL,
  ...MID_BACK_FILL,
  ...FRONT_BELT_FILL,
]

// ═══════════════════════════════════════════════════════════════════════════
export function createStreetTrees(ctx) {
  // Partition placements by species so each species becomes one InstancedMesh
  // set (one InstancedMesh per sub-mesh inside the species GLB).
  const firPlacements  = ALL_TREES.filter((t) => t.k === F)
  const jacaPlacements = ALL_TREES.filter((t) => t.k === J)

  loadSpecies(ctx, FIR_GLB,  firPlacements,  'fir')
  loadSpecies(ctx, JACA_GLB, jacaPlacements, 'jacaranda')
}

// ── Loader: fetch GLB once, build InstancedMesh per sub-mesh ─────────────
function loadSpecies(ctx, glbPath, placements, label) {
  if (placements.length === 0) return

  loadGLBModel(ctx.scene, glbPath, [0, 0, 0], 1, 0, {
    addToScene:  false,
    center:      false,
    groundAlign: false,
    onLoad: (model) => buildInstancedSpecies(ctx, model, placements, label),
  })
}

function buildInstancedSpecies(ctx, model, placements, label) {
  model.updateMatrixWorld(true)

  // Collect every Mesh inside the loaded tree along with its local-to-model
  // transform. A typical Poly Haven tree has 2–3 sub-meshes (trunk + needles
  // or trunk + leaves). Each becomes one InstancedMesh.
  const subMeshes = []
  model.traverse((c) => {
    if (c.isMesh) {
      subMeshes.push({
        geometry:    c.geometry,
        material:    c.material,   // SHARED — never clone materials
        localMatrix: c.matrixWorld.clone(),
      })
    }
  })

  // Bottom-of-model offset so each instance sits on the ground.
  const box = new THREE.Box3().setFromObject(model)
  const modelMinY = box.min.y

  const N = placements.length
  const dummy = new THREE.Object3D()
  const finalMat = new THREE.Matrix4()

  for (const sm of subMeshes) {
    const inst = new THREE.InstancedMesh(sm.geometry, sm.material, N)
    inst.castShadow    = false
    inst.receiveShadow = true

    for (let i = 0; i < N; i++) {
      const p = placements[i]
      const s = p.s * SCALE_MULT

      // Outer transform: position + Y-rotation + uniform scale
      dummy.position.set(p.x, -modelMinY * s, p.z)
      dummy.rotation.set(0, p.r, 0)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()

      // Combine with the sub-mesh's local-to-model matrix so the internal
      // hierarchy (trunk offset, canopy offset, etc.) is preserved.
      finalMat.multiplyMatrices(dummy.matrix, sm.localMatrix)
      inst.setMatrixAt(i, finalMat)
    }
    inst.instanceMatrix.needsUpdate = true
    inst.computeBoundingSphere?.()

    ctx.villageGroup.add(inst)
  }

  console.log(
    `[streetTrees] ${label} — instanced: ${placements.length} placements × ` +
    `${subMeshes.length} sub-meshes = ${subMeshes.length} draw calls (was ${placements.length * subMeshes.length} clones)`
  )
}
