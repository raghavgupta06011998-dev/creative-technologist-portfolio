import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// ── Draco geometry decoder ────────────────────────────────────────────────
// Decoder WASM/JS files are served from /draco/ (copied from three/examples).
// This allows loading GLBs compressed with KHR_draco_mesh_compression.
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
dracoLoader.preload()

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

function toVector3(value) {
  return Array.isArray(value) ? new THREE.Vector3(...value) : value.clone()
}

function applyRotation(object, rotation) {
  if (Array.isArray(rotation)) {
    object.rotation.set(rotation[0] || 0, rotation[1] || 0, rotation[2] || 0)
    return
  }

  object.rotation.y = rotation || 0
}

function normalizeModel(model, normalizeTo) {
  if (!normalizeTo) return

  const box = new THREE.Box3().setFromObject(model)
  const size = new THREE.Vector3()
  box.getSize(size)
  const largestAxis = Math.max(size.x, size.y, size.z)

  if (largestAxis > 0) {
    model.scale.multiplyScalar(normalizeTo / largestAxis)
  }
}

function alignModel(model, { center = false, groundAlign = true } = {}) {
  const box = new THREE.Box3().setFromObject(model)
  const centerPoint = new THREE.Vector3()
  box.getCenter(centerPoint)

  if (center) {
    model.position.x -= centerPoint.x
    model.position.z -= centerPoint.z
  }

  if (groundAlign) {
    model.position.y -= box.min.y
  }
}

export function loadGLBModel(
  scene,
  path,
  position,
  scale = 1,
  rotation = 0,
  options = {}
) {
  const holder = new THREE.Group()
  holder.position.copy(toVector3(position))
  holder.scale.setScalar(scale)
  applyRotation(holder, rotation)

  if (options.addToScene !== false) {
    scene.add(holder)
  }

  gltfLoader.load(
    path,
    (gltf) => {
      const model = gltf.scene

      model.traverse((child) => {
        if (child.isMesh) {
          // castShadow=false by default — sun.castShadow is disabled scene-wide
          // (see environment.js).  Setting true here keeps the mesh in Three.js's
          // shadow-casting object list every frame for no visual benefit.
          // Re-enable per-feature only if shadows are turned back on globally.
          child.castShadow    = false
          child.receiveShadow = true
        }
      })

      normalizeModel(model, options.normalizeTo)
      alignModel(model, {
        center: options.center ?? false,
        groundAlign: options.groundAlign ?? true
      })

      holder.add(model)
      options.onLoad?.(model, gltf, holder)
      console.log('Loaded GLB:', path)
    },
    undefined,
    (error) => {
      console.error('Failed to load GLB:', path, error)
      options.onError?.(error)
    }
  )

  return holder
}
