---
name: threejs-portfolio-standards
description: >-
  The proactive build-time rulebook for writing/editing Three.js code in this portfolio.
  Use BEFORE adding or editing any system, experience, prop, material, or update-loop logic,
  and whenever a change touches performance, collision, the render loop, lighting, or in-code
  asset use. Carries the ctx/dynamicUpdaters runtime patterns, the hard performance constraints,
  the collision rule, the asset pipeline, and the "what NOT to introduce" list. Complements
  design-bible-reader (vision) and the Guardian (after-the-fact review) by enforcing the rules
  WHILE the code is written.
---

# Three.js Portfolio Standards

The operational rules every new system must obey. Authority for vision is the design-bible;
this is the authority for HOW the codebase is built (mirrors TECH_ARCHITECTURE.md + CLAUDE.md).

## Stack (fixed)
- Three.js r0.183.2 (WebGL) · Vite · vanilla JS (no framework). One dep: `three`.
- NO new heavy dependency (framework / physics engine / large lib) without a logged decision
  in `design-bible/DECISION_LOG.md`.

## Runtime patterns (every system follows these)
- **`ctx` is the shared world context** passed everywhere: `ctx.scene`, `ctx.villageGroup`
  (world-content root), `ctx.character` (player), `ctx.delta`, `ctx.groundObjects` (raycast
  walkables), `ctx.dynamicUpdaters` (per-frame fn array), `ctx.dayNight`
  (`registerLogoMaterial` / `registerLight`). Read/extend `ctx` — never invent parallel globals.
- **`villageBuilder.js` orchestrates:** it calls each system's `create...(ctx)` in order, sets up
  player/camera, then registers updaters. A new experience plugs in with ONE `create...(ctx)` call.
- **The update loop iterates `ctx.dynamicUpdaters` every frame.** All per-frame behavior
  (animation, flocking, triggers) registers there — one push per system.
- **Delta-time, frame-rate-independent motion is mandatory.** Scale by `dt`; smoothing uses
  `factor = 1 - exp(-k*dt)`, never raw per-frame lerp. No frame-rate-dependent motion ships.
- **New experiences are self-contained modules** exposing `create<Name>(ctx)` and registering
  their own updater. Proposed home for Forest experiences: `src/world/village/forest/` (e.g.
  `livingSwarm.js`) — to be created.

## Performance — HARD constraints (do not violate)
- **Shadows are globally OFF** (`castShadow=false` everywhere). Never re-enable for one feature;
  soft-shadow look comes from baked AO + composition.
- **InstancedMesh** for any high-count repeated geometry (trees, fence, foliage, swarm lights) —
  keep draw calls low (existing forest ~5-10 draw calls total).
- **Shared materials** — one material per role/zone, cached and reused; never one per object.
- **Glow = emissive material, not lights.** Real lights are capped (entrance lantern, campfire);
  do NOT add a light per object. Day/Night raises emissive intensity via `ctx.dayNight`, not new lights.
- **Budget:** 60 fps desktop / >=30 fps mid mobile; total draw calls in the low hundreds max.

## Collision
- **Visual mesh != collision mesh.** Collision uses simple invisible primitives (circles for
  points/trees/posts, AABBs for linear walls) + the ground raycaster (`ctx.groundObjects`).
- Never per-triangle collision on a heavy visual GLB.

## Asset pipeline (in code)
- **GLB/GLTF only** for downloaded assets; load + clone via `assetLoader.js`
  (`modelCache`, `placeAsset(ctx, key, x, y, z, scale, rotY)`). **Reuse before download.**
- **Procedural-vs-downloaded:** anything that moves/glows/reacts is **procedural** (the Living
  Swarm = fully procedural, no GLB). Static physical props are downloaded.
- **Do NOT use** `crate_a/b/c/d` or `chair_a/b`; `green_01-16` only where they visually fit.
- **Avoid full "terrain sheets"** (one GLB with ground+trees+road) — prefer modular trees + own
  ground plane + own ribbon road. New asset acceptance runs `ASSET_ACCEPTANCE_RUBRIC.md`.

## What NOT to introduce
Framework/physics/large dep (unlogged) · real-time shadows · per-object lights · unique-material-
per-object · frame-rate-dependent motion · heavy meshes as colliders · new global state outside
`ctx` · thousands of particles.

## Working discipline (CLAUDE.md sec 4)
Restate the goal in 1-2 lines → list the files you'll touch → make ONE focused change → do not
break working systems (movement, camera, driving, entrance, hero house, terrain raycaster, bridge
walkability, collision resolver) → report files changed + concrete in-browser test steps. Use
readable, commented constants for positions/scales/road widths/collision radii.

## Authoritative references
- `TECH_ARCHITECTURE.md` — primary (sec 2 patterns, sec 5 perf, sec 7 collision, sec 10 don'ts).
- `CLAUDE.md` — sec 3 rules, sec 4 workflow, sec 5 folders.
- `PROJECT_FULL_CONTEXT.md` — sec 16 per-file/system responsibilities.
- Code anchors: `src/world/village/villageBuilder.js`, `utils/assetLoader.js`,
  `effects/dayNight.js`, `skills/skillTriggers.js` (proximity pattern).

## When this skill fires, output
- The conventions the change must follow + any hard-constraint risk, before code is written.
- A reminder of the one-change-per-task discipline and the in-browser test steps to report after.
