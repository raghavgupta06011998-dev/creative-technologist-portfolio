import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════════════════
//  SKILL EMBLEMS — procedural 3D symbols for the Skill Trail
// ═══════════════════════════════════════════════════════════════════════════
//
//  Each emblem is a small Group composed of Three.js primitives. It sits
//  on a low procedural stone pedestal (with an engraved name plate on
//  the road-facing side) and floats / rotates gently above it.
//
//  Phase 1 builds the autumn (Zone 1) palette only. The same builders
//  accept a `theme` object so later zones can recolour by passing
//  different palettes — no architectural changes needed.
//
//  Performance:
//    • One shared material per role (pedestal stone, brass body, cream
//      accent, amber emissive, halo ring). 5 materials total for the
//      entire zone regardless of how many emblems we add.
//    • Geometries are reused where the same primitive appears across
//      multiple emblems (e.g. pedestal cylinder).
//    • Animation: one updater pushed into ctx.dynamicUpdaters loops
//      over every emblem group and sets transform — O(n) per frame.
// ═══════════════════════════════════════════════════════════════════════════


// ── Theme palettes ────────────────────────────────────────────────────────
//   Phase 1 ships only the autumn palette (Zone 1). Other zones will get
//   their own palette object in later phases without touching the builders.
export const THEME_AUTUMN = {
  pedestal:        0x3a2618,    // warm dark stone
  body:            0xa0651e,    // brushed brass / copper
  bodyRoughness:   0.4,
  bodyMetalness:   0.65,
  accent:          0xe8d8b0,    // cream / page tone
  emissive:        0xff9430,    // amber glow
  emissiveStrong:  0xffb060,    // brighter accent (ribbon, halo highlight)
  haloOpacity:     0.30,
}

// ── Shared materials per theme (cached) ──────────────────────────────────
const _matCache = new Map()
function matsFor(theme) {
  if (_matCache.has(theme)) return _matCache.get(theme)
  const mats = {
    stone: new THREE.MeshStandardMaterial({
      color:     theme.pedestal,
      roughness: 0.95,
      metalness: 0,
    }),
    body: new THREE.MeshStandardMaterial({
      color:             theme.body,
      roughness:         theme.bodyRoughness,
      metalness:         theme.bodyMetalness,
      emissive:          new THREE.Color(theme.emissive),
      emissiveIntensity: 0.18,
    }),
    accent: new THREE.MeshStandardMaterial({
      color:             theme.accent,
      roughness:         0.75,
      metalness:         0.05,
      emissive:          new THREE.Color(theme.emissive),
      emissiveIntensity: 0.25,
    }),
    glow: new THREE.MeshStandardMaterial({
      color:             0x111111,
      emissive:          new THREE.Color(theme.emissiveStrong),
      emissiveIntensity: 1.30,
      roughness:         1.0,
      metalness:         0,
      side:              THREE.DoubleSide,
    }),
    halo: new THREE.MeshBasicMaterial({
      color:       theme.emissive,
      transparent: true,
      opacity:     theme.haloOpacity,
      side:        THREE.DoubleSide,
      depthWrite:  false,
    }),
    plate: new THREE.MeshStandardMaterial({
      color:             0x2a1a0c,
      roughness:         0.85,
      metalness:         0.15,
      emissive:          new THREE.Color(theme.emissive),
      emissiveIntensity: 0.08,
    }),
  }
  _matCache.set(theme, mats)
  return mats
}

// ── Shared geometries (cached, reused across all emblems / pedestals) ────
const _pedestalGeo = new THREE.CylinderGeometry(0.42, 0.55, 0.55, 14)
const _haloGeo     = new THREE.RingGeometry(0.60, 0.78, 32)
const _plateGeo    = new THREE.PlaneGeometry(0.52, 0.18)


// ── Name plate texture (small carved sign on pedestal front) ─────────────
//   Builds a canvas texture with the skill name in serif type, sized to
//   the plate proportions. Each emblem gets one (cheap; small canvases).
function makeNamePlateTexture(name) {
  const w = 312, h = 108
  const canvas = document.createElement('canvas')
  canvas.width  = w
  canvas.height = h
  const c = canvas.getContext('2d')

  // Dark engraved background
  c.fillStyle = '#1a0f06'
  c.fillRect(0, 0, w, h)
  // Subtle inner border
  c.strokeStyle = '#7a4a20'
  c.lineWidth = 3
  c.strokeRect(5, 5, w - 10, h - 10)
  // Name
  c.textAlign    = 'center'
  c.textBaseline = 'middle'
  c.fillStyle    = '#f0caa0'
  c.font         = 'bold 36px Georgia, "Times New Roman", serif'
  c.fillText(name, w / 2, h / 2)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}


// ═══════════════════════════════════════════════════════════════════════════
//  Pedestal — small stone base + engraved name plate on the road-facing side
// ═══════════════════════════════════════════════════════════════════════════
function buildPedestal(name, theme) {
  const mats = matsFor(theme)
  const group = new THREE.Group()

  // Stone cylinder
  const stone = new THREE.Mesh(_pedestalGeo, mats.stone)
  stone.position.y    = 0.275
  stone.castShadow    = false
  stone.receiveShadow = true
  group.add(stone)

  // Engraved name plate on the +Z face (road-facing side after rotY)
  const tex = makeNamePlateTexture(name)
  const plateMat = new THREE.MeshStandardMaterial({
    map:               tex,
    roughness:         0.85,
    metalness:         0.15,
    emissive:          new THREE.Color(theme.emissive),
    emissiveIntensity: 0.10,
  })
  const plate = new THREE.Mesh(_plateGeo, plateMat)
  plate.position.set(0, 0.33, 0.52)   // sits proud of the stone, road-facing
  plate.castShadow    = false
  plate.receiveShadow = true
  group.add(plate)

  // Ground halo ring at base
  const halo = new THREE.Mesh(_haloGeo, mats.halo)
  halo.rotation.x  = -Math.PI / 2
  halo.position.y  = 0.04
  halo.renderOrder = 3
  group.add(halo)

  return group
}


// ═══════════════════════════════════════════════════════════════════════════
//  Emblem builders — each returns a THREE.Group with the symbol
// ═══════════════════════════════════════════════════════════════════════════

// 1. UX Research — magnifying glass
function buildMagnifyingGlass(theme) {
  const m = matsFor(theme)
  const g = new THREE.Group()

  // Lens frame
  const frame = new THREE.Mesh(
    new THREE.TorusGeometry(0.30, 0.045, 12, 32),
    m.body,
  )
  g.add(frame)

  // Glass disc (translucent cream)
  const glass = new THREE.Mesh(
    new THREE.CircleGeometry(0.26, 32),
    new THREE.MeshStandardMaterial({
      color:             theme.accent,
      transparent:       true,
      opacity:           0.38,
      roughness:         0.25,
      metalness:         0.10,
      emissive:          new THREE.Color(theme.emissive),
      emissiveIntensity: 0.45,
      side:              THREE.DoubleSide,
    }),
  )
  g.add(glass)

  // Handle (angled down-right)
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.42, 10),
    m.body,
  )
  // Place handle so its inner end touches the lens edge at 45°
  handle.rotation.z = Math.PI * 0.30   // tilt
  handle.position.set(0.32, -0.32, 0)
  g.add(handle)

  // Slight initial tilt so the glass faces the player
  g.rotation.x = -0.15
  return g
}

// 2. Design Thinking — three connected nodes (process loop)
function buildNodeTrio(theme) {
  const m = matsFor(theme)
  const g = new THREE.Group()

  const r = 0.32                        // triangle radius
  const nodes = []
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 - Math.PI / 2
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 14, 12),
      m.body,
    )
    node.position.set(x, y, 0)
    g.add(node)
    nodes.push(new THREE.Vector3(x, y, 0))
  }

  // Edges — thin cylinders between consecutive nodes (forms a closed loop)
  for (let i = 0; i < 3; i++) {
    const a = nodes[i]
    const b = nodes[(i + 1) % 3]
    const mid = a.clone().add(b).multiplyScalar(0.5)
    const len = a.distanceTo(b)
    const edge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, len, 8),
      m.body,
    )
    edge.position.copy(mid)
    // Rotate cylinder to align with (b - a)
    const dir = b.clone().sub(a).normalize()
    const up  = new THREE.Vector3(0, 1, 0)
    const q   = new THREE.Quaternion().setFromUnitVectors(up, dir)
    edge.quaternion.copy(q)
    g.add(edge)
  }
  return g
}

// 3. Problem Solving — two interlocking rings (chain link)
function buildInterlockedRings(theme) {
  const m = matsFor(theme)
  const g = new THREE.Group()

  const ringGeo = new THREE.TorusGeometry(0.24, 0.045, 12, 28)

  const ringA = new THREE.Mesh(ringGeo, m.body)
  ringA.position.x = -0.15
  g.add(ringA)

  // Second ring — slightly different tone via custom material instance
  // (still inexpensive: just one extra material for visual contrast).
  const ringBMat = new THREE.MeshStandardMaterial({
    color:             0x8a4a14,        // deeper copper
    roughness:         0.45,
    metalness:         0.55,
    emissive:          new THREE.Color(theme.emissive),
    emissiveIntensity: 0.20,
  })
  const ringB = new THREE.Mesh(ringGeo, ringBMat)
  ringB.position.x = 0.15
  ringB.rotation.y = Math.PI / 2   // perpendicular ring → interlocked silhouette
  g.add(ringB)

  return g
}

// 4. Information Architecture — four stacked layers ascending
function buildLayerStack(theme) {
  const m = matsFor(theme)
  const g = new THREE.Group()

  const sizes = [0.62, 0.50, 0.38, 0.26]
  const thick = 0.055
  const gap   = 0.04
  let y = -((sizes.length * (thick + gap)) / 2) + thick / 2
  for (const w of sizes) {
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(w, thick, w),
      m.body,
    )
    slab.position.y = y
    g.add(slab)

    // Emissive edge accent on top of each layer
    const edge = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.98, 0.005, w * 0.98),
      m.glow,
    )
    edge.position.y = y + thick / 2 + 0.003
    g.add(edge)

    y += thick + gap
  }
  return g
}

// 5. User Psychology — head sphere with tilted aura ring
function buildHeadAura(theme) {
  const m = matsFor(theme)
  const g = new THREE.Group()

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.20, 18, 14),
    m.body,
  )
  g.add(head)

  // Aura ring — tilted, larger, faintly glowing
  const aura = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.022, 10, 36),
    m.glow,
  )
  aura.rotation.x = Math.PI / 2.4    // tilt forward
  aura.rotation.y = 0.3
  g.add(aura)

  // Single small accent dot above the head (idea / insight)
  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 10, 8),
    m.glow,
  )
  dot.position.y = 0.32
  g.add(dot)
  return g
}

// 6. Storytelling — open book with glowing ribbon
function buildOpenBook(theme) {
  const m = matsFor(theme)
  const g = new THREE.Group()

  // Two page-halves tilted into a V
  const pageGeo = new THREE.BoxGeometry(0.42, 0.025, 0.32)
  const leftPage  = new THREE.Mesh(pageGeo, m.accent)
  const rightPage = new THREE.Mesh(pageGeo, m.accent)
  const tilt = 0.45
  leftPage.position.set(-0.20, 0, 0)
  leftPage.rotation.z =  tilt
  rightPage.position.set(0.20, 0, 0)
  rightPage.rotation.z = -tilt
  g.add(leftPage, rightPage)

  // Spine
  const spine = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.06, 0.34),
    m.body,
  )
  spine.position.y = 0.06
  g.add(spine)

  // Rising ribbon — a thin curved emissive strip out of the spine
  const ribbonShape = new THREE.Shape()
  ribbonShape.moveTo(0, 0)
  ribbonShape.lineTo(0.04, 0)
  ribbonShape.lineTo(0.04, 0.45)
  ribbonShape.lineTo(0, 0.45)
  ribbonShape.lineTo(0, 0)
  const ribbon = new THREE.Mesh(
    new THREE.ShapeGeometry(ribbonShape),
    m.glow,
  )
  ribbon.position.set(-0.02, 0.08, 0)
  ribbon.rotation.x = -0.15
  g.add(ribbon)

  return g
}


// ── Emblem registry ──────────────────────────────────────────────────────
const EMBLEM_BUILDERS = {
  ux_research:            buildMagnifyingGlass,
  design_thinking:        buildNodeTrio,
  problem_solving:        buildInterlockedRings,
  information_architecture: buildLayerStack,
  user_psychology:        buildHeadAura,
  storytelling:           buildOpenBook,
}


// ═══════════════════════════════════════════════════════════════════════════
//  Public API
// ═══════════════════════════════════════════════════════════════════════════

// Animated emblem records — module-scoped, animated by a single updater.
const _animated = []

// Build a complete emblem instance (pedestal + emblem + animation hook)
// and place it at world (x, z) with rotY (so the name plate faces the road).
//
//   ctx        — village ctx (we add to villageGroup and dynamicUpdaters)
//   kind       — key into EMBLEM_BUILDERS
//   title      — name engraved on the pedestal plate
//   x, z, rotY — world position + Y rotation
//   theme      — palette object (THEME_AUTUMN for Zone 1)
export function placeEmblem(ctx, { kind, title, x, z, rotY, theme }) {
  const root = new THREE.Group()
  root.position.set(x, 0, z)
  root.rotation.y = rotY

  // Pedestal
  root.add(buildPedestal(title, theme))

  // Emblem above pedestal
  const emblemBuilder = EMBLEM_BUILDERS[kind]
  if (!emblemBuilder) {
    console.warn(`[skillEmblems] unknown emblem kind: ${kind}`)
    return
  }
  const emblem = emblemBuilder(theme)
  // Lift emblem above pedestal top (pedestal top is at y ≈ 0.55)
  const EMBLEM_BASE_Y = 1.20
  emblem.position.y = EMBLEM_BASE_Y
  root.add(emblem)

  // Shadows off (matches forest convention); receive on for plate/pedestal
  root.traverse((c) => {
    if (c.isMesh) {
      c.castShadow = false
      if (c.receiveShadow === undefined) c.receiveShadow = true
    }
  })

  ctx.villageGroup.add(root)

  // Register animation — gentle bob + slow rotate on emblem group
  _animated.push({
    emblem,
    baseY: EMBLEM_BASE_Y,
    phase: Math.random() * Math.PI * 2,
    // small rotation speed variation so the trail doesn't feel mechanical
    rotSpeed: 0.00022 + Math.random() * 0.00014,
  })
}

// Per-frame updater — pushed into ctx.dynamicUpdaters by villageBuilder.
// O(n) over emblems; trivially cheap for ~30 emblems max in the forest.
export function updateEmblems(time) {
  for (const a of _animated) {
    a.emblem.position.y = a.baseY + Math.sin(time * 0.0009 + a.phase) * 0.07
    a.emblem.rotation.y = time * a.rotSpeed
  }
}

// Convenience: registers the updater into ctx.dynamicUpdaters.
export function registerEmblemAnimation(ctx) {
  if (!ctx.dynamicUpdaters) ctx.dynamicUpdaters = []
  ctx.dynamicUpdaters.push(updateEmblems)
}
