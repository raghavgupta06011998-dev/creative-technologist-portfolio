import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════════════════
//  SKILL PLAQUE BUILDERS — procedural wooden signs (no GLB download)
// ═══════════════════════════════════════════════════════════════════════════
//
//  Three reusable builders, all using the same warm wood palette
//  (matches hero house fence + forest fence).  Each returns a THREE.Group
//  ready to add to the scene.
//
//    createSkillPlaque({ title, x, z, rotY, height })
//        Small wooden post + carved sign — used for skill plaques in
//        every zone and for tool-trail stones.
//
//    createEntranceSign({ x, z, rotY, title })
//        Larger entrance sign with two posts and a wide plaque.
//
//    createExitArch({ x, z, title })
//        Wooden gate arch over the road — two posts, top beam, hanging
//        sign.  Used at the forest exit.
//
//  Canvas textures are baked once per call and never updated, so memory
//  is bounded.  All meshes share a single MeshStandardMaterial wherever
//  possible — only the canvas-textured plaque needs its own material.
// ═══════════════════════════════════════════════════════════════════════════

// ── Shared palette (matches hero house buildWoodFence) ───────────────────
export const WOOD_COLOR = 0x6b3f1c            // rich saddle brown
const _sharedWoodMat = new THREE.MeshStandardMaterial({
  color:     WOOD_COLOR,
  roughness: 0.92,
  metalness: 0,
})

// ── Canvas-text plaque texture builder ───────────────────────────────────
//   Same wood-grain canvas style as heroHouse buildJourneySign.  One
//   texture per call — colorSpace=SRGBColorSpace so warm tones survive.
function makePlaqueTexture(title, opts = {}) {
  const {
    w           = 420,
    h           = 168,
    fontSize    = 42,
    italicSub   = null,    // optional italic subtitle line under title
  } = opts

  const canvas = document.createElement('canvas')
  canvas.width  = w
  canvas.height = h
  const c = canvas.getContext('2d')

  // Wood background
  c.fillStyle = '#5a3318'
  c.fillRect(0, 0, w, h)

  // Wood grain
  for (let i = 0; i < 14; i++) {
    const y = (i / 14) * h
    c.strokeStyle = `rgba(28,14,4,${0.07 + Math.random() * 0.08})`
    c.lineWidth = 1 + Math.random() * 1.5
    c.beginPath()
    c.moveTo(0, y)
    c.lineTo(w, y + (Math.random() - 0.5) * 5)
    c.stroke()
  }

  // Carved border
  c.strokeStyle = '#c89a78'
  c.lineWidth = 4
  c.strokeRect(7, 7, w - 14, h - 14)

  // Title
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.fillStyle = '#f5deb3'
  c.font = `bold ${fontSize}px serif`
  const titleY = italicSub ? h * 0.40 : h * 0.5
  c.fillText(title, w / 2, titleY)

  // Optional italic subtitle
  if (italicSub) {
    c.fillStyle = '#d8b878'
    c.font = `italic ${Math.round(fontSize * 0.55)}px serif`
    c.fillText(italicSub, w / 2, h * 0.72)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// ── Skill plaque (small wooden post + carved sign) ───────────────────────
//   Used for every skill plaque and every tool-trail stone.
//
//   opts:
//     title    string  text carved into the plaque
//     x, z     world position (ground)
//     rotY     Y-rotation in radians (sign faces direction +Z by default,
//              so use rotY = -π/2 to face +X i.e. east)
//     height   total post height (default 1.4u — skill plaques)
//              use 0.65 for tool-trail stones (low and natural)
//     plaqueW  plaque width (default 1.4u, 0.9 for tools)
//     plaqueH  plaque height (default 0.55, 0.4 for tools)
//     italicSub  optional small italic line under the title
export function createSkillPlaque({
  title,
  x, z,
  rotY     = 0,
  height   = 1.4,
  plaqueW  = 1.4,
  plaqueH  = 0.55,
  italicSub = null,
}) {
  const group = new THREE.Group()

  // Vertical wooden post
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, height, 0.12),
    _sharedWoodMat,
  )
  post.position.y = height / 2
  group.add(post)

  // Plaque on top of post
  const texture = makePlaqueTexture(title, { italicSub })
  const plaqueMat = new THREE.MeshStandardMaterial({
    map:       texture,
    roughness: 0.85,
    metalness: 0,
    side:      THREE.DoubleSide,
  })
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(plaqueW, plaqueH, 0.08),
    plaqueMat,
  )
  plaque.position.y = height - plaqueH / 2 + 0.02
  group.add(plaque)

  group.position.set(x, 0, z)
  group.rotation.y = rotY

  // Shadows off (matches forest convention); receive on.
  group.traverse((c) => {
    if (c.isMesh) {
      c.castShadow    = false
      c.receiveShadow = true
    }
  })

  return group
}

// ── Entrance sign — two posts + wider plaque ─────────────────────────────
export function createEntranceSign({ x, z, rotY = 0, title = 'Skills Forest', italicSub = null }) {
  const group = new THREE.Group()

  const postH = 2.2
  const postSep = 2.2

  // Two posts
  for (const dx of [-postSep / 2, postSep / 2]) {
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, postH, 0.18),
      _sharedWoodMat,
    )
    post.position.set(dx, postH / 2, 0)
    group.add(post)
  }

  // Larger plaque
  const w = 2.6, h = 1.1
  const texture = makePlaqueTexture(title, {
    w: 560, h: 240, fontSize: 56, italicSub,
  })
  const plaqueMat = new THREE.MeshStandardMaterial({
    map:       texture,
    roughness: 0.85,
    metalness: 0,
    side:      THREE.DoubleSide,
  })
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, 0.10),
    plaqueMat,
  )
  plaque.position.set(0, postH - h / 2 + 0.05, 0)
  group.add(plaque)

  group.position.set(x, 0, z)
  group.rotation.y = rotY

  group.traverse((c) => {
    if (c.isMesh) {
      c.castShadow    = false
      c.receiveShadow = true
    }
  })

  return group
}

// ── Exit arch — wooden gate spanning the road ────────────────────────────
//   Two tall posts flanking the road outside the fence line, a top beam
//   connecting them, and a hanging plaque centred under the beam.
//   Player walks UNDER the beam (clearance > 3u).
export function createExitArch({ x, z, title = 'Career Mountains Ahead', italicSub = null }) {
  const group = new THREE.Group()

  const postH    = 4.2
  const postSep  = 26    // posts at ±13 from centre — clear of \|x\|=12 fence
  const beamH    = 0.32
  const beamW    = postSep + 0.4   // beam slightly overhangs posts

  // Two tall posts
  for (const dx of [-postSep / 2, postSep / 2]) {
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, postH, 0.35),
      _sharedWoodMat,
    )
    post.position.set(dx, postH / 2, 0)
    group.add(post)
  }

  // Top horizontal beam
  const beam = new THREE.Mesh(
    new THREE.BoxGeometry(beamW, beamH, 0.40),
    _sharedWoodMat,
  )
  beam.position.set(0, postH - beamH / 2, 0)
  group.add(beam)

  // Hanging plaque under beam
  const pW = 4.0, pH = 1.2
  const texture = makePlaqueTexture(title, {
    w: 640, h: 220, fontSize: 56, italicSub,
  })
  const plaqueMat = new THREE.MeshStandardMaterial({
    map:       texture,
    roughness: 0.85,
    metalness: 0,
    side:      THREE.DoubleSide,
  })
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(pW, pH, 0.10),
    plaqueMat,
  )
  plaque.position.set(0, postH - beamH - pH / 2 - 0.05, 0)
  group.add(plaque)

  group.position.set(x, 0, z)

  group.traverse((c) => {
    if (c.isMesh) {
      c.castShadow    = false
      c.receiveShadow = true
    }
  })

  return group
}
