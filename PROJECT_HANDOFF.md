# PROJECT HANDOFF — Raghav 3D Interactive Portfolio
**Authoritative current-truth handoff. As of 2026-05-31.**
A new Claude session can continue the project from this document alone. Only current truth is
included; rejected directions are listed *only* in §REJECTED so they are never reopened.

---

## ▶ START HERE (new Claude session)
1. **What this is:** a cinematic, *playable* 3D portfolio world (Three.js), not a website. The
   medium is the proof — exploring the world demonstrates the maker's core skill.
2. **Read order:** this file → `design-bible/README.md` (the LOCKED vision) → `BUILD_ROADMAP.md`
   + `SWARM_BUILD_CHECKLIST.md` (what to build) → `CURRENT_BUILD_AUDIT.md` (code reality).
3. **Source-of-truth hierarchy** (higher wins): **L1 vision =** `design-bible/`; **L2 build =**
   implementation docs at repo root; **L3 state =** `PROJECT_FULL_CONTEXT.md`, `ASSET_MAP.md`, etc.
4. **The work is safely backed up** (see §GIT). Full history is local on `backup-before-cleanup`;
   a clean 226 MB snapshot is on GitHub.
5. **Next action:** build the **Living Swarm** (fully spec'd) — see §NEXT. Do NOT write more
   planning docs; documentation is complete. Build.
6. **Before editing code:** check `ARCHIVE_PLAN.md` — there are duplicate same-named files
   (`buildings/heroHouse.js` vs the active `structures/heroHouse.js`, etc.). Edit only ACTIVE files.

---

## IDENTITY & VISION (LOCKED)
- **Maker identity:** *Creative Technologist* — **"I design and build intelligent tools, agents,
  and experiences that make work smarter."** Build is the engine; design is the differentiator.
- **Headline idea:** the portfolio *is* the proof of its own claim.
- **Core laws:** experience over documentation · show-don't-tell · one identity (no diffusion) ·
  memory over completeness · humane-not-cold (warm golden-hour, never neon/sci-fi) · every
  immersive element anchored to real evidence or a fast path · **meaning before form** ·
  realistic/semi-realistic.
- **Audience:** recruiters; working assumption = **founding-designer / early-stage** lean
  (ratification PENDING).

## NARRATIVE STRUCTURE (LOCKED)
Linear story; **hub-and-spoke access** (a fast path to proof is required).
`Space/Portal → Village → Hero House → Bridge → Forest → Mountains → Projects → Future`

| Zone | Owns the question | Notes |
|---|---|---|
| Portal | "Am I entering somewhere real?" | concept-level |
| **Village** | "Where do I come from / what shaped me?" | world that shaped the maker (given + self-built); functional places (Workshop/Studio/Library/Market), **never labelled value-buildings**; the hub |
| **Hero House** | "Who am I?" | personal story; emotional core; interior not built |
| **Forest** | "What can I do?" | **LOCKED.** "Maker's Forest" — 5 performed-capability experiences |
| **Mountains** | "Where have I done it?" | professional record; **Hall of Gates**, context-not-content, gates portal to Projects |
| **Projects** | "What have I built?" | proof / hiring zone; **2 worlds:** Jarvis + Agent Suite |
| Future | "What now — will I act?" | invitation / CTA; concept-level |

Forest's 5 experiences (verbs): **Workshop·REVEAL** (design) · **Living Swarm·DIRECT** (AI agents) ·
**Waterworks·CONNECT** (systems) · **Overlook·SEE** (insight; reveals the mountains) ·
**Story Fire·KINDLE** (creative production; shows real reel).

---

## DESIGN BIBLE STATUS (LOCKED) — `design-bible/`
```
design-bible/
  README.md                         index + reading order
  MASTER_WORLD_MAP.md               spatial layout, sightlines, build order
  MASTER_WORLD_BLUEPRINT.md         production philosophies + future-agent architecture
  DECISION_LOG.md                   append-only decision/reversal record (D-001…D-011)
  00-canon/  PORTFOLIO_BIBLE.md · NARRATIVE_SPINE.md · GLOSSARY.md
  01-languages/  VISUAL · LIGHTING · MATERIAL · INTERACTION · ENVIRONMENTAL_STORYTELLING · ASSET
  02-zones/  MASTER_FOREST.md · MASTER_VILLAGE.md · MASTER_MOUNTAINS.md · MASTER_PROJECTS.md
  03-experiences/forest/  EXP_LIVING_SWARM.md
  04-evaluation/  EVALUATION_FRAMEWORK.md · ASSET_ACCEPTANCE_RUBRIC.md
  05-templates/  ZONE_MASTER_TEMPLATE.md · EXPERIENCE_SPEC_TEMPLATE.md
```
All design-bible docs are **LOCKED**. Vision is complete; do not expand it. (Audio/Motion language
docs intentionally not written yet — principles live in Blueprint §1 / Interaction §8.)

## PROJECTS (LOCKED)
- **Two Project Worlds:** **Jarvis** (interactive flagship — real voice-powered browser workspace,
  hand-engineered, fully showable) and **Agent Suite** (impact story — production AI agents:
  Glean QC/ticket/training; shown as guided simulation since live systems are confidential).
- **Project Zero = meta-reveal** at the Summit ("you're inside one of my projects"), **not** a
  Project World. No third world unless a future build independently earns it. Cap 3, default 2.

---

## CODEBASE REALITY (ACTIVE) — `src/`
- **Stack:** Three.js **r0.183.2**, **Vite**, **vanilla JS** (no framework). One dependency: `three`.
- **Boot flow:** app starts in a **Mars scene** (`world/mars/marsScene.js`) with a legacy
  **driving mode**; a white-fade **portal transition** loads the **Village**
  (`world/village/villageBuilder.js`). Force village directly with URL hash `#village`.
- **Runtime pattern:** shared `ctx` object; `villageBuilder.js` orchestrates; per-frame work runs
  via `ctx.dynamicUpdaters`; assets via `utils/assetLoader.js` (`placeAsset`, `modelCache`).
- **What renders today:** Village (terrain, cobblestone roads + back lanes, hero house exterior,
  8 street houses, market, farm, street trees, outer rocks, river, **walkable bridge**); Forest
  *environment* (laterite road, procedural fence, ~1,240 instanced trees/bushes, terrain disc);
  **Day/Night toggle** (top-right, working); proximity overlay; player/camera/collision.
- **Forest "skill" content (ACTIVE but OFF-VISION):** `skills/skillsForest.js` → `skillPillars.js`
  renders **placeholder logo squares** (Figma/Illustrator/Zeplin) — this is to be **replaced by
  the Living Swarm + the 5 experiences**. Reusable: `skillTriggers.js` (overlay), `skillPlaque.js`
  (signs).
- **Performance (good, keep):** shadows globally off; InstancedMesh (~5–10 draw calls for the
  forest); shared materials; delta-time movement; frame-rate-independent camera.
- **Mars + boot player use REMOTE assets** (threejs.org textures, modelviewer.dev Astronaut) — no
  local dependency. The Village player is local `Knight.glb`.

### Key code paths
```
src/main.js                                   entry; ctx; boot; render loop
src/world/village/villageBuilder.js           village assembly (the active graph root)
src/world/village/effects/dayNight.js         Day/Night toggle (registerLogoMaterial/registerLight)
src/world/village/utils/assetLoader.js        ASSETS registry + placeAsset + modelCache
src/world/village/skills/                     LIVE: skillsForest, skillPillars, skillTriggers, skillPlaque, skillClearings
src/world/village/nature/skillsForest*        forest road/fence/trees/terrain (KEEP — Swarm's stage)
src/world/village/player/                     playerController, cameraController, collision (ACTIVE)
src/world/village/structures/                 entrance, heroHouse, streetHouses (ACTIVE)
src/world/village/props/                      villageProps, marketZone, farmZone (ACTIVE)
```
**Proposed home for the Living Swarm:** `src/world/village/forest/livingSwarm.js` (new) +
one call in `villageBuilder.js` + register updater in `ctx.dynamicUpdaters`.

---

## GIT / BACKUP (ACTIVE — safe recovery points)
- **New GitHub repo (backup):** `https://github.com/raghavgupta06011998-dev/creative-technologist-portfolio.git`
  (remote name `backup`; branch **`main`** = the clean snapshot).
- **Old repo (origin, stale):** `https://github.com/raghavgupta06011998-dev/my-project.git` (untouched).
- **Branches (local):**
  - **`backup-before-cleanup` @ `541e08f`** — FULL history + all 3.4 GB assets. **Recovery point.
    Local only; never pushed (contains >100 MB files); do not build on it; never delete.**
  - **`clean-snapshot` @ `ea09d18`** — orphan; **226 MB · 740 files**, 0 files ≥100 MB; **pushed to
    `backup/main`**. Currently checked out. **Future work happens here (or a branch off it).**
  - **`main` @ `541e08f`** — stale, tracks old origin; untouched.
- **Recovery points:** local full = `backup-before-cleanup` (541e08f); off-site clean = GitHub
  `main` (ea09d18). Rollback: `git checkout -f backup-before-cleanup`.
- **On disk:** nothing was deleted — `public/assets` is still **3.4 GB** locally (excluded files
  are untracked, not removed). `.git` history is 3.7 GB locally.
- **⚠ The clean-snapshot branch has NO asset `.gitignore` yet** — a future `git add .` could
  re-stage the 3.4 GB. Add the asset `.gitignore` (see `GIT_ASSET_STRATEGY.md`) before further
  commits on this branch.

---

## DOCUMENTATION HIERARCHY
- **L1 VISION (canonical, LOCKED):** `design-bible/**`
- **L2 BUILD (canonical):** `BUILD_ROADMAP.md` · `TECH_ARCHITECTURE.md` ·
  `LIVING_SWARM_IMPLEMENTATION_PLAN.md` · `SWARM_BUILD_CHECKLIST.md`
- **L3 STATE (reference; vision parts superseded by L1, marked in place):**
  `PROJECT_FULL_CONTEXT.md` · `PROJECT_PROGRESS.md` · `ASSET_MAP.md` · `ASSET_AUDIT_REPORT.md` ·
  `EXTERNAL_ASSET_DOWNLOAD_PLAN.md` · `CLAUDE.md` (auto-loaded; routes the hierarchy)
- **OPS / AUDITS:** `REPOSITORY_STRATEGY.md` · `GIT_ASSET_STRATEGY.md` · `CLEANUP_STRATEGY.md` ·
  `REPOSITORY_HEALTH_REPORT.md` · `CURRENT_BUILD_AUDIT.md` · `R0_CLEANUP_AUDIT.md` ·
  `ARCHIVE_PLAN.md` · `archive/` (historical, immutable) · this file.

---

## EXISTING AUDITS & CLEANUP FINDINGS (PENDING action — nothing executed)
- **~24 code files proven orphaned/duplicate** (full list + evidence in `ARCHIVE_PLAN.md`):
  duplicate trees `buildings/**`, `systems/{cameraController,playerController,villageAssets,waterSystem}`,
  `structures/{farmArea,marketArea}`; legacy `*Builder.js` (6); dead skill systems
  `skills/{logoStations,skillEmblems}`; misc orphans (`nature/forest`, `lighting/villageLighting`,
  `props/{fences,furniture}`, `core/SceneManager`, `utils/constants`, `config/*`, `entities/NPC`,
  `ui/interactionPanel`, `ui/interactionPrompt`, `world/mars/MarsWorld`, `counter.js`). **Verify-first:**
  `entities/Car.js` (driving is live), village `utils/materials.js`.
  → Recommended action: **Archive** (not delete) to `archive/legacy-code/`. **Not yet done.**
- **Assets:** ~3.4 GB tracked, **only ~200–230 MB used**. Verified keep-set + remove-set in
  `R0_CLEANUP_AUDIT.md` / `CLEANUP_STRATEGY.md`. The clean snapshot already embodies the keep-set.

## KNOWN ISSUES
- **Pre-existing 404s (DEFERRED, not regressions):** `heroHouse` apple/cherry trees and
  `skillPillars` boulder reference `forest/forest/source/*` which **does not exist on disk** — they
  already don't render. Fix by re-sourcing or removing those `placeAsset` calls.
- **Off-vision live content:** the placeholder-logo skill pillars (replace with Living Swarm).
- **Dead/duplicate code** (above) — agent hazard (wrong-twin edits) until archived.
- **clean-snapshot lacks asset `.gitignore`** (above).

## LIVING SWARM STATUS (PENDING build — fully specified)
- **Spec (LOCKED):** `design-bible/03-experiences/forest/EXP_LIVING_SWARM.md`
- **How-to-build:** `LIVING_SWARM_IMPLEMENTATION_PLAN.md`
- **Task board:** `SWARM_BUILD_CHECKLIST.md` (23 micro-tasks, A1→G2)
- **Essence:** a warm swarm of living lights the visitor **directs by movement** to ignite dormant
  points (verb = DIRECT). Must read as **intelligence + trust + agency**; warm/organic, **never
  neon/sci-fi**; anchored to the real agents; day-subtle / night-dominant; fully **procedural**
  (no GLB), instanced, day/night-aware. **Not yet built.**

---

## STATUS SUMMARY

**LOCKED** (do not reopen): identity · narrative spine + zone ownership · all `design-bible/` ·
Forest concept + 5 experiences · Living Swarm design · Projects = Jarvis + Agent Suite ·
Project Zero = meta-reveal at Summit · Mountains = Hall of Gates (context-not-content) ·
Village = "world that shaped me" via functional places · performance laws · doc hierarchy ·
the GitHub backup.

**ACTIVE** (working in code): Mars boot + portal transition · Village shell · Forest environment ·
Day/Night · player/camera/collision · asset pipeline · proximity overlay · (off-vision) skill
pillars.

**PENDING** (decided, not executed): build the Living Swarm · archive the ~24 dead/duplicate files ·
add asset `.gitignore` to clean-snapshot · Jarvis + Agent Suite worlds · Mountains/House/Portal/
Future builds.

**DEFERRED** (intentionally later): pre-existing 404 fixes (apple/cherry/boulder) · aggressive asset
curation/history slim · primary-audience ratification · career chronology + project metrics
(content) · Audio/Motion language docs · `COWORK_INSTRUCTIONS.md` archival.

**REJECTED** (never reopen — see §DO NOT REPEAT for why): skill boards/plaques · glowing cartoon
"skill trees" · rock/monolith monuments · floating-logo trails / logo stations · skill emblems ·
the Mountains "continuous transformation climb" (Direction A) · Project Zero as a peer world ·
a 3rd project world for symmetry · Git LFS · history rewrite for the backup.

---

## WHAT'S COMPLETED vs NOT
**Completed:** the entire documentation/vision system (Bible + implementation docs + audits) ·
village/bridge/river/forest-environment build · day/night · the GitHub backup (off-site, clean).
**Not completed:** any of the 5 Forest experiences (incl. Living Swarm) · Mountains · Projects
worlds · Hero House interior · Portal/Future · code archive/cleanup · the Village "meaning" layer.

## ▶ NEXT (recommended order — build, don't document)
1. *(optional, ~1 session)* **R0 coherence cleanup:** retire the placeholder-logo pillars from the
   live build + archive the ~24 dead/duplicate files (per `ARCHIVE_PLAN.md`) + add asset
   `.gitignore`. Makes the repo agent-safe and on-tone.
2. **Build the Living Swarm** in the existing forest clearing — the signature proof
   (`SWARM_BUILD_CHECKLIST.md`, start at A1). Build C-phase intent-following FIRST (agency = make-or-break).
3. **Build Jarvis** (the touchable flagship) + a Projects hub entry + fast path.
4. Then: remaining Forest clearings → Mountains → Village finish → Hero House → bookends.
> Discipline: build the **proof spine (Swarm → Jarvis → Projects)** before framing zones. The
> documentation phase is over — the value is now in building.

---

## ⛔ DO NOT REPEAT THESE DISCUSSIONS (already finalized)
1. **What the Forest is** — LOCKED as the "Maker's Forest" (5 performed experiences). Six prior
   representations were tried and rejected (boards, emblems, rocks/monoliths, cartoon glowing
   trees, floating-logo stations, pillar monuments) — *all* failed for being label/museum/collector
   /cartoon. **Do not propose another forest representation.**
2. **Skills as logos/boards** — rejected; the live placeholder logos are temporary, to be replaced
   by the Swarm. Don't "improve the logos."
3. **Mountains structure** — LOCKED as Hall of Gates (context-not-content). The continuous-climb
   "transformation" model (Direction A) was rejected (it duplicated the Forest). Don't redesign.
4. **Project Zero** — it is a meta-reveal at the Summit, **not** a Project World. Don't re-add it
   as a room. Projects = 2 worlds (Jarvis + Agent Suite); no symmetry-driven third.
5. **Village meaning** — "world that shaped me," principles embodied as **functional places, never
   labelled**. Not an abstract "values" zone, not a skills zone.
6. **Identity** — Creative Technologist (designer who builds). Don't relitigate positioning.
7. **Git/backup approach** — Option A (orphan clean snapshot) was executed; **no Git LFS, no
   history rewrite**. The backup exists. Don't redo it.
8. **Documentation** — the Bible is complete and LOCKED. **Do not create new vision/narrative/
   planning documents.** Build instead.

---
*Recovery quick-reference:* full local = `backup-before-cleanup` (541e08f) · clean off-site =
GitHub `backup/main` (ea09d18) · build on `clean-snapshot`.
