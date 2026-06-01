import * as THREE from 'three'

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    72,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  camera.position.set(0, 3, 7)
  return camera
}

export function resizeCamera(camera) {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}
