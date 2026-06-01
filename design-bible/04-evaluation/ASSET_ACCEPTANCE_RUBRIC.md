# ASSET_ACCEPTANCE_RUBRIC.md — The Asset Reviewer's Checklist

> **Layer:** 04 · Evaluation
> **Status:** LOCKED
> **Version:** 1.0 · **Last updated:** 2026-05-31
> **Inherits from:** `ASSET_LANGUAGE.md` (esp. §10), `VISUAL_LANGUAGE.md`, `MATERIAL_LANGUAGE.md`,
> `EVALUATION_FRAMEWORK.md`
> **Purpose:** the concrete, scored checklist used to accept/revise/reject a single proposed asset
> (downloaded or procedural). This is the rubric the **Asset Reviewer** agent runs. It is step 4
> of the evaluation algorithm, specialized for assets.

---

## §1 · Inputs the reviewer needs
- The asset (or its spec): format, source, licence, poly/complexity, textures/materials.
- The **target zone** (and Experience, if any) — to apply zone visual/material mood.
- Whether it is intended as **procedural** or **downloaded**.

## §2 · The gates (binary — any fail = reject, regardless of quality)
- **G1 · Meaning gate:** does it serve the target zone's question and not violate a Bible law?
  (e.g., a logo wall / labelled value-building / sci-fi prop fails here.) → `BIBLE §5/§9`,
  `SPINE §2–3`, `ENV §9`.
- **G2 · Exclusion gate:** it is **not** `crate_a/b/c/d` or `chair_a/b`; `green_01–16` only if it
  visually fits. → `ASSET §8`.
- **G3 · Licence gate:** CC0, or CC-BY with attribution recorded; never unknown/ambiguous.
  → `ASSET §4/§7`.

## §3 · The graded checklist (each scored pass / revise / fail)
1. **Format & fitness** — GLB/GLTF, game-ready, correct scale, grounded (no float/clip), not a
   "full terrain sheet." (`ASSET §2`)
2. **Realism level** — semi-realistic, cinematic; not cartoon/toy/clinical. (`VISUAL §2`)
3. **Material quality** — PBR (albedo/roughness/normal), worn/hand-touched, not plastic/flat;
   crisp at viewing distance; no muddy/stretched/obvious-tile in focal areas. (`MATERIAL §2/§3`)
4. **Silhouette & weight** — readable; hero vs dressing weighting correct. (`VISUAL §3`)
5. **Procedural-vs-downloaded** — correct choice (moves/glows/reacts → procedural; static physical
   → downloaded). (`ASSET §5`)
6. **Reuse** — does an existing/cache asset already serve? Reuse preferred over new. (`ASSET §6`)
7. **Performance** — shared materials; instanced if high-count; no background shadow-casting;
   visual mesh ≠ collision mesh. (`ASSET §6`, `LIGHTING §5`)
8. **Material vocabulary fit** — belongs to warm wood/stone/metal/foliage/water/glass palette;
   emissive (if any) warm/subtle/day-night-aware, never neon. (`MATERIAL §4/§6`)
9. **Earns its place** — meaning/navigation/composition, not filler. (`ENV §5`, `BLUEPRINT §4`)
10. **Zone fit** — matches the target zone's visual/material mood (e.g., Mountains cooler/serious;
    Village warm; Forest living-green). (`VISUAL §8`, `MATERIAL §7`)

## §4 · Scoring & verdict
- **Any gate (G1–G3) fails → `reject`.**
- **All gates pass, all graded items pass → `accept`.**
- **Gates pass but ≥1 graded item is `revise`/`fail` → `revise`** with the specific fixes.
- Use the standard verdict shape (`EVALUATION_FRAMEWORK §4`), citing each clause.

## §5 · Verdict template
```
VERDICT:  accept | revise | reject
ASSET:    <name/source>   ZONE: <target>   MODE: procedural | downloaded
GATES:    G1 <pass/fail> · G2 <pass/fail> · G3 <pass/fail>
GRADED:   1..10 <pass/revise/fail each, with the failing clause cited>
REQUIRED: <fixes to reach accept> (empty if accept)
```

## §6 · Quick reject signals (fast triage)
Cartoon/toy look · neon/sci-fi · plastic/flat material · floating/clipping · "terrain sheet" ·
unknown licence · `crate_*`/`chair_*` · labelled value/skill content · filler with no meaning ·
a downloaded model for something that should be procedural (or vice-versa).

> Cross-refs: `ASSET_LANGUAGE.md` (full rules), `EVALUATION_FRAMEWORK.md` (the parent algorithm),
> `ASSET_MAP.md` (operational inventory — check before sourcing new).
