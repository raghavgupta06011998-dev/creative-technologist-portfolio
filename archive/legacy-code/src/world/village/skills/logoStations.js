import * as THREE from 'three'
import { placeAsset } from '../utils/assetLoader.js'
import { LANE_PTS } from '../roads/skillsForestRoad.js'

// ═══════════════════════════════════════════════════════════════════════════
//  LOGO STATIONS — 8 brand/tool stations along the Skills Forest road
// ═══════════════════════════════════════════════════════════════════════════
//
//  Each station is:
//    • a big mossy-boulder pedestal (`boulder_mossy_lg` scaled up)
//    • a backlit brand logo plane mounted on a low post above the boulder
//    • a thin amber halo ring at the base
//    • a subtle backboard behind the logo (gives the "lit billboard" feel)
//
//  Logo source:
//    • Tries to load /assets/logos/<key>.png at runtime
//    • If the file isn't there, falls back to a procedural canvas
//      wordmark (brand-color background + clean white text) so the world
//      is finished-looking immediately
//    • When you drop a real PNG in, the texture swaps in transparently
//
//  Day / Night:
//    • Each logo's MeshStandardMaterial is registered with the day/night
//      system via ctx.dayNight.registerLogoMaterial(mat). At night the
//      emissiveIntensity is boosted so the boards read as illuminated
//      signage.
// ═══════════════════════════════════════════════════════════════════════════


// ── Curve sampling (same maths as the road + fence + emblems) ────────────
const _curve = new THREE.CatmullRomCurve3(
  LANE_PTS.map(([x, z]) => new THREE.Vector3(x, 0, z)),
  false, 'catmullrom', 0.5,
)
const _N = 400
const _samples  = []
const _tangents = []
for (let i = 0; i <= _N; i++) {
  const t = i / _N
  _samples.push(_curve.getPointAt(t))
  _tangents.push(_curve.getTangentAt(t))
}
function nearestIndexForZ(targetZ) {
  let best = 0, bestDist = Math.abs(_samples[0].z - targetZ)
  for (let i = 1; i <= _N; i++) {
    const d = Math.abs(_samples[i].z - targetZ)
    if (d < bestDist) { bestDist = d; best = i }
  }
  return best
}
function trailPos(targetZ, side, outset = 15) {
  const i  = nearestIndexForZ(targetZ)
  const c  = _samples[i]
  const tg = _tangents[i]
  const sign = side === 'L' ? -1 : 1
  const nx = -tg.z, nz = tg.x
  const x  = c.x + nx * sign * outset
  const z  = c.z + nz * sign * outset
  // direction back toward road
  const rotY = Math.atan2(-sign * nx, -sign * nz)
  return { x, z, rotY }
}


// ── Brand metadata ───────────────────────────────────────────────────────
//   key       — the key used in /assets/logos/<key>.png lookup
//   label     — placeholder wordmark text
//   bgColor   — placeholder background colour (canvas)
//   fgColor   — placeholder text colour (canvas)
//   z, side   — placement along the road
//
// Placement: spacing ≈23u, alternating LEFT / RIGHT along the curve.
export const TOOL_STATIONS = [
  { key: 'figma',      label: 'Figma',      bgColor: '#F24E1E', fgColor: '#FFFFFF', z: -200, side: 'L' },
  { key: 'photoshop',  label: 'Photoshop',  bgColor: '#001E36', fgColor: '#31A8FF', z: -223, side: 'R' },
  { key: 'illustrator',label: 'Illustrator',bgColor: '#330000', fgColor: '#FF9A00', z: -246, side: 'L' },
  { key: 'framer',     label: 'Framer',     bgColor: '#0099FF', fgColor: '#FFFFFF', z: -269, side: 'R' },
  { key: 'blender',    label: 'Blender',    bgColor: '#265787', fgColor: '#EA7600', z: -292, side: 'L' },
  { key: 'threejs',    label: 'three.js',   bgColor: '#0a0a0a', fgColor: '#FFFFFF', z: -315, side: 'R' },
  { key: 'chatgpt',    label: 'ChatGPT',    bgColor: '#10A37F', fgColor: '#FFFFFF', z: -338, side: 'L' },
  { key: 'claude',     label: 'Claude',     bgColor: '#CC785C', fgColor: '#FFFFFF', z: -361, side: 'R' },
]

const OUTSET            = 15      // distance from road centreline (fence is at 12u)
const PEDESTAL_SCALE    = 1.95    // boulder_mossy_lg → ≈ 2.5–3u tall
const LOGO_W            = 2.40    // logo plane width  (units)
const LOGO_H            = 1.20    // logo plane height
const LOGO_Y            = 2.65    // logo centre height above ground
const BACKBOARD_PAD     = 0.18    // dark backboard slightly larger than logo
const POST_HEIGHT       = 1.60    // post that lifts the logo off the boulder


// ── Procedural placeholder texture builder ──────────────────────────────
function makePlaceholderTexture(label, bgColor, fgColor) {
  const w = 512, h = 256
  const canvas = document.createElement('canvas')
  canvas.width  = w
  canvas.height = h
  const c = canvas.getContext('2d')

  // Background
  c.fillStyle = bgColor
  c.fillRect(0, 0, w, h)

  // Subtle inner border
  c.strokeStyle = 'rgba(255,255,255,0.18)'
  c.lineWidth = 4
  c.strokeRect(10, 10, w - 20, h - 20)

  // Wordmark
  c.textAlign    = 'center'
  c.textBaseline = 'middle'
  c.fillStyle    = fgColor
  // Pick a clean sans for tech-brand feel
  c.font = 'bold 78px "Helvetica Neue", Helvetica, Arial, sans-serif'
  c.fillText(label, w / 2, h / 2)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}


// ── Logo material builder — placeholder + async real-PNG swap-in ────────
function makeLogoMaterial(station) {
  const placeholderTex = makePlaceholderTexture(station.label, station.bgColor, station.fgColor)

  const mat = new THREE.MeshStandardMaterial({
    map:               placeholderTex,
    emissiveMap:       placeholderTex,
    emissive:          new THREE.Color(0xffffff),
    emissiveIntensity: 0.25,                     // subtle by day
    roughness:         0.55,
    metalness:         0.10,
    side:              THREE.DoubleSide,
  })

  // Try to load a real logo PNG from /assets/logos/<key>.png
  // — if missing, the placeholder stays. We DO NOT log an error in that
  // case (it's expected during dev). Three.js' TextureLoader calls the
  // onError callback silently when the file is absent.
  new THREE.TextureLoader().load(
    `/assets/logos/${station.key}.png`,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
      mat.map         = tex
      mat.emissiveMap = tex
      mat.needsUpdate = true
    },
    undefined,
    () => {/* placeholder kept; no console noise */}
  )

  return mat
}


// ── Shared materials (post + backboard + halo) ───────────────────────────
const _postMat = new THREE.MeshStandardMaterial({
  color:     0x3a2410,
  roughness: 0.92,
  metalness: 0,
})
const _backboardMat = new THREE.MeshStandardMaterial({
  color:     0x161616,
  roughness: 0.85,
  metalness: 0.15,
})
const _haloMat = new THREE.MeshBasicMaterial({
  color:       0xffb060,
  transparent: true,
  opacity:     0.28,
  side:        THREE.DoubleSide,
  depthWrite:  false,
})

// Shared geometries
const _postGeo      = new THREE.CylinderGeometry(0.10, 0.10, POST_HEIGHT, 8)
const _backboardGeo = new THREE.PlaneGeometry(LOGO_W + BACKBOARD_PAD * 2, LOGO_H + BACKBOARD_PAD * 2)
const _logoGeo      = new THREE.PlaneGeometry(LOGO_W, LOGO_H)
const _haloGeo      = new THREE.RingGeometry(1.30, 1.65, 36)


// ═══════════════════════════════════════════════════════════════════════════
//  Place a single tool station
// ═══════════════════════════════════════════════════════════════════════════
function placeStation(ctx, station) {
  const p = trailPos(station.z, station.side, OUTSET)

  // 1) Pedestal — big mossy boulder, ground-snapped via placeAsset
  const stoneRotY = Math.random() * Math.PI * 2
  placeAsset(ctx, 'boulder_mossy_lg', p.x, 0, p.z, PEDESTAL_SCALE, stoneRotY)

  // 2) Container group — positioned/rotated so children are easy to lay
  //    out in local space (local +Z points toward the road).
  const group = new THREE.Group()
  group.position.set(p.x, 0, p.z)
  group.rotation.y = p.rotY

  // Halo at base (ground level, on the road-facing side of the boulder)
  const halo = new THREE.Mesh(_haloGeo, _haloMat)
  halo.rotation.x  = -Math.PI / 2
  halo.position.set(0, 0.05, 0)
  halo.renderOrder = 3
  group.add(halo)

  // Post — lifts the logo plane above the boulder.
  // Local +Z toward road → step the post slightly forward so the sign
  // sits in front of the boulder, not buried in its silhouette.
  const post = new THREE.Mesh(_postGeo, _postMat)
  post.position.set(0, LOGO_Y - POST_HEIGHT * 0.5 - LOGO_H * 0.5, 0.85)
  group.add(post)

  // Backboard — dark plate behind the logo for contrast / lit-sign feel
  const back = new THREE.Mesh(_backboardGeo, _backboardMat)
  back.position.set(0, LOGO_Y, 0.85)
  group.add(back)

  // Logo plane
  const logoMat = makeLogoMaterial(station)
  const logo    = new THREE.Mesh(_logoGeo, logoMat)
  logo.position.set(0, LOGO_Y, 0.86)   // just in front of the backboard
  group.add(logo)

  // Shadows off (cheap forest convention); receive on for big surfaces.
  group.traverse((c) => {
    if (c.isMesh) {
      c.castShadow = false
      if (c.receiveShadow === undefined) c.receiveShadow = true
    }
  })

  ctx.villageGroup.add(group)

  // Register material with the day/night system so night mode brightens
  // the logo's emissive. Registry function may not exist on first call
  // (race during init) — guard.
  if (ctx.dayNight && typeof ctx.dayNight.registerLogoMaterial === 'function') {
    ctx.dayNight.registerLogoMaterial(logoMat)
  } else {
    // Stash for later registration if the day/night system loads after
    // logo stations.
    ctx._pendingLogoMaterials = ctx._pendingLogoMaterials || []
    ctx._pendingLogoMaterials.push(logoMat)
  }
}


// ═══════════════════════════════════════════════════════════════════════════
//  Public — build all 8 tool stations
// ═══════════════════════════════════════════════════════════════════════════
export function createLogoStations(ctx) {
  for (const s of TOOL_STATIONS) placeStation(ctx, s)
}
