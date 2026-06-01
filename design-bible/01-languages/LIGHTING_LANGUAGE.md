# LIGHTING_LANGUAGE.md — The Light & Mood Authority

> **Layer:** 01 · Languages (global)
> **Status:** LOCKED · zone moods in §6 · day/night in §7
> **Version:** 1.0 · **Last updated:** 2026-05-31
> **Inherits from:** `PORTFOLIO_BIBLE.md`, `VISUAL_LANGUAGE.md`
> **Governs:** light direction, mood, color temperature, glow, light-as-wayfinding, day/night,
> and the performance discipline of lighting.
> **Purpose:** Light is the World's primary mood instrument and its quietest wayfinding tool.
> This document is the authority for whether a scene's light belongs.

---

## §1 · The one lighting sentence
**Golden hour is the master key.** Warm, low, directional sun; soft ambient warmth; pools of
gentle glow in the dark. Light should feel *felt on the skin* — the opposite of flat or
clinical.

## §2 · The lighting philosophy
- **Light is emotion.** Every mood beat in the four journeys (Bible §7) is delivered first by
  light: warmth = welcome, shafts = wonder, cool thin light = seriousness, dawn = hope.
- **Light is wayfinding.** Lanterns, glow, and bright focal pools *pull* the visitor forward and
  mark landmarks and transitions — diegetic navigation, no UI arrows.
- **Light reveals the focal point.** The brightest, warmest pool in any view is where the eye —
  and the visitor — should go.

## §3 · Key, fill, and ambient (the recipe)
- **Key:** a warm, low, directional sun (golden-hour angle). Long, soft, romantic light.
- **Fill:** cooler, gentle ambient/hemisphere to keep shadows from going black — never so strong
  it flattens the scene. Warm-from-above, soft-cool-from-below feel.
- **Bounce/atmosphere:** soft haze, light shafts through canopy/openings, dust motes where they
  add depth. Atmosphere = depth = cinema.
- **Contrast with intent:** strong enough for drama and a clear focal point; never so harsh it
  loses detail or so flat it loses mood.

## §4 · Glow (the only "magic" light)
- Glow is **warm and subtle**, integrated into nature/objects — *never neon, never cyberpunk.*
- **Emissive materials are the default glow tool**, not real lights. Reserve actual point/spot
  lights for a strict few hero sources (entrance lantern, campfire, key landmarks).
- Glow always reads as *natural energy* (firelight, lanternlight, living luminescence — e.g. the
  Living Swarm), never as UI or sci-fi.

## §5 · Performance discipline (canon)
- **Cast shadows are disabled globally** for performance. The *visual intent* of soft shadow is
  achieved through ambient occlusion baked into assets, contact darkening, and composition —
  not a live shadow pass. Mood must not depend on real-time shadows.
- **Strict light budget.** A small, fixed number of real lights per zone; everything else is
  emissive. Adding a real light per object is forbidden.
- Background/terrain meshes never drive expensive lighting.

## §6 · Per-zone mood
- **Portal:** cosmic, then a warm flood as the World opens — the threshold from cold space to
  warm world.
- **Village:** full golden hour, cozy, inviting; lanterns warm the lanes.
- **Hero House:** warmest, most intimate; glowing windows; hearth feeling.
- **Forest:** dappled golden shafts piercing a living-green canopy; clearings each carry a warm
  signature glow (per MASTER_FOREST); the Living Swarm is the brightest living light.
- **Mountains:** cooler, thinner, more serious light — altitude and credibility. Gates legibly
  lit for verification.
- **Projects:** lit to serve each world's clarity; the interactive flagship is bright and
  readable.
- **Future:** dawn — rising, hopeful, forward light.

## §7 · Day / Night (canon system)
- The World supports a **Day/Night toggle.**
- **Day:** golden-hour daylight; lanterns subtle; emissive low; the World reads warm and open.
- **Night:** ambient/sun drop and cool; fog/sky deepen; **lanterns, fire, and glow intensify**;
  emissive materials (logos, swarm, runes, windows) become the dominant points of interest.
- Night must *not* require new lights — it works by lowering global light and **raising existing
  emissive intensity.** Performance stays flat across the toggle.

## §8 · What BELONGS / what does NOT
**Belongs:** warm low sun; soft golden shafts; cozy lantern pools; warm subtle glow; readable
focal lighting; a deliberate cool-and-thin mood in the Mountains; dawn light in the Future.

**Does NOT belong:** flat even lighting with no focal point; cold/clinical white or blue light
as a mood; neon/cyberpunk glow; a real light added per object; mood that depends on real-time
shadows; harsh contrast that destroys detail; night mode that just turns everything dark with
nothing glowing.

## §9 · Evaluation checklist (for agents — "does this lighting belong?")
1. **Warmth/tone** — golden-hour band; warm or intentionally-cool (Mountains)? Not clinical? (§1,§6)
2. **Focal point** — is there one clear, well-lit focus? Not flat? (§2,§3)
3. **Glow** — warm, subtle, emissive-based, natural — not neon, not UI? (§4)
4. **Wayfinding** — does light guide the visitor toward landmarks/transitions? (§2)
5. **Performance** — emissive-first, within the light budget, no shadow-dependence? (§5)
6. **Day/Night** — does it behave correctly in both modes (emissive carries night)? (§7)
7. **Zone mood** — matches the zone's prescribed mood? (§6)

> Cross-refs: color → `VISUAL_LANGUAGE.md §5`; emissive surfaces → `MATERIAL_LANGUAGE.md`.
