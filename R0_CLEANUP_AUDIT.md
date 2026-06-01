# R0_CLEANUP_AUDIT.md — What to Preserve, Evolve, or Safely Remove

> **Mode:** Reality / audit-only. **Status:** AUDIT · **Version:** 1.0 · **Date:** 2026-05-31
> **Method:** Traced the live import graph from `src/main.js` → `villageBuilder.js` and grepped
> every `from '…'` in `src` (excluding commented imports, allowing `.js` extensions). "Used /
> orphan" calls below are backed by that trace. **No files were deleted, moved, refactored, or
> modified.**
> **Policy:** conservative. **Nothing is recommended for deletion unless proven unused**, and even
> then *Archive* is preferred over *Delete* to preserve knowledge.

---

## §0 · Verdict on your assumption
**Validated, with two refinements.**
- ✅ **World Content is mostly valuable → keep/evolve.** Mars, Portal/transition, Village, Market,
  Farm, Houses, Terrain, Roads, River, Bridge, Trees, Day/Night, and the Forest *environment* are
  real, working foundations. **Keep them.**
- ✅ **Code Architecture holds the real, safe cleanup** — duplicate module trees, an abandoned
  "Builder" architecture, and orphaned files that nothing imports.
- **Refinement 1:** *not all* World Content is keep-as-is — the **live skill content** (placeholder
  logos / `skillPillars`) is the one piece that **conflicts the vision** and should *eventually be
  replaced* (Keep+Update, not delete now).
- **Refinement 2:** *not all* of `src/` is cleanup — the **active engine** (`core/*`,
  `entities/Player`, `systems/{movement,controls,interaction,driving,collision}`, `ui/overlayText`,
  `world/mars/marsScene`) is **live and must be kept.** The cleanup targets only the *orphaned/
  duplicate* subset.

---

# CATEGORY A — WORLD CONTENT (mostly preserve)

### A1 · Mars intro + Portal transition
- **Files:** `world/mars/marsScene.js` (+ `earth.js`, `gate.js`, `ground.js`), `main.js` transition.
- **Purpose:** the arrival scene + white-fade portal into the village.
- **Used?** ✅ `main.js:11` imports `marsScene`; transition is `ctx.triggerTransition`.
- **Why flagged:** off the bible's *designed* Portal (cosmic threshold), but you've designated it a
  valued foundation.
- **Relationship to vision:** **Needs updating** eventually (could become the canonical Portal); not
  a conflict to remove.
- **Risk:** High (it's the entry point). **Recommendation:** **Keep** (evolve later).
- *Note:* `world/mars/MarsWorld.js` appears **orphaned** (no live import) — likely an older duplicate
  of `marsScene`. Verify; if confirmed, Archive. Keep Mars itself.

### A2 · Village shell (terrain, roads, houses, market, farm, river, bridge)
- **Files:** `terrain/terrain.js`, `terrain/skillsForestTerrain.js`, `roads/{roads,backStreet,backLanes,skillsForestRoad}.js`, `structures/{heroHouse,entrance,streetHouses}.js`, `props/{villageProps,marketZone,farmZone}.js`, `nature/{river,bridge,outerRocks,streetTrees}.js`.
- **Purpose:** the built village hub + the path to the forest.
- **Used?** ✅ All imported and called by `villageBuilder.js` (lines 6–46).
- **Why flagged:** not flagged as problematic — listed to confirm preservation.
- **Relationship to vision:** **Supports** (the hub / on-ramp). The *meaning* layer (functional
  places) is missing but that's additive, not a fix.
- **Risk:** High (core of the built world). **Recommendation:** **Keep.**

### A3 · Day/Night system
- **File:** `effects/dayNight.js`.
- **Used?** ✅ `villageBuilder.js:41,83`.
- **Relationship to vision:** **Supports strongly** (~90% match). **Risk:** High. **Recommendation:**
  **Keep** (reuse for the Living Swarm's day/night).

### A4 · Environment / lighting
- **File:** `environment/environment.js`.
- **Used?** ✅ `villageBuilder.js:5,77`.
- **Relationship to vision:** **Supports** (golden-hour-ish, shadows off). **Risk:** High.
  **Recommendation:** **Keep.** *(Note: `lighting/villageLighting.js` is a separate **orphan** — see B7.)*

### A5 · Forest **environment** (road, fence, trees, terrain disc)
- **Files:** `roads/skillsForestRoad.js`, `nature/{skillsForestFence,skillsForestTrees}.js`, `terrain/skillsForestTerrain.js`, `skills/skillClearings.js`.
- **Used?** ✅ All called by `villageBuilder.js`; `player/collision.js:2` consumes `skillsForestTrees` `TREE_POSITIONS`.
- **Relationship to vision:** **Supports** (~80% — this is the stage the Living Swarm will sit in).
- **Risk:** High. **Recommendation:** **Keep.**

### A6 · Disabled village layers (retained, not called)
- **Files:** `nature/gardenPlants.js`, `nature/mountain.js`, `props/streetLamps.js`, `props/decorItems.js`, `props/signs.js`.
- **Used?** ⚠ **Imported only via commented-out lines** in `villageBuilder.js:21–25` → **not
  executed.** Proven: no live (non-commented) import.
- **Why flagged:** intentionally disabled village content, kept for later re-enable.
- **Relationship to vision:** **Supports** (village dressing) — simply not active.
- **Risk:** Safe (inert). **Recommendation:** **Keep (disabled).** Do not delete; they're a deliberate
  "re-enable later" set.

### A7 · Skill **content** (the off-vision piece) ⚠
- **Files:** `skills/skillsForest.js` (live), `skills/skillPillars.js` (live), `skills/skillPlaque.js` (live; used for entrance/exit signs), `skills/skillTriggers.js` (live overlay).
- **Purpose:** what renders in the forest today — a mossy boulder + **3 floating placeholder logo
  squares** (Figma/Illustrator/Zeplin) + entrance sign + campfire + exit arch + proximity overlay.
- **Used?** ✅ `villageBuilder.js:37,38`; `skillsForest.js:4` imports `skillPillars`.
- **Why flagged:** **the placeholder-logo representation directly conflicts the locked vision** (the
  Maker's Forest rejects logos/boards). The `skillsForest.js` header comment ("Tool/Brand Logo
  Trail") is also stale — it disagrees with its own imports.
- **Relationship to vision:** **Conflicts** (logos) — to be **replaced** by the Living Swarm + the
  five experiences. `skillPlaque` (entrance/exit signs) and `skillTriggers` (overlay) are reusable.
- **Risk:** Medium (live, but easily swapped). **Recommendation:** **Keep + Update / Replace** —
  retire the logo pillar from the build when the Living Swarm lands; **keep** `skillTriggers`
  (overlay pattern) and `skillPlaque` (signs) for reuse. *(Do not delete now — it's the only forest
  content until the Swarm exists.)*

---

# CATEGORY B — CODE ARCHITECTURE (the real, safe cleanup)

> All items below are **proven unused** by the live import graph (nothing imports them), unless the
> row says "verify." Recommendation leans **Archive** (preserve) over **Delete**, per policy.

### B1 · Duplicate "buildings/" tree (superseded by `structures/`)
- **Files:** `buildings/{heroHouse,farmArea,residentialArea,storyAreas}.js`.
- **Used?** ❌ Proven orphan. The live build imports `structures/heroHouse` (`villageBuilder.js:20`),
  `structures/streetHouses`, `props/farmZone` — never the `buildings/` versions.
- **Why:** an earlier module layout, superseded.
- **Relationship to vision:** neutral (dead duplicates). **Risk:** Safe. **Recommendation:**
  **Archive** (or Delete — proven unused).

### B2 · Duplicate "systems/" controllers (superseded by `player/`)
- **Files:** `systems/cameraController.js`, `systems/playerController.js`, `systems/villageAssets.js`, `systems/waterSystem.js`.
- **Used?** ❌ Proven orphan. Live build uses `player/playerController` (`villageBuilder.js:49`) →
  which imports `player/cameraController` + `player/collision`. Nothing imports the `systems/`
  controllers. *(Note: this is the village-level `systems/` folder — distinct from the active engine
  `src/systems/`.)*
- **Relationship to vision:** neutral. **Risk:** Safe. **Recommendation:** **Archive** (or Delete).

### B3 · Duplicate structures (superseded by `props/`)
- **Files:** `structures/farmArea.js`, `structures/marketArea.js`.
- **Used?** ❌ Proven orphan. Live build uses `props/farmZone` + `props/marketZone`
  (`villageBuilder.js:45,46`).
- **Risk:** Safe. **Recommendation:** **Archive** (or Delete).

### B4 · Abandoned "Builder" architecture
- **Files:** `roads/roadBuilder.js`, `terrain/terrainBuilder.js`, `nature/{riverBuilder,forestBuilder,mountainBuilder}.js`, `props/propsBuilder.js`.
- **Used?** ❌ Proven orphan. The live build uses the concrete modules (`roads/roads.js`,
  `terrain/terrain.js`, `nature/river.js`, etc.), not these builders.
- **Why:** an older generation of the world-assembly code.
- **Relationship to vision:** neutral. **Risk:** Safe. **Recommendation:** **Archive.**

### B5 · Abandoned skill systems (off-vision + orphaned)
- **Files:** `skills/logoStations.js`, `skills/skillEmblems.js`.
- **Used?** ❌ Proven orphan (nothing imports them; the live `skillsForest` imports only
  `skillPillars` + `skillPlaque`).
- **Why:** two of the six abandoned skill iterations; also off-vision (logos/emblems).
- **Relationship to vision:** **Conflicts** + dead. **Risk:** Safe. **Recommendation:** **Archive.**

### B6 · Orphaned nature/forest module
- **File:** `nature/forest.js`.
- **Used?** ❌ Proven orphan (superseded by `skillsForest*` + `finalForest`).
- **Risk:** Safe. **Recommendation:** **Archive.**

### B7 · Misc orphaned village modules
- **Files:** `lighting/villageLighting.js`, `props/fences.js`, `props/furniture.js`, `utils/materials.js` *(village)*.
- **Used?** ❌ Proven orphan.
- **Relationship to vision:** neutral. **Risk:** Safe. **Recommendation:** **Archive.**

### B8 · Orphaned src-level engine files
- **Files:** `entities/Car.js`, `entities/NPC.js`, `ui/interactionPanel.js`, `ui/interactionPrompt.js`, `core/SceneManager.js`, `utils/constants.js`, `config/{worldConfig,lightingConfig,controlsConfig}.js`.
- **Used?** ❌ Proven orphan (no live import). ⚠ **Verify before touching `Car.js`:** the **driving
  system is live** (`main.js:9` → `systems/driving.js`, `systems/movement.js:3`), yet `Car.js`
  itself is not imported — confirm driving doesn't lazy-load it.
- **Relationship to vision:** neutral / Mars-era. **Risk:** Safe (most) / **Medium** (`Car.js` —
  verify vs. driving). **Recommendation:** **Archive** (Car.js: **Keep+verify** first).

### B9 · Vite scaffolding leftover
- **File:** `src/counter.js` (+ template `static/javascript.svg`, `static/vite.svg`).
- **Used?** ❌ Proven orphan (Vite starter remnant).
- **Risk:** Safe. **Recommendation:** **Delete** (proven-unused boilerplate) or Archive.

---

## §1 · Active engine — DO NOT touch (listed to prevent accidental cleanup)
These `src/` files are **live** and must be kept: `core/{camera,clock,renderer,scene}.js`,
`entities/Player.js`, `systems/{movement,controls,interaction,driving,collision}.js`,
`ui/overlayText.js`, `utils/{loaders,helpers}.js`, `world/mars/marsScene.js`,
`world/village/villageBuilder.js` and everything it calls (Category A).

---

## §2 · Summary

| Category | Items | Dominant recommendation |
|---|---|---|
| **World Content** | Mars/Portal, Village shell, Day/Night, Environment, Forest env, disabled layers | **Keep** (one item — skill logos — **Keep+Update/Replace**) |
| **Code Architecture** | buildings/, systems/ controllers, structures dups, *Builders, dead skill systems, nature/forest, misc orphans, src orphans | **Archive** (all proven unused; counter.js Delete-eligible) |

**Your assumption holds:** the World Content is the valuable, preserve-and-evolve layer; the Code
Architecture is where the safe cleanup lives. The only nuances are (a) the live **skill-logo content
conflicts the vision and should be *replaced*, not kept as-is**, and (b) the **active engine inside
`src/` must be preserved** — the cleanup is strictly the orphaned/duplicate subset.

## §3 · Proven-unused count (Delete-eligible if you choose; Archive recommended)
~**24 files** across B1–B9 are proven orphaned. **0** have been touched. Recommended path when you're
ready: **Archive** the B-group into `archive/legacy-code/` (preserving git history), **Keep+verify**
`Car.js`, **Keep+Update** the A7 skill content until the Living Swarm replaces it. Nothing here blocks
building the Living Swarm in the live forest environment.

*No cleanup performed. Audit only. Await your decision before any archival or deletion.*
