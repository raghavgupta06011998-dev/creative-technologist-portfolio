import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { placeAsset } from '../utils/assetLoader.js'
import { LANE_PTS } from '../roads/skillsForestRoad.js'

// ═══════════════════════════════════════════════════════════════════════════
//  SKILL PILLARS — five sacred-grove monuments along the forest road
// ═══════════════════════════════════════════════════════════════════════════
//
//  Each pillar = ONE mossy boulder anchor + ONE hero floating logo + TWO
//  supporting floating logos. Logos are 3D-extruded from official brand
//  SVGs (CC0 Simple Icons by default). If an SVG isn't on disk yet, a
//  procedural canvas-textured placeholder takes its place automatically
//  and is replaced with the real extrusion the moment the SVG loads.
//
//  Phase 1 ships only Pillar 1 (Design). Adding the other four is a
//  data-only change to PILLARS below — no code edits required.
//
//  Performance:
//    • One PointLight per pillar? — No. Zero new lights. Logo glow is
//      pure emissive material; halo at the base is a transparent ring.
//    • Floating animation: single update fn pushed to ctx.dynamicUpdaters
//      iterates registered logos — 3 transform writes per pillar per
//      frame, trivially cheap.
//    • Materials: brand-coloured MeshStandardMaterial per logo; total
//      memory ≈ 15 small geometries + 15 materials when all 5 pillars
//      are live.
// ═══════════════════════════════════════════════════════════════════════════


// ── Curve sampler (mirrors road + fence) ─────────────────────────────────
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
function trailPos(targetZ, side, outset) {
  const i  = nearestIndexForZ(targetZ)
  const c  = _samples[i]
  const tg = _tangents[i]
  const sign = side === 'L' ? -1 : 1
  const nx = -tg.z, nz = tg.x
  const x  = c.x + nx * sign * outset
  const z  = c.z + nz * sign * outset
  const rotY = Math.atan2(-sign * nx, -sign * nz)
  return { x, z, rotY }
}


// ── Constants ────────────────────────────────────────────────────────────
const PEDESTAL_ASSET   = 'boulder_mossy_lg'
const PEDESTAL_SCALE   = 2.20      // all 5 pillars identical — neutrality is the point
const OUTSET           = 16        // 16u from road centreline (fence is at 12u)

const HERO_TARGET_SIZE = 1.40      // hero logo bounding-box height (world units)
const SUPP_TARGET_SIZE = 0.85      // supporting logo bounding-box height

const HERO_Y           = 3.60      // hero logo centre height above ground
const SUPP_Y           = 2.70      // supporting logo centre height
const SUPP_OFFSET_X    = 1.15      // supporting logos to either side of hero (local X)

const EXTRUDE_DEPTH    = 0.10      // 10cm logo thickness — reads as 3D, not slab


// ── Halo geometry + material per pillar (theme-coloured) ────────────────
const _haloGeo = new THREE.RingGeometry(1.50, 1.88, 40)
const _haloMaterials = new Map()
function haloMatFor(colorHex) {
  if (!_haloMaterials.has(colorHex)) {
    _haloMaterials.set(colorHex, new THREE.MeshBasicMaterial({
      color:        colorHex,
      transparent:  true,
      opacity:      0.32,
      side:         THREE.DoubleSide,
      depthWrite:   false,
    }))
  }
  return _haloMaterials.get(colorHex)
}


// ── Procedural placeholder texture (used while SVG loads, or if missing) ─
function makePlaceholderTexture(label, brandHex) {
  const w = 512, h = 512
  const canvas = document.createElement('canvas')
  canvas.width  = w
  canvas.height = h
  const c = canvas.getContext('2d')

  // Brand-coloured background (slightly darkened for legibility behind text)
  c.fillStyle = '#' + brandHex.toString(16).padStart(6, '0')
  c.fillRect(0, 0, w, h)

  // Subtle inner border
  c.strokeStyle = 'rgba(255,255,255,0.20)'
  c.lineWidth   = 6
  c.strokeRect(14, 14, w - 28, h - 28)

  // Wordmark (white) — automatically downsizes if label is long
  c.fillStyle    = '#FFFFFF'
  c.textAlign    = 'center'
  c.textBaseline = 'middle'
  let fontSize = label.length > 8 ? 70 : 96
  c.font = `bold ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`
  c.fillText(label, w / 2, h / 2)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}


// ── Build a placeholder logo mesh (canvas-textured square plane) ─────────
function buildPlaceholderLogo(label, brandHex, targetSize) {
  const tex = makePlaceholderTexture(label, brandHex)
  const mat = new THREE.MeshStandardMaterial({
    map:               tex,
    emissiveMap:       tex,
    emissive:          new THREE.Color(0xffffff),
    emissiveIntensity: 0.20,
    roughness:         0.50,
    metalness:         0.10,
    side:              THREE.DoubleSide,
  })
  const geo  = new THREE.PlaneGeometry(targetSize, targetSize)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.castShadow = false
  return { mesh, mat }
}


// ── Build an extruded-SVG logo (when the file is available) ──────────────
//   Returns a Promise resolving to { mesh, mat } on success, rejects on
//   network/parse failure. We auto-scale to targetSize, recentre, and
//   flip Y (SVG y-down → Three.js y-up).
function buildExtrudedSVGLogo(url, brandHex, targetSize) {
  return new Promise((resolve, reject) => {
    const loader = new SVGLoader()
    loader.load(
      url,
      (data) => {
        try {
          const group = new THREE.Group()
          const mat = new THREE.MeshStandardMaterial({
            color:             brandHex,
            roughness:         0.42,
            metalness:         0.55,
            emissive:          new THREE.Color(brandHex),
            emissiveIntensity: 0.20,
            side:              THREE.DoubleSide,
          })
          for (const path of data.paths) {
            // Simple Icons paths are single-color silhouettes
            const shapes = SVGLoader.createShapes(path)
            for (const shape of shapes) {
              const geo = new THREE.ExtrudeGeometry(shape, {
                depth:         EXTRUDE_DEPTH,
                bevelEnabled:  false,
                curveSegments: 12,
              })
              const mesh = new THREE.Mesh(geo, mat)
              mesh.castShadow = false
              group.add(mesh)
            }
          }
          // Flip SVG Y (svg has y-down)
          group.scale.y = -1
          // Centre + scale to target size
          const box  = new THREE.Box3().setFromObject(group)
          const size = new THREE.Vector3()
          box.getSize(size)
          // Avoid division by zero on degenerate SVGs
          if (size.y === 0 || size.x === 0) {
            reject(new Error('Degenerate SVG bounding box'))
            return
          }
          const fit = targetSize / Math.max(size.x, size.y)
          group.scale.multiplyScalar(fit)
          const box2   = new THREE.Box3().setFromObject(group)
          const center = new THREE.Vector3()
          box2.getCenter(center)
          group.position.sub(center)

          resolve({ mesh: group, mat })
        } catch (err) {
          reject(err)
        }
      },
      undefined,
      (err) => reject(err),
    )
  })
}


// ── Combined logo mount: placeholder first, async swap-in when SVG loads ─
//   Returns { container, registerMat } where:
//     container — a THREE.Group ready to add to the scene
//     registerMat — a callback that re-registers the current material
//       reference (used by day/night). When the SVG swaps in, the new
//       material is also registered so toggling night still brightens it.
function buildLogoMount(ctx, fileKey, label, brandHex, targetSize) {
  const container = new THREE.Group()
  const placeholder = buildPlaceholderLogo(label, brandHex, targetSize)
  container.add(placeholder.mesh)

  // Register placeholder material with day/night
  registerWithDayNight(ctx, placeholder.mat)

  // Attempt to load the real SVG; if missing or broken, placeholder stays.
  const url = `/assets/skills/logos/${fileKey}.svg`
  buildExtrudedSVGLogo(url, brandHex, targetSize)
    .then(({ mesh, mat }) => {
      container.remove(placeholder.mesh)
      placeholder.mesh.geometry.dispose()
      container.add(mesh)
      // Register the new material with day/night so night-glow works
      registerWithDayNight(ctx, mat)
    })
    .catch(() => {/* expected when SVG not yet placed — silent */})

  return { container }
}

function registerWithDayNight(ctx, mat) {
  if (ctx.dayNight && typeof ctx.dayNight.registerLogoMaterial === 'function') {
    ctx.dayNight.registerLogoMaterial(mat)
  } else {
    ctx._pendingLogoMaterials = ctx._pendingLogoMaterials || []
    ctx._pendingLogoMaterials.push(mat)
  }
}


// ── Animation registry ───────────────────────────────────────────────────
//   One updater iterates all registered logos every frame. Each entry
//   carries its base position + phase so bob/rotate stays smooth.
const _animated = []
let _updaterRegistered = false

function registerLogoAnimation(ctx, mount, baseY, isHero) {
  _animated.push({
    group:    mount.container,
    baseY,
    phase:    Math.random() * Math.PI * 2,
    bobAmp:   isHero ? 0.18 : 0.12,
    bobSpeed: isHero ? 0.0014 : 0.0019,
    rotSpeed: isHero ? 0.00018 : 0.00024,
  })

  // Push the per-frame fn only once into ctx.dynamicUpdaters
  if (!_updaterRegistered) {
    if (!ctx.dynamicUpdaters) ctx.dynamicUpdaters = []
    ctx.dynamicUpdaters.push((time) => {
      for (const a of _animated) {
        a.group.position.y = a.baseY + Math.sin(time * a.bobSpeed + a.phase) * a.bobAmp
        a.group.rotation.y = time * a.rotSpeed
      }
    })
    _updaterRegistered = true
  }
}


// ═══════════════════════════════════════════════════════════════════════════
//  PILLAR DATA — Phase 1 has ONE entry. Add the others to roll out Phase 2.
// ═══════════════════════════════════════════════════════════════════════════
//   side          'L' / 'R'
//   z             position along the road
//   haloColor     subtle ground halo + pillar identity colour
//   hero / supp   each = { key (filename without .svg), label (placeholder
//                 text), color (brand hex) }
const PILLARS = [
  {
    id:        'design',
    title:     'Product, UX & Graphic Design',
    side:      'L',
    z:         -205,
    haloColor: 0x6ea1a0,                        // warm teal
    hero:      { key: 'figma',       label: 'Figma',       color: 0xF24E1E },
    supporting: [
      { key: 'illustrator', label: 'Ai', color: 0xFF9A00 },
      { key: 'zeplin',      label: 'Zp', color: 0xFDBD39 },
    ],
  },

  // ── Phase 2 (commented out until visual approval of Pillar 1) ────────
  // {
  //   id:        'ai',
  //   title:     'AI Workflows, Agents & Vibe Coding',
  //   side:      'R',
  //   z:         -240,
  //   haloColor: 0x4a90e2,                       // cool cyan-blue
  //   hero:      { key: 'claude',  label: 'Claude',  color: 0xD97757 },
  //   supporting: [
  //     { key: 'chatgpt', label: 'GPT',   color: 0x10A37F },
  //     { key: 'glean',   label: 'Glean', color: 0x6F61C0 },
  //   ],
  // },
  // {
  //   id:        'workflow',
  //   title:     'Internal Tools, Jira & Workflows',
  //   side:      'L',
  //   z:         -275,
  //   haloColor: 0x8a6dc0,                       // muted purple
  //   hero:      { key: 'jira',  label: 'Jira',  color: 0x0052CC },
  //   supporting: [
  //     { key: 'slack', label: 'Slack', color: 0x4A154B },
  //     { key: 'rovo',  label: 'Rovo',  color: 0x172B4D },
  //   ],
  // },
  // {
  //   id:        'data',
  //   title:     'Data, Dashboards & Insights',
  //   side:      'R',
  //   z:         -310,
  //   haloColor: 0xd4a050,                       // amber/gold
  //   hero:      { key: 'tableau', label: 'Tableau', color: 0xE97627 },
  //   supporting: [
  //     { key: 'looker', label: 'Looker', color: 0x4285F4 },
  //     { key: 'jira',   label: 'Jira',   color: 0x0052CC },  // reuse jira.svg
  //   ],
  // },
  // {
  //   id:        'creative',
  //   title:     'Creative Production & Presentation',
  //   side:      'L',
  //   z:         -345,
  //   haloColor: 0xe07050,                       // warm rose
  //   hero:      { key: 'photoshop', label: 'Ps', color: 0x31A8FF },
  //   supporting: [
  //     { key: 'firefly',    label: 'Firefly', color: 0xC74634 },
  //     { key: 'powerpoint', label: 'PPT',     color: 0xD24726 },
  //   ],
  // },
]


// ═══════════════════════════════════════════════════════════════════════════
//  Build one pillar (anchor + hero + 2 supporting logos)
// ═══════════════════════════════════════════════════════════════════════════
function buildPillar(ctx, pillar) {
  const p = trailPos(pillar.z, pillar.side, OUTSET)

  // 1) Anchor — mossy boulder, ground-snapped via placeAsset
  const stoneRotY = Math.random() * Math.PI * 2
  placeAsset(ctx, PEDESTAL_ASSET, p.x, 0, p.z, PEDESTAL_SCALE, stoneRotY)

  // 2) A "rig" group at the pillar position, rotated so local +Z faces the
  //    road. Children (halo + logos) are placed in local space — much
  //    easier than computing world offsets.
  const rig = new THREE.Group()
  rig.position.set(p.x, 0, p.z)
  rig.rotation.y = p.rotY
  ctx.villageGroup.add(rig)

  // Halo ring on the ground at base
  const halo = new THREE.Mesh(_haloGeo, haloMatFor(pillar.haloColor))
  halo.rotation.x  = -Math.PI / 2
  halo.position.y  = 0.06
  halo.renderOrder = 3
  rig.add(halo)

  // Hero logo — large, centre, higher
  const hero = buildLogoMount(ctx, pillar.hero.key, pillar.hero.label, pillar.hero.color, HERO_TARGET_SIZE)
  hero.container.position.set(0, HERO_Y, 0)
  rig.add(hero.container)
  registerLogoAnimation(ctx, hero, HERO_Y, true)

  // Two supporting logos — smaller, lower, offset to either side
  const offsets = [-SUPP_OFFSET_X, +SUPP_OFFSET_X]
  pillar.supporting.forEach((supp, i) => {
    const mount = buildLogoMount(ctx, supp.key, supp.label, supp.color, SUPP_TARGET_SIZE)
    mount.container.position.set(offsets[i], SUPP_Y, 0)
    rig.add(mount.container)
    registerLogoAnimation(ctx, mount, SUPP_Y, false)
  })
}


// ═══════════════════════════════════════════════════════════════════════════
//  Public — build all enabled pillars
// ═══════════════════════════════════════════════════════════════════════════
export function createSkillPillars(ctx) {
  for (const pillar of PILLARS) buildPillar(ctx, pillar)
}

// Export the pillar data so triggers / clearings can stay in sync.
export { PILLARS as PILLAR_DATA }
