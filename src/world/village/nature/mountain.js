import * as THREE from 'three'
import { placeAsset, rand } from '../utils/assetLoader.js'

// ── Layout constants ─────────────────────────────────────────────────────────
const MOUNTAIN_Z    = -420  // far behind forest
const MOUNTAIN_X    = 0
const PEAK_HEIGHT   = 90
const BASE_RADIUS   = 110

// ── Procedural mountain cone ──────────────────────────────────────────────────
function buildMountain(ctx) {
  const geo = new THREE.ConeGeometry(BASE_RADIUS, PEAK_HEIGHT, 18, 1)

  // vertex noise for rocky silhouette
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    if (y < PEAK_HEIGHT - 0.5) {
      pos.setX(i, pos.getX(i) + (Math.random() - 0.5) * 10)
      pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * 10)
    }
  }
  geo.computeVertexNormals()

  const mat = new THREE.MeshStandardMaterial({
    color:     0x7a6a5a,
    roughness: 0.95,
    metalness: 0
  })

  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.set(MOUNTAIN_X, PEAK_HEIGHT / 2, MOUNTAIN_Z)
  mesh.castShadow    = true
  mesh.receiveShadow = true
  ctx.villageGroup.add(mesh)

  // snow cap
  const snowGeo = new THREE.ConeGeometry(BASE_RADIUS * 0.18, PEAK_HEIGHT * 0.22, 14, 1)
  const snowMat = new THREE.MeshStandardMaterial({ color: 0xeeeeff, roughness: 0.6 })
  const snowMesh = new THREE.Mesh(snowGeo, snowMat)
  snowMesh.position.set(0, PEAK_HEIGHT * 0.42, 0)
  mesh.add(snowMesh)
}

// ── Main export ───────────────────────────────────────────────────────────────
export function createMountain(ctx) {
  buildMountain(ctx)

  // foreground boulders hinting at the mountain path
  const rockKeys = ['rocks_04','rocks_05','rocks_06','rocks_01','rocks_03']
  const boulderSpots = [
    [  0, -355, 1.4],
    [-20, -345, 1.2],
    [ 20, -345, 1.2],
    [-38, -335, 1.0],
    [ 38, -335, 1.0],
    [  0, -375, 1.6],
    [-15, -390, 0.9],
    [ 15, -390, 0.9]
  ]
  boulderSpots.forEach(([x, z, s], i) => {
    placeAsset(ctx, rockKeys[i % rockKeys.length], x + rand(-3, 3), 0, z + rand(-3, 3), s * rand(0.85, 1.15), rand(0, Math.PI * 2))
  })
}
