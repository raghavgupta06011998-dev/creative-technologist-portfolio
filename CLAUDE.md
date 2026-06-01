# Raghav 3D Interactive Portfolio — Claude Code Context

> **SOURCE-OF-TRUTH HIERARCHY (read in this order).** As of 2026-05-31 the project is governed by
> a layered documentation system. When two documents disagree, the **higher level wins.**
>
> - **Level 1 — VISION (canonical):** [`design-bible/`](design-bible/README.md). The complete,
>   LOCKED world vision — identity, narrative, zones, experiences, languages, evaluation. Start at
>   `design-bible/README.md`. **This is the authority for *what the world is and means.***
> - **Level 2 — BUILD (canonical for implementation):** `BUILD_ROADMAP.md`,
>   `TECH_ARCHITECTURE.md`, `LIVING_SWARM_IMPLEMENTATION_PLAN.md`, `SWARM_BUILD_CHECKLIST.md`.
>   **The authority for *how and in what order the world is built.***
> - **Level 3 — STATE (reference only):** `PROJECT_FULL_CONTEXT.md`, `PROJECT_PROGRESS.md`,
>   `ASSET_MAP.md`, `ASSET_AUDIT_REPORT.md`, `EXTERNAL_ASSET_DOWNLOAD_PLAN.md`, this file. Useful
>   build-state, asset, and operational reference. **Where their *vision/concept* content conflicts
>   with Level 1, Level 1 supersedes** (some Level-3 docs predate the design-bible — superseded
>   sections are marked in place, not deleted).
>
> This file (`CLAUDE.md`) is operational guidance only. For *vision* read Level 1; for *build plan*
> read Level 2; for *current build state and assets* read Level 3.

---

## 1. Project — one paragraph

A cinematic narrative 3D portfolio in Three.js, not a website. The visitor explores a playable world: space intro → portal → village hub → personal house → experience street → skills forest → bridge → mountain career path → project worlds → future area. The visual style target is **realistic / semi-realistic, cinematic golden-hour** — never cartoon or toy-like.

Active project path:
```
/Users/raghavgupta/Portfolio/raghav-portfolio
```

---

## 2. Active area

> **⚠ SUPERSEDED (kept for history) — see Level 1/2 for current direction.** The 85 MB forest
> blocker described below was **resolved** (see `PROJECT_FULL_CONTEXT.md` §13), and the forest's
> *meaning* was fully redirected by the design-bible. **Current active work:** building the
> **Living Swarm** vertical slice in the Forest — see `SWARM_BUILD_CHECKLIST.md` (Level 2) and
> `design-bible/03-experiences/forest/EXP_LIVING_SWARM.md` (Level 1). The Forest is now the
> "Maker's Forest" (`design-bible/02-zones/MASTER_FOREST.md`), not a "design + technical skills"
> zone. The codebase's existing village/bridge/forest-road systems remain valid build-state.

**Village hub** (the main navigable world). Bridge, river, market, farm, back lanes are in. Forest is built but using a problematic single 85 MB GLB — replacement is the top priority. See `PROJECT_FULL_CONTEXT.md` § 6 and § 13–14.

---

## 3. Project rules (must follow)

1. **Do NOT scan all assets unless needed.** Only inspect the asset folder relevant to the active task.
2. **Do NOT update MD files without asking first.** Includes refactors and creating new MDs. Always confirm scope and plan before touching docs.
3. **Use realistic / semi-realistic assets.** No cartoon, no toy-style. PUBG/GTA-ish realism is the target; warm and cinematic is preferred over gritty.
4. **Prefer GLB / GLTF.** Convert from FBX/OBJ only if the asset is essential.
5. **Avoid full terrain sheets.** Single GLBs that contain "ground + trees + road + props" become floor/ceiling problems. Prefer modular trees + your own ground plane + your own ribbon road.
6. **Visual mesh and collision mesh must stay separate.** Never use a complex visual GLB as a collision or walkable target. Always create a simple invisible plane / circle / box for collision.
7. **For the forest, prefer modular trees / clusters + a custom road / path** (mirrors how `streetTrees.js` is structured).
8. **For collision, use simple invisible colliders.** Circles for points/posts/trees, AABBs for linear walls. Never per-triangle collision on heavy GLBs.
9. **Performance:** keep instance count modest, clone from `modelCache`, reuse materials, avoid casting shadows from background terrain meshes.
10. **Do not break existing systems** when adding features: player movement, camera, car drive (legacy), entrance, hero house, terrain raycaster, bridge deck walkability, collision resolver.
11. **Quality over quantity.** Better composition and lighting beats more assets.
12. **One change per task.** Small focused edits over huge rewrites; explain what changed and why.
13. **Do not use** crate_a/b/c/d or chair_a/b. green_01 → green_16 are OK where they visually fit.

---

## 4. Development workflow

### Before coding

1. Read the relevant code file(s) — do not start editing blind.
2. Restate the goal in 1–2 lines so we agree on scope.
3. List the files you will touch and the planned change in plain English.
4. If asset / image references are involved, identify which GLB / texture and what side / orientation / scale you'll use.

### When coding

1. Edit only the files you listed.
2. Use readable constants for positions, scales, rotations, road widths, collision radii, etc.
3. Comment placement / tuning constants so they can be changed later without reading code paths.
4. Do not break unrelated systems.

### After coding

1. List the files changed.
2. Summarise what changed and why.
3. Give the user concrete in-browser test steps (where to walk, what to verify).

---

## 5. Important folders

```
src/world/village/
├── villageBuilder.js
├── environment/   environment.js
├── terrain/       terrain.js
├── roads/         roads.js · backStreet.js · backLanes.js
├── structures/    entrance.js · heroHouse.js · streetHouses.js
├── props/         villageProps.js · marketZone.js · farmZone.js
├── nature/        streetTrees.js · outerRocks.js · river.js · bridge.js · finalForest.js
├── player/        playerController.js · cameraController.js · collision.js
└── utils/         assetLoader.js

public/assets/
├── architecture/  characters/  forest/  hdri/  models/
├── new assets/    props/       textures/  village/
```

For detailed file responsibilities, see `PROJECT_FULL_CONTEXT.md` § 16.

---

## 6. Documentation map (by source-of-truth level)

**Level 1 — VISION (canonical):** `design-bible/`
| File | Purpose |
|---|---|
| `design-bible/README.md` | Index + reading order for the whole vision system — **start here** |
| `design-bible/00-canon/` | Constitution: `PORTFOLIO_BIBLE`, `NARRATIVE_SPINE`, `GLOSSARY` |
| `design-bible/01-languages/` | Global design systems: Visual, Lighting, Material, Interaction, Environmental Storytelling, Asset |
| `design-bible/02-zones/` | Zone masters: `MASTER_FOREST`, `MASTER_VILLAGE`, `MASTER_MOUNTAINS`, `MASTER_PROJECTS` |
| `design-bible/03-experiences/` | Component specs: `EXP_LIVING_SWARM` |
| `design-bible/04-evaluation/` | Agent decision engine: `EVALUATION_FRAMEWORK`, `ASSET_ACCEPTANCE_RUBRIC` |
| `design-bible/05-templates/` | Uniform schemas for new zone/experience docs |
| `design-bible/MASTER_WORLD_MAP.md` | Spatial layout, sightlines, build order |
| `design-bible/MASTER_WORLD_BLUEPRINT.md` | Production philosophies + future-agent architecture |
| `design-bible/DECISION_LOG.md` | Append-only record of decisions & reversals |

**Level 2 — BUILD (canonical for implementation):**
| File | Purpose |
|---|---|
| `BUILD_ROADMAP.md` | Phase/scope/order of building (proof spine first) |
| `TECH_ARCHITECTURE.md` | Stack, runtime patterns, performance constraints |
| `LIVING_SWARM_IMPLEMENTATION_PLAN.md` | How to build the Living Swarm |
| `SWARM_BUILD_CHECKLIST.md` | The current step-by-step task board |

**Level 3 — STATE (reference; vision content superseded by Level 1 where they conflict):**
| File | Purpose |
|---|---|
| `PROJECT_FULL_CONTEXT.md` | Build-state + systems reference (its *concept/zone* sections are superseded — marked in place) |
| `PROJECT_PROGRESS.md` | Short milestone tracker |
| `CLAUDE.md` (this file) | Operational rules + workflow for Claude Code |
| `ASSET_MAP.md` | GLB ↔ JPG preview inventory |
| `ASSET_AUDIT_REPORT.md` | Most recent asset usage audit |
| `EXTERNAL_ASSET_DOWNLOAD_PLAN.md` | Planned external assets and licences |
| `COWORK_INSTRUCTIONS.md` | Multi-contributor asset integration workflow (likely complete — archival candidate) |
| `archive/` | Historical direction / blueprint docs — do not consult for current state |

**Update rule:** *vision* changes go in `design-bible/` (Level 1); *build plan* changes go in the
Level-2 docs; *build-state* changes (systems added, assets placed, layout shifts) go in
`PROJECT_FULL_CONTEXT.md` (Level 3). Don't put vision in Level 3 or build-state in Level 1.

---

## 7. Default behaviour for Claude Code

When the user asks for **design / direction help** → think in terms of story, composition, camera, lighting, asset placement. Avoid generic website advice.

When the user asks for **asset analysis** → match GLBs with previews, categorise, suggest placement. Do not place assets unless asked.

When the user asks for **implementation** → make small focused changes; preserve existing structure; use safe assets; do not touch unrelated files; report changed files clearly.

When the user asks for **improvement** → improve composition, lighting, camera, spacing, and storytelling first. Do not randomly add objects.

When the user asks for **documentation changes** → ask first, present a plan, then edit only after approval.
