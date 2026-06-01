# CURRENT_BUILD_AUDIT.md — Reality vs. Vision

> **Mode:** Reality. **Status:** AUDIT · **Version:** 1.0 · **Date:** 2026-05-31
> **Method:** Read the actual codebase (`src/`), traced the live import graph from `main.js` →
> `villageBuilder.js`, and compared against the design-bible. **The codebase is treated as
> reality; the bible as a hypothesis.** No code changed.

---

## §0 · The headline (brutal version)
**The gap between vision and reality is near-total at the experience layer.** The design-bible
describes a 7-zone narrative world (Maker's Forest with 5 performed-capability experiences,
Mountains "Hall of Gates", two Project Worlds, a Project-Zero reveal, a Hero-House interior, a
Portal, a Future zone). **None of those signature experiences exist in code.** Zero. Not the
Living Swarm, not a single Forest verb, not the Mountains, not Projects, not the House interior.

What *does* exist is an **earlier, different project**: the app boots into a **Mars scene with a
car/driving mode** and a white-fade **portal transition** into a **partially-built cozy village
hub** (houses, market, farm, roads, bridge, river) plus a **forest road lined with procedural
trees/fence** and **one half-built "skill" station rendering placeholder logo squares** — a
representation the bible has explicitly *rejected*. There is also substantial **dead/duplicate
code** (~20 orphaned modules, including whole duplicate trees and 2–3 abandoned skill systems).

**Plain truth:** the foundations (village, terrain, roads, bridge, day/night, player/camera,
asset pipeline, forest infrastructure) are real and decent. The *portfolio* — the thing that
proves the claim — does not exist yet, and the one piece of "skills" content that renders today
**contradicts the locked vision.**

---

## §1 · Per-system audit

### VILLAGE
- **Current state:** Built (exterior). Multi-layer terrain, cobblestone roads + back lanes + back
  street, hero-house GLB, 8 street houses, market zone, farm zone, street trees, outer rocks,
  river, walkable bridge. Loads via `addVillageWorld`.
- **Quality vs vision:** ~40% as a *place*, ~10% as *meaning*. It's a generic cozy village. The
  bible's Village = "the world that shaped me," embodied as **functional places** (Workshop,
  Studio, Library, Market). Only a Market exists; there is no Workshop/Studio/Library, no
  "given vs self-built" duality, no personal-signature detail.
- **Problems:** reads as a template village, not Raghav's origin world; some props disabled
  (lamps/signs/decor commented out in `villageBuilder`).
- **Tech debt:** duplicate house/market/farm modules (`buildings/`, `structures/`, `props/`).
- **Keep:** terrain, roads, bridge, river, the village shell as the hub/on-ramp.
- **Remove:** orphaned duplicates (see §2).
- **Missing:** the functional-place meaning layer; the personal signature; Hero-House interior.
- **Priority:** Important (it's the on-ramp) — but *meaning* layer is Later.

### HOUSE (Hero House)
- **Current state:** An exterior GLB placed at the village center. That's all.
- **Quality vs vision:** ~5%. The bible's House = "who I am," the emotional core, *interior*,
  first-person story. **No interior, no story content, no interaction.**
- **Problems:** it's set dressing, not a zone.
- **Tech debt:** two heroHouse modules (`buildings/heroHouse.js` orphaned vs `structures/` live).
- **Keep:** the exterior placement.
- **Remove:** the duplicate `buildings/heroHouse.js`.
- **Missing:** everything that makes it "the House" (interior, story).
- **Priority:** Later (content-blocked on personal narrative).

### FOREST
- **Current state:** Infrastructure **built and good** — laterite road (CatmullRom), gravel
  shoulders, procedural picket fence (3 InstancedMesh), ~1,240 instanced trees/bushes, forest
  terrain disc, exclusion zones. **Content = the live `skillsForest.js` → `skillPillars.js`
  "Pillar 1"**: one mossy boulder + **3 floating placeholder logo squares** (Figma/Illustrator/
  Zeplin, canvas placeholders since no real SVGs) + entrance sign + campfire + exit arch.
- **Quality vs vision:** infrastructure ~80%; **content ~0% and off-vision.** The bible's Forest
  is the "Maker's Forest" — five *performed* experiences (REVEAL/DIRECT/CONNECT/SEE/KINDLE),
  self-portrait, **no logos, no boards.** The live content is floating brand logos — the exact
  thing the bible rejected (and the file's own header comment still says "Tool/Brand Logo Trail,"
  contradicting its imports).
- **Problems:** the one rendered "skill" feature **violates the locked vision**; the `skills/`
  folder is a graveyard of 6 abandoned iterations.
- **Tech debt:** `skills/` contains `skillEmblems` + `logoStations` (orphaned), `skillPillars`
  (live but off-vision), `skillsForest` (stale comment), `skillClearings`, `skillPlaque`,
  `skillTriggers`.
- **Keep:** road, fence, trees, terrain, exclusion zones, campfire, the proximity-overlay system.
- **Remove:** the placeholder-logo Pillar from the live build; the abandoned skill systems.
- **Missing:** all five Forest experiences — above all **the Living Swarm.**
- **Priority:** **Critical** (this is where the next real build goes).

### MOUNTAINS
- **Current state:** **Does not exist.** `nature/mountain.js` is a disabled village backdrop;
  `mountainBuilder.js` is orphaned. No Hall of Gates, no chambers, no career content.
- **Quality vs vision:** 0%.
- **Keep:** nothing relevant. **Remove:** `mountainBuilder.js` (orphan).
- **Missing:** the entire zone. **Priority:** Later.

### PROJECTS
- **Current state:** **Does not exist.** No project worlds, no Jarvis embed, no Agent Suite
  simulation, no Project-Zero reveal.
- **Quality vs vision:** 0% — and this is the **hiring zone**, the most important per the bible.
- **Missing:** everything. **Priority:** Important (it's what convinces — but blocked on a chosen
  integration approach for Jarvis/Agents).

### WORLD NAVIGATION
- **Current state:** Boots to **Mars**, white-fade **transition** to village; in-village walking
  with 3rd-person camera; forest reached by walking village→bridge→road. `#village` hash bypass.
- **Quality vs vision:** partial. Walking + a portal-style transition exist. **No Fast Path, no
  hub-and-spoke to Projects (no Projects), no zone-to-zone wayfinding** beyond the linear walk.
- **Problems:** the Mars+driving intro is **undocumented and off-vision** (bible's Portal is a
  cosmic threshold, not Mars + a car); reaching the forest requires a long traversal.
- **Keep:** the transition mechanism; the walking/camera.
- **Remove:** evaluate the driving mode / Car (off-vision; see §2).
- **Missing:** Fast Path; coherent arrival aligned to the bible's Portal.
- **Priority:** Important.

### LIGHTING
- **Current state:** `environment.js` — HDRI IBL (not background), hemisphere + ambient + a
  directional sun with **shadows disabled**; solid sky color; fog.
- **Quality vs vision:** ~70%. Matches the bible's golden-hour-ish, humane, shadows-off,
  emissive-glow direction well. Not yet a deliberate per-zone mood (Mountains cool, etc.).
- **Problems:** none major. **Tech debt:** orphaned `lighting/villageLighting.js`.
- **Keep:** the whole environment/lighting approach. **Remove:** `lighting/villageLighting.js`.
- **Missing:** per-zone mood tuning. **Priority:** Keep / Later.

### ASSETS
- **Current state:** GLB pipeline via `assetLoader.js` (`modelCache` + `placeAsset`); ~5.4 GB on
  disk, **~50–80 MB actually used** (per `ASSET_AUDIT_REPORT`). Forest tree pack extracted
  procedurally. **No real brand logos downloaded** → forest shows placeholders.
- **Quality vs vision:** pipeline ~85% (disciplined, cached, instanced). Storage hygiene poor
  (huge unused asset tree).
- **Problems:** 5.4 GB bloat; placeholder logos stand in for content that the vision says
  shouldn't be logos at all.
- **Tech debt:** unused multi-GB asset folders; `utils/materials.js` orphaned.
- **Keep:** `assetLoader`, the cache/instancing pattern, the used ~50–80 MB.
- **Remove:** (later, with care) unused asset folders; the placeholder-logo dependency.
- **Missing:** the Maker's real work as textures (the only "assets" the Forest/Projects truly need).
- **Priority:** Later (don't prune GB now; just stop depending on logos).

### DAY / NIGHT
- **Current state:** `effects/dayNight.js` — working top-right toggle; adjusts ambient/hemi/sun/
  fog/sky and registered emissive materials & lights; emissive carries night.
- **Quality vs vision:** ~90%. This is the **closest system to the bible** and a genuine asset.
- **Problems / debt:** minimal. **Keep:** all of it. **Remove:** nothing. **Missing:** nothing
  major. **Priority:** Keep (reuse for the Swarm's day/night).

### INTERACTIONS
- **Current state:** Two unrelated systems — (a) the Mars/village `systems/interaction.js` +
  driving toggle (legacy), and (b) the forest **proximity overlay** (`skillTriggers.js`) that
  fades text near points.
- **Quality vs vision:** ~10%. The bible's model — **verbs, dormant→alive, responsive world,
  trivial-not-frustrating** — is essentially absent. Only proximity text exists.
- **Problems:** no interactive experience anywhere; the proximity overlay is the only "interaction."
- **Keep:** the proximity-overlay pattern (reuse for the Swarm anchor).
- **Remove:** evaluate legacy driving/interaction if the Mars intro is cut.
- **Missing:** every designed interaction (starting with DIRECT / the Swarm).
- **Priority:** **Critical** (the Swarm introduces the first real interaction).

### UI
- **Current state:** `ui/overlayText.js` (Mars intro text), `#skill-overlay` (proximity panel,
  in `index.html`), the day/night button. Orphaned: `ui/interactionPanel.js`,
  `ui/interactionPrompt.js`.
- **Quality vs vision:** minimal but on-tone (the bible wants minimal, diegetic-first UI). **No
  Fast Path control.**
- **Keep:** the overlay + day/night button. **Remove:** orphaned UI modules.
- **Missing:** Fast Path; any "view work / résumé" affordance.
- **Priority:** Later (Fast Path becomes relevant once Projects exist).

### PERFORMANCE
- **Current state:** Shadows globally off; InstancedMesh for forest (~5–10 draw calls) + fence (3);
  shared materials; `modelCache`; delta-time movement; frame-rate-independent camera lerp.
- **Quality vs vision:** ~85%. **Strongly matches** the bible's performance laws. This is a real
  strength.
- **Problems:** 5.4 GB asset disk footprint (load/serve hygiene, not runtime FPS); both Mars and
  village code present (village clears scene on transition, so runtime is OK).
- **Keep:** all perf decisions. **Remove:** nothing perf-critical. **Missing:** nothing major.
- **Priority:** Keep.

---

## §2 · Dead / duplicate code (remove candidates — confirm before deleting)
Confirmed orphaned (never imported by the live graph):
- **Duplicate trees:** `buildings/{farmArea,heroHouse,residentialArea,storyAreas}.js`,
  `systems/{cameraController,playerController,villageAssets,waterSystem}.js`,
  `structures/{farmArea,marketArea}.js` — superseded by `structures/` + `player/` + `props/`.
- **Abandoned "Builder" architecture:** `roads/roadBuilder.js`, `terrain/terrainBuilder.js`,
  `nature/{riverBuilder,forestBuilder,mountainBuilder,forest}.js`, `props/propsBuilder.js`.
- **Abandoned skill systems:** `skills/skillEmblems.js`, `skills/logoStations.js` (and the live
  `skillPillars.js` is off-vision — retire from the build).
- **Misc orphans:** `lighting/villageLighting.js`, `props/{fences,furniture}.js`,
  `utils/materials.js`, plus `src/ui/{interactionPanel,interactionPrompt}.js`, `core/SceneManager.js`,
  `utils/{loaders,constants}.js`, `config/*` (unused), `systems/collision.js`.
- **Off-vision subsystems to decide on:** `world/mars/*` + `entities/Car.js` + `systems/driving.js`
  (the Mars + driving intro). Keep only if it becomes the Portal; otherwise scope to cut.

*(Removal not performed — listed for approval. Conservative policy applies.)*

---

## §3 · The vision-match scorecard
| Zone / system | Built? | Matches bible? |
|---|---|---|
| Village (place) | Partial | Generic, not "where I came from" |
| Village (meaning) | No | 0% |
| Hero House | Exterior only | ~5% |
| Forest (infra) | Yes | ~80% |
| Forest (content) | Off-vision logos | **Contradicts** |
| Living Swarm | **No** | 0% |
| Mountains | No | 0% |
| Projects | No | 0% |
| Day/Night | Yes | ~90% ✅ |
| Lighting | Yes | ~70% ✅ |
| Performance | Yes | ~85% ✅ |
| Interactions | Proximity text only | ~10% |
| Navigation/Portal | Mars+driving | Off-vision |

---

# REAL IMPLEMENTATION ROADMAP
*(based on the codebase, not the documentation — shortest path to a convincing demo)*

## The reframe
A "convincing portfolio demo" does **not** require all 7 zones. It requires a **short, coherent
slice with one unforgettable moment and a link to real proof.** Today the codebase has good
*foundations* but its only "content" beat (placeholder logos) is off-vision, and the arrival is
an undocumented Mars/driving prototype. The shortest path is: **make the existing slice coherent,
then build the one wow-moment, then link to real proof.**

## R0 — Coherence cleanup *(1 session; do this FIRST)*
- **Retire the off-vision skill content** from the live build (the placeholder-logo Pillar) so the
  forest isn't showing the exact thing the vision rejects. Keep the forest *infrastructure*.
- **Purge confirmed dead code** (§2 orphans) so the next build happens in a clean, vision-aligned
  tree (do this with approval; conservative).
- **Decide the arrival:** either (a) keep Mars as a lightweight "Portal" and accept it, or (b)
  set the demo to drop the player near the village/forest. Don't build the wow-moment behind a
  long, off-vision intro.
- *Outcome:* a lean, coherent codebase whose tone matches the vision — the necessary stage for the
  Swarm to land.

## R1 — The wow-moment: the Living Swarm *(the hero build)*
- Build the Living Swarm in the **existing** forest clearing (`SWARM_BUILD_CHECKLIST.md`).
  Infrastructure (road/fence/trees/terrain) and day/night already exist, so it has a home and a
  glow system. This is the one beat that proves the thesis and creates the memory.
- *Outcome:* a recruiter who walks the forest hits one unforgettable, on-vision moment.

## R2 — Link to real proof *(make it convince, not just delight)*
- Connect the experience to **real work**: the lightest viable version is an overlay/portal link
  to **Jarvis** (your real, showable tool) and/or a Story-Fire-style reel of real output. Full
  Project Worlds can wait; even a clean *link* to the live Jarvis turns "pretty" into "hireable."
- *Outcome:* the demo now answers "what has he built?" with real evidence.

## R3 — Tighten the frame *(mostly already built)*
- Trim the village to a coherent on-ramp; ensure arrival → forest is short; add a **Fast Path**
  affordance to the proof. The village is ~built; this is polish, not new construction.

## Later (not for the first convincing demo)
Mountains (Hall of Gates), full Project Worlds + Agent-Suite sim + Project-Zero reveal, Hero-House
interior, the full Village meaning-layer, Portal/Future as designed.

---

## The direct answer: should the Living Swarm be built next?
**Yes — the Living Swarm is the right hero build, and reality confirms the bible here** (the
forest infrastructure and day/night already exist, so it's the lowest-dependency high-impact
build). **But it should not be the literal first keystroke.** Reality adds one mandatory
precondition the pure-doc plan ignored:

> **Do R0 (coherence cleanup) first.** Building the signature moment *next to* a graveyard of six
> abandoned skill systems and a live placeholder-logo station that **contradicts the vision**
> would undercut it. ~1 session of cleanup (retire the off-vision logos, purge dead code, decide
> the arrival) buys the Swarm a clean, on-tone stage.

**What I would NOT do next:** build Mountains, Projects worlds, or the House interior — they're
0% and either content-blocked (chronology, personal story) or lower-impact than the Swarm for a
first demo. And I would **not** keep iterating the skills-logo systems — they're the wrong
representation and should be retired, not refined.

**Sequence, plainly: R0 cleanup → Living Swarm → link Jarvis → tighten the frame.** That is the
shortest path from today's codebase to a demo that both *delights* and *convinces.*
