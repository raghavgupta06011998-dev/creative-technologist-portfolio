import * as THREE from 'three'

export function createMarsScene(ctx) {
  addMarsLights(ctx)
  addStars(ctx)
  addEarth(ctx)
  addMarsGround(ctx)
  addGate(ctx)
}

function addMarsLights(ctx) {
  ctx.scene.add(new THREE.AmbientLight(0x3a1f10, 1.8))

  const sunLight = new THREE.DirectionalLight(0xfff5dd, 4.5)
  sunLight.position.set(160, 120, 80)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.set(2048, 2048)
  ctx.scene.add(sunLight)

  const earthRimLight = new THREE.DirectionalLight(0x88aaff, 1.2)
  earthRimLight.position.set(-120, 40, -100)
  ctx.scene.add(earthRimLight)

  const spaceLight = new THREE.DirectionalLight(0x223366, 0.3)
  spaceLight.position.set(-80, -20, -60)
  ctx.scene.add(spaceLight)

  ctx.scene.add(new THREE.HemisphereLight(0x553322, 0x221100, 1.2))
}

function addStars(ctx) {
  const g1 = new THREE.BufferGeometry()
  const p1 = new Float32Array(12000 * 3)
  for (let i = 0; i < 12000 * 3; i++) p1[i] = (Math.random() - 0.5) * 700
  g1.setAttribute('position', new THREE.BufferAttribute(p1, 3))
  ctx.scene.add(new THREE.Points(g1, new THREE.PointsMaterial({
    color: 0xffffff, size: 0.1, transparent: true, opacity: 0.8
  })))

  const g2 = new THREE.BufferGeometry()
  const p2 = new Float32Array(3000 * 3)
  for (let i = 0; i < 3000 * 3; i++) p2[i] = (Math.random() - 0.5) * 500
  g2.setAttribute('position', new THREE.BufferAttribute(p2, 3))
  ctx.scene.add(new THREE.Points(g2, new THREE.PointsMaterial({
    color: 0xffeedd, size: 0.22, transparent: true, opacity: 0.9
  })))

  const g3 = new THREE.BufferGeometry()
  const p3 = new Float32Array(800 * 3)
  for (let i = 0; i < 800 * 3; i++) p3[i] = (Math.random() - 0.5) * 400
  g3.setAttribute('position', new THREE.BufferAttribute(p3, 3))
  ctx.scene.add(new THREE.Points(g3, new THREE.PointsMaterial({
    color: 0xffffff, size: 0.4, transparent: true, opacity: 0.6
  })))
}

function addEarth(ctx) {
  ctx.earthGroup = new THREE.Group()
  ctx.earthGroup.position.set(-25, 5, -220)
  ctx.earthGroup.rotation.z = 0.18

  const textureLoader = new THREE.TextureLoader()
  const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg')
  const cloudTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png')

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(60, 64, 64),
    new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 35,
      specular: new THREE.Color(0x555555),
      emissive: new THREE.Color(0x112244),
      emissiveIntensity: 0.35
    })
  )
  ctx.earthGroup.add(earth)

  ctx.cloudMesh = new THREE.Mesh(
    new THREE.SphereGeometry(60.8, 64, 64),
    new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.5,
      depthWrite: false
    })
  )
  ctx.earthGroup.add(ctx.cloudMesh)

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(66, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0x66aaff,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide
    })
  )
  ctx.earthGroup.add(atmosphere)

  const earthKeyLight = new THREE.DirectionalLight(0xffffff, 1.8)
  earthKeyLight.position.set(120, 80, 100)
  ctx.scene.add(earthKeyLight)

  ctx.scene.add(ctx.earthGroup)
}

function addMarsGround(ctx) {
  const groundGeo = new THREE.PlaneGeometry(300, 300, 150, 150)
  const pos = groundGeo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const noise = Math.sin(x * 0.08) * 0.18 + Math.cos(z * 0.06) * 0.15
    pos.setZ(i, noise)
  }
  groundGeo.computeVertexNormals()

  const ground = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({
    color: 0xa14a1f,
    roughness: 1,
    metalness: 0
  }))
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  ctx.scene.add(ground)

  const under = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    new THREE.MeshStandardMaterial({ color: 0x6a2a12, roughness: 1 })
  )
  under.rotation.x = -Math.PI / 2
  under.position.y = -0.55
  ctx.scene.add(under)

  const rockColors = [0x7a3410, 0x8c3f18, 0x5a240f, 0xa04822, 0x3d180a]

  for (let i = 0; i < 12; i++) {
    const size = Math.random() * 1.5 + 1.2
    const x = (Math.random() - 0.5) * 80
    const z = -15 - Math.random() * 20
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(size, 1),
      new THREE.MeshStandardMaterial({
        color: rockColors[Math.floor(Math.random() * rockColors.length)],
        roughness: 1
      })
    )
    rock.position.set(x, size * 0.3, z)
    rock.rotation.set(Math.random(), Math.random(), Math.random())
    rock.castShadow = true
    rock.receiveShadow = true
    ctx.scene.add(rock)
    ctx.rockColliders.push({ mesh: rock, radius: size * 0.9 })
  }

  for (let i = 0; i < 35; i++) {
    const size = Math.random() * 0.7 + 0.3
    const x = (Math.random() - 0.5) * 60
    const z = -5 - Math.random() * 30
    if (Math.abs(x) < 4 && z > -16) continue
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(size, 0),
      new THREE.MeshStandardMaterial({
        color: rockColors[Math.floor(Math.random() * rockColors.length)],
        roughness: 1
      })
    )
    rock.position.set(x, size * 0.3, z)
    rock.rotation.set(Math.random(), Math.random(), Math.random())
    rock.castShadow = true
    ctx.scene.add(rock)
    ctx.rockColliders.push({ mesh: rock, radius: size * 0.85 })
  }

  for (let i = 0; i < 80; i++) {
    const size = Math.random() * 0.18 + 0.04
    const x = (Math.random() - 0.5) * 40
    const z = (Math.random() - 0.5) * 30
    if (Math.abs(x) < 3 && z > -8 && z < 2) continue
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(size, 0),
      new THREE.MeshStandardMaterial({
        color: rockColors[Math.floor(Math.random() * rockColors.length)],
        roughness: 1
      })
    )
    rock.position.set(x, size * 0.3, z)
    rock.rotation.set(Math.random(), Math.random(), Math.random())
    ctx.scene.add(rock)
  }

  for (let i = 0; i < 14; i++) {
    const r = Math.random() * 12 + 8
    const hill = new THREE.Mesh(
      new THREE.SphereGeometry(r, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x6b2a05, roughness: 1 })
    )
    hill.position.set(
      (Math.random() - 0.5) * 120,
      -r + Math.random() * 3 - 1,
      -38 - Math.random() * 25
    )
    ctx.scene.add(hill)
  }
}

function addGate(ctx) {
  const gateGroup = new THREE.Group()
  gateGroup.position.set(0, 0, -14)

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x2e1f0e,
    roughness: 0.98,
    metalness: 0.0
  })
  const stoneLight = new THREE.MeshStandardMaterial({
    color: 0x3d2b1a,
    roughness: 0.95,
    metalness: 0.0
  })

  const pillarL = new THREE.Mesh(new THREE.BoxGeometry(1.3, 9, 1.3), stoneMat)
  pillarL.position.set(-2.4, 4, 0)
  pillarL.castShadow = true
  gateGroup.add(pillarL)

  const pillarR = new THREE.Mesh(new THREE.BoxGeometry(1.3, 9, 1.3), stoneMat)
  pillarR.position.set(2.4, 4, 0)
  pillarR.castShadow = true
  gateGroup.add(pillarR)

  const lintel = new THREE.Mesh(new THREE.BoxGeometry(6.4, 1.5, 1.3), stoneMat)
  lintel.position.set(0, 8.75, 0)
  lintel.castShadow = true
  gateGroup.add(lintel)

  const keystone = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2, 1.4), stoneLight)
  keystone.position.set(0, 9.9, 0)
  keystone.castShadow = true
  gateGroup.add(keystone)

  const blockL1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 1.35), stoneLight)
  blockL1.position.set(-2.4, 2, 0)
  gateGroup.add(blockL1)

  const blockL2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 1.35), stoneLight)
  blockL2.position.set(-2.4, 5.5, 0)
  gateGroup.add(blockL2)

  const blockR1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 1.35), stoneLight)
  blockR1.position.set(2.4, 2, 0)
  gateGroup.add(blockR1)

  const blockR2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 1.35), stoneLight)
  blockR2.position.set(2.4, 5.5, 0)
  gateGroup.add(blockR2)

  const fallen = [
    { p: [-3.2, -0.4, 0.8], s: [0.9, 0.25, 0.6] },
    { p: [3.0, -0.4, 0.6], s: [0.7, 0.2, 0.5] },
    { p: [-2.8, -0.4, -0.5], s: [0.5, 0.18, 0.4] },
    { p: [3.5, -0.4, -0.3], s: [0.4, 0.15, 0.35] },
  ]
  fallen.forEach((f) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(...f.s), stoneMat)
    b.position.set(...f.p)
    b.rotation.y = Math.random() * 0.6 - 0.3
    gateGroup.add(b)
  })

  const slab1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.9), stoneLight)
  slab1.position.set(1.8, -0.44, 1.5)
  slab1.rotation.y = 0.3
  gateGroup.add(slab1)

  const slab2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 0.7), stoneMat)
  slab2.position.set(-2.0, -0.45, 1.2)
  slab2.rotation.y = -0.2
  gateGroup.add(slab2)

  ctx.portalMat = new THREE.MeshBasicMaterial({ color: 0xfff8e7 })
  const portal = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 7.8), ctx.portalMat)
  portal.position.set(0, 4, 0.05)
  gateGroup.add(portal)

  const bloom = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 10),
    new THREE.MeshBasicMaterial({
      color: 0xffeeaa,
      transparent: true,
      opacity: 0.18,
      depthWrite: false
    })
  )
  bloom.position.set(0, 4, -0.1)
  gateGroup.add(bloom)

  const spill = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 12),
    new THREE.MeshBasicMaterial({
      color: 0xffaa22,
      transparent: true,
      opacity: 0.22,
      depthWrite: false
    })
  )
  spill.rotation.x = -Math.PI / 2
  spill.position.set(0, -0.45, 4)
  gateGroup.add(spill)

  ctx.scene.add(gateGroup)

  ctx.gateLight = new THREE.PointLight(0xffcc66, 8, 22)
  ctx.gateLight.position.set(0, 4, -13)
  ctx.scene.add(ctx.gateLight)

  const gateFill = new THREE.PointLight(0xff9933, 3, 14)
  gateFill.position.set(0, 1, -11)
  ctx.scene.add(gateFill)

  const gateTop = new THREE.PointLight(0xffaa44, 2, 10)
  gateTop.position.set(0, 8, -14)
  ctx.scene.add(gateTop)
}

export function updateMarsScene(ctx) {
  if (ctx.earthGroup) {
    ctx.earthGroup.rotation.y += 0.0003
  }

  if (ctx.cloudMesh) {
    ctx.cloudMesh.rotation.y += 0.0006
  }

  if (ctx.gateLight) {
    ctx.gateLight.intensity = 7 + Math.sin(ctx.time * 1.8) * 1.5
  }

  if (ctx.portalMat) {
    const p = Math.sin(ctx.time * 1.5) * 0.03
    ctx.portalMat.color.setRGB(1, 0.97 + p, 0.8 + p)
  }
}
