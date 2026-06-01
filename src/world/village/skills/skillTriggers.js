// ═══════════════════════════════════════════════════════════════════════════
//  SKILL TRIGGERS — proximity-based HTML overlay
// ═══════════════════════════════════════════════════════════════════════════
//
//  When the player walks within `r` units of any trigger, the bottom-centre
//  overlay fades in with the trigger's title and one-line narrative.
//  When the player leaves all trigger zones, the overlay fades out.
//
//  • Pure JS, no per-frame DOM mutation unless the active trigger CHANGES
//    (so steady-state walking = zero DOM work).
//  • One trigger active at a time (closest wins).
//  • CSS for #skill-overlay lives in index.html — this module never
//    touches stylesheets.
//
//  Register: villageBuilder pushes updateSkillTriggers into
//  ctx.dynamicUpdaters via registerSkillTriggers(ctx).
// ═══════════════════════════════════════════════════════════════════════════

// ── Trigger list ─────────────────────────────────────────────────────────
//   Matches the 8 tool/brand logo stations from logoStations.js, plus
//   the entrance / campfire / exit atmospheric markers.
//   r = 7 fires the overlay while the player walks the road OR steps
//   slightly toward the fence — never requires wandering deep.
// NOTE: tool-station triggers were removed when the logo-board setup was
// disabled. Only entrance / campfire / exit atmospheric triggers remain.
// The new "Skill Rock + Floating Logo" system will add per-tool triggers
// back once its layout is approved.
const TRIGGERS = [
  // Entrance
  { x: -14, z: -178, r: 5.0,
    title: 'Skills Forest',
    text:  'Five pillars of how I work — what I have grown into, quietly, over years.' },

  // ── Pillar 1 — Product, UX & Graphic Design (LEFT, z=-205) ───────────
  //   Coordinates match the trail-pos output for (z=-205, side=L, outset=16)
  //   so the overlay fires when the player approaches the pillar.
  { x: -19, z: -205, r: 8.0,
    title: 'Product, UX & Graphic Design',
    text:  'Where I think — research, wireframes, systems, craft. Figma · Illustrator · Zeplin · Photoshop · InDesign · Figma AI.' },

  // Campfire — atmospheric marker deeper off-road
  { x: -28, z: -360, r: 6.0,
    title: 'Around the Fire',
    text:  'A quiet place to rest before the climb begins.' },

  // Exit
  { x: 0, z: -375, r: 5.0,
    title: 'Career Mountains Ahead',
    text:  'The climb begins here — companies, roles, and the path I want to walk next.' },
]

// ── Internal state (module-scoped) ───────────────────────────────────────
let _overlay = null
let _titleEl = null
let _textEl  = null
let _currentTrigger = null
let _initFailedWarned = false

function ensureOverlay() {
  if (_overlay) return true
  _overlay = document.getElementById('skill-overlay')
  _titleEl = document.getElementById('skill-overlay-title')
  _textEl  = document.getElementById('skill-overlay-text')
  if (!_overlay || !_titleEl || !_textEl) {
    if (!_initFailedWarned) {
      console.warn('[skillTriggers] #skill-overlay element not found in DOM — overlay disabled')
      _initFailedWarned = true
    }
    return false
  }
  return true
}

// ── Per-frame update ─────────────────────────────────────────────────────
export function updateSkillTriggers(ctx) {
  if (!ctx.character) return
  if (!ensureOverlay()) return

  const p = ctx.character.position
  let bestTrigger = null
  let bestDistSq  = Infinity

  for (const t of TRIGGERS) {
    const dx = p.x - t.x
    const dz = p.z - t.z
    const dSq = dx * dx + dz * dz
    const rSq = t.r * t.r
    if (dSq < rSq && dSq < bestDistSq) {
      bestDistSq  = dSq
      bestTrigger = t
    }
  }

  // Touch DOM only when the active trigger CHANGES — steady walking = 0 DOM work
  if (bestTrigger !== _currentTrigger) {
    _currentTrigger = bestTrigger
    if (bestTrigger) {
      _titleEl.textContent = bestTrigger.title
      _textEl.textContent  = bestTrigger.text
      _overlay.classList.add('visible')
    } else {
      _overlay.classList.remove('visible')
    }
  }
}

// ── Convenience: registers update fn into the per-frame loop ────────────
export function registerSkillTriggers(ctx) {
  if (!ctx.dynamicUpdaters) ctx.dynamicUpdaters = []
  ctx.dynamicUpdaters.push(() => updateSkillTriggers(ctx))
}
