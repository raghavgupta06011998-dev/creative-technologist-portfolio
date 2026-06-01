# ASSET_LANGUAGE.md — The Sourcing, Quality & Performance Authority

> **Layer:** 01 · Languages (global)
> **Status:** LOCKED
> **Version:** 1.0 · **Last updated:** 2026-05-31
> **Inherits from:** `PORTFOLIO_BIBLE.md`, `VISUAL_LANGUAGE.md`, `MATERIAL_LANGUAGE.md`
> **Governs:** what assets may enter the World, from where, at what quality, under what licence,
> and within what performance budget. Bridges to operational `ASSET_MAP.md`.
> **Purpose:** The master asset-acceptance authority. The checklist in §10 is the rubric the
> future asset-evaluation agent runs.

---

## §1 · The one asset sentence
**Realistic, game-ready, modular, cleanly licensed, reused before downloaded, and procedural
when procedural is better.** Quality and coherence over quantity.

## §2 · Format & technical fitness
- **GLB/GLTF preferred.** Convert from FBX/OBJ only if an asset is essential and no GLB exists.
- **Game-ready** geometry: sane poly counts for real-time, clean topology, correct scale,
  origin at a sensible pivot, sits on the ground (no float/clip).
- **No "full terrain sheets"** — single GLBs bundling ground+trees+road+props become
  floor/ceiling problems. Prefer **modular** assets + custom ground + custom paths.
- **Visual mesh ≠ collision mesh** (principle): never use a heavy visual GLB as the walkable or
  collision target; collision is always a simple invisible primitive.

## §3 · Quality bar
- Must clear `VISUAL_LANGUAGE.md` (semi-realistic, cinematic, not cartoon/toy) and
  `MATERIAL_LANGUAGE.md` (PBR, worn, not plastic/flat).
- Crisp at viewing distance; no muddy/low-res textures in focal areas.
- **Film-frame-worthy.** If it reads as a free-pack filler prop, it fails — even if technically
  fine.

## §4 · Sourcing rules (free, clean licences)
- **Poly Haven** — CC0, GLB, realistic, game-ready. *Primary source; safe by default, no
  attribution required.*
- **Quaternius** — CC0, GLB, cohesive semi-realistic packs (esp. nature). Safe by default.
- **Sketchfab** — widest realistic catalogue, but **licence varies per model.** Allowed only with
  **Downloadable + CC0/CC-BY**; **CC-BY requires a credit** recorded in the project (see §7).
- **The Maker's own work** — exports of real projects (designs, screens, the reel) are the
  highest-value assets and the only "logos" the World needs (evidence anchors,
  `ENVIRONMENTAL_STORYTELLING.md §6`).
- Suggest new external assets only when existing assets cannot achieve the goal.

## §5 · Procedural vs. downloaded (the decision rule)
- **Procedural** for anything that **moves, glows, reacts, or shows live/real data** — the
  Living Swarm, glow, water, reveals, charts, proximity reactions. Procedural is cheaper and
  fully controllable.
- **Downloaded** for **static physical props** that would be tedious/low-quality to model
  (telescope, waterwheel, workbench, furniture, rocks, trees).
- Rule of thumb: *if it's alive, build it; if it's a static physical thing, source it.*

## §6 · Reuse & performance discipline (canon)
- **Reuse before download.** Check the existing library / `modelCache` first; clone and reuse.
- **Shared materials** (see `MATERIAL_LANGUAGE.md §5`) — not a unique material per asset.
- **Instancing** for any high-count system (trees, foliage, fences, swarm). Keep draw calls low.
- **No shadow-casting** from background/terrain assets (shadows globally off — LIGHTING §5).
- Modest instance counts; cull/scale sensibly. Performance must stay smooth on the toggle and
  across zones.

## §7 · Licensing hygiene
- Every external asset's licence is recorded (CC0 / CC-BY + required credit) in the project's
  asset records.
- **CC-BY assets require an attribution** kept in the repo/credits. CC0 needs none.
- No asset of unknown/ambiguous licence enters the World.

## §8 · Excluded & conditional assets (canon)
- ❌ **Do NOT use** `crate_a`, `crate_b`, `crate_c`, `crate_d`, `chair_a`, `chair_b`. Do not fix,
  move, rename, delete, or use them as fallbacks. They are excluded, full stop.
- ⚠️ **`green_01`–`green_16`** are allowed **only where they visually fit** (tropical plants,
  fruit, greenery, market/nature dressing). Do not force them; do not call them "garden bushes"
  unless they read as such.
- **Placeholders** (e.g., procedural canvas logos) are permitted as temporary stand-ins and must
  be replaceable by real assets with no structural change (placeholder→real swap).

## §9 · What BELONGS / what does NOT
**Belongs:** a CC0 Poly Haven GLB of a weathered table; a Quaternius fern pack; a CC-BY Sketchfab
telescope (credited); a modular tree reused via the cache; a procedural swarm; the Maker's real
work as a texture; simple invisible colliders paired with visual meshes.

**Does NOT belong:** a cartoon/toy asset; a "full terrain sheet" GLB; a heavy visual mesh used
as collision; an unknown-licence model; `crate_*`/`chair_*`; a unique material per object;
shadow-casting background assets; a downloaded model for something that should be procedural
(and vice versa); filler-pack props that fail the film-frame bar.

## §10 · Evaluation checklist (for agents — the asset-acceptance rubric)
Any **No** in 1–7 is a rejection or flag.
1. **Format/fitness** — GLB/GLTF, game-ready, correct scale, grounded, not a terrain sheet? (§2)
2. **Visual quality** — clears VISUAL + MATERIAL bars (semi-realistic, PBR, film-worthy)? (§3)
3. **Procedural-vs-downloaded** — correct choice for moving/glowing vs static? (§5)
4. **Reuse** — does an existing/cache asset already serve; is reuse preferred? (§6)
5. **Performance** — shared materials, instanced if high-count, no background shadows? (§6)
6. **Licence** — CC0, or CC-BY with credit recorded; never unknown? (§4,§7)
7. **Not excluded** — not `crate_*`/`chair_*`; `green_*` only if it visually fits? (§8)
8. **Earns its place** — passes `ENVIRONMENTAL_STORYTELLING.md §5` (meaning/nav/composition)? 
9. **Zone fit** — matches the target zone's visual/material mood?

> Cross-refs: look → `VISUAL_LANGUAGE.md`; surface → `MATERIAL_LANGUAGE.md`; meaning →
> `ENVIRONMENTAL_STORYTELLING.md`; operational inventory → `ASSET_MAP.md` (root).
