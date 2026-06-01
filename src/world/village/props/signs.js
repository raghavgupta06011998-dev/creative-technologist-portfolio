import * as THREE from 'three'

// ── Layout constants — must match roads.js ────────────────────────────────────
const SIDE_Z  = -65    // side house Z
const PLAZA_Z = -105   // fountain plaza
const HERO_Z  = -165   // hero house
const FUTURE_Z = -210  // future path hint

// ── Canvas sign board texture ─────────────────────────────────────────────────
function makeSignTexture(line1, line2 = '', opts = {}) {
  const W = 512, H = opts.tall ? 320 : 256
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const c = canvas.getContext('2d')

  // aged wood background
  c.fillStyle = opts.dark ? '#2e1a08' : '#6b3a1f'
  c.fillRect(0, 0, W, H)

  // wood grain
  for (let i = 0; i < 20; i++) {
    const y = (i / 20) * H
    c.strokeStyle = `rgba(${opts.dark ? '15,8,0' : '40,18,5'},${0.07 + Math.random() * 0.09})`
    c.lineWidth = 1 + Math.random() * 1.8
    c.beginPath(); c.moveTo(0, y); c.lineTo(W, y + (Math.random() - 0.5) * 10); c.stroke()
  }

  // border
  c.strokeStyle = opts.gold ? '#ffd700' : '#f0d8a8'
  c.lineWidth = 6; c.strokeRect(10, 10, W - 20, H - 20)
  c.strokeStyle = `rgba(245,216,168,0.3)`
  c.lineWidth = 2; c.strokeRect(16, 16, W - 32, H - 32)

  // main label
  c.textAlign = 'center'; c.textBaseline = 'middle'
  c.fillStyle = '#ffd700'
  c.font = `bold ${opts.smallFont ? 50 : 58}px serif`
  c.fillText(line1, W / 2, line2 ? H * 0.38 : H * 0.5)

  if (line2) {
    c.font = `${opts.smallFont ? 28 : 32}px serif`
    c.fillStyle = '#f0d8a8'
    c.fillText(line2, W / 2, H * 0.70)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// ── Build one sign with two poles ─────────────────────────────────────────────
function buildSign(ctx, line1, line2, x, z, rotY = 0, opts = {}) {
  const boardW = opts.wide ? 7.5 : 6.0
  const boardH = opts.tall ? 2.8 : 2.3
  const poleH  = 5.0

  const mat = new THREE.MeshStandardMaterial({
    map:       makeSignTexture(line1, line2, opts),
    roughness: 0.85, metalness: 0, side: THREE.DoubleSide
  })
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x4a2510, roughness: 0.95 })
  const poleGeo = new THREE.CylinderGeometry(0.1, 0.13, poleH, 8)

  const group = new THREE.Group()
  group.position.set(x, 0, z)
  group.rotation.y = rotY

  const board = new THREE.Mesh(new THREE.BoxGeometry(boardW, boardH, 0.18), mat)
  board.position.set(0, poleH * 0.80, 0)
  board.castShadow = true
  group.add(board)

  const pL = new THREE.Mesh(poleGeo, poleMat); pL.position.set(-boardW * 0.36, poleH / 2, 0); pL.castShadow = true
  const pR = new THREE.Mesh(poleGeo, poleMat); pR.position.set( boardW * 0.36, poleH / 2, 0); pR.castShadow = true
  group.add(pL, pR)

  ctx.villageGroup.add(group)
  return group
}

// ── Design principle house sign positions ─────────────────────────────────────
// Each sign sits ~3 units in front of its house door, angled toward the road.
// X and rotY mirror the house positions in streetHouses.js.
// Change text here to rename a design principle without touching house placement.
const HOUSE_SIGNS = [
  // Left houses
  { label: 'UI DESIGN',      x: -22,  z: -20,  ry:  Math.PI * 0.08 },
  { label: 'UX DESIGN',      x: -24,  z: -54,  ry:  Math.PI * 0.05 },
  { label: 'PRODUCT',        x: -20,  z: -83,  ry:  Math.PI * 0.10 },
  // Right houses
  { label: 'VISUAL DESIGN',  x: +24,  z: -22,  ry: -Math.PI * 0.07 },
  { label: 'GRAPHIC',        x: +22,  z: -56,  ry: -Math.PI * 0.04 },
  { label: 'RESEARCH',       x: +26,  z: -81,  ry: -Math.PI * 0.09 },
]

// ── Main export ───────────────────────────────────────────────────────────────
export function createNavigationSigns(ctx) {
  // ── Design principle house labels ─────────────────────────────────────────
  for (const s of HOUSE_SIGNS) {
    buildSign(ctx, s.label, '', s.x, s.z, s.ry, { smallFont: true })
  }

  // ── Hero house — "HOME" front sign ────────────────────────────────────────
  buildSign(ctx, 'HOME', 'My Story & Journey',
    -12, HERO_Z - 24,
    Math.PI * 0.06,
    { gold: true }
  )

  // ── Right-front — "PROJECTS" portal sign ─────────────────────────────────
  buildSign(ctx, 'PROJECTS', 'My Work →',
    52, -18,
    -Math.PI * 0.25,
    { smallFont: true }
  )

  // ── Far forward — "THE FUTURE" ────────────────────────────────────────────
  buildSign(ctx, 'THE FUTURE', 'What comes next ↑',
    0, FUTURE_Z,
    0,
    { wide: true, dark: true }
  )
}
