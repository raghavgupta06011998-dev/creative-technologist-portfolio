# TECH_ARCHITECTURE.md — Production Architecture (Implementation Layer)

> **Layer:** Implementation. **Status:** ACTIVE · **Version:** 1.0 · **Last updated:** 2026-05-31
> **Authority for vision:** `design-bible/`. This doc describes *how the codebase is built* and the
> constraints every new system must obey. Reflects the **existing** stack; new work extends it.
> **No code here** — patterns, constraints, and structure only.

---

## §1 · Stack
- **Three.js r0.183.2** (WebGL), **Vite** dev/build, **vanilla JS** (no React/framework).
- **No heavy new dependencies.** Adding a framework, physics engine, or large lib requires an
  explicit decision (log it in `design-bible/DECISION_LOG.md`).

## §2 · Core runtime patterns (the conventions every system follows)
- **The `ctx` object** is the shared world context passed everywhere. Known fields include:
  `ctx.scene`, `ctx.villageGroup` (root group for world content), `ctx.character` (player),
  `ctx.delta` (frame delta), `ctx.groundObjects` (raycast walkables), `ctx.dynamicUpdaters`
  (per-frame fn array), `ctx.dayNight` (day/night system + `registerLogoMaterial`/`registerLight`).
  New systems read/extend `ctx`; they do not invent parallel globals.
- **`villageBuilder.js` orchestrates** world assembly: it calls each system's `create…(ctx)` in
  order, then sets up player/camera, then registers per-frame updaters. New experiences plug in
  here with a single `create…(ctx)` call.
- **The update loop** iterates `ctx.dynamicUpdaters` every frame, passing time/delta. **All
  per-frame behavior (animation, flocking, triggers) registers here** — one push per system.
- **Delta-time, frame-rate-independent** motion is mandatory (movement scales by `dt`; smoothing
  uses `factor = 1 - exp(-k·dt)`, never raw per-frame lerp). No frame-rate-dependent motion ships.

## §3 · Module / folder structure
Existing (do not disturb working systems):
```
src/world/village/
├── villageBuilder.js          orchestrator
├── environment/  terrain/  roads/  structures/  props/  nature/
├── player/        playerController.js · cameraController.js · collision.js
├── effects/       dayNight.js
├── skills/        (mostly DISABLED experiments — skillsForest, skillEmblems,
│                   logoStations, skillPillars, skillClearings, skillTriggers, skillPlaque)
└── utils/         assetLoader.js (placeAsset, modelCache, setActiveSpawnContext)
```
**Proposed home for Forest experiences (new):**
```
src/world/village/forest/
└── livingSwarm.js             createLivingSwarm(ctx) + its updater
   (future: workshop.js, waterworks.js, overlook.js, storyFire.js)
```
- New experiences are **self-contained modules** exposing `create<Name>(ctx)` and registering
  their own updater into `ctx.dynamicUpdaters`.
- The disabled `skills/` experiments are **legacy** — keep until the Forest is rebuilt, then
  archive (a chore, not a blocker; see BUILD_ROADMAP §2).

## §4 · Asset pipeline
- **GLB/GLTF only** for downloaded assets; loaded + cloned via `assetLoader.js` (`modelCache`,
  `placeAsset(ctx, key, x, y, z, scale, rotY)`). **Reuse before download** (`ASSET_LANGUAGE §6`).
- **Sourcing:** Poly Haven (CC0), Quaternius (CC0), Sketchfab (CC-BY w/ recorded attribution).
  Exclusions: `crate_a/b/c/d`, `chair_a/b`; `green_01–16` only where they fit.
- **Procedural-vs-downloaded rule** (`ASSET_LANGUAGE §5`): anything that **moves/glows/reacts** is
  **procedural** (the Living Swarm is fully procedural — no GLB). Static physical props are
  downloaded.
- New asset acceptance runs `design-bible/04-evaluation/ASSET_ACCEPTANCE_RUBRIC.md`.

## §5 · Rendering & performance architecture (hard constraints)
- **Shadows are globally OFF.** `castShadow=false` everywhere; never re-enable for a single
  feature. Soft-shadow *look* comes from baked AO + composition (`LIGHTING §5`).
- **InstancedMesh** for any high-count repeated geometry (trees, fence, foliage, and **the swarm's
  lights**) → keep draw calls low (existing forest = ~5–10 draw calls total).
- **Shared materials** — one material per role/zone; never one material per object
  (`MATERIAL §5`). Cache and reuse.
- **Glow = emissive material, not lights.** Real lights are capped (entrance lantern, campfire);
  do not add a light per object. The **swarm glows via emissive + additive blending**, zero new
  lights.
- **Day/Night via emissive intensity**, not new lights: register emissive materials with
  `ctx.dayNight` so night raises their intensity (existing pattern from logoStations/effects).
- **Budget targets:** 60 fps desktop / ≥30 fps mid mobile; total draw calls modest (low hundreds
  max); swarm = **1 draw call** (single InstancedMesh or Points), **1 shared material**, **0 new
  lights**; swarm count in the **tens** (legibility over spectacle — `EXP §7`).

## §6 · Interaction architecture
- **Input:** player movement + camera (existing `playerController`/`cameraController`). Experiences
  read player **position and movement direction** from `ctx.character`; they do not add new input
  modes for MVP.
- **Proximity detection pattern** (reuse from `skillTriggers.js`): per-frame distance checks
  against a small set of points; **act only when state changes** (no per-frame DOM/scene churn).
  The swarm's intent-following and the overlay anchor use this exact pattern.
- **Interaction law:** trivial, never frustrating; no fail states; one clear verb
  (`INTERACTION_PHILOSOPHY`). MVP interactions are *presence- and movement-driven* (no click
  puzzles).
- **Overlay system** (existing `#skill-overlay` + CSS-driven fade) is reused for any
  depth-on-approach text and the real-agent anchor line.

## §7 · Collision architecture
- **Visual mesh ≠ collision mesh** (`ASSET §2`). Collision uses **simple invisible primitives**
  (circles/AABBs) and the ground raycaster (`ctx.groundObjects`). The swarm is **non-colliding**
  (lights pass around the player visually; no physics).

## §8 · Blender requirements
- **Living Swarm: none** — fully procedural in Three.js.
- Blender is needed later only for **static hero props** that aren't well-sourced (e.g., specific
  Mountain-hall pieces, the Story-Fire totems). Even then: GLB export, game-ready, correct
  scale/pivot, no baked-in lights/shadows. **Do not model what can be sourced (Poly Haven/
  Quaternius) or done procedurally.**

## §9 · Three.js subsystems the Swarm needs (capability list, not code)
- **InstancedMesh** (preferred) of a small glowing quad, *or* a `Points` system — one draw call.
- **BufferGeometry / instanced attributes** for per-light position, phase, brightness.
- **Emissive / additive-blended material** for warm glow (no lights); transparent, depthWrite off.
- **A per-frame updater** (in `ctx.dynamicUpdaters`) running the flocking + state machine.
- **Vector math** for boids (separation/alignment/cohesion) + intent bias toward the player.
- Optional: a soft halo sprite/bloom for each light (kept cheap; shared).

## §10 · What NOT to introduce
- ❌ A framework, physics engine, or large dependency (without a logged decision).
- ❌ Real-time shadows; per-object lights; unique-material-per-object.
- ❌ Frame-rate-dependent motion.
- ❌ Heavy visual meshes used as colliders.
- ❌ New global state outside `ctx`.
- ❌ Thousands of particles (legibility + perf — keep the swarm in the tens).

## §11 · How to use
New systems: follow §2 conventions, plug into `villageBuilder` + `dynamicUpdaters`, obey §5
performance constraints and §4 asset rules. Validate against the bible's evaluation framework.
