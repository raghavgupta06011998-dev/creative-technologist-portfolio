# COWORK INSTRUCTIONS — 3D Portfolio Asset Integration
# Project: Cinematic 3D Portfolio (Three.js)
# Active project path: /Users/raghavgupta/Portfolio/raghav-portfolio

---

## OVERVIEW

This is a 3D interactive portfolio built in plain Three.js (ES modules, no React).
The world is a cinematic village hub with a story-driven environment.

You have two main jobs:
1. Extract and organize downloaded asset ZIPs from ~/Downloads/Assets into the portfolio
2. Register new GLBs in the asset registry and apply a few code upgrades

Read this entire document before doing anything. Then follow the tasks in order.

---

## CRITICAL RULES — READ FIRST

- NEVER touch, move, rename, or delete files in `/public/assets/models/Dont Use/`
- NEVER add `crate_a`, `crate_b`, `crate_c`, `crate_d`, `chair_a`, or `chair_b` to any code
- NEVER change player movement, car controls, or camera code
- NEVER rewrite files from scratch — only append or make targeted edits
- NEVER delete existing asset entries in assetLoader.js
- KayKit Forest Pack is ALREADY installed at `/public/assets/forest/source/` — do NOT extract or move it again
- `models/Dont Use/` has a space in the parent folder name `streetlight and sign/` — this is correct, do not rename

---

## SOURCE ZIP LOCATIONS

All ZIPs are in: `~/Downloads/Assets/`

```
GROUP A — Download Now (First Prototype)/
GROUP B — Village Expansion + Nature + Bridge/
GROUP C — NPCs + Interactions + Mountain/
GROUP D — Project Portals + Space Intro/
GROUP E — Optional : Later/
```

---

## TASK 0 — EXTRACT AND PLACE ALL ZIPS

Work through each group. For each ZIP, extract it into a TEMP folder first, inspect what's inside, then move the files to the correct destination in the portfolio.

### Target portfolio folder:
`/Users/raghavgupta/Portfolio/raghav-portfolio/public/assets/`

---

### GROUP A — First Prototype

#### 3D Model Packs (ZIPs in: GROUP A/3D Model Packs/)

| ZIP File | Extract to |
|---|---|
| `Fantasy Props MegaKit[Standard].zip` | `/public/assets/models/fantasy-props/` |
| `KayKit_Adventurers_2.0_FREE.zip` | `/public/assets/characters/kaykit-adventurers/` |
| `KayKit_Character_Animations_1.1.zip` | `/public/assets/characters/kaykit-animations/` |
| `KayKit_Forest_Nature_Pack_1.0_FREE.zip` | **SKIP — already installed at /public/assets/forest/source/** |
| `Medieval Village MegaKit[Standard].zip` | `/public/assets/models/medieval-village/` |
| `Stylized Nature MegaKit[Standard].zip` | `/public/assets/models/stylized-nature/` |

#### HDRIs (already extracted, no ZIP — just COPY files)
Source: `GROUP A/HDRIs/`

| Source file | Destination |
|---|---|
| `belfast_sunset_puresky_2k.exr` | `/public/assets/hdri/village_main.exr` |
| `evening_field_2k.exr` | `/public/assets/hdri/village_soft.exr` |
| `river_walk_1_2k.exr` | `/public/assets/hdri/village_sky.exr` |
| `venice_sunset_2k.exr` | `/public/assets/hdri/village_golden.exr` |

Note: Rename files exactly as shown above. The code will reference these exact filenames.

#### Individual GLB Models — Poly Pizza (no ZIP — just COPY)
Source: `GROUP A/Individual GLB Models (Poly Pizza)/`
Destination: `/public/assets/models/polypizza/`

Files to copy:
- `Bridge.glb`
- `Castle Gate.glb`
- `Hanging Lantern.glb`
- `Rock Large.glb`
- `Small Bridge.glb`
- `Village Market.glb`
- `Wagon.glb`
- `Wood bridge.glb`

#### Textures — Poly Haven (ZIPs in: GROUP A/Textures — Poly Haven/)
Extract each ZIP into its own named subfolder under `/public/assets/textures/`:

| ZIP File | Extract to |
|---|---|
| `aerial_grass_rock_2k.zip` | `/public/assets/textures/terrain/aerial-grass-rock/` |
| `ceramic_roof_01_2k.zip` | `/public/assets/textures/architecture/ceramic-roof/` |
| `cobblestone_large_01_4k.zip` | `/public/assets/textures/roads/cobblestone-large/` |
| `grass_path_2_2k.zip` | `/public/assets/textures/terrain/grass-path-2/` |
| `red_plaster_weathered_4k.zip` | `/public/assets/textures/architecture/red-plaster/` |
| `rock_wall_06_4k.zip` | `/public/assets/textures/architecture/rock-wall-06/` |
| `rocky_trail_2k.zip` | `/public/assets/textures/terrain/rocky-trail/` |
| `wood_planks_2k.zip` | `/public/assets/textures/architecture/wood-planks/` |
| `yellow_plaster_02_2k.zip` | `/public/assets/textures/architecture/yellow-plaster/` |

#### Textures — ambientCG (ZIPs in: GROUP A/Textures — ambientCG/)
Extract each ZIP — keep files flat (all JPGs go directly into target folder):

| ZIP File | Extract to |
|---|---|
| `Bricks075A_2K-JPG.zip` | `/public/assets/village/textures/` |
| `Grass001_2K-JPG.zip` | `/public/assets/textures/terrain/grass-001/` |
| `Grass004_2K-JPG.zip` | `/public/assets/textures/terrain/grass-004/` |
| `PavingStones150_2K-JPG.zip` | `/public/assets/village/textures/` |

---

### GROUP B — Village Expansion + Nature + Bridge

#### 3D Model Packs (ZIPs in: GROUP B/3D Model Packs - Village Expansion + Nature + Bridge/)

| ZIP File | Extract to |
|---|---|
| `KayKit_DungeonRemastered_1.1_FREE.zip` | `/public/assets/models/kaykit-dungeon/` |
| `KayKit_Medieval_Hexagon_Pack_1.0_FREE.zip` | `/public/assets/models/kaykit-hexagon/` |
| `RPG Character Pack.zip` | `/public/assets/characters/rpg-characters/` |
| `Ultimate Animated Animal Pack.zip` | `/public/assets/models/animals-pack/` |
| `Ultimate Stylized Nature Pack.zip` | `/public/assets/models/stylized-nature-pack/` |
| `kenney_fantasy-town-kit_2.0.zip` | `/public/assets/models/kenney-fantasy-town/` |
| `kenney_food-kit.zip` | `/public/assets/models/kenney-food/` |
| `kenney_nature-kit.zip` | `/public/assets/models/kenney-nature/` |

#### HDRIs (already extracted — just COPY)
Source: `GROUP B/HDRIs - Poly Haven/`

| Source file | Destination |
|---|---|
| `hilly_terrain_01_2k.exr` | `/public/assets/hdri/forest_golden.exr` |
| `rolling_hills_2k.exr` | `/public/assets/hdri/mountain_path.exr` |

#### Individual GLB Models (no ZIP — just COPY)
Source: `GROUP B/Individual GLB Models/`
Destination: `/public/assets/models/polypizza/`

Files to copy:
- `Arrow Sign.glb`
- `Autumn Tree.glb`
- `Barrel.glb`
- `Market Stand.glb`
- `Pine Trees.glb`
- `Post Lantern.glb`
- `Rocks.glb`
- `Town Sign.glb`
- `Well.glb`

#### Poly Haven 3D Models (ZIPs in: GROUP B/Poly Haven 3D Models/)
Each ZIP contains a GLTF model with textures. Extract each ZIP into `/public/assets/models/polyhaven/`.
Keep each model in its own subfolder (as it comes out of the ZIP).

ZIPs to extract:
- `CheeseBox_01_4k.gltf.zip`
- `Lantern_01_4k.gltf.zip`
- `WoodenTable_01_4k.gltf.zip`
- `anthurium_botany_01_4k.gltf.zip`
- `fir_tree_01_4k.gltf.zip`
- `jacaranda_tree_4k.gltf.zip`
- `pine_tree_01_4k.gltf.zip`
- `rock_07_4k.gltf.zip`
- `rock_09_4k.gltf.zip`

#### Textures — Poly Haven (ZIPs in: GROUP B/Textures — Poly Haven (2K JPG ZIP)/)

| ZIP File | Extract to |
|---|---|
| `brown_mud_dry_2k.zip` | `/public/assets/textures/terrain/brown-mud/` |
| `clay_roof_tiles_02_2k.zip` | `/public/assets/textures/architecture/clay-roof-02/` |
| `cobblestone_floor_04_2k.zip` | `/public/assets/textures/roads/cobblestone-04/` |
| `cobblestone_floor_06_2k.zip` | `/public/assets/textures/roads/cobblestone-06/` |
| `forest_leaves_02_2k.zip` | `/public/assets/textures/forest/leaves-02/` |
| `mossy_cobblestone_2k.zip` | `/public/assets/textures/roads/mossy-cobblestone/` |
| `plaster_stone_wall_01_2k.zip` | `/public/assets/textures/architecture/plaster-stone-wall/` |
| `river_small_rocks_2k.zip` | `/public/assets/textures/terrain/river-rocks/` |
| `rock_wall_05_2k.zip` | `/public/assets/textures/architecture/rock-wall-05/` |
| `rock_wall_08_2k.zip` | `/public/assets/textures/architecture/rock-wall-08/` |
| `worn_mossy_plasterwall_2k.zip` | `/public/assets/textures/architecture/worn-plaster/` |

#### Textures — ambientCG (ZIPs in: GROUP B/Textures — ambientCG (2K JPG)/)
Extract flat into their own named subfolder under `/public/assets/textures/`:

| ZIP File | Extract to |
|---|---|
| `Bricks094_2K-JPG.zip` | `/public/assets/textures/architecture/bricks-094/` |
| `Bricks102_2K-JPG.zip` | `/public/assets/textures/architecture/bricks-102/` |
| `PavingStones046_2K-JPG.zip` | `/public/assets/textures/roads/paving-046/` |
| `PavingStones047_2K-JPG.zip` | `/public/assets/textures/roads/paving-047/` |
| `Rock030_2K-JPG.zip` | `/public/assets/textures/terrain/rock-030/` |
| `Rock063_2K-JPG.zip` | `/public/assets/textures/terrain/rock-063/` |
| `Rock064_2K-JPG.zip` | `/public/assets/textures/terrain/rock-064/` |

---

### GROUP C — NPCs + Interactions + Mountain

#### 3D Model Packs (ZIPs in: GROUP C/3D Model Packs/)

| ZIP File | Extract to |
|---|---|
| `Background Posed Humans Pack/Female-20260517T080403Z-3-001.zip` | `/public/assets/characters/background-humans/female/` |
| `Background Posed Humans Pack/Male-20260517T080405Z-3-001.zip` | `/public/assets/characters/background-humans/male/` |
| `KayKit_Furniture_Bits_1.0_FREE.zip` | `/public/assets/models/kaykit-furniture/` |
| `Ultimate Crops Pack.zip` | `/public/assets/models/crops/` |
| `Ultimate Food Pack.zip` | `/public/assets/models/food/` |
| `Ultimate Modular Men Pack.zip` | `/public/assets/characters/modular-men/` |
| `Ultimate Modular Women Pack.zip` | `/public/assets/characters/modular-women/` |
| `Universal Base Characters[Standard].zip` | `/public/assets/characters/universal-base/` |
| `kenney_mini-characters.zip` | `/public/assets/characters/kenney-mini/` |
| `kenney_platformer-kit.zip` | `/public/assets/models/kenney-platformer/` |

#### HDRIs (already extracted — just COPY)
Source: `GROUP C/HDRIs/`

| Source file | Destination |
|---|---|
| `dikhololo_sunset_2k.exr` | `/public/assets/hdri/space_sunset.exr` |
| `qwantani_sunset_2k.exr` | `/public/assets/hdri/mountain_sunset.exr` |
| `rural_landscape_2k.exr` | `/public/assets/hdri/village_sky2.exr` |

#### Poly Haven 3D Models (ZIPs in: GROUP C/Poly Haven 3D Models/)
Extract to `/public/assets/models/polyhaven/`:
- `Rockingchair_01_4k.gltf.zip`
- `WoodenChair_01_4k.gltf.zip`

#### Textures — Poly Haven (ZIPs in: GROUP C/Textures — Poly Haven/)

| ZIP File | Extract to |
|---|---|
| `blue_plaster_weathered_2k.zip` | `/public/assets/textures/architecture/blue-plaster/` |
| `dry_ground_01_2k.zip` | `/public/assets/textures/terrain/dry-ground/` |
| `grass_path_3_2k.zip` | `/public/assets/textures/terrain/grass-path-3/` |
| `plaster_brick_pattern_2k.zip` | `/public/assets/textures/architecture/plaster-brick/` |
| `rock_face_2k.zip` | `/public/assets/textures/terrain/rock-face/` |
| `rock_wall_07_2k.zip` | `/public/assets/textures/architecture/rock-wall-07/` |
| `wood_planks_grey_2k.zip` | `/public/assets/textures/architecture/wood-planks-grey/` |

#### Textures — ambientCG (ZIPs in: GROUP C/Textures — ambientCG (2K JPG)/)

| ZIP File | Extract to |
|---|---|
| `Ground025_2K-JPG.zip` | `/public/assets/textures/terrain/ground-025/` |
| `Ground037_2K-JPG.zip` | `/public/assets/textures/terrain/ground-037/` |
| `Plaster007_2K-JPG.zip` | `/public/assets/textures/architecture/plaster-007/` |
| `Rock023_2K-JPG.zip` | `/public/assets/textures/terrain/rock-023/` |
| `Rock026_2K-JPG.zip` | `/public/assets/textures/terrain/rock-026/` |
| `Rock051_2K-JPG.zip` | `/public/assets/textures/terrain/rock-051/` |

---

### GROUP D — Project Portals + Space Intro

#### 3D Model Packs (ZIPs in: GROUP D/3D Model Packs/)

| ZIP File | Extract to |
|---|---|
| `Pirate Kit.zip` | `/public/assets/models/pirate/` |
| `Ultimate Space Kit.zip` | `/public/assets/models/space/` |
| `kenney_modular-space-kit_1.0.zip` | `/public/assets/models/kenney-space/` |

#### HDRIs (already extracted — just COPY)
Source: `GROUP D/HDRIs/`

| Source file | Destination |
|---|---|
| `autumn_forest_04_2k.exr` | `/public/assets/hdri/forest_autumn.exr` |
| `mossy_forest_2k.exr` | `/public/assets/hdri/forest_mossy.exr` |
| `nature_reserve_forest_2k.exr` | `/public/assets/hdri/forest_reserve.exr` |
| `spruit_sunrise_2k.exr` | `/public/assets/hdri/sunrise.exr` |
| `wildflower_field_2k.exr` | `/public/assets/hdri/wildflower.exr` |

#### Individual GLB Models (no ZIP — just COPY)
Source: `GROUP D/Individual GLB Models/`
Destination: `/public/assets/models/polypizza/`
- `Gate.glb`

#### Textures — Poly Haven (ZIPs in: GROUP D/Textures — Poly Haven (2K JPG ZIP)/)

| ZIP File | Extract to |
|---|---|
| `brick_wall_001_2k.zip` | `/public/assets/textures/architecture/brick-wall-01/` |
| `brick_wall_005_2k.zip` | `/public/assets/textures/architecture/brick-wall-05/` |
| `clay_roof_tiles_03_2k.zip` | `/public/assets/textures/architecture/clay-roof-03/` |
| `cobblestone_floor_01_2k.zip` | `/public/assets/textures/roads/cobblestone-01/` |
| `cobblestone_floor_02_2k.zip` | `/public/assets/textures/roads/cobblestone-02/` |
| `cobblestone_floor_03_2k.zip` | `/public/assets/textures/roads/cobblestone-03/` |
| `cobblestone_floor_05_2k.zip` | `/public/assets/textures/roads/cobblestone-05/` |
| `forrest_ground_01_2k.zip` | `/public/assets/textures/terrain/forest-ground/` |
| `pebbles_2k.zip` | `/public/assets/textures/terrain/pebbles/` |
| `red_slate_roof_tiles_01_2k.zip` | `/public/assets/textures/architecture/red-slate-roof/` |
| `roof_tiles_2k.zip` | `/public/assets/textures/architecture/roof-tiles/` |

#### Textures — ambientCG (ZIPs in: GROUP D/Textures — ambientCG (2K JPG)/)

| ZIP File | Extract to |
|---|---|
| `Bricks021_2K-JPG.zip` | `/public/assets/textures/architecture/bricks-021/` |
| `GlazedTerracotta001_2K-JPG.zip` | `/public/assets/textures/architecture/terracotta/` |
| `PavingStones006_2K-JPG.zip` | `/public/assets/village/textures/` |
| `PavingStones049_2K-JPG.zip` | `/public/assets/textures/roads/paving-049/` |
| `PavingStones051_2K-JPG.zip` | `/public/assets/textures/roads/paving-051/` |
| `PavingStones141_2K-JPG.zip` | `/public/assets/textures/roads/paving-141/` |
| `Tiles074_2K-JPG.zip` | `/public/assets/textures/architecture/tiles-074/` |

---

### GROUP E — Optional (Do Later)

#### 3D Model Packs (ZIPs in: GROUP E/3D Model Packs/)

| ZIP File | Extract to |
|---|---|
| `Farm Buildings Pack.zip` | `/public/assets/models/farm-buildings-e/` |
| `KayKit Dungeon Pack 1.0.zip` | `/public/assets/models/kaykit-dungeon-classic/` |
| `Medieval Village Pack.zip` | `/public/assets/models/medieval-village-e/` |
| `Stylized Tree Pack.zip` | `/public/assets/models/stylized-trees/` |
| `Ultimate House Interior Pack.zip` | `/public/assets/models/house-interiors/` |
| `kenney_graveyard-kit_5.0.zip` | `/public/assets/models/kenney-graveyard/` |
| `kenney_minigolf-kit.zip` | `/public/assets/models/kenney-minigolf/` |
| `kenney_pirate-kit.zip` | `/public/assets/models/kenney-pirate/` |

#### Poly Haven 3D Models (ZIPs in: GROUP E/Poly Haven Models/)
Extract to `/public/assets/models/polyhaven/`:
- `dead_tree_trunk_4k.gltf.zip`
- `fir_sapling_4k.gltf.zip`
- `fir_sapling_medium_4k.gltf.zip`
- `island_tree_01_4k.gltf.zip`
- `island_tree_02_4k.gltf.zip`
- `tree_stump_01_4k.gltf.zip`

#### Poly Pizza Models (no ZIP — just COPY)
Source: `GROUP E/Poly Pizza Models/`
Destination: `/public/assets/models/polypizza/`
- `Birch Trees.glb`
- `Maple Trees.glb`
- `Market Scene.glb`
- `Market Stalls Compact.glb`
- `Rock bridge and environment.glb`
- `Torii Gate.glb`
- `rope bridge.glb`

---

## TASK 1 — REGISTER NEW ASSETS IN assetLoader.js

File to edit: `/Users/raghavgupta/Portfolio/raghav-portfolio/src/world/village/utils/assetLoader.js`

**Do NOT delete any existing entries.**

After the existing `// ── Props (misc) ─────────────────────────────────` section, add the following new sections **before the closing `}`** of the ASSETS object:

```js
  // ── Poly Pizza Individual GLBs ──────────────────
  pp_bridge:          { path: '/assets/models/polypizza/Bridge.glb'            },
  pp_castle_gate:     { path: '/assets/models/polypizza/Castle Gate.glb'       },
  pp_hanging_lantern: { path: '/assets/models/polypizza/Hanging Lantern.glb'   },
  pp_rock_large:      { path: '/assets/models/polypizza/Rock Large.glb'        },
  pp_small_bridge:    { path: '/assets/models/polypizza/Small Bridge.glb'      },
  pp_village_market:  { path: '/assets/models/polypizza/Village Market.glb'    },
  pp_wagon:           { path: '/assets/models/polypizza/Wagon.glb'             },
  pp_wood_bridge:     { path: '/assets/models/polypizza/Wood bridge.glb'       },
  pp_arrow_sign:      { path: '/assets/models/polypizza/Arrow Sign.glb'        },
  pp_autumn_tree:     { path: '/assets/models/polypizza/Autumn Tree.glb'       },
  pp_barrel:          { path: '/assets/models/polypizza/Barrel.glb'            },
  pp_market_stand:    { path: '/assets/models/polypizza/Market Stand.glb'      },
  pp_pine_trees:      { path: '/assets/models/polypizza/Pine Trees.glb'        },
  pp_post_lantern:    { path: '/assets/models/polypizza/Post Lantern.glb'      },
  pp_rocks:           { path: '/assets/models/polypizza/Rocks.glb'             },
  pp_town_sign:       { path: '/assets/models/polypizza/Town Sign.glb'         },
  pp_well:            { path: '/assets/models/polypizza/Well.glb'              },
  pp_gate:            { path: '/assets/models/polypizza/Gate.glb'              },

  // ── Poly Pizza — GROUP E ─────────────────────────
  pp_birch_trees:     { path: '/assets/models/polypizza/Birch Trees.glb'              },
  pp_maple_trees:     { path: '/assets/models/polypizza/Maple Trees.glb'              },
  pp_market_scene:    { path: '/assets/models/polypizza/Market Scene.glb'             },
  pp_market_stalls:   { path: '/assets/models/polypizza/Market Stalls Compact.glb'    },
  pp_rock_bridge:     { path: '/assets/models/polypizza/Rock bridge and environment.glb' },
  pp_torii_gate:      { path: '/assets/models/polypizza/Torii Gate.glb'               },
  pp_rope_bridge:     { path: '/assets/models/polypizza/rope bridge.glb'              },
```

---

## TASK 2 — UPGRADE ROAD TEXTURE TO COBBLESTONE

The road currently uses a plain road texture. We want to upgrade it to use the new PavingStones006 cobblestone texture that is already in the project at `/public/assets/village/textures/`.

File to edit: `/Users/raghavgupta/Portfolio/raghav-portfolio/src/world/village/roads/roadBuilder.js`

**Step 1:** Open the file and find where the road material / road texture is created.

Look for code similar to:
```js
const roadTexture = new THREE.TextureLoader().load(...)
const roadMaterial = new THREE.MeshStandardMaterial(...)
```

**Step 2:** Replace or update the texture paths to use the PavingStones006 textures.

The existing texture files in the project are:
```
/assets/village/textures/PavingStones006_1K-JPG_Color.jpg
/assets/village/textures/PavingStones006_1K-JPG_NormalGL.jpg
/assets/village/textures/PavingStones006_1K-JPG_Roughness.jpg
```

**Step 3:** Update the road material to use all three maps (color, normal, roughness):

```js
const tl = new THREE.TextureLoader()

const roadColorMap = tl.load('/assets/village/textures/PavingStones006_1K-JPG_Color.jpg')
const roadNormalMap = tl.load('/assets/village/textures/PavingStones006_1K-JPG_NormalGL.jpg')
const roadRoughMap  = tl.load('/assets/village/textures/PavingStones006_1K-JPG_Roughness.jpg')

// Set texture tiling so the cobblestone repeats naturally across the road
roadColorMap.wrapS = roadColorMap.wrapT = THREE.RepeatWrapping
roadNormalMap.wrapS = roadNormalMap.wrapT = THREE.RepeatWrapping
roadRoughMap.wrapS = roadRoughMap.wrapT = THREE.RepeatWrapping
roadColorMap.repeat.set(4, 12)   // tweak X/Y repeat to match road dimensions
roadNormalMap.repeat.set(4, 12)
roadRoughMap.repeat.set(4, 12)

const roadMaterial = new THREE.MeshStandardMaterial({
  map:          roadColorMap,
  normalMap:    roadNormalMap,
  roughnessMap: roadRoughMap,
  roughness:    0.9,
  metalness:    0.0,
})
```

If there are multiple road sections (main road, left split, right split), use the SAME material for all of them. Do not create separate materials — just reuse `roadMaterial`.

---

## TASK 3 — VERIFY HDRI FOLDER

After placing the EXR files in Task 0, run this check:

```bash
ls /Users/raghavgupta/Portfolio/raghav-portfolio/public/assets/hdri/
```

You should see these files:
- `village_main.exr`
- `village_soft.exr`
- `village_sky.exr`
- `village_golden.exr`
- `forest_golden.exr`
- `mountain_path.exr`
- `space_sunset.exr`
- `mountain_sunset.exr`
- `village_sky2.exr`
- `forest_autumn.exr`
- `forest_mossy.exr`
- `forest_reserve.exr`
- `sunrise.exr`
- `wildflower.exr`

If all files are present, report success. The HDRI code will be activated separately.

---

## TASK 4 — VERIFY FOREST SOURCE FOLDER (NO ACTION NEEDED)

Run this check to confirm the KayKit Forest Pack is intact:

```bash
ls /Users/raghavgupta/Portfolio/raghav-portfolio/public/assets/forest/source/
```

You should see files like: `Oak.glb`, `Maple.glb`, `FirTree.glb`, `PineTree.glb`, `Birch1.glb`, etc.

**Do NOT move or change anything in this folder.** Just confirm it is there.

---

## TASK 5 — SCAN AND REPORT EXTRACTED PACKS

After extracting the ZIPs from GROUP A (Fantasy Props MegaKit, Medieval Village MegaKit, Stylized Nature MegaKit, KayKit Adventurers), run these commands and paste the output into your report:

```bash
find /Users/raghavgupta/Portfolio/raghav-portfolio/public/assets/models/fantasy-props -name "*.glb" | head -30
find /Users/raghavgupta/Portfolio/raghav-portfolio/public/assets/models/medieval-village -name "*.glb" | head -30
find /Users/raghavgupta/Portfolio/raghav-portfolio/public/assets/models/stylized-nature -name "*.glb" | head -30
find /Users/raghavgupta/Portfolio/raghav-portfolio/public/assets/characters/kaykit-adventurers -name "*.glb" | head -20
find /Users/raghavgupta/Portfolio/raghav-portfolio/public/assets/characters/rpg-characters -name "*.glb" | head -20
```

This helps us know what GLB files are available inside each pack so we can register them in assetLoader.js in the next session.

---

## WHAT TO REPORT WHEN DONE

When all tasks are complete, please report:

1. List of ZIPs that were successfully extracted
2. Any ZIPs that failed or were empty/corrupted
3. Exact paths of the HDRI files placed in `/public/assets/hdri/`
4. The output of the TASK 5 scans (GLB file lists from major packs)
5. Whether the road texture update in roadBuilder.js was applied successfully
6. Any file path issues you encountered

---

## FORMAT NOTES

- Poly Haven texture ZIPs contain JPG files named like: `cobblestone_large_01_diff_2k.jpg`, `cobblestone_large_01_nor_gl_2k.jpg`, `cobblestone_large_01_rough_2k.jpg`
- ambientCG texture ZIPs contain JPG files named like: `PavingStones006_2K-JPG_Color.jpg`, `PavingStones006_2K-JPG_NormalGL.jpg`, `PavingStones006_2K-JPG_Roughness.jpg`
- KayKit ZIPs usually contain a `Models/` subfolder with individual GLB files — copy only the GLBs, not Unity/Unreal project files
- Quaternius ZIPs usually contain a flat folder of GLB files — copy all GLBs
- Kenney ZIPs usually have a `Models/` subfolder with GLTF/GLB files — copy only GLBs
- Poly Haven 3D model ZIPs each contain a `.gltf` + textures folder — extract keeping folder structure intact

---

*These instructions were generated for the raghav-portfolio Three.js project.*
*Project path: /Users/raghavgupta/Portfolio/raghav-portfolio*
*Do not use these instructions for any other project.*
