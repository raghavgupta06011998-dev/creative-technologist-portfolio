import * as THREE from 'three'

export function makeMat(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    map:              options.map              || null,
    roughness:        options.roughness        ?? 0.86,
    metalness:        options.metalness        ?? 0,
    emissive:         options.emissive ? new THREE.Color(options.emissive) : new THREE.Color(0x000000),
    emissiveIntensity: options.emissiveIntensity ?? 0
  })
}

function createNoiseTexture(base, accent, size = 256, speckles = 1800) {
  const canvas = document.createElement('canvas')
  canvas.width  = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < speckles; i++) {
    const alpha = Math.random() * 0.16 + 0.03
    ctx.fillStyle = `rgba(${accent[0]},${accent[1]},${accent[2]},${alpha})`
    ctx.fillRect(Math.random() * size, Math.random() * size, Math.random() * 3 + 1, Math.random() * 3 + 1)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function createStoneTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#c9b89d'
  ctx.fillRect(0, 0, size, size)
  for (let y = -40; y < size + 80; y += 54) {
    for (let x = -30; x < size + 80; x += 72) {
      const w  = 48 + Math.random() * 42
      const h  = 32 + Math.random() * 34
      const px = x + Math.random() * 12
      const py = y + Math.random() * 12
      ctx.fillStyle = `rgb(${178 + Math.random() * 38},${162 + Math.random() * 28},${132 + Math.random() * 22})`
      ctx.beginPath()
      ctx.moveTo(px + 6, py)
      ctx.lineTo(px + w - 7, py + Math.random() * 5)
      ctx.lineTo(px + w,     py + h - 8)
      ctx.lineTo(px + 7,     py + h)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = 'rgba(95,77,58,0.26)'
      ctx.lineWidth   = 3
      ctx.stroke()
    }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(7, 7)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function createTerracottaTexture() {
  const canvas = document.createElement('canvas')
  canvas.width  = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#a84f2c'
  ctx.fillRect(0, 0, 256, 256)
  for (let y = 0; y < 256; y += 22) {
    for (let x = 0; x < 256; x += 32) {
      const offset = y % 44 === 0 ? 0 : 16
      ctx.fillStyle = `rgb(${150 + Math.random() * 42},${66 + Math.random() * 26},${36 + Math.random() * 18})`
      ctx.fillRect(x + offset, y, 28, 17)
      ctx.strokeStyle = 'rgba(76,38,24,0.35)'
      ctx.strokeRect(x + offset, y, 28, 17)
    }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2.5, 2.5)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createMaterialLibrary(ctx) {
  const stoneTexture = createStoneTexture()

  const plasterTexture = createNoiseTexture('#e9d6b5', [130, 92, 63], 256, 2400)
  plasterTexture.repeat.set(1.5, 1.5)

  const terracottaTexture = createTerracottaTexture()

  const grassTexture = createNoiseTexture('#789d55', [47, 76, 42], 256, 1300)
  grassTexture.repeat.set(6, 6)

  const pathTexture = createStoneTexture()
  pathTexture.repeat.set(3, 3)

  ctx.materialsCache = {
    plaster:    plasterTexture,
    terracotta: terracottaTexture,
    wallMats:   new Map()
  }

  return {
    grass:     makeMat(0xffffff, { map: grassTexture,     roughness: 0.96 }),
    path:      makeMat(0xffffff, { map: pathTexture,      roughness: 0.86 }),
    stone:     makeMat(0xffffff, { map: stoneTexture,     roughness: 0.84 }),
    stoneDark: makeMat(0x8c6a4f, {                         roughness: 0.9  }),
    wood:      makeMat(0x8b5e3c, {                         roughness: 0.85 }),
    leaves:    makeMat(0x3f8f48, {                         roughness: 0.9  }),
    roofRed:   makeMat(0xb94f35, { map: terracottaTexture, roughness: 0.78 })
  }
}
