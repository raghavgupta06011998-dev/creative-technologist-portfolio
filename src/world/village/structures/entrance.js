import * as THREE from 'three'

// ── Layout constants ─────────────────────────────────────────────────────────
const GATE_Z     =  14   // matches roads.js ENTRANCE_Z

// ── "RAGHAV'S WORLD" welcome sign ────────────────────────────────────────────
function buildWelcomeSign(ctx) {
  const w = 512, h = 256
  const canvas = document.createElement('canvas')
  canvas.width  = w
  canvas.height = h
  const c = canvas.getContext('2d')

  // wood background
  c.fillStyle = '#6b3a1f'
  c.fillRect(0, 0, w, h)
  for (let i = 0; i < 18; i++) {
    const y = (i / 18) * h
    c.strokeStyle = `rgba(40,20,5,${0.08 + Math.random() * 0.08})`
    c.lineWidth   = 1 + Math.random() * 2
    c.beginPath(); c.moveTo(0, y); c.lineTo(w, y + (Math.random() - 0.5) * 10); c.stroke()
  }
  c.strokeStyle = '#f5deb3'; c.lineWidth = 7
  c.strokeRect(10, 10, w - 20, h - 20)

  c.textAlign = 'center'; c.textBaseline = 'middle'
  c.fillStyle = '#f5deb3'
  c.font = 'bold 62px serif'
  c.fillText("RAGHAV'S", w / 2, h * 0.37)
  c.fillStyle = '#ffd700'
  c.font = 'bold 58px serif'
  c.fillText('WORLD', w / 2, h * 0.70)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace

  const board = new THREE.Mesh(
    new THREE.BoxGeometry(7.5, 3.0, 0.22),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8, metalness: 0, side: THREE.DoubleSide })
  )
  board.castShadow = true
  board.position.set(0, 5.2, GATE_Z)

  const poleMat = new THREE.MeshStandardMaterial({ color: 0x6b3d1e, roughness: 0.9 })
  const poleGeo = new THREE.CylinderGeometry(0.12, 0.14, 6.2, 8)
  const pL = new THREE.Mesh(poleGeo, poleMat); pL.position.set(-3.5, 2.0, GATE_Z); pL.castShadow = true
  const pR = new THREE.Mesh(poleGeo, poleMat); pR.position.set( 3.5, 2.0, GATE_Z); pR.castShadow = true

  ctx.villageGroup.add(board, pL, pR)
}

// ── Main export ───────────────────────────────────────────────────────────────
export function createEntrance(ctx) {
  // welcome sign only — old Fence/ folder gatepost/gate removed
  buildWelcomeSign(ctx)
}
