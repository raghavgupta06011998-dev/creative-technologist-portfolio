# ASSET_AUDIT_REPORT.md

**Generated:** 2026-05-24  
**Scope:** `public/assets/` + `src/world/village/utils/assetLoader.js` + `src/world/village/`  
**Method:** Read-only. No files deleted, moved, or changed.

---

## Total Asset Storage

| Top-level folder | Size | Status |
|------------------|------|--------|
| `public/assets/forest/` | **3.2 GB** | Partially used (only `optimized/` served) |
| `public/assets/textures/` | **1.1 GB** | Mostly unused (3 of ~45 folders active) |
| `public/assets/models/` | **734 MB** | Partially used |
| `public/assets/hdri/` | **175 MB** | 1 of 14 files active |
| `public/assets/characters/` | **138 MB** | 1 file active |
| `public/assets/village/` | **42 MB** | Not referenced in any code |
| **TOTAL** | **≈ 5.4 GB** | |

> **The project is serving ~5.4 GB of assets from `public/`, but the active village scene uses roughly 50–80 MB of it.**

---

## 1. Used Asset Folders

These folders contain files that are directly referenced and loaded at runtime.

| Folder | Keys Used | Files Used |
|--------|-----------|------------|
| `models/houses/` | house_01, 03, 06, 07, 10, 11, 12, 15, 16 | 9 of 16 GLBs |
| `models/Fence/` | fence, gate, gatepost, post | All 4 GLBs (heroHouse fence built procedurally using these) |
| `models/rocks/` | rocks_01–06 | All 6 GLBs |
| `models/streetlight and sign/` | streetlight_01, 04; streetsign_04 | 3 of 10 GLBs |
| `models/bench/` | bench_a, b, c, d | All 4 GLBs |
| `models/barrel/` | barrel_a, barrel_b | Both GLBs |
| `models/bucket/` | bucket_a | 1 GLB |
| `models/green/` | green_03, 05, 06, 07, 09, 11 | 6 of 16 GLBs |
| `models/farmbuilding/` | farmbuilding_02 | 1 of 8 GLBs |
| `models/farmstractures/` | farmstructure_23 | 1 of 28 GLBs |
| `models/animals/` | horse | 1 GLB |
| `models/polypizza/` | pp_castle_gate, pp_market_stand, pp_wagon | 3 of 23 GLBs |
| `models/kenney-fantasy-town/` | kft_fountain_round, kft_fountain_detail, kft_lantern | 3 of 17 GLBs |
| `models/kenney-nature/` | kn_flower_red/yellow/purple, kn_plant_bush, kn_plant_bush_small | 5 of 29 GLBs |
| `models/props/` | props_70 | 1 of 8 GLBs |
| `models/milktank/` | milktank_a | 1 GLB |
| `models/lawnmover/` | — | 0 (catalogued but not called yet) |
| `forest/forest/optimized/` | forest_fir, forest_jacaranda | 2 Draco GLBs |
| `characters/kaykit-adventurers/` | Knight.glb | 1 GLB (player character) |
| `models/car/` | car_01.glb | 1 GLB (loaded by Car.js entity) |
| **Textures** | | |
| `textures/terrain/grass-path-2/` | GP2 terrain layer | Active |
| `textures/terrain/gravel_sand/` | GRV terrain layer | Active |
| `textures/terrain/brown-mud/` | MUD terrain layer | Active |
| `textures/roads/cobblestone-02/` | Main road texture | Active |
| `hdri/village_sky2.exr` | Active sky (HDRI_PATH) | 1 of 14 EXR files |

---

## 2. Confirmed Active Asset Keys (called in scene code)

These are the exact keys that reach `placeAsset()` or direct model loaders at runtime.

```
— Houses —
house_01  house_03  house_06  house_07
house_10  house_11  house_12  house_15  house_16

— Rocks / Boulders —
rocks_01  rocks_02  rocks_03  rocks_04  rocks_05  rocks_06
boulder_mossy_lg  boulder_outcrop  boulder_plain_lg

— Nature / Plants —
forest_fir  forest_jacaranda
kn_flower_red  kn_flower_yellow  kn_flower_purple
kn_plant_bush  kn_plant_bush_small
apple  cherry   ← heroHouse yard trees (broken paths — source/ missing)

— Village Props —
bench_a  bench_b  bench_c  bench_d
barrel_a  barrel_b  bucket_a
streetlight_01  streetlight_04  streetsign_04
props_70
kft_fountain_round  kft_fountain_detail  kft_lantern
pp_castle_gate  pp_market_stand  pp_wagon

— Structures —
farmbuilding_02  farmstructure_23
horse  milktank_a

— Green (market produce) —
green_03  green_05  green_06  green_07  green_09  green_11

— Characters / Vehicles —
characters/kaykit-adventurers/Knight.glb   (playerController.js)
models/car/car_01.glb                      (Car.js entity)
```

**⚠️ Broken-path keys (catalogued but paths point to non-existent `/source/` folder):**
```
apple  cherry   ← used in heroHouse.js yard — will silently fail at runtime
boulder_mossy_lg  boulder_outcrop  boulder_plain_lg  ← used in outerRocks.js — will silently fail
```

---

## 3. Possibly Unused Asset Folders

These folders exist in `public/assets/` but are not referenced anywhere in the codebase.

| Folder | Size | Notes |
|--------|------|-------|
| `models/Cliffs/` | 75 MB | Contains Rock030, Rock051, Rock063 subfolders (texture sets). No GLBs found. Cliff backdrop feature was rejected. |
| `models/medieval-village/` | 58 MB | Complete medieval pack. Not catalogued. |
| `models/fantasy-props/` | 57 MB | Fantasy props pack. Not catalogued. |
| `models/stylized-nature-pack/` | 99 MB | Large nature pack. Not catalogued. |
| `models/stylized-nature/` | 48 MB | Second nature pack. Not catalogued. |
| `models/character/` | 48 MB | Character models. Not catalogued. Only `kaykit-adventurers/Knight.glb` is used (different folder). |
| `models/animals-pack/` | 36 MB | Animal pack. Not catalogued. `models/animals/horse.glb` is used (different folder). |
| `models/space/` | 19 MB | Kenney space pack (planets, spaceships, astronauts, mechs). Not catalogued. |
| `models/pirate/` | 21 MB | Pirate pack. Not catalogued. |
| `models/medieval-village-e/` | 7.4 MB | Alternate medieval variant. Not catalogued. |
| `models/kenney-space/` | 7.8 MB | Second space pack. Not catalogued. |
| `models/stylized-trees/` | 5.2 MB | Stylized trees (different from kenney-nature). Not catalogued. |
| `models/crops/` | 2.9 MB | Crop models. Not catalogued. |
| `models/food/` | 2.5 MB | Food props. Not catalogued. |
| `models/foodish/` | 1.3 MB | More food props. Not catalogued. |
| `models/kaykit-dungeon/` | 6.3 MB | Dungeon kit. Not catalogued. |
| `models/kaykit-dungeon-classic/` | 11 MB | Dungeon classic kit. Not catalogued. |
| `models/kaykit-furniture/` | 1.0 MB | Furniture kit. Not catalogued. |
| `models/kenney-food/` | 3.6 MB | Kenney food pack. Not catalogued. |
| `models/kenney-graveyard/` | 3.4 MB | Kenney graveyard pack. Not catalogued. |
| `models/kenney-minigolf/` | 2.1 MB | Kenney minigolf pack. Not catalogued. |
| `models/kenney-pirate/` | 3.0 MB | Kenney pirate pack. Not catalogued. |
| `models/kenney-platformer/` | 3.4 MB | Kenney platformer pack. Not catalogued. |
| `models/environment/` | 12 MB | Contains `forest_land.glb`. Not referenced in code. |
| `models/watersprinkler/` | 1.7 MB | Not catalogued. |
| `models/waterdish/` | 948 KB | Not catalogued. |
| `models/little foodholder/` | 1.9 MB | Not catalogued. |
| `models/farm-buildings-e/` | 692 KB | Alternate farm variant. Not catalogued. |
| `models/Dont Use/` | 1.3 MB | Explicitly marked do-not-use. Contains broken crate/chair models. |
| `models/house-interiors/` | 3.0 MB | Interior props. Not catalogued. |
| `village/textures/` | 42 MB | Contains Bricks, PavingStones texture sets in non-standard format (.blend, .mtlx, .tres, .usdc). Not referenced anywhere in code. |
| `textures/forest/` | 26 MB | Forest floor textures. Not referenced in code (forest zone not yet built). |
| `textures/architecture/` | 323 MB | 26 subfolders of architecture textures (brick, plaster, roof, etc.). **None referenced in any code.** |
| `characters/universal-base/` | 36 MB | Not used. |
| `characters/modular-men/` | 35 MB | Not used. |
| `characters/modular-women/` | 30 MB | Not used. |
| `characters/rpg-characters/` | 17 MB | Not used. |
| `characters/kaykit-animations/` | 12 MB | Not used. |
| `characters/kenney-mini/` | 3.3 MB | Not used. |
| `characters/background-humans/` | 1.1 MB | Not used. |

---

## 4. Very Large Asset Folders / Files

Ranked by size, flagged if low/no current usage:

| Asset | Size | In Use? | Risk |
|-------|------|---------|------|
| `forest/forest/pine_tree_01_2k.gltf/` | **937 MB** | ❌ No | Permanently excluded |
| `forest/forest/pine_tree_01_1k.gltf/` | **929 MB** | ❌ No | Permanently excluded |
| `forest/forest/fir_tree_01_2k.gltf/` | **487 MB** | ❌ No | Superseded by optimized build |
| `forest/forest/fir_tree_01_1k.gltf/` | **465 MB** | ❌ No | Source for optimized build; not served |
| `forest/forest/jacaranda_tree_2k.gltf/` | **219 MB** | ❌ No | Superseded by optimized build |
| `forest/forest/jacaranda_tree_1k.gltf/` | **205 MB** | ❌ No | Source for optimized build; not served |
| `textures/architecture/` | **323 MB** | ❌ None | 26 subfolders, 0 referenced in code |
| `textures/terrain/` | **443 MB** | ⚠️ 3 of 25 folders | 22 terrain sets unused |
| `textures/roads/` | **304 MB** | ⚠️ 1 of 17 folders | 16 road sets unused |
| `models/stylized-nature-pack/` | **99 MB** | ❌ No | Entire pack uncatalogued |
| `models/Cliffs/` | **75 MB** | ❌ No | Cliff feature rejected |
| `models/medieval-village/` | **58 MB** | ❌ No | Uncatalogued |
| `models/fantasy-props/` | **57 MB** | ❌ No | Uncatalogued |
| `models/stylized-nature/` | **48 MB** | ❌ No | Uncatalogued |
| `models/character/` | **48 MB** | ❌ No | Wrong folder (Knight is in kaykit-adventurers) |
| `characters/universal-base/` | **36 MB** | ❌ No | — |
| `models/animals-pack/` | **36 MB** | ❌ No | Wrong folder (horse is in animals/) |
| `characters/modular-men/` | **35 MB** | ❌ No | — |
| `hdri/` | **175 MB** | ⚠️ 1 of 14 | 13 EXR files unused |
| `village/textures/` | **42 MB** | ❌ No | Non-standard texture format |

---

## 5. Assets That Should Be Kept

These are confirmed active, are planned for future use, or are the known good source files.

| Asset | Reason to Keep |
|-------|---------------|
| `models/houses/house_01–16.glb` | Active in scene (9 used); remaining may be used in future zones |
| `models/Fence/` (fence, gate, gatepost, post) | Active — heroHouse fence |
| `models/rocks/rocks_01–06.glb` | Active — outerRocks, decorItems |
| `models/streetlight and sign/` | Active — villageProps |
| `models/bench/bench_a–d.glb` | Active — villageProps, decorItems |
| `models/barrel/`, `models/bucket/` | Active — market, farm, props |
| `models/green/green_01–16.glb` | Active (6 used); remaining usable for future market / garden zones |
| `models/farmbuilding/farmbuilding_02.glb` | Active — farmZone |
| `models/farmstractures/farmstructure_23.glb` | Active — farmZone |
| `models/animals/horse.glb` | Active — farmZone |
| `models/milktank/milktank_a001.glb` | Active — farmZone |
| `models/polypizza/` (pp_castle_gate, pp_market_stand, pp_wagon + others) | Active subset; rest reserved for market/experience zone |
| `models/kenney-fantasy-town/` | Active subset (fountain, lantern); rest useful for future village zones |
| `models/kenney-nature/` | Active (flowers, bushes); cliff keys unused but nature keys needed |
| `models/props/props_70.glb` | Active — market zone marker sign |
| `models/car/car_01.glb` | Active — driveable car entity |
| `characters/kaykit-adventurers/Knight.glb` | Active — player character |
| `forest/forest/optimized/fir_1k_draco.glb` | Active — street trees |
| `forest/forest/optimized/jacaranda_1k_draco.glb` | Active — street trees |
| `forest/forest/fir_tree_01_1k.gltf/` | Keep as optimization source (raw input for scripts/optimize-trees.mjs) |
| `forest/forest/jacaranda_tree_1k.gltf/` | Keep as optimization source |
| `textures/terrain/grass-path-2/` | Active — terrain layer |
| `textures/terrain/gravel_sand/` | Active — terrain layer |
| `textures/terrain/brown-mud/` | Active — terrain layer |
| `textures/roads/cobblestone-02/` | Active — main road |
| `hdri/village_sky2.exr` | Active sky |
| `hdri/village_golden.exr` | Listed in code comments as a swap option |
| `hdri/village_soft.exr` | Listed in code comments as a swap option |
| `hdri/sunrise.exr` | Listed in code comments as a swap option |
| `hdri/mountain_sunset.exr` | Planned — mountain/career zone |
| `hdri/forest_*.exr` (4 files) | Planned — forest/skills zone |
| `models/bridge/bridge_01–08.glb` | Catalogued; bridge/river zone planned in portfolio |
| `models/lawnmover/` | Catalogued; farm zone prop |
| `textures/terrain/river-rocks/`, `riverbed/` | Planned — river/bridge zone |
| `textures/terrain/forest-ground/` | Planned — forest zone |

---

## 6. Assets That Can Probably Be Removed Later

These are catalogued or present but serve no clear purpose in this portfolio world. Safe to remove **after confirming no future zone needs them.**

| Asset | Size | Reason |
|-------|------|--------|
| `models/Dont Use/` | 1.3 MB | Explicitly marked. Broken crate/chair models. |
| `models/watersprinkler/` | 1.7 MB | Not catalogued. No village use case. |
| `models/waterdish/` | 948 KB | Not catalogued. No village use case. |
| `models/little foodholder/` | 1.9 MB | Not catalogued. No village use case. |
| `models/kenney-graveyard/` | 3.4 MB | Graveyard theme doesn't fit this portfolio world. |
| `models/kenney-minigolf/` | 2.1 MB | No use case in portfolio world. |
| `models/kenney-pirate/` | 3.0 MB | No use case unless a pirate-themed project world is planned. |
| `models/kenney-platformer/` | 3.4 MB | No use case in portfolio world. |
| `models/farm-buildings-e/` | 692 KB | Duplicate farm variant; farmbuilding/ and farmstractures/ already cover the farm zone. |
| `village/textures/` | 42 MB | Contains .blend/.mtlx/.tres/.usdc files — not usable by Three.js. No code reference. |
| `models/character/` | 48 MB | Unused; player uses `kaykit-adventurers/Knight.glb` from a different folder. |
| `models/animals-pack/` | 36 MB | Horse used from `models/animals/` — this is a different, unused pack. |
| `characters/universal-base/` | 36 MB | No reference in code. |
| `characters/modular-men/` | 35 MB | No reference in code. |
| `characters/modular-women/` | 30 MB | No reference in code. |
| `characters/rpg-characters/` | 17 MB | No reference in code. |
| `characters/kaykit-animations/` | 12 MB | No reference in code. |
| `characters/kenney-mini/` | 3.3 MB | No reference in code. |
| `characters/background-humans/` | 1.1 MB | No reference in code. |
| `models/kaykit-furniture/` | 1.0 MB | No planned use. Already have bench/table/chair from other packs. |
| `models/kenney-food/` | 3.6 MB | Food/greenery already covered by green_01–16. |
| `models/foodish/` | 1.3 MB | No reference; food covered. |
| `models/food/` | 2.5 MB | No reference; food covered. |

**Estimated removable (low-risk):** ~300 MB

---

## 7. Assets That Should Be Moved Outside the Project

These are massive files that are not served at runtime and bloat the repository/build folder. They should live outside the project in a staging area, not in `public/`.

| Asset | Size | Reason to Move Out |
|-------|------|-------------------|
| `forest/forest/pine_tree_01_2k.gltf/` | **937 MB** | Permanently excluded — never used |
| `forest/forest/pine_tree_01_1k.gltf/` | **929 MB** | Permanently excluded — never used |
| `forest/forest/fir_tree_01_2k.gltf/` | **487 MB** | Superseded by 1K; not used |
| `forest/forest/jacaranda_tree_2k.gltf/` | **219 MB** | Superseded by 1K; not used |
| `models/Cliffs/` | **75 MB** | Cliff feature permanently rejected |
| `models/medieval-village/` | **58 MB** | Not planned for this portfolio world |
| `models/fantasy-props/` | **57 MB** | Not planned; style may not match |
| `models/stylized-nature-pack/` | **99 MB** | Not planned; duplicate of kenney-nature functionality |
| `models/stylized-nature/` | **48 MB** | Not planned; duplicate functionality |
| `models/pirate/` | **21 MB** | Not planned |
| `models/space/` | **19 MB** | May be needed for Space Intro zone later — consider staging |
| `models/medieval-village-e/` | **7.4 MB** | Not planned |
| `models/kaykit-dungeon/` | **6.3 MB** | No dungeon zone in portfolio |
| `models/kaykit-dungeon-classic/` | **11 MB** | No dungeon zone in portfolio |
| `models/kenney-space/` | **7.8 MB** | May be needed for Space Intro — consider staging |
| `models/stylized-trees/` | **5.2 MB** | Duplicate tree coverage |
| `textures/architecture/` | **323 MB** | 0 of 26 subfolders referenced in code. Stage elsewhere until a house-texturing feature is planned. |
| `textures/terrain/` (22 unused folders) | **~400 MB** | Only grass-path-2, gravel_sand, brown-mud are active. Rest are unused road/terrain variants. |
| `textures/roads/` (16 unused folders) | **~302 MB** | Only cobblestone-02 is active. The other 16 folders are unused alternates. |
| `models/crops/` | **2.9 MB** | Not planned |
| `forest/forest/fir_tree_01_1k.gltf/` | **465 MB** | Optimization source — keep accessible but need not be in `public/` |
| `forest/forest/jacaranda_tree_1k.gltf/` | **205 MB** | Same — optimization source only |

**Estimated moveable (high-impact):** ~3.8 GB — brings active `public/` down to ~250 MB

---

## 8. Broken Asset Keys

These keys are defined in `assetLoader.js` and called in scene code, but point to paths that do not exist on disk. They fail silently at runtime — no error thrown, asset just doesn't appear.

| Key | Broken Path | Called In |
|-----|-------------|-----------|
| `apple` | `/assets/forest/forest/source/AppleTree.glb` | `heroHouse.js` — yard tree |
| `cherry` | `/assets/forest/forest/source/CherryTree.glb` | `heroHouse.js` — yard tree |
| `boulder_mossy_lg` | `/assets/forest/forest/source/BoulderMossyLarge.glb` | `outerRocks.js` |
| `boulder_plain_lg` | `/assets/forest/forest/source/BoulderPlainLarge.glb` | `outerRocks.js` |
| `boulder_outcrop` | `/assets/forest/forest/source/BoulderOutcropMossyLarge.glb` | `outerRocks.js` |
| All `ph_*` keys | `/assets/models/polyhaven/...` | Not called in scene (polyhaven folder absent) |
| `oak`, `maple`, `fir`, `pine`, etc. | `/assets/forest/forest/source/...` | Not called in current scene files |

> The `source/` subfolder does not exist. These models were from a previous asset pack that was never extracted correctly.

---

## 9. Catalogue Bloat — Keys Defined But Never Called

These keys exist in `assetLoader.js` but are never referenced in any `placeAsset()` call or scene file. They add catalogue noise but cause no harm.

```
Bridges:        bridge_01–08
Extra houses:   house_02, 04, 05, 08, 09, 13, 14
Farm (unused):  farmbuilding_01, 03–08; farmstructure_01–22, 24–28
Green (unused): green_01, 02, 04, 08, 10, 12, 13, 14, 15, 16
Lights unused:  streetlight_02, 03, 05, 06; streetsign_01, 02, 03
Bench/table:    bench_c, d (defined, called in disabled decorItems only); table_a, b
Props unused:   props_01, 12, 28, 44, 72, 91, 92; brick_a; bonfire; lawnmover_a; crate_a–d; chair_a, b
PP unused:      pp_bridge, pp_hanging_lantern, pp_rock_large, pp_small_bridge, pp_village_market,
                pp_arrow_sign, pp_autumn_tree, pp_barrel, pp_pine_trees, pp_post_lantern, pp_rocks,
                pp_town_sign, pp_well, pp_gate, pp_birch_trees, pp_maple_trees, pp_market_scene,
                pp_market_stalls, pp_rock_bridge, pp_torii_gate, pp_rope_bridge, pp_wood_bridge
KFT unused:     kft_cart, kft_cart_high, kft_fence, kft_fence_curved, kft_fence_gate,
                kft_fence_broken, kft_hedge, kft_hedge_curved, kft_hedge_large,
                kft_hedge_large_curved, kft_hedge_gate, kft_watermill, kft_rock_small
KN unused:      kn_cliff_*, kn_rock_*, kk_mountain_*, kk_hill_*, kk_rock_*,
                kn_tree_*, kn_fence_*, kn_pot_*, kn_log_stack
PH (all):       ph_lantern, ph_fir_tree, ph_pine_tree, ph_jacaranda, ph_island_tree_*,
                ph_fir_sapling, ph_fir_sapling_med, ph_rock_07, ph_rock_09, ph_dead_tree,
                ph_tree_stump, ph_wooden_table, ph_rocking_chair, ph_wooden_chair, ph_anthurium
Forest broken:  oak, maple, birch_1–3, birch_orange_1–2, cherry, ash, apple, plum,
                fir, noble_fir, pine, sapling_dec, sapling_dec_2, sapling_con,
                shrub_dec, shrub_dec_2, shrub_con, shrub_holly, shrub_rasp
```

---

## 10. Recommended Clean Asset Structure

The goal is to keep only what is **actively used** in `public/` and move everything else to a staging folder outside the repo.

### Recommended `public/assets/` structure (lean version)

```
public/assets/
├── draco/                          ← decoder files (1 MB)
├── hdri/                           ← keep ALL .exr files (175 MB, planned use)
├── characters/
│   └── kaykit-adventurers/         ← Knight.glb only
├── models/
│   ├── Fence/                      ← fence, gate, gatepost, post
│   ├── animals/                    ← horse.glb only
│   ├── barrel/                     ← barrel_a, barrel_b
│   ├── bench/                      ← bench_a–d
│   ├── bonfire/                    ← keep (planned use)
│   ├── brick/                      ← keep (planned use)
│   ├── bridge/                     ← keep (bridge zone planned)
│   ├── bucket/                     ← bucket_a
│   ├── car/                        ← car_01.glb
│   ├── farmbuilding/               ← farmbuilding_02 (keep all, low weight)
│   ├── farmstractures/             ← farmstructure_23 (keep all, planned)
│   ├── green/                      ← green_01–16 (5.6 MB, all potentially useful)
│   ├── houses/                     ← house_01–16
│   ├── kenney-fantasy-town/        ← keep all (2.7 MB, many useful)
│   ├── kenney-nature/              ← keep all (3.5 MB, flowers/bushes active)
│   ├── lawnmover/                  ← keep (farm use)
│   ├── milktank/                   ← milktank_a
│   ├── polypizza/                  ← keep all (12 MB, many planned)
│   ├── props/                      ← props_70 + others for future use
│   ├── rocks/                      ← rocks_01–06
│   ├── streetlight and sign/       ← all (small, useful)
│   └── table/                      ← keep (planned use)
├── forest/
│   └── forest/
│       └── optimized/              ← fir_1k_draco.glb, jacaranda_1k_draco.glb only
└── textures/
    ├── terrain/
    │   ├── grass-path-2/           ← ACTIVE
    │   ├── gravel_sand/            ← ACTIVE
    │   ├── brown-mud/              ← ACTIVE
    │   ├── river-rocks/            ← keep (river zone planned)
    │   ├── riverbed/               ← keep (river zone planned)
    │   └── forest-ground/          ← keep (forest zone planned)
    └── roads/
        └── cobblestone-02/         ← ACTIVE (keep others if road reskin is planned)
```

### Move to external staging (outside repo)

```
~/Portfolio/asset-staging/
├── forest-originals/               ← all original 1K/2K GLTF tree folders (3.2 GB)
├── textures-architecture/          ← full architecture texture library (323 MB)
├── textures-terrain-unused/        ← 22 unused terrain sets (~400 MB)
├── textures-roads-unused/          ← 16 unused road sets (~302 MB)
├── models-experimental/            ← stylized-nature-pack, stylized-nature, medieval-village,
│                                      fantasy-props, pirate, Cliffs, character, animals-pack
├── models-future-space/            ← space/, kenney-space/ (for Space Intro zone)
├── models-unused/                  ← graveyard, minigolf, pirate, platformer, dungeon, etc.
├── characters-unused/              ← all character packs except kaykit-adventurers
└── village-textures-broken/        ← village/textures/ (.blend/.mtlx format, unusable)
```

### Estimated impact

| State | `public/assets/` size |
|-------|----------------------|
| Current | **~5.4 GB** |
| After clean (recommended) | **~250–280 MB** |
| Savings | **~5.1 GB** |

---

## Summary Table

| Category | Count | Notes |
|----------|-------|-------|
| Active asset keys (called in scene) | **47** | Confirmed at runtime |
| Broken keys (missing source/ folder) | **5+** | apple, cherry, all boulder_* |
| Catalogued but unused keys | **150+** | Defined in ASSETS but never called |
| Uncatalogued model folders | **29** | Exist in public/ but not in ASSETS |
| Active texture folders | **4** | grass-path-2, gravel_sand, brown-mud, cobblestone-02 |
| Active HDRI | **1** | village_sky2.exr |
| Moveable to staging | **~5.1 GB** | Pine trees alone = 1.87 GB |

---

*This report is read-only. No files were moved, deleted, or changed.*  
*Re-run asset checks: search for `placeAsset(ctx,` in `src/world/village/` and cross-reference with `ASSETS` keys in `assetLoader.js`.*
