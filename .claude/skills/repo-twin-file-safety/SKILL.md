---
name: repo-twin-file-safety
description: >-
  Route every src/ edit to the ACTIVE module and never a dead twin that silently
  no-ops. Use before editing, creating, refactoring, moving, or archiving ANY file
  under src/, and whenever a filename exists in more than one folder. Also use when
  performing R0 cleanup / archiving legacy code, so the exact dead path is archived
  and never the active same-named file (the "twin trap").
---

# Repo Navigation / Twin-File Safety

Several DEAD files share a filename with an ACTIVE file in another folder. Editing the
dead twin changes nothing at runtime; archiving the wrong twin breaks the world. Always
confirm the ACTIVE path here before touching `src/`.

## The live import graph (source of truth for "active")
Entry: `src/main.js` -> `src/world/village/villageBuilder.js` -> transitive imports.
If a file is NOT reachable from this graph, editing it has NO runtime effect.

## Twin pairs (ACTIVE vs DEAD) — memorize these
| Filename | ACTIVE (edit this) | DEAD (do not edit; archive target) |
|---|---|---|
| heroHouse.js | `structures/heroHouse.js` (villageBuilder:20) | `buildings/heroHouse.js` |
| cameraController.js | `player/cameraController.js` (villageBuilder:50) | `systems/cameraController.js` |
| playerController.js | `player/playerController.js` (villageBuilder:49) | `systems/playerController.js` |
| farmArea / farm | `props/farmZone.js` | `buildings/farmArea.js`, `structures/farmArea.js` |
| marketArea / market | `props/marketZone.js` | `structures/marketArea.js` |

## Archive map (from ARCHIVE_PLAN.md — plan only, nothing moved yet)
- **SAFE to archive — 29 files, zero runtime risk** (Groups 1-4): duplicate architectures
  (`buildings/*`, `systems/{cameraController,playerController,villageAssets,waterSystem}`,
  `structures/{farmArea,marketArea}`), legacy `*Builder.js` (roads/terrain/river/forest/
  mountain/props), dead skill systems (`skills/{logoStations,skillEmblems}`), misc orphans
  (`nature/forest`, `lighting/villageLighting`, `props/{fences,furniture}`, `entities/NPC`,
  `core/SceneManager`, `utils/constants`, `config/*`, `counter.js`).
- **VERIFY FIRST — 5 files** (Group 5): `entities/Car.js` (driving is live), `ui/interactionPanel.js`,
  `ui/interactionPrompt.js`, `world/mars/MarsWorld.js`, village `utils/materials.js`. Re-run a
  reference scan and smoke-test before archiving each.
- **KEEP + UPDATE — LIVE off-vision content** (Group 6): `skills/skillPillars.js` (placeholder
  logos), `skills/skillsForest.js` (orchestrator). **Do NOT archive yet** — they are the Forest's
  only content; retire only once the Living Swarm exists. `skillPlaque`, `skillTriggers`,
  `skillClearings` are reusable KEEP.

## Rules
1. Before editing a `src/` file, confirm it is the ACTIVE twin (table above / import graph).
2. When archiving, move the EXACT dead path into `archive/legacy-code/` — never the active twin.
3. Archive Groups 1-4 in batches; run `npm run build` / dev-load smoke test after each batch
   (verify Mars -> Portal -> Village -> Forest still loads).
4. Verify Group 5 individually before moving (especially `Car.js`, `MarsWorld.js`).
5. Never archive Group 6 before the Living Swarm replaces it (would empty the Forest).
6. Touch `skillPillars`/`skillsForest` only to retire/replace — not to "improve the logos."

## Authoritative references
- `ARCHIVE_PLAN.md` — primary: full active-vs-dead evidence table + recommended sequence.
- `CLAUDE.md` (sec 5) — folder map.
- `PROJECT_FULL_CONTEXT.md` (sec 16) — per-file responsibilities.
- `src/main.js`, `src/world/village/villageBuilder.js` — verify the live graph directly.

## When this skill fires, output
- The ACTIVE path to edit (or the exact DEAD path to archive), with the import-graph evidence,
  and a smoke-test reminder for any archive batch.
