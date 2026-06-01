import * as THREE from 'three'

export function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.6

  document.body.innerHTML = ''
  document.body.appendChild(renderer.domElement)

  return renderer
}

export function resizeRenderer(renderer) {
  renderer.setSize(window.innerWidth, window.innerHeight)
}
