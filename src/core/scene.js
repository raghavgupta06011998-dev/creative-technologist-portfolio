import * as THREE from 'three'

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000008)
  scene.fog = new THREE.FogExp2(0x0a0400, 0.007)
  return scene
}
