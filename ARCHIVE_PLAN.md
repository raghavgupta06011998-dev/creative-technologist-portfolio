# ARCHIVE_PLAN.md — Conservative Cleanup Plan (review & approve before any action)

> **Mode:** Plan only. **Status:** AWAITING APPROVAL · **Version:** 1.0 · **Date:** 2026-05-31
> **Method:** Two independent scans — (1) the live `from '…'` import graph (`main.js` →
> `villageBuilder.js` → transitive); (2) a **catch-all reference scan** of every candidate
> basename across all of `src/` (catches dynamic imports, string refs, sibling imports, ctx
> property collisions), excluding each file's own lines and commented lines.
> **Nothing has been archived, deleted, or modified.** Highest priority: **preserve the playable
> Mars → Portal → Village → Forest experience.**
>
> **⚠ #1 cleanup risk — the "twin" trap:** several dead files share a *filename* with an active
> file in another folder (`heroHouse`, `cameraController`, `playerController`, `farmArea`,
> `marketArea`). When archiving, archive the **exact path** listed here — never the active twin.

---

## GROUP 1 — Duplicate architectures (SAFE to archive)
Superseded by the live `structures/` + `player/` + `props/` modules.

| File Path | Current Purpose | Evidence It Is Unused | What Replaced It | Risk | Action |
|---|---|---|---|---|---|
| `src/world/village/buildings/heroHouse.js` | old hero-house builder | Catch-all: only matches are the **`structures/heroHouse`** import + a comment; `buildings/heroHouse` never imported | `structures/heroHouse.js` (`villageBuilder:20`) | None | **Archive** |
| `src/world/village/buildings/farmArea.js` | old farm builder | No refs anywhere | `props/farmZone.js` | None | **Archive** |
| `src/world/village/buildings/residentialArea.js` | old houses builder | No refs anywhere | `structures/streetHouses.js` | None | **Archive** |
| `src/world/village/buildings/storyAreas.js` | old story-zone builder | No refs anywhere | (none active) | None | **Archive** |
| `src/world/village/systems/cameraController.js` | old camera | Only matches are **`player/cameraController`** imports + a comment | `player/cameraController.js` (`villageBuilder:50`) | None | **Archive** |
| `src/world/village/systems/playerController.js` | old player | Only match is **`player/playerController`** import | `player/playerController.js` (`villageBuilder:49`) | None | **Archive** |
| `src/world/village/systems/villageAssets.js` | old asset helper | No refs anywhere | `utils/assetLoader.js` | None | **Archive** |
| `src/world/village/systems/waterSystem.js` | old water | No refs anywhere | `nature/river.js` | None | **Archive** |
| `src/world/village/structures/farmArea.js` | dup farm builder | No refs anywhere | `props/farmZone.js` | None | **Archive** |
| `src/world/village/structures/marketArea.js` | dup market builder | No refs anywhere | `props/marketZone.js` | None | **Archive** |

## GROUP 2 — Legacy "Builder" architecture (SAFE to archive)
An earlier generation of world-assembly code; the live build uses the concrete modules.

| File Path | Current Purpose | Evidence It Is Unused | What Replaced It | Risk | Action |
|---|---|---|---|---|---|
| `src/world/village/roads/roadBuilder.js` | old road builder | No refs anywhere | `roads/roads.js` etc. | None | **Archive** |
| `src/world/village/terrain/terrainBuilder.js` | old terrain builder | No refs anywhere | `terrain/terrain.js` | None | **Archive** |
| `src/world/village/nature/riverBuilder.js` | old river builder | No refs anywhere | `nature/river.js` | None | **Archive** |
| `src/world/village/nature/forestBuilder.js` | old forest builder | No refs anywhere | `nature/skillsForest*` + `finalForest` | None | **Archive** |
| `src/world/village/nature/mountainBuilder.js` | old mountain builder | No refs anywhere | (none active) | None | **Archive** |
| `src/world/village/props/propsBuilder.js` | old props builder | No refs anywhere | `props/villageProps.js` | None | **Archive** |

## GROUP 3 — Abandoned skill systems (SAFE to archive — orphaned)
Two of the six abandoned skill iterations. (The *live* off-vision skill content is GROUP 6.)

| File Path | Current Purpose | Evidence It Is Unused | What Replaced It | Risk | Action |
|---|---|---|---|---|---|
| `src/world/village/skills/logoStations.js` | old logo-station system | No refs anywhere; `skillsForest` imports only `skillPillars`+`skillPlaque` | (superseded by skillPillars, itself off-vision) | None | **Archive** |
| `src/world/village/skills/skillEmblems.js` | old glowing-emblem system | No refs anywhere | (superseded) | None | **Archive** |

## GROUP 4 — Misc orphaned modules (SAFE to archive)

| File Path | Current Purpose | Evidence It Is Unused | What Replaced It | Risk | Action |
|---|---|---|---|---|---|
| `src/world/village/nature/forest.js` | old forest module | Catch-all matches are only the word "forest" in asset paths / other files; never imported | `skillsForest*` + `finalForest` | None | **Archive** |
| `src/world/village/lighting/villageLighting.js` | old lighting | No refs anywhere | `environment/environment.js` | None | **Archive** |
| `src/world/village/props/fences.js` | old fence props | No refs anywhere | procedural fences in heroHouse/skillsForestFence | None | **Archive** |
| `src/world/village/props/furniture.js` | old furniture props | No refs anywhere | (none active) | None | **Archive** |
| `src/entities/NPC.js` | Mars-era NPC | No refs anywhere | (none active) | None | **Archive** |
| `src/core/SceneManager.js` | old scene manager | No refs anywhere | `core/scene.js` + per-system setup | None | **Archive** |
| `src/utils/constants.js` | old constants | No refs anywhere | inline constants per module | None | **Archive** |
| `src/config/worldConfig.js` | old config | No refs anywhere | inline config | None | **Archive** |
| `src/config/lightingConfig.js` | old config | No refs anywhere | `environment.js` | None | **Archive** |
| `src/config/controlsConfig.js` | old config | No refs anywhere | `systems/controls.js` | None | **Archive** |
| `src/counter.js` | Vite starter leftover | Only match is "counter-curve" in a `roads.js` comment; never imported | (none) | None | **Archive** *(or Delete — pure boilerplate)* |

## GROUP 5 — VERIFY FIRST (likely safe; confirm to protect the live experience)

| File Path | Current Purpose | Evidence | What Replaced It | Risk | Action |
|---|---|---|---|---|---|
| `src/entities/Car.js` | car entity for driving mode | **Zero references anywhere** — even `systems/driving.js` doesn't import it; but **driving mode is live** (`main.js:9`) | driving appears to operate without it | **Medium** | **Verify First** — confirm driving doesn't dynamically need it before archiving |
| `src/ui/interactionPanel.js` | interaction panel UI | Module never imported; functionality is **reimplemented inline** in `systems/interaction.js` via `ctx.interactionPanel` (same name, different thing) | inline code in `systems/interaction.js` | Low | **Verify First** — confirm the inline version fully supersedes the module |
| `src/ui/interactionPrompt.js` | interaction prompt UI | Same as above — inline in `systems/interaction.js` via `ctx.interactionPrompt` | inline code in `systems/interaction.js` | Low | **Verify First** |
| `src/world/mars/MarsWorld.js` | Mars world (likely old) | No refs anywhere; the live Mars entry is `world/mars/marsScene.js` (`main.js:11`) | `marsScene.js` | Low | **Verify First** — confirm it's an unused duplicate, not a dep of marsScene |
| `src/world/village/utils/materials.js` | shared materials helper | Flagged orphan in prior audit; **not re-confirmed in this pass** | likely inline materials | Low | **Verify First** — re-run the reference scan before archiving |

## GROUP 6 — LIVE off-vision content (KEEP + UPDATE — do NOT archive yet)
This is cleanup target #5 (placeholder-logo content). It **conflicts the vision** but is the
**only content in the Forest today** — archiving it now empties the forest.

| File Path | Current Purpose | Evidence (it is USED) | What Will Replace It | Risk | Action |
|---|---|---|---|---|---|
| `src/world/village/skills/skillPillars.js` | live "Pillar 1" — floating **placeholder logo squares** | **USED:** `skillsForest.js:4` imports it; runs in the live build | the **Living Swarm** + the five Forest experiences | Medium | **Keep + Update** (retire when the Swarm lands) |
| `src/world/village/skills/skillsForest.js` | forest content orchestrator (stale "Logo Trail" header) | **USED:** `villageBuilder.js:37` | rewritten around the Maker's-Forest experiences | Medium | **Keep + Update** |
| `src/world/village/skills/skillPlaque.js` | entrance/exit wooden signs | **USED:** by `skillsForest.js` | reusable (signs) | Low | **Keep** |
| `src/world/village/skills/skillTriggers.js` | proximity overlay | **USED:** `villageBuilder.js:38` | reusable (overlay pattern) | Low | **Keep** |
| `src/world/village/skills/skillClearings.js` | tree-exclusion zones | **USED:** by `skillsForestTrees.js` | reusable | Low | **Keep** |

---

## TOTALS

**1. Definitely safe to archive (Risk: None): 29 files**
- Group 1 duplicate architectures: **10**
- Group 2 legacy builders: **6**
- Group 3 abandoned skill systems: **2**
- Group 4 misc orphans: **11** (incl. `counter.js`)

**2. Require verification before archiving: 5 files** (Group 5)
- `entities/Car.js` (Medium), `ui/interactionPanel.js` (Low), `ui/interactionPrompt.js` (Low),
  `world/mars/MarsWorld.js` (Low), `utils/materials.js` [village] (Low).

**3. Should remain active (KEEP): the entire playable world + engine**
- **World content (your KEEP list):** Mars (`marsScene` + `earth`/`gate`/`ground`), portal
  transition (`main.js`), village shell (`terrain`, `skillsForestTerrain`, `roads/*`,
  `structures/{heroHouse,entrance,streetHouses}`, `props/{villageProps,marketZone,farmZone}`),
  `nature/{river,bridge,outerRocks,streetTrees,skillsForestFence,skillsForestTrees,finalForest}`,
  forest road, Day/Night (`effects/dayNight`), environment/lighting (`environment`).
- **Engine:** `core/{camera,clock,renderer,scene}`, `entities/Player`,
  `systems/{movement,controls,interaction,driving,collision}`, `ui/overlayText`,
  `player/{playerController,cameraController,collision}`, `utils/{loaders,helpers,assetLoader}`,
  `villageBuilder`.
- **Disabled-but-retained village layers (Keep, inert):** `nature/gardenPlants`, `nature/mountain`,
  `props/{streetLamps,decorItems,signs}` — imported only via commented lines; keep for later
  re-enable.
- **Live skill content (Group 6 — Keep+Update):** `skillPillars`, `skillsForest`, `skillPlaque`,
  `skillTriggers`, `skillClearings`.
- Approx **45+ active files** — none are archive candidates.

**4. Risk to the Mars → Portal → Village → Forest experience**
- **Group 1–4 (29 files): zero runtime risk.** They are unreachable from the live import graph;
  archiving them cannot change what loads or renders. Verified by two independent scans.
- **Group 5 (5 files): low–medium, hence "verify first."** Notably `Car.js` (driving is live) and
  `MarsWorld.js` (Mars must keep working) — confirm before moving, even though both show zero
  references.
- **Group 6: do NOT archive yet.** The placeholder-logo content is off-vision but is the Forest's
  only content; removing it before the Living Swarm exists would leave the forest empty. Replace,
  don't pre-remove.
- **The one procedural risk is the "twin trap"** (§ top): archiving the wrong same-named file
  (e.g., `structures/heroHouse` instead of `buildings/heroHouse`) would break the village. Mitigate
  by archiving the **exact paths** in this plan and running `npm run build` / a dev-load smoke test
  after each batch.

---

## Recommended safe sequence (when you approve — not performed)
1. Archive **Group 1–4 (29 files)** into `archive/legacy-code/` (preserve paths + git history); smoke-test the Mars→Village→Forest load.
2. **Verify then archive Group 5** individually (especially `Car.js`, `MarsWorld.js`).
3. Leave **Group 6** live; replace it only when the **Living Swarm** is built.

*No archival or deletion performed. This plan awaits your manual review and approval.*
