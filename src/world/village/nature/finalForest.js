import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// ═══════════════════════════════════════════════════════════════════════════
//  FINAL FOREST — story zone reached by crossing the bridge
// ═══════════════════════════════════════════════════════════════════════════
//
//  Loads final_forest.glb as a single background instance representing the
//  forest area beyond the village.  Sits AFTER the bridge so the journey
//  reads as:  village  →  bridge  →  short open path  →  forest.
//
//  ── Spatial reference ───────────────────────────────────────────────────
//    Bridge centre:        z = −148    (scale 4.5 → spans ≈ 36u along Z)
//    Bridge north foot:    z ≈ −166
//    North approach ends:  z = −174
//    Forest starts:        z ≲ −200    (≈26u clear walking gap)
//    Forest centre:        z = −230    (where the mass of trees sits)
//
//  ── Quick-tune constants ────────────────────────────────────────────────
//    FOREST_X                         centre alignment on bridge axis
//    FOREST_GROUND_Y                  bottom of GLB after auto-grounding
//    FOREST_MANUAL_Y_OFFSET           extra vertical correction after auto-grounding
//    FOREST_FRONT_Z                   nearest/front edge of forest after bridge
//    FOREST_SCALE                     uniform scale applied to the whole GLB
//    FOREST_ROT_Y                     Y rotation — flip if dense side faces wrong way
// ═══════════════════════════════════════════════════════════════════════════

const FOREST_X               =    0      // centred on the bridge axis
const FOREST_GROUND_Y        =    0.05   // target ground level for the GLB bounds
const FOREST_MANUAL_Y_OFFSET =  -55      // deeper sink — drops the floating hill base onto ground level
const FOREST_FRONT_Z         = -167      // forest's south edge butts directly against the bridge north foot (≈−166)
const FOREST_SCALE           =    1.0    // keep native size first; 6x was making it cover the sky/village
const FOREST_ROT_Y           =    0      // 0 puts the point-1 clearing facing south toward the bridge

// ── Walkable plane tuning ─────────────────────────────────────────────────
//   A flat invisible floor that the gravity raycaster lands on while the
//   player is over the forest area.  Using the GLB itself as a ground target
//   caused the player to snap UP to the first surface a downward ray hit —
//   tree canopies — i.e. the "launched into the sky" bug.  A dedicated flat
//   plane gives a smooth, predictable forest floor.
//
//     FOREST_WALK_Y   world-Y of the plane.  Match bridge deck height (~0.28)
//                     so stepping from the bridge onto the forest road is
//                     seamless (no visible step up/down).
//     WALK_PAD_XZ    extra metres around the GLB footprint so the player
//                     finds the plane the moment they step onto the forest.
const FOREST_WALK_Y          =    0.3    // matches BRIDGE deck (≈0.28) — clean transition
const WALK_PAD_XZ            =    8      // pad the footprint outward by this

// ── Backing land plane (extends ground behind the bridge) ─────────────────
//   Fills the space behind the bridge / around the forest so the world
//   doesn't look like the village is floating in the sky after the river.
//   Same warm gravel-sand colour as the village base terrain so it reads as
//   "continuing world", not a separate slab.  Y is just below the forest
//   walkable plane so it never covers the forest road.
const BACKING_LAND_SIZE      =  600      // 600×600u — wide enough to fill horizon
const BACKING_LAND_X         =    0
const BACKING_LAND_Z         = -350      // centred behind the forest
const BACKING_LAND_Y         =   -0.10   // just below FOREST_WALK_Y (0.3) and terrain (0)
const BACKING_LAND_COLOR     = 0xcbbd9c  // matches village base terrain

const FOREST_GLB = '/assets/new assets/final_forest.glb'

// ─────────────────────────────────────────────────────────────────────────
export function createFinalForest(ctx) {
  // ── Add the backing land plane FIRST (no async dependency) ───────────────
  //   Single PlaneGeometry → one draw call.  Receives shadow but doesn't
  //   cast — it's a flat ground extension, not a feature.
  const backingMat = new THREE.MeshStandardMaterial({
    color:     BACKING_LAND_COLOR,
    roughness: 0.98,
    metalness: 0,
  })
  const backingPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(BACKING_LAND_SIZE, BACKING_LAND_SIZE),
    backingMat
  )
  backingPlane.rotation.x    = -Math.PI / 2
  backingPlane.position.set(BACKING_LAND_X, BACKING_LAND_Y, BACKING_LAND_Z)
  backingPlane.receiveShadow = true
  backingPlane.name          = 'forest_backing_land'
  ctx.villageGroup.add(backingPlane)

  // ───────────────────────────────────────────────────────────────────────
  //  PERFORMANCE: the 85 MB final_forest.glb is DISABLED.
  //  ───────────────────────────────────────────────────────────────────────
  //  The skills-forest visual is now built from much cheaper pieces:
  //    • roads/skillsForestRoad.js      — laterite S-curve trail (1 mesh)
  //    • terrain/skillsForestTerrain.js — rocky + sand-rocks side strips (2)
  //    • nature/skillsForestTrees.js    — optimized fir InstancedMesh (~2-3)
  //    • this file's backing-land plane — adds 1 mesh
  //
  //  Loading the 85 MB monolithic forest GLB on top of those was costing
  //  85 MB of bandwidth + a giant render burden for no visual gain.  It is
  //  intentionally not loaded.  If you want the old hill landscape back,
  //  uncomment the loader block below.
  return
  // eslint-disable-next-line no-unreachable
  const loader = new GLTFLoader()

  loader.load(
    FOREST_GLB,

    (gltf) => {
      const root = gltf.scene

      root.scale.setScalar(FOREST_SCALE)
      root.rotation.y = FOREST_ROT_Y

      // Auto-place from the model's real bounds instead of guessing from its pivot.
      // This prevents the forest from appearing as a ceiling above the village or
      // floating under the bridge when the GLB origin is not at ground level.
      root.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(root)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())

      root.position.x += FOREST_X - center.x
      root.position.y += FOREST_GROUND_Y - box.min.y + FOREST_MANUAL_Y_OFFSET
      root.position.z += FOREST_FRONT_Z - box.max.z

      console.log('[finalForest] placed', {
        frontZ: FOREST_FRONT_Z,
        scale: FOREST_SCALE,
        manualYOffset: FOREST_MANUAL_Y_OFFSET,
        size: size.toArray(),
        finalPosition: root.position.toArray(),
      })

      // Shadows: receive only.  This GLB is large (85 MB) — having every
      // mesh cast shadows would crater frame rate, and forest trees as a
      // distant story zone don't need to shadow each other.
      root.traverse((child) => {
        if (child.isMesh) {
          child.receiveShadow = true
          child.castShadow    = false
        }
      })

      ctx.villageGroup.add(root)

      // ── Asset analysis log ─────────────────────────────────────────────
      //   Prints the GLB's real bounds + a sample of child mesh names so we
      //   can identify a "path" / "ground" / "terrain" mesh and adjust
      //   FOREST_ROT_Y accordingly if the path entrance faces wrong way.
      root.updateMatrixWorld(true)
      const finalBox    = new THREE.Box3().setFromObject(root)
      const finalSize   = finalBox.getSize(new THREE.Vector3())
      const finalCenter = finalBox.getCenter(new THREE.Vector3())

      const meshNames = []
      let meshCount = 0
      root.traverse((c) => {
        if (c.isMesh) {
          meshCount++
          if (meshNames.length < 25) meshNames.push(c.name || '(unnamed)')
        }
      })

      console.log('[finalForest] ANALYSIS', {
        worldBoundsMin: finalBox.min.toArray().map(v => +v.toFixed(2)),
        worldBoundsMax: finalBox.max.toArray().map(v => +v.toFixed(2)),
        worldSize:      finalSize.toArray().map(v => +v.toFixed(2)),
        worldCenter:    finalCenter.toArray().map(v => +v.toFixed(2)),
        meshCount,
        firstMeshNames: meshNames,
        currentRotY:    FOREST_ROT_Y,
        currentScale:   FOREST_SCALE,
      })

      // ── Forest walkable floor (FLAT invisible plane) ───────────────────
      //   The previous attempts both failed for different reasons:
      //     (a) plane at box.min.y → ~-54, player sank into the hill
      //     (b) GLB root as ground → ray hit tree canopies, player launched
      //   This plane lives at FOREST_WALK_Y (default 0.5) and covers the
      //   GLB's XZ footprint + WALK_PAD_XZ padding.  applyGravity raycasts
      //   against THIS plane only — no chance of hitting a leaf.
      //
      //   Tree trunks remain solid via CIRCLES in collision.js (X/Z only),
      //   so the player blocks naturally without any vertical knock-up.
      const planeW = finalSize.x + WALK_PAD_XZ * 2
      const planeD = finalSize.z + WALK_PAD_XZ * 2
      const walkPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(planeW, planeD),
        new THREE.MeshBasicMaterial({ visible: false })
      )
      walkPlane.rotation.x   = -Math.PI / 2
      walkPlane.position.set(finalCenter.x, FOREST_WALK_Y, finalCenter.z)
      walkPlane.name         = 'forest_walkable_plane'
      walkPlane.receiveShadow = false
      ctx.villageGroup.add(walkPlane)

      if (!ctx.groundObjects) ctx.groundObjects = [ctx.groundMesh]
      ctx.groundObjects.push(walkPlane)
    },

    undefined,   // progress — not needed

    (err) => {
      console.warn('[finalForest] Failed to load final_forest.glb:', err)
    }
  )
}
