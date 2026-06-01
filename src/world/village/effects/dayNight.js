import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════════════════
//  DAY / NIGHT TOGGLE
// ═══════════════════════════════════════════════════════════════════════════
//
//  Adds a fixed top-right button that toggles between Day and Night.
//
//  What changes on toggle:
//    • Ambient + Hemisphere + Directional sun light intensities
//    • Sun colour shifts cool-blue at night
//    • Scene background + fog colour
//    • Registered PointLights (entrance lantern, campfire) — boosted
//      at night so lit places actually feel lit
//    • Registered logo materials — emissiveIntensity boosted at night
//      so the brand boards read as illuminated signage
//
//  What does NOT need explicit handling:
//    • Existing emissive lamp meshes throughout the village pop
//      naturally when the global ambient/sun drops at night.
//
//  Performance:
//    • No new PointLights, SpotLights, or shaders are created.
//    • Toggle is one mode switch + a handful of property assignments —
//      O(registered_lights + registered_materials) per click, never
//      per-frame.
// ═══════════════════════════════════════════════════════════════════════════


// ── Mode presets ─────────────────────────────────────────────────────────
const PRESETS = {
  day: {
    ambient:        0.30,
    hemi:           0.55,
    sunIntensity:   2.50,
    sunColor:       0xfff8f0,
    background:     0xa8cce8,
    fog:            0xb8d4e8,
    fogDensity:     0.00012,
    pointMultiplier:0.70,     // lanterns barely on
    logoEmissive:   0.25,     // subtle illumination
  },
  night: {
    ambient:        0.10,
    hemi:           0.15,
    sunIntensity:   0.12,
    sunColor:       0x6a82b6,   // cool moonlight
    background:     0x0a1024,
    fog:            0x0a1024,
    fogDensity:     0.00020,
    pointMultiplier:1.85,     // lanterns / campfire much brighter
    logoEmissive:   1.30,     // boards lit as backlit signage
  },
}


// ── Toggle button (JS-injected, no index.html edit needed) ──────────────
function buildToggleButton() {
  const btn = document.createElement('button')
  btn.id          = 'day-night-toggle'
  btn.type        = 'button'
  btn.setAttribute('aria-label', 'Toggle day or night mode')
  btn.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    padding: 10px 18px;
    min-width: 110px;
    background: rgba(40, 25, 15, 0.86);
    border: 1px solid #c89a78;
    border-radius: 4px;
    color: #f5deb3;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 15px;
    cursor: pointer;
    z-index: 110;
    user-select: none;
    transition: background 0.18s ease, transform 0.12s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  `
  btn.addEventListener('mouseover', () => { btn.style.background = 'rgba(60, 40, 25, 0.92)' })
  btn.addEventListener('mouseout',  () => { btn.style.background = 'rgba(40, 25, 15, 0.86)' })
  btn.addEventListener('mousedown', () => { btn.style.transform = 'scale(0.97)' })
  btn.addEventListener('mouseup',   () => { btn.style.transform = 'scale(1)' })
  return btn
}


// ── Apply preset to scene ────────────────────────────────────────────────
function applyMode(ctx, mode) {
  const p  = PRESETS[mode]
  const dn = ctx.dayNight
  dn.mode  = mode

  // Ambient
  if (dn.ambient) dn.ambient.intensity = p.ambient
  // Hemisphere
  if (dn.hemi)    dn.hemi.intensity    = p.hemi
  // Sun (directional)
  if (dn.sun) {
    dn.sun.intensity = p.sunIntensity
    dn.sun.color.setHex(p.sunColor)
  }
  // Background + fog
  if (ctx.scene.background && ctx.scene.background.isColor) {
    ctx.scene.background.setHex(p.background)
  }
  if (ctx.scene.fog) {
    ctx.scene.fog.color.setHex(p.fog)
    if (ctx.scene.fog.isFogExp2) ctx.scene.fog.density = p.fogDensity
  }
  // Registered point lights (entrance lantern, campfire, etc.)
  for (const L of dn.lights) {
    L.light.intensity = L.baseIntensity * p.pointMultiplier
  }
  // Registered logo materials
  for (const m of dn.logoMaterials) {
    m.emissiveIntensity = p.logoEmissive
  }
}


// ── Scene light discovery (fallback if not stored on ctx) ───────────────
function discoverLights(ctx) {
  const found = { ambient: null, hemi: null, sun: null }
  ctx.scene.traverse((o) => {
    if (o.isAmbientLight   && !found.ambient) found.ambient = o
    if (o.isHemisphereLight && !found.hemi)   found.hemi    = o
    if (o.isDirectionalLight && !found.sun)   found.sun     = o
  })
  return found
}


// ═══════════════════════════════════════════════════════════════════════════
//  Public — install the toggle into the current ctx
// ═══════════════════════════════════════════════════════════════════════════
export function setupDayNightToggle(ctx) {
  // Resolve lights: prefer ctx-stored refs (set by environment.js), fall
  // back to scene traversal so this works even if env-side isn't updated.
  const discovered = discoverLights(ctx)

  ctx.dayNight = {
    mode:           'day',
    ambient:        ctx.ambient || discovered.ambient,
    hemi:           ctx.hemi    || discovered.hemi,
    sun:            ctx.sun     || discovered.sun,
    lights:         [],         // [{ light, baseIntensity }]
    logoMaterials:  [],         // [MeshStandardMaterial]
    // Public registration API used by logoStations.js and skillsForest.js
    registerLight: (light) => {
      ctx.dayNight.lights.push({ light, baseIntensity: light.intensity })
    },
    registerLogoMaterial: (mat) => {
      ctx.dayNight.logoMaterials.push(mat)
    },
  }

  // Drain any materials/lights that were registered before this fn ran
  if (ctx._pendingLogoMaterials) {
    for (const m of ctx._pendingLogoMaterials) {
      ctx.dayNight.registerLogoMaterial(m)
    }
    ctx._pendingLogoMaterials = null
  }
  if (ctx._pendingLights) {
    for (const L of ctx._pendingLights) {
      ctx.dayNight.registerLight(L)
    }
    ctx._pendingLights = null
  }

  // Build + attach the button
  const btn = buildToggleButton()
  document.body.appendChild(btn)
  const setLabel = () => {
    btn.textContent = ctx.dayNight.mode === 'day' ? '🌙  Night' : '☀️  Day'
  }
  btn.addEventListener('click', () => {
    const next = ctx.dayNight.mode === 'day' ? 'night' : 'day'
    applyMode(ctx, next)
    setLabel()
  })
  // Initialise in DAY mode
  applyMode(ctx, 'day')
  setLabel()
}
