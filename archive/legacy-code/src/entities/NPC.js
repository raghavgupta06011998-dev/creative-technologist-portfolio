import * as THREE from 'three'

function makeMat(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.86,
    metalness: options.metalness ?? 0
  })
}

export function createVillageCharacter() {
  const character = new THREE.Group()
  const shirt = makeMat(0x3d7fa6, { roughness: 0.75 })
  const pants = makeMat(0x2f3842, { roughness: 0.8 })
  const skin = makeMat(0xc98b63, { roughness: 0.72 })
  const hair = makeMat(0x2b1c17, { roughness: 0.9 })

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.9, 6, 12), shirt)
  body.position.y = 1.25
  body.castShadow = true
  character.add(body)

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 12), skin)
  head.position.y = 2.1
  head.castShadow = true
  character.add(head)

  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.33, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.48), hair)
  hairCap.position.y = 2.2
  character.add(hairCap)

  ;[-0.22, 0.22].forEach((x) => {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.6, 4, 8), pants)
    leg.position.set(x, 0.45, 0)
    leg.castShadow = true
    character.add(leg)

    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.58, 4, 8), skin)
    arm.position.set(x * 2.5, 1.18, 0)
    arm.rotation.z = -x * 1.2
    arm.castShadow = true
    character.add(arm)
  })

  character.scale.setScalar(0.9)
  return character
}
