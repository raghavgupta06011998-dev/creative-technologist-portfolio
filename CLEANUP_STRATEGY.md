# CLEANUP_STRATEGY.md — Phased, Reversible Cleanup Plan

> **Mode:** Strategy. **Status:** AWAITING APPROVAL · **Version:** 1.0 · **Date:** 2026-05-31
> **No deletions, no archiving, no moves performed.** This sequences *what* to clean, *in what
> order*, and *how safely*. Per-code-file detail lives in `ARCHIVE_PLAN.md`; per-asset detail in
> `GIT_ASSET_STRATEGY.md`. Actions use **KEEP · KEEP+UPDATE · ARCHIVE · VERIFY FIRST** (never DELETE
> without proof; default to ARCHIVE over DELETE).

---

## §1 · Four cleanup classes

### CLASS A — SAFE cleanup (zero runtime risk; reversible)
Proven unreachable from the live import graph (two independent scans, `ARCHIVE_PLAN.md`).
| Target | Reason | Evidence | Risk | Replaced by | Archive destination | Action |
|---|---|---|---|---|---|---|
| `buildings/` (4 files) | duplicate tree | no live import | None | `structures/` + `props/` | `archive/legacy-code/buildings/` | **ARCHIVE** |
| `systems/{cameraController,playerController,villageAssets,waterSystem}.js` | duplicate tree | no live import | None | `player/*`, `assetLoader`, `river` | `archive/legacy-code/systems/` | **ARCHIVE** |
| `structures/{farmArea,marketArea}.js` | duplicate | no live import | None | `props/{farmZone,marketZone}` | `archive/legacy-code/structures/` | **ARCHIVE** |
| `*/`*Builder.js` (6: road/terrain/river/forest/mountain/props) | legacy architecture | no live import | None | concrete modules | `archive/legacy-code/builders/` | **ARCHIVE** |
| `skills/{logoStations,skillEmblems}.js` | abandoned skill systems | no live import | None | (superseded) | `archive/legacy-code/skills/` | **ARCHIVE** |
| `nature/forest.js`, `lighting/villageLighting.js`, `props/{fences,furniture}.js` | orphans | no live import | None | active equivalents | `archive/legacy-code/misc/` | **ARCHIVE** |
| `entities/NPC.js`, `core/SceneManager.js`, `utils/constants.js`, `config/*` (3) | src orphans | no live import | None | inline / active engine | `archive/legacy-code/src/` | **ARCHIVE** |
| `src/counter.js` | Vite scaffold | only matched a comment | None | (none) | `archive/legacy-code/src/` | **ARCHIVE** |
**Total CLASS A: 29 files.** Independent of the asset/git problem; tiny; reversible from
`backup-before-cleanup`.

### CLASS B — VERIFY FIRST (likely safe; confirm to protect the live experience)
| Target | Reason | Evidence | Risk | Action |
|---|---|---|---|---|
| `entities/Car.js` | car entity | **zero refs** anywhere, but driving mode is live (`main.js:9`) | Medium | **VERIFY FIRST** (confirm driving doesn't lazy-load it) |
| `ui/interactionPanel.js`, `ui/interactionPrompt.js` | UI modules | never imported; logic reimplemented **inline** in `systems/interaction.js` via `ctx.*` | Low | **VERIFY FIRST** |
| `world/mars/MarsWorld.js` | Mars world | no refs; live entry is `marsScene.js` | Low | **VERIFY FIRST** (Mars must keep working) |
| `world/village/utils/materials.js` | materials helper | flagged orphan; not re-confirmed in catch-all pass | Low | **VERIFY FIRST** (re-scan) |

### CLASS C — REQUIRES APPROVAL (irreversible or vision-affecting)
| Target | Reason | Evidence | Risk | Action |
|---|---|---|---|---|
| Git **history rewrite** to purge > 100 MB blobs | unblock GitHub push | `.git` 3.7 GB; 4 files > 100 MB in history (`GIT_ASSET_STRATEGY §2`) | **High (irreversible)** | **APPROVAL + offline backup first** |
| `.gitignore` asset rules + untrack `public/assets/` heavy folders | stop committing 3.4 GB | `.gitignore` lacks asset rules | Medium | **APPROVAL** (finalize keep-set first) |
| **Live off-vision skill content** (`skillPillars.js` placeholder logos; `skillsForest.js` logo orchestration) | conflicts LOCKED vision | `USED` by `villageBuilder:37` | Medium | **KEEP + UPDATE** — replace only when the Living Swarm lands; do **not** remove first |

### CLASS D — NEVER (do not clean)
- The **playable world + engine** (Mars, Portal, Village, Hero House, Market, Farm, Roads, River,
  Bridge, Terrain, Trees, Forest environment, Day/Night, player/camera/collision, asset pipeline).
  → **KEEP.**
- The **LOCKED `design-bible/`** and the **implementation docs.** → **KEEP.**
- **`backup-before-cleanup` branch** and any offline backup. → **KEEP (never delete).**
- **Disabled-but-retained village layers** (`gardenPlants`, `mountain`, `streetLamps`,
  `decorItems`, `signs`) — intentionally commented out, kept for re-enable. → **KEEP.**
- **Reusable skill modules** (`skillPlaque`, `skillTriggers`, `skillClearings`). → **KEEP.**
- **`archive/` contents** (immutable history). → **KEEP.**

## §2 · Phased order (each phase reversible until C)
1. **Phase 0 — Backups (no cleanup):** confirm `backup-before-cleanup`, add a `baseline-pre-cleanup`
   tag, make an **offline copy**, verify it builds. *(Gate for everything irreversible.)*
2. **Phase 1 — CLASS A code archive (safe):** move the 29 files to `archive/legacy-code/`; run the
   app (Mars→Village→Forest) to confirm no regression. Reversible. Makes the repo agent-safe by
   removing dead twins.
3. **Phase 2 — CLASS B verify + archive:** confirm each, then archive. Re-test driving + Mars.
4. **Phase 3 — Git/asset slim (CLASS C, APPROVAL):** finalize keep-set + `.gitignore`; choose
   Option A (clean snapshot) or B (history rewrite) from `GIT_ASSET_STRATEGY §8`; back up offline
   first; execute on a copy; push.
5. **Phase 4 — Build:** Living Swarm (the off-vision skill content is replaced here, not before).

## §3 · Cross-cutting rules
- **Code cleanup (A/B) is independent of the git/asset problem (C)** — they can proceed in
  parallel; A/B do **not** block the GitHub push, and C does **not** require A/B.
- **Twin trap:** archive exact paths only (`ARCHIVE_PLAN.md` top warning).
- **Smoke-load after every structural batch.** No batch is "done" until Mars→Village→Forest loads.

> Cross-refs: `ARCHIVE_PLAN.md` (file-level evidence), `GIT_ASSET_STRATEGY.md` (assets/history),
> `REPOSITORY_STRATEGY.md` (branch/backup/recovery), `CURRENT_BUILD_AUDIT.md` (what's live).
