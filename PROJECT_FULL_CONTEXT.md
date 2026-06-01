# PROJECT_FULL_CONTEXT.md

> **Raghav 3D Interactive Portfolio — single source of truth**
> Last refreshed: 2026-05-26
> Read this file first. Other root docs are scoped references (assets, workflow, etc.); this one describes the live project state, every system, every rule, and what's next.

> **🔭 RECONCILIATION NOTICE (2026-05-31) — this is now a LEVEL-3 (build-state) reference, not the
> vision source of truth.** A layered documentation system was established (see
> `CLAUDE.md` → Source-of-Truth Hierarchy):
> - **Level 1 — VISION (canonical):** `design-bible/` (identity, narrative, zones, experiences,
>   languages). For *what the world is and means*, read `design-bible/README.md`.
> - **Level 2 — BUILD (canonical):** `BUILD_ROADMAP.md`, `TECH_ARCHITECTURE.md`,
>   `LIVING_SWARM_IMPLEMENTATION_PLAN.md`, `SWARM_BUILD_CHECKLIST.md`.
> - **Level 3 — STATE (this file):** the live **build-state, systems, assets, perf, file map** —
>   all still accurate and useful. **Where this file's *concept/zone/next-steps* content conflicts
>   with Level 1, Level 1 wins.** Superseded sections below are **marked in place, not deleted.**
>
> **Section status key:**
> - ✅ **ACTIVE** — current build-state/operational truth (keep using): §2, §3, §4, §5, §6 *(technical
>   systems only)*, §7, §8, §9, §10, §11, §12, §13, §15, §16, §17.
> - ⚠ **SUPERSEDED BY design-bible** — vision/concept content redirected by Level 1: §0 *(read
>   order)*, §1 *(zone concept table)*, §6 *(the "skills forest" naming/purpose)*, §14 *(next
>   steps)*, §18 *(update rule)*. Marked inline below.
> - 🗄 **HISTORICAL** — kept for lineage: §12 (problem-asset history).

---

## 0. Read order for new contributors

> ⚠ **SUPERSEDED read order.** New contributors should start at **`design-bible/README.md`**
> (Level 1 vision) → then Level-2 build docs (`BUILD_ROADMAP.md`, `TECH_ARCHITECTURE.md`,
> `SWARM_BUILD_CHECKLIST.md`) → then the Level-3 references below for build-state/assets. The
> original list (kept) covers only the Level-3 reference set.

1. **`PROJECT_FULL_CONTEXT.md`** ← you are here
2. `PROJECT_PROGRESS.md` — short milestone tracker
3. `CLAUDE.md` — Claude Code rules (operational, not state)
4. `ASSET_MAP.md` — GLB ↔ JPG preview inventory
5. `ASSET_AUDIT_REPORT.md` — most recent asset usage audit
6. `EXTERNAL_ASSET_DOWNLOAD_PLAN.md` — planned external assets, licences
7. `COWORK_INSTRUCTIONS.md` — multi-contributor asset integration workflow
8. `archive/` — historical direction & blueprint docs (do not consult for current state)

---

## 1. Portfolio concept

> ⚠ **SUPERSEDED BY design-bible (Level 1).** The high-level "playable 3D world" framing below is
> still true, but the **zone names, ownership, and meanings have been redefined** by the canon.
> Authoritative now: `design-bible/00-canon/NARRATIVE_SPINE.md` (zone ownership) and
> `design-bible/MASTER_WORLD_MAP.md` (structure). Key changes: the journey is
> **Space → Portal → Village → Hero House → Bridge → Forest → Mountains → Projects → Future**;
> the Forest is the **"Maker's Forest"** (capabilities, *not* "design + technical skills"); the
> **Village** = "where I come from / what shaped me"; the **Mountains** = professional experience
> (Hall of Gates); "Experience street" is **dropped** (career experience now lives in the
> Mountains). The table below is retained as historical build-state context only.

A cinematic, narrative 3D portfolio built in Three.js. Not a website — a playable world the visitor explores. Storytelling is **movement-based** (camera, lighting, signposts, environmental cues), with **minimal UI** and **trigger-based progression** as the player walks through each zone. The full journey from outermost to innermost:

| # | Zone | Status |
|---|---|---|
| 1 | Space intro (black hole / portal arrival) | not built |
| 2 | Portal / gate transition | not built |
| 3 | **Village hub** — main navigation world | **active build** |
| 4 | Hero house — personal story zone | placed; interior not built |
| 5 | Experience street — internships / past work | not built |
| 6 | Bridge / river crossing — symbolic transition | **built (bridge ✓, river ✓)** |
| 7 | **Skills forest** — design + technical skills | **active build — modular trees+bushes+laterite road+fence system** |
| 8 | Mountain career path — 5 mountain zones for career stages | not built |
| 9 | Project worlds — projects as mini worlds / portals | not built |
| 10 | Future area — open path, sunrise direction | not built |

**Visual style target:** realistic / semi-realistic, cinematic, golden-hour. Not cartoon, not toy-like.

---

## 2. Tech stack

- **Three.js** v0.183.2
- **Vite** dev/build
- **GLTFLoader** (+ Draco) for all GLB/GLTF assets
- **EXRLoader** for HDRI environment lighting
- Vanilla JS (no React)

Active project root:
```
/Users/raghavgupta/Portfolio/raghav-portfolio
```

---

## 3. Current village layout (live)

### Coordinate system

- Hero at `(0, 0, −48)`
- `+Z` = south (toward player spawn), `−Z` = north (into village, toward river)
- `+X` = east (player's right on approach), `−X` = west
- Player spawns at `(0, _, +10)` facing north
- Village extends roughly `x ∈ [−90, +90]`, `z ∈ [+30, −170]`
- Skills forest extends `x ∈ [−95, +95]`, `z ∈ [−180, −380]`

### Key landmarks

| Element | Position / span | File |
|---|---|---|
| Player spawn | `(0, _, +10)` | `player/playerController.js` |
| Welcome sign | `z = +14`, poles at `x = ±3.5` | `structures/entrance.js` |
| Approach road (cobblestone) | centred `x=0`, `z = +30 → −6`, ~14u wide | `roads/roads.js` |
| Loop road (cobblestone) | ring R = 28–42 around hero house | `roads/roads.js` |
| Hero house | `(0, 0, −48)`, scale 1.55 | `structures/heroHouse.js` |
| Hero house wooden fence ring | procedural brown picket, R=26 (style template reused by forest fence) | `structures/heroHouse.js` `buildWoodFence` |
| 8 side houses | ring R = 53–60, scale ~1.25 | `structures/streetHouses.js` |
| Left back lane | curves behind houses, `z = +5 → −90` | `roads/backLanes.js` |
| Right back lane | curves behind houses, `z = +5 → −50` | `roads/backLanes.js` |
| North road (approach to bridge) | `x = 0`, `z = −90 → −130` | `roads/roads.js` |
| Back street (dirt outer path) | outer ring | `roads/backStreet.js` |
| Market zone (LEFT) | `pp_village_market` at `(−48, 0, −18)` + 2 × `new_village_market` at `(±60, 0, +2)` | `props/marketZone.js` |
| Farm zone (RIGHT, pasture) | centre `(80, 0, −58)`, 22×14u | `props/farmZone.js` |
| Left-side farm buildings | `farmbuilding_04 (−75,−30)`, `farmbuilding_03 (−78,−52)`, `farmbuilding_05 (−72,−88)` | `props/farmZone.js` |
| Right-side farm buildings | `farmbuilding_02 (82,−86)`, `farmbuilding_08 (76,−72)`, silos/structures | `props/farmZone.js` |
| Back farmland soil patch | `(−32, _, −105)`, 30×22u | `props/farmZone.js` |
| River | code-only animated water across `z ≈ −140` | `nature/river.js` |
| Bridge (`bridge_01.glb`) | centre `(0, 0, −148)`, scale 4.5, deck Y ≈ 0.28 | `nature/bridge.js` |
| **Skills forest terrain disc** | radius 160 at `(0, 0.025, −240)`, covers `z ∈ [−80, −400]` | `terrain/skillsForestTerrain.js` |
| **Skills forest road (laterite)** | `z = −174 → −380`, 18u wide, S-curve + soft drift | `roads/skillsForestRoad.js` |
| **Skills forest gravel shoulders** | 2u strips at \|x\|=9-11 flanking laterite | `roads/skillsForestRoad.js` |
| **Skills forest fence** | procedural brown picket at \|x\|=12, follows road curve, starts z=−180 | `nature/skillsForestFence.js` |
| **Skills forest trees + bushes** | layered: near-bush, near-tree, mid-bush, far-tree from `low_poly_forest_tree_pack.glb` | `nature/skillsForestTrees.js` |
| 28 street trees | jacaranda + fir mix, ring around village | `nature/streetTrees.js` |
| Outer rocks | rough rocky outer landscape | `nature/outerRocks.js` |
| Village props | 12 streetlights, 14 benches, signs, barrels, buckets | `props/villageProps.js` |

### Terrain layers (with explicit render order — see `terrain/terrain.js`)

| Layer | renderOrder | Y | Notes |
|---|---|---|---|
| Base (sandy beige) | −10 | 0.000 | Full 900×900, also serves as `ctx.groundMesh` (gravity raycaster) |
| Gravel base | −9 | 0.010 | Full 900×900 dry default |
| Worn ground (grass-path-2) | −7 | 0.030 | Trampled dirt discs |
| Gravel shoulders | −6 | 0.033 | Road ↔ ground blend |
| Mud patches | −5 | 0.040 | Brown-mud accents |
| Skills forest terrain disc | 0 | 0.025 | radius 160 CircleGeometry, forest-ground texture, registered as walkable |
| Cobblestone roads | 0 | 0.05+ | Above all terrain layers |
| Back lanes | 1 | 0.15 | Above roads visually |
| Skills forest road + shoulders | 2 | 0.06 | Above all ground |

Note: there is no green lawn layer — it was removed because the worn / mud / gravel layers + village base read better.

---

## 4. Bridge setup

- Asset: `/assets/models/bridge/bridge_01.glb`
- Loaded directly (not via `placeAsset`) because we need to apply a vertical offset *after* `groundAlign` — `bridge.js` handles this with `BRIDGE_DECK_OFFSET = −1.55`
- Position: `(0, 0, −148)`, scale `4.5`, rotation `Math.PI / 2`
- Spans ≈ 36u across river; deck ≈ y 0.28; railings top ≈ y 0.88
- South approach cobblestone strip: `z = −122 → −130`
- North approach cobblestone strip: `z = −166 → −174`
- Bridge group is registered in `ctx.groundObjects` → deck is walkable via gravity raycaster
- Bridge railings are AABB colliders (see § 11)

**Cleared zone enforced by all forest systems:** nothing places at `z > −180`. This keeps the bridge deck, north approach, and bridge exit completely empty of trees/bushes/rocks/fences.

---

## 5. River setup

- Code-only animated water (`nature/river.js`) — no GLB asset
- Crosses the village west-east at roughly `z = −140` so the bridge spans it
- Water surface sits below bridge deck height

---

## 6. Skills forest system (active build)

> ✅ **Technical systems ACTIVE / ⚠ naming & purpose SUPERSEDED.** The four modular subsystems
> below (terrain disc, laterite road + shoulders, procedural fence, extracted-leaf trees/bushes)
> are **real, valid build-state** and remain the foundation the Forest is built on. **But the
> zone's *meaning* is now the "Maker's Forest"** (`design-bible/02-zones/MASTER_FOREST.md`) — a
> self-portrait of five performed-capability experiences, **not** a "design + technical skills"
> display. The current active build on top of these systems is the **Living Swarm**
> (`design-bible/03-experiences/forest/EXP_LIVING_SWARM.md` + `SWARM_BUILD_CHECKLIST.md`). Read
> the subsystem details below as *infrastructure*; read Level 1 for *what goes on it*.

After multiple iterations, the skills-forest zone north of the bridge is now built from **four cooperating modular subsystems** — no more single-mesh GLB. Each layer follows the project rule "visual mesh ≠ collision mesh" and uses simple invisible colliders or none at all.

### 6.1 Skills forest terrain (`terrain/skillsForestTerrain.js`)

- Single `CircleGeometry`, radius 160, 64 radial segments, centred `(0, 0.025, −240)`
- Spans `z ∈ [−80, −400]`, `x ∈ [−160, +160]`
- Texture: `forest-ground` (warm forest floor PBR, repeat 30)
- Registered in `ctx.groundObjects` → walkable via gravity raycaster
- Replaced earlier rectangular twin strips that read as blocky

### 6.2 Skills forest road & shoulders (`roads/skillsForestRoad.js`)

- Laterite (warm red-brown earth) main path, 18u wide, `z = −174 → −380` (206u long)
- **Gentle S-curve** then softer drift: peaks at `x = −10` (z≈−218) and `x = +10` (z≈−268), then a small right drift around z≈−330
- **Gravel_sand shoulders** — 2u-wide strips on each side, adjacent to the laterite at \|x\|=9–11, using the `gravel_sand` PBR texture
- All three ribbons share the SAME `CatmullRomCurve3` waypoints → edges align exactly; no Z-fighting
- `LANE_PTS` exported so fence + tree placement use the identical curve
- Built via generic `buildRibbon(opts)` helper (centerOffset, width, y, renderOrder)
- Y = 0.06 (above forest terrain at 0.025)

### 6.3 Skills forest fence (`nature/skillsForestFence.js`)

- **Procedural** brown picket fence — same wood colour (`0x6b3f1c`), same dimensions, same construction as `heroHouse.js` `buildWoodFence` (post + top rail + bottom rail + 5 pickets per panel)
- Per-side ribbon following the road `CatmullRomCurve3`, offset perpendicular by `FENCE_OFFSET = 12`
- 60 sample-pairs along the curve, panels filled in between
- Cutoff at `z = −180` — fence starts cleanly past the bridge
- Performance: **3 `THREE.InstancedMesh`** (posts / rails / pickets) → 3 draw calls regardless of fence length
- No collision (fence is visual framing; trees behind it provide soft resistance)

### 6.4 Skills forest trees + bushes (`nature/skillsForestTrees.js`)

- Source asset: `/assets/new assets/low_poly_forest_tree_pack.glb` (14 MB) — a single pack containing many tree + bush meshes
- Loaded **once** via `loadGLBModel(addToScene:false)`
- Pipeline:
  1. Traverse the loaded scene graph; every leaf mesh is collected
  2. Each leaf's `matrixWorld` is baked into a cloned geometry, then re-centred (XZ centre = origin, base = y=0)
  3. Classification by height: `height > 4u` → tree pool; else bush pool (`TREE_HEIGHT_THRESHOLD = 4.0`)
  4. Placement generation via rejection sampling against the road curve (`distToRoadCurve()` against 200 curve samples)
  5. Group placements by chosen pool mesh → one `THREE.InstancedMesh` per unique mesh → ~5–10 draw calls for the entire forest
- **Layered placement** (per side of road):

| Layer | \|x\| band | Per-side | Scale | Role |
|---|---|---|---|---|
| Near bush (fence understory) | 14–30 | 200 | 0.9–1.5 | Heavy ground cover just outside fence |
| Near tree (close wall) | 28–55 | 120 | 0.7–1.1 | Tree wall close to road |
| Mid bush (filler) | 28–70 | 150 | 0.7–1.3 | Bridges near + far layers |
| Far tree (tall canopy) | 55–95 | 150 | 0.9–1.5 | Tall trees fill the horizon |

Totals: **540 trees + 700 bushes = 1,240 placements** (both sides combined)

- `castShadow = false` on every `InstancedMesh` (`receiveShadow = true`)
- Trees only export to collision (`TREE_POSITIONS`); bushes are walk-through

### 6.5 Curve-aware exclusion zones

| Constant | Value | Meaning |
|---|---|---|
| `Z_START` | −180 | South cutoff — no vegetation past this point. Guards bridge + approach |
| `TREE_EXCLUSION` | 18 | Min metres from nearest road-curve sample to any tree placement |
| `BUSH_EXCLUSION` | 13 | Min metres from nearest road-curve sample to any bush placement |
| `FENCE_OFFSET` | 12 | Fence sits perpendicular distance 12 from road centreline |
| Road half-width | 9 | Laterite extends `\|x\|=9` from centreline |
| Shoulder span | 9–11 | Gravel_sand 2u strips immediately outside laterite |

Because exclusion is computed against the **actual road curve** (not against `x=0`), S-curve peaks at ±10u stay protected. With the move to single-mesh placement (each leaf cloned individually), there are no unbounded pack-internal offsets that could swing onto the path.

### 6.6 Clearance guarantees (mathematically enforced)

```
       road centre
            │
   laterite │ laterite       (0–9u)
            ●─── edge
   gravel   │ gravel         (9–11u)
            ●─── shoulder edge
   grass    │ grass          (11–12u)
            ║─── PICKET FENCE (12u)
   grass    │ grass          (12–14u)
            ░ ─── BUSH band starts (14–90u, curve-dist ≥ 13)
        ▒▒▒▒│▒▒▒▒ ── TREE band starts (28–95u, curve-dist ≥ 18)
```

The bridge deck, laterite road, gravel shoulders, and fenced corridor are **provably empty** of vegetation.

---

## 7. Market setup

`props/marketZone.js`:

- `pp_village_market` at `(−48, 0, −18)` — original LEFT-side centrepiece
- 2 × `new_village_market.glb` at `(−60, 0, +2)` (`rot = 0.5 rad`) and `(+60, 0, +2)` (`rot = −0.5 rad`) — large market zones flanking the spawn approach (scale 7.0; flagged as a perf hotspot — see § 15)
- `pp_town_sign` at `(−42, 0, −8)`
- `pp_post_lantern` at `(−54, 0, −12)`
- `bench_b` at `(−38, 0, −12)`

---

## 8. Farm zone plan

`props/farmZone.js`:

- **Pasture (right side):** centre `(80, −58)`, 22×14u soil plane, fence perimeter (10 posts), 2 cows inside
- **Service yard:** 2 × `barrel_a`, 1 × `milktank_a` between barn row and pasture
- **Back-row buildings:** `farmbuilding_02` (barn, `(82, −86)`), `farmstructure_23` (silo, `(68, −80)`)
- **Front-row small structures (along right back lane):** `farmstructure_22 (78,−30)`, `farmstructure_26 (82,−42)`
- **Left-side farm buildings (along left back lane):** `farmbuilding_04 (−75,−30)`, `farmbuilding_03 (−78,−52)`
- **Back-corner barns:** `farmbuilding_05 (−72,−88)` left-back, `farmbuilding_08 (76,−72)` right-back
- **Back farmland soil:** `(−32, −105)`, 30×22u brown earth plane, behind hero house
- **Viewing bench:** `bench_a` at `(80, −49.5)` south of pasture fence

---

## 9. Back lanes / road structure

Three road systems all on cobblestone-02 texture (same warm tan tint `0xdcc7a0`):

- **Main loop + approach + north road** (`roads/roads.js`) — primary cobblestone, ribbon-mesh CatmullRom
- **Back lanes** (`roads/backLanes.js`) — narrower (12u vs 14u) cobblestone lanes behind side house rows
  - Left lane: `(−13,+5) → (−22,−10) → (−50,−16) → (−66,−22) → (−78,−45) → (−78,−72) → (−63,−90)`
  - Right lane: `(13,+5) → (22,−10) → (50,−16) → (66,−22) → (78,−36) → (72,−50)`
  - Both lanes branch off the approach road near the entrance for visual continuity
- **Back street** (`roads/backStreet.js`) — outer dirt path connecting planned outer zones
- **Skills forest road** (`roads/skillsForestRoad.js`) — separate laterite + gravel-shoulder system (see § 6)

All road ribbons use `CatmullRomCurve3` + custom buffer geometry with tangential UVs. `renderOrder` is explicit to avoid Z-fighting with terrain.

---

## 10. Collision / "reality" requirement

Architecture: `player/collision.js` exports `resolveCollisions(pos)` which mutates a `THREE.Vector3` each frame. Two systems:

| System | Use | Detail |
|---|---|---|
| `CIRCLES` | Buildings, posts, trees, benches, fences, barrels, lamps, signs | Radial push-out — natural sliding around curves; cheap |
| `AABBS` | Bridge railings | Axis-aligned box; shallowest-penetration axis push |

`PLAYER_R = 0.5`. Resolver only mutates `pos.x` and `pos.z` — **never** `pos.y`. So horizontal-only blocking; no upward launch from collisions.

### Solid colliders right now

- Village hard objects: houses (9), markets (3), farm buildings & structures (8), entrance sign poles (2), streetlights (12), directional signs (2), town sign + lantern (2), benches (14), barrels + buckets + milk tank (11), pasture fence posts (10), 28 street tree trunks, bridge railings (2 AABBs)
- **Skills forest trees:** 540 cheap circle colliders imported from `skillsForestTrees.js` `TREE_POSITIONS` export, radius 2.0 (bushes are walk-through, fence has no collision)

### Gravity / walkable surfaces

`applyGravity()` in `player/playerController.js` raycasts down from `player.y + 5` against `ctx.groundObjects` (recursive). Registered as walkable:
- Base terrain mesh (`ctx.groundMesh`)
- Bridge group (`ctx.groundObjects.push(bridgeGroup)` inside `bridge.js`)
- Skills forest terrain disc (registered inside `skillsForestTerrain.js`)

**Important rule:** never push a complex visual GLB onto `ctx.groundObjects` directly — the ray will hit canopies/roofs and snap the player up. Always use a dedicated flat invisible plane or simple disc for "this area is walkable".

### Movement smoothness

- Player horizontal movement uses **delta-time scaling** (`pos += speed * dt`) — speed stays constant regardless of FPS
- Camera follow uses **frame-rate-independent exponential lerp**: `factor = 1 - exp(-8 * dt)` (cameraController.js). Without this fix the camera jerked when FPS dipped because a constant `0.12` per-frame lerp was tied to frame count, not elapsed time.

### Debug

Press `Alt + C` in the running game (or `window.__showCollision(true)` in DevTools) to see all colliders as red cylinders + blue boxes.

---

## 11. Asset folders used

```
public/assets/
├── architecture/          ← buildings (kaykit, kenney village kits, farm kits…)
├── characters/            ← Knight.glb (kaykit-adventurers)
├── forest/                ← village tree GLBs (jacaranda, fir, optimized Draco copies)
├── hdri/                  ← village_sky2.exr (IBL only — not background)
├── models/                ← bridge_01.glb and other singletons
├── new assets/            ← large external GLBs:
│                              • Village Market.glb
│                              • low_poly_forest_tree_pack.glb (active — skills forest)
│                              • final_forest.glb (disabled, kept for reference)
├── props/                 ← village props, signs, lamps, benches, storage
├── textures/              ← terrain + road texture sets:
│                              • cobblestone, gravel_sand (forest shoulders),
│                                laterite (forest road), grass-path-2, brown-mud,
│                                forest-ground (forest terrain disc), …
└── village/               ← ATTRIBUTION.md for ambientCG textures
```

Asset registry (key → path) lives in `src/world/village/utils/assetLoader.js`. Always register new assets there so caching/cloning works. (Forest tree pack is loaded directly by `skillsForestTrees.js` since it needs custom extraction.)

### Active forest-zone assets at a glance

| Use | Path |
|---|---|
| Forest tree+bush pack | `/assets/new assets/low_poly_forest_tree_pack.glb` |
| Laterite road texture | `/assets/textures/terrain/laterite/terrain_{diffuse,normal,roughness}.jpg` |
| Gravel shoulder texture | `/assets/textures/terrain/gravel_sand/terrain_{diffuse,normal,roughness}.jpg` |
| Forest terrain disc texture | `/assets/textures/terrain/forest-ground/forrest_ground_01_*_2k.jpg` |
| Hero-house fence (style template) | Procedural — see `structures/heroHouse.js` `buildWoodFence` |
| Bridge | `/assets/models/bridge/bridge_01.glb` |
| Village market (large) | `/assets/new assets/Village Market.glb` |

---

## 12. Assets that caused problems (and how they were resolved)

| Asset | Problem | Resolution |
|---|---|---|
| `Mountain_terrain.glb` | Was placed under the village; yellow flat base showed through ground; multiple Y/Z/scale tweaks couldn't hide it | **Removed entirely.** No code references remain. |
| `final_forest.glb` (85 MB) | Walkability bug (player launched up onto canopies when GLB was in `groundObjects`); placement Y was finicky; no path could be drawn through it; very heavy download cost | **Resolved.** `finalForest.js` now early-returns after building only the 600×600 backing land plane; the GLB itself is not loaded. Replaced by the modular skills-forest system (§ 6). File kept on disk for reference. |
| Pine tree pack (`fir_1k_draco.glb` previously used for skills forest) | Even Draco-compressed at 12 MB, instancing 100 trees + parsing was a perf hit | **Disabled** in skills forest (kept in `streetTrees.js` for the village ring). Skills forest now uses the cheaper `low_poly_forest_tree_pack.glb` with extracted leaf meshes. |
| `low_poly_forest_tree_pack.glb` (whole-pack clone) | Cloning the entire pack with random rotation pushed internal pack-local trees onto the road | **Resolved.** Pipeline rewritten to traverse pack, bake each leaf's transform into its own re-centred geometry, classify by height, and place individual meshes — no more unbounded internal offsets. |
| Large green lawn discs in terrain | Made ground look like a painted flat surface | Removed; base + worn + mud + gravel reads better |

---

## 13. Current technical issues

| Severity | Issue | Owner / next action |
|---|---|---|
| 🟡 med | Player character is the default kaykit Knight — stylised, doesn't match the realistic direction | Move to a Ready Player Me avatar with Mixamo animations retargeted in Blender |
| 🟡 med | River is functional but plain — no flow direction along bridge axis | Upgrade to `THREE.Water2` with a hand-painted flow map |
| 🟡 med | 2 × `new_village_market.glb` at scale 7.0 sit right at the spawn approach — large pixel fill near spawn | Consider reducing scale to 3–4 OR keeping one instance only |
| 🟢 low | `assetLoader.js` sets `castShadow=true` on every cloned mesh even though sun shadows are disabled scene-wide | Flip to `false` to shave per-frame iteration cost |
| 🟢 low | No skybox / distant mountain ring around the village | Poly Haven cliff-side texture draped on a curved background plane is the next experiment |
| 🟢 low | Skills forest density polish — fine-tune the bush/tree count for the "Amazon-deep" reading without over-instancing | Tune `NEAR_BUSH_COUNT` / `FAR_TREE_COUNT` per visual review |

The 85 MB forest blocker is **resolved**. Forest replacement is no longer on the open-issues list.

---

## 14. Next steps (in priority order)

> ⚠ **SUPERSEDED BY `BUILD_ROADMAP.md` (Level 2).** The current build priority is the **proof
> spine: Living Swarm → Jarvis → Projects** (`BUILD_ROADMAP.md` §1–§4; `SWARM_BUILD_CHECKLIST.md`
> is the active task board). Several items below also reflect the old vision — e.g. "glowing skill
> markers" (the Forest is no longer a skills display), "Experience street" (dropped; career lives
> in the Mountains). The list is retained as historical context; **do not action it directly** —
> follow Level 2.

1. **Skills forest polish** — visual density tuning, asset variety pass, signage / glowing skill markers placed along the laterite road.
2. **Player upgrade** — Ready Player Me avatar + Mixamo animation retarget.
3. **Mountain career path** — 5 mountain zones, each with a gate; one strong Sketchfab CC0 mountain cloned 5× with scale/rotation variance.
4. **River upgrade** — `THREE.Water2` with flow map painted along the river curve.
5. **Village background ring** — cliff-side texture on a curved background plane for valley feel.
6. **Hero house interior** — first-person interior pass with personal storytelling props.
7. **Experience street** — internships/work-history zone branching off the village hub.
8. **Project worlds** — design each major project as a portal or mini world.
9. **Future / sunrise area** — open path north of forest with a signpost.

---

## 15. Performance optimization decisions

The project has been performance-tuned through several rounds; the following decisions are intentional and should be preserved unless explicitly revisited.

### Rendering

- **Sun shadow pass is disabled.** `environment.js` sets `sun.castShadow = false`. With dozens of houses + props + 1,200+ forest instances, the shadow pass was rendering the scene a second time every frame. The scene is still lit by HDRI IBL, hemisphere light, and ambient — visually acceptable.
- **Most forest instances have `castShadow = false`** even though sun shadows are off — this skips the internal shadow-receiver iteration. `receiveShadow = true` is kept so future re-enabling looks correct.
- **HDRI is loaded for IBL only** (`scene.environment`), never as a panoramic background. Background is a solid sky colour.

### Asset loading

- **Each GLB is fetched once.** `assetLoader.js` exposes a `modelCache` keyed by path; subsequent `placeAsset` calls clone the cached template. Forest tree pack is loaded once and never re-fetched.
- **Pine pack (`fir_1k_draco.glb`) was disabled in the skills forest** because even at 12 MB Draco-compressed it was slow to parse, and the pine pack supplies one species only. Pines are still used by `streetTrees.js` (28 instances) where the dataset is small.
- **No GLB is registered as a walkable surface.** Walkable surfaces are flat planes or simple discs — never the full mesh tree GLB. This prevents the historical "player launched onto canopy" bug.

### Instancing

- **`THREE.InstancedMesh` is used for every high-count system:**
  - Skills forest fence — 3 InstancedMesh (posts / rails / pickets) → 3 draw calls regardless of fence length
  - Skills forest trees + bushes — one InstancedMesh per unique pool mesh → ~5–10 draw calls for the entire 1,240-placement forest
- Per-instance matrix is set once at load; no per-frame matrix updates.

### Collision

- **Only simple circle / AABB colliders** — never per-triangle collision against complex GLBs.
- Tree colliders are auto-generated from `TREE_POSITIONS` exported by `skillsForestTrees.js` — no manual duplication of coordinates.
- Bushes have no collision (walk-through). Fences have no collision (visual framing). This keeps the per-frame collision loop at ≈540 circles + 80 village circles + 2 AABBs.
- The collision loop is `O(N)` per frame but each check is a single distance compare — ~280 µs total at the current count.

### Movement / camera

- **Player movement is delta-time scaled** (`pos += speed * dt`).
- **Camera lerp is frame-rate independent**: `factor = 1 - exp(-8 * dt)`. Replaces an old constant `0.12` per-frame lerp that caused jerky follow when FPS dipped.

### General

- Avoid full terrain GLBs. Floor / ceiling problems are avoided by building terrain from simple planes and discs.
- Keep instance count modest, clone from `modelCache`, reuse materials. New systems should follow this pattern.

---

## 16. Project rules (must follow)

1. **Do NOT scan all assets unless needed.** Only inspect the asset folder relevant to the active task.
2. **Do NOT update MD files without asking.** This includes refactors of existing MDs and creation of new ones. Ask first.
3. **Use realistic / semi-realistic assets.** No cartoon, no toy-style. PUBG/GTA-ish realism is the target; warm and cinematic is preferred over gritty.
4. **Prefer GLB / GLTF.** Convert from FBX/OBJ only if the asset is essential.
5. **Avoid full terrain sheets.** Single GLBs that contain "ground + trees + road + props" become floor/ceiling problems. Prefer modular trees + your own ground plane + your own ribbon road.
6. **Visual mesh and collision mesh must stay separate.** Never use a complex visual GLB as a collision / walkable target. Always create a simple invisible plane / circle / box for collision.
7. **For the forest, prefer modular trees / clusters + a custom road / path.** This is the active pattern used by `streetTrees.js` and the skills forest system (§ 6).
8. **For collision, use simple invisible colliders.** Circles for points/posts/trees, AABBs for linear walls. Never per-triangle collision on heavy GLBs.
9. **Performance:** keep instance count modest, clone from `modelCache`, reuse materials, avoid casting shadows from background meshes, default to `InstancedMesh` for high-count systems.
10. **Do not break existing systems** when adding new features: player movement, camera, car drive (legacy), entrance, hero house, terrain raycaster, bridge deck walkability, collision resolver, skills forest road/fence/exclusion zones.
11. **Quality over quantity.** Better composition and lighting beats more assets.
12. **One change per task.** Small focused edits over huge rewrites; explain what changed and why.
13. **Do not delete assets permanently without asking.** Disable / move first; deletion is reversible only through `git`.
14. **Keep the skills forest road exclusion zones intact** — bridge, laterite road, gravel shoulders, and fenced corridor must remain provably empty. Use `TREE_EXCLUSION` / `BUSH_EXCLUSION` / `Z_START` to enforce this for any new vegetation system.

---

## 17. Key file map

```
src/
└── world/
    └── village/
        ├── villageBuilder.js              ← top-level village assembly
        ├── environment/environment.js     ← HDRI IBL, sun (no shadow), hemi, ambient, fog
        ├── terrain/
        │   ├── terrain.js                 ← multi-layer village ground
        │   └── skillsForestTerrain.js     ← single forest disc, registered walkable
        │
        ├── roads/
        │   ├── roads.js                   ← approach + loop + north road (cobblestone)
        │   ├── backStreet.js              ← outer dirt path
        │   ├── backLanes.js               ← left/right back cobblestone lanes
        │   └── skillsForestRoad.js        ← laterite road + 2× gravel_sand shoulders (exports LANE_PTS)
        │
        ├── structures/
        │   ├── entrance.js                ← welcome sign + poles
        │   ├── heroHouse.js               ← centre house + procedural picket fence (style template)
        │   └── streetHouses.js            ← 8 side houses in a ring
        │
        ├── props/
        │   ├── villageProps.js            ← lamps, benches, signs, barrels
        │   ├── marketZone.js              ← left market + 2 large markets
        │   └── farmZone.js                ← pasture, fences, farm buildings, soil
        │
        ├── nature/
        │   ├── streetTrees.js             ← 28 village ring trees (fir + jacaranda)
        │   ├── outerRocks.js              ← outer rocky landscape
        │   ├── river.js                   ← animated water
        │   ├── bridge.js                  ← bridge_01.glb + approach strips
        │   ├── finalForest.js             ← (disabled GLB) backing land plane only
        │   ├── skillsForestTrees.js       ← extracted leaf meshes from low_poly_forest_tree_pack
        │   └── skillsForestFence.js       ← procedural brown picket along road curve
        │
        ├── player/
        │   ├── playerController.js        ← input, animation, gravity, delta-time movement
        │   ├── cameraController.js        ← 3rd-person orbit, frame-rate-independent lerp
        │   └── collision.js               ← CIRCLES + AABBS + resolveCollisions()
        │
        └── utils/
            └── assetLoader.js             ← asset registry + modelCache + placeAsset/loadModel
```

---

## 18. How to update this file

> ⚠ **SUPERSEDED update rule.** This file is no longer the single canonical doc. Route updates by
> level: ***vision*** changes → `design-bible/` (Level 1); ***build plan*** changes → Level-2 docs;
> ***build-state*** changes (system added/removed, asset replaced, layout shifted) → **this file**
> (Level 3). The guidance below applies only to Level-3 build-state updates.

When something material changes (system added/removed, asset replaced, layout shifted), update **this** file in place — don't create a new doc. Keep it as the canonical state. Bump the "Last refreshed" date at the top.

Move historical material to `archive/` instead of deleting it.
