# VISUAL_LANGUAGE.md — The Art Direction Authority

> **Layer:** 01 · Languages (global — inherited by every Zone)
> **Status:** LOCKED · zone deviations noted in §8
> **Version:** 1.0 · **Last updated:** 2026-05-31
> **Inherits from:** `PORTFOLIO_BIBLE.md` (esp. §5 laws, §9 non-negotiables), `NARRATIVE_SPINE.md`
> **Governs:** form, realism level, composition, color, scale, detail density — across the World.
> **Purpose:** Defines what *looks* right and what does not. The authority for judging whether
> any tree, house, prop, environment, or scene belongs visually.

---

## §1 · The one visual sentence
**Semi-realistic, cinematic, golden-hour, handcrafted, warm.** A believable world a half-step
more beautiful than reality — *Pixar-grade warmth executed at PUBG/GTA-level realism*, never
cartoon, never clinical, never cold.

## §2 · Realism level (the spectrum, and where we sit)
- Target: **stylised realism.** Real materials, real proportions, real light — but composed,
  warmed, and slightly idealised. Think "the most beautiful 20 minutes of golden hour," not
  documentary neutrality and not toy-box stylisation.
- **Belongs:** PBR materials, believable wear, natural irregularity, grounded scale.
- **Does NOT belong:** flat-shaded cartoon assets, toy/low-poly-cute aesthetics, hyper-gritty
  photoreal grimness, plastic perfection, anime/cel shading.
- **The test:** *Could this exist in a warm, cinematic film frame?* If it reads as a game-jam
  prop or a children's toy, it fails.

## §3 · Form & silhouette language
- **Readable silhouettes first.** Every important object must be recognisable in shadow from the
  path. If you can't tell what it is by outline, it's too busy or too generic.
- **Natural irregularity.** Hand-made imperfection (a leaning fence, a worn step) over
  mechanical symmetry. The World is *tended by a person*, not stamped by a factory.
- **Hierarchy of form:** hero objects (Hero House, Bridge, Living Swarm, Mountain Hall) get the
  strongest, simplest silhouettes; supporting dressing stays quieter so it never competes.

## §4 · Composition rules (cinematic framing)
- **Foreground / midground / background** in every meaningful view — depth is mandatory; flat
  staging is forbidden.
- **One focal point per view.** Light, placement, and contrast guide the eye to it. Two
  competing focal points = a failed composition.
- **Read from the path.** The visitor experiences the World from the walkable route; every
  scene must compose *from there.* Beauty only visible from impossible angles doesn't count.
- **Negative space & breathing room.** Curated, not cluttered (Bible §5: memory over
  completeness). Density serves a focal point; it never fills emptiness for its own sake.
- **Framing devices** (arches, trees, terrain) lead the eye toward landmarks and transitions.
- **Leading lines** (paths, fences, light shafts) point toward where the visitor should go.

## §5 · Color philosophy
- **Master palette: golden hour.** Warm ambers, honeyed light, soft greens, earthy browns, warm
  stone. Warmth is the through-tone of the whole World (Bible: *humane, not cold*).
- **Per-zone color identity** (a recognisable shift, never a clash):
  - Village — warm gold, cozy earth tones.
  - Forest — deep living greens warmed by golden shafts; per-clearing accent (see MASTER_FOREST).
  - Mountains — cooler, more serious, thinner light (the tonal shift to the earned/credible).
  - Projects — each world may carry its own identity, but stays within the humane band.
  - Future — dawn light, hopeful, forward.
- **Saturation discipline:** rich but never garish. Color comes from *light and material*, not
  from cranked sliders.
- **BANNED:** neon, cyberpunk glow, cold blue clinical palettes, pure black/pure white UI-color
  in-world, candy/toy saturation. (Glow exists — see LIGHTING — but it is *warm and subtle*,
  never neon.)

## §6 · Scale & proportion
- **Believable human scale** everywhere. The visitor must feel correctly sized within the World.
- Doors, steps, fences, furniture read at human proportion; hero landmarks may be grand but
  never cartoonishly oversized.
- **Floating/clipping/incorrect-ground-contact is an automatic fail** (objects sit *on* the
  ground, grounded and shadowed-into-place visually).

## §7 · Detail density
- **Curated density.** Three perfect, meaningful details beat thirty generic props.
- Every object earns its place by **meaning, navigation, or composition** (Bible §12). "It's a
  nice asset" is not a reason to place it.
- Detail concentrates around focal points and discovery moments; transitional space stays calm.

## §8 · Per-zone deviations (allowed; everything else inherits the global)
- **Mountains:** cooler palette, thinner/harder light, more serious — a *deliberate* tonal break
  signalling the shift from warm capability to earned record. Still semi-realistic, still humane.
- **Forest clearings:** each may carry a signature accent color (per MASTER_FOREST), but stays
  within warm-living-green.
- **Projects:** each Project World may assert its own visual identity, but never violates
  realism level (§2) or the humane band (§5).
- **Portal/Future:** cosmic (Portal) and dawn (Future) palettes are permitted within "humane,
  not cold."

## §9 · What BELONGS / what does NOT (quick judgments)
**Belongs:** a weathered wooden fence with believable grain; a mossy realistic boulder; a tree
with natural asymmetry and PBR bark; a warm lantern; a house with handcrafted irregularity and
golden-lit windows; depth-staged scenes with one clear focal point.

**Does NOT belong:** a flat-shaded cartoon tree; a neon sign; a toy-style house; a pristine
plastic prop; a cold blue-lit scene; a flat single-plane composition; clutter with no focal
point; an oversized cartoon landmark; anything floating or clipping the ground; a billboard of
text used as the main visual.

## §10 · Evaluation checklist (for agents — "does this belong visually?")
Score each; any **No** in 1–6 is a likely rejection.
1. **Realism level** — semi-realistic, cinematic, not cartoon/toy/clinical? (§2)
2. **Tone** — warm/humane, within the golden-hour band? Not neon/cold? (§5)
3. **Silhouette** — readable and appropriately weighted (hero vs dressing)? (§3)
4. **Scale & grounding** — believable human scale, sits correctly on the ground? (§6)
5. **Composition fit** — supports a single focal point, reads from the path, adds depth? (§4)
6. **Earns its place** — serves meaning/navigation/composition, not filler? (§7)
7. **Zone fit** — matches the zone's color identity & deviation rules? (§8)
8. **Quality bar** — film-frame-worthy, not game-jam? (§2)

> Cross-refs: material quality → `MATERIAL_LANGUAGE.md`; light/mood → `LIGHTING_LANGUAGE.md`;
> sourcing/quality → `ASSET_LANGUAGE.md`; meaning → `ENVIRONMENTAL_STORYTELLING.md`.
