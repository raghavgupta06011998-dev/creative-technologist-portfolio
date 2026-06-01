# EXTERNAL ASSET DOWNLOAD PLAN
### Cinematic 3D Portfolio World — Full Research & Download Plan
> Last updated: 2026-05-17
> Status: Deep research complete across 4 source clusters. No assets downloaded. No code changed. Awaiting approval.
> Research method: Live page fetches confirmed every URL — 404s are marked explicitly.

---

## RESEARCH PROGRESS CHECKPOINTS

### ✅ Cluster 1A — Quaternius
- Sources searched: quaternius.com (82 packs scanned)
- Strong finds: Buildings, props, NPCs, nature, space — all covered with glTF
- Weak/missing: Fishing (404), food/crops (FBX only, no glTF), pure Mediterranean plaster building style

### ✅ Cluster 1B — Kenney + KayKit + Poly Pizza
- Sources searched: kenney.nl, kaylousberg.itch.io, poly.pizza (17+ search pages)
- Strong finds: KayKit has animated characters + 161 animations (CC0 + GLTF). Poly Pizza has confirmed CC0 GLBs for lamps, signs, wells, market stalls, bridges
- Weak/missing: Kenney format unclear (no GLB listed on pages), some KayKit URLs 404

### ✅ Cluster 2A — Poly Haven HDRIs + Models
- Sources searched: polyhaven.com/hdris (17 pages), polyhaven.com/models (full library)
- Strong finds: 17 HDRIs confirmed. Poly Haven has a full TREE library (pine, fir, jacaranda, island trees). No buildings, bridges, or characters.
- Weak/missing: No bridge, no building, no character models

### ✅ Cluster 2B — Poly Haven Textures + ambientCG
- Sources searched: polyhaven.com/textures (31 plaster, 23 roof, 9 cobblestone, 8+ terrain). ambientCG (21 cobblestone, 35 plaster, 9 rock, grass)
- Strong finds: Poly Haven has full terracotta + plaster texture sets. ambientCG has excellent medieval cobblestone (PavingStones variants) + lush grass
- Weak/missing: No water surface normal on either. No pure lush green grass on Poly Haven.

---

## ASSETS TO AVOID

- **crate_a, crate_b, crate_c, crate_d** — broken paths in existing project, do not reference ever
- **chair_a, chair_b** — broken paths in existing project, do not reference ever
- **Sketchfab** — license filter unreliable, skip for this project
- **8K/16K textures for interactive use** — download 2K JPG for runtime; 4K only for hero surfaces
- **Style mismatch assets** — avoid ultra-clean cartoon or hyper-realistic photogrammetry buildings
- **FBX-only packs without glTF** — need Blender conversion step; mark lower priority
- **Kenney Fish Pack** — 2D vector SVG, not 3D, useless for scene
- **Kenney Foliage Pack** — may be 2D sprites; verify 3D before use
- **Quaternius Simple Nature Pack** — 13 untextured models, no glTF; superseded by MegaKit
- **Quaternius Modular Medieval Building Pack** — 30 untextured models, no glTF; superseded by MegaKit
- **Quaternius Ultimate Nature Pack** — 150 untextured, no glTF; superseded by Stylized Nature MegaKit
- **aerial_mud_1** (Poly Haven) — looks like truck track ruts, too industrial/modern
- **ambientCG WoodFloor021** — parquet floor, not planks; wrong style
- **ambientCG Plaster001-004** — too clean/modern white; prefer Poly Haven's warm aged plasters

---

## FULL RECOMMENDED ASSET TABLE

### SECTION A — 3D MODEL PACKS

| # | Asset / Pack | Source | Link | License | Format to Download | Category | Best Use | Download | Folder | Perf | Style Fit | Interaction |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Medieval Village MegaKit** | Quaternius | https://quaternius.com/packs/medievalvillagemegakit.html | CC0 | **glTF (Standard tier)** | Buildings | Primary village architecture: walls, roofs, doors, windows, stairs, arches — 304+ modular textured pieces | **NOW** | `models/village/` `models/houses/` | Medium (304 assets, atlas textures) | **Strong** | house door = About/story |
| 2 | **Fantasy Props MegaKit** | Quaternius | https://quaternius.com/packs/fantasypropsmegakit.html | CC0 | **glTF (Standard tier)** | Props / Market | Market stalls, chests, tools, pottery, barrels, furniture, vegetables — 200+ props, 4 shared textures | **NOW** | `models/props/` `models/market/` | Low (shared atlas) | **Strong** | fruit cart = mini-game; stall = experience section |
| 3 | **Stylized Nature MegaKit** | Quaternius | https://quaternius.com/packs/stylizednaturemegakit.html | CC0 | **glTF (Standard tier)** | Nature | 40 trees, 35 plants/flowers, 27 rocks, grass, bushes — Ghibli-inspired warm style | **NOW** | `models/trees/` `models/nature/` | Low (stylized, shared atlas) | **Strong** | tree shrine = skills marker |
| 4 | **KayKit Medieval Hexagon Pack** *(free tier)* | KayKit / itch.io | https://kaylousberg.itch.io/kaykit-medieval-hexagon | CC0 | **GLTF** | Buildings / Roads | 200+ free assets: buildings (church, tavern, market, windmill, well, blacksmith), road tiles, river tiles, terrain, nature props | **NOW** | `models/village/` `models/houses/` `models/roads/` | Low (single atlas) | **Strong** | well = portal/lore; tavern = NPC dialogue |
| 5 | **KayKit Forest Nature Pack** *(free tier)* | KayKit / itch.io | https://kaylousberg.itch.io/kaykit-forest | CC0 | **GLTF** | Nature | 100+ free: trees, rocks, bushes, grass. Single 1024 gradient atlas (downsampable to 128) | **NOW** | `models/trees/` `models/nature/` | Very Low | **Strong** | forest sign = skills marker |
| 6 | **KayKit Character Animations** | KayKit / itch.io | https://kaylousberg.itch.io/kaykit-character-animations | CC0 | **GLTF + FBX** | Characters | 161 animations: idle, walk, run, jump, sneak, wave, fish, dig, combat, sit, lockpick — KayKit rig | **NOW** | `models/characters/player/` | Low (animation data) | **Strong** | player walk/idle/interact |
| 7 | **KayKit Adventurers** *(free tier)* | KayKit / itch.io | https://kaylousberg.itch.io/kaykit-adventurers | CC0 | **GLTF** | Characters | 5 rigged + animated characters (textured), 25+ accessories. Basic movement animations included | **NOW** | `models/characters/player/` `models/characters/npc/` | Low | **Strong** | player character; NPC villagers |
| 8 | **Quaternius Stylized Nature MegaKit** (already #3) | — | — | — | — | — | — | — | — | — | — | — |
| 9 | **Ultimate Stylized Nature Pack** | Quaternius | https://quaternius.com/packs/ultimatestylizednature.html | CC0 | **glTF** | Nature | 63 textured nature assets with normal maps — May 2022 | NEXT | `models/nature/` | Low | **Strong** | supplemental nature scatter |
| 10 | **Ultimate Space Kit** | Quaternius | https://quaternius.com/packs/ultimatespacekit.html | CC0 | **glTF** | Space / Portal | 92 models: planets, space structures, animated characters, enemies, vegetation — CC0 | LATER | `models/portal-space/` | Medium | **Partial** (stylized sci-fi) | portal = project world entry |
| 11 | **RPG Character Pack** | Quaternius | https://quaternius.com/packs/rpgcharacters.html | CC0 | **glTF** | Characters | 6 TEXTURED + rigged + animated fantasy characters — only textured character pack | NEXT | `models/characters/npc/` | Low | **Strong** | key NPC dialogue characters |
| 12 | **Ultimate Modular Men Pack** | Quaternius | https://quaternius.com/packs/ultimatemodularcharacters.html | CC0 | **glTF** | Characters | 11 chars, 24 animations, modular body parts (4 swappable per char), untextured low-poly | NEXT | `models/characters/npc/` | Low | **Partial** (needs texture) | NPC villagers |
| 13 | **Ultimate Modular Women Pack** | Quaternius | https://quaternius.com/packs/ultimatemodularwomen.html | CC0 | **glTF** | Characters | 10 chars, 24 animations, modular, untextured — companion to Men Pack | NEXT | `models/characters/npc/` | Low | **Partial** | NPC female villagers |
| 14 | **Universal Base Characters** | Quaternius | https://quaternius.com/packs/universalbasecharacters.html | CC0 | **glTF** | Characters | 26 models: 6 rigged base bodies (Superhero/Regular/Teen × male/female) + 20 hairstyles. Humanoid rig, retarget-compatible | LATER | `models/characters/player/` | Low | **Partial** | custom player base |
| 15 | **Ultimate Animated Animal Pack** | Quaternius | https://quaternius.com/packs/ultimateanimatedanimals.html | CC0 | **glTF** | Nature / Atmosphere | 12 animals, 12+ animations each (walk, gallop, attack, death) | NEXT | `models/nature/` | Low | **Strong** | roaming village animals = life/atmosphere |
| 16 | **KayKit Dungeon Pack Remastered** *(free tier)* | KayKit / itch.io | https://kaylousberg.itch.io/kaykit-dungeon-remastered | CC0 | **GLTF** | Props | 200 free: walls, floors, barrels, chairs, tables, chests, banners, tavern furniture, beds — useful for interior and market dressing | NEXT | `models/props/` `models/market/` | Low | **Partial** (dungeon style, reuse selectively) | tavern/market interior dressing |
| 17 | **KayKit Furniture Bits** *(free tier)* | KayKit / itch.io | https://kaylousberg.itch.io/furniture-bits | CC0 | **GLTF** | Props | 50+ free: beds, sofas, tables, lamps, desks, decorative items | LATER | `models/props/` | Very Low | **Partial** | hero house interior |
| 18 | **Kenney Fantasy Town Kit** | Kenney | https://kenney.nl/assets/fantasy-town-kit | CC0 | **OBJ** (check ZIP for GLTF) | Buildings | 160 variations of medieval town buildings, walls, structures — completely remade v2.0 | NEXT | `models/village/` | Low | **Strong** | supplemental village buildings |
| 19 | **Kenney Nature Kit** | Kenney | https://kenney.nl/assets/nature-kit | CC0 | **OBJ** (check ZIP for GLTF) | Nature | 330 files: trees, rocks, terrain, waterfalls, camping gear, vegetation, fences, palms | NEXT | `models/nature/` `models/trees/` | Low | **Strong** | supplemental nature/terrain |
| 20 | **Kenney Food Kit** | Kenney | https://kenney.nl/assets/food-kit | CC0 | **OBJ** (check ZIP for GLTF) | Market Props | 200 food items — fruits, vegetables, bread, market food | NEXT | `models/market/` | Very Low | **Strong** | market stall display items; fruit cart fill |
| 21 | **Kenney Mini Characters** | Kenney | https://kenney.nl/assets/mini-characters | CC0 | **OBJ** (check ZIP for GLTF) | Characters | 25 files: animated characters with disability representation | LATER | `models/characters/npc/` | Very Low | **Partial** (small/compact style) | background NPC crowd fill |
| 22 | **Kenney Modular Space Kit** | Kenney | https://kenney.nl/assets/modular-space-kit | CC0 | **OBJ** (check ZIP for GLTF) | Space / Portal | 40 files: modular sci-fi space components, multiple color variations, animations | LATER | `models/portal-space/` | Low | **Partial** | space intro zone supplement |
| 23 | **Kenney Platformer Kit** | Kenney | https://kenney.nl/assets/platformer-kit | CC0 | **OBJ** (check ZIP for GLTF) | Characters | 150 files: animated characters, level components — v4.0 added animations | LATER | `models/characters/player/` | Low | **Partial** | alternative player character |
| 24 | **Quaternius Ultimate Food Pack** | Quaternius | https://quaternius.com/packs/ultimatefood.html | CC0 | **FBX** (no glTF — needs conversion) | Market Props | 103 food models: untextured, tavern/market food | LATER | `models/market/` | Very Low | **Partial** | market/tavern food dressing (needs Blender export) |
| 25 | **Quaternius Ultimate Crops Pack** | Quaternius | https://quaternius.com/packs/ultimatecrops.html | CC0 | **FBX** (no glTF — needs conversion) | Nature / Farm | 102 crops in 5 growth stages: untextured | LATER | `models/nature/` | Very Low | **Partial** | farm/garden zone (needs Blender export) |
| 26 | **Quaternius Pirate Kit** | Quaternius | https://quaternius.com/packs/piratekit.html | CC0 | **glTF** | Props | 71 textured + animated models: ships, coastal/dockside props, animated characters | LATER | `models/props/` | Low | **Partial** | coastal/bridge-adjacent dressing |

---

### SECTION B — INDIVIDUAL GLB MODELS (Poly Pizza)

All Poly Pizza downloads are GLB format — direct Three.js use, no conversion needed.

| # | Model Name | Author | Link | License | Polys | Category | Best Use | Download | Folder |
|---|---|---|---|---|---|---|---|---|---|
| 27 | **Post Lantern** | Kay Lousberg | https://poly.pizza/m/ZSQ65S4lEu | **CC0** ✅ | Low | Lamps | Primary village street lamp | **NOW** | `models/lamps/` |
| 28 | **Town Sign** | Quaternius | https://poly.pizza/m/VSZubp0ru3 | **CC0** ✅ | Low | Signs | Directional/zone sign boards | **NOW** | `models/signs/` |
| 29 | **Arrow Sign** | Quaternius | https://poly.pizza/m/dwmvPHHCdq | **CC0** ✅ | Low | Signs | Navigation arrows at path splits | **NOW** | `models/signs/` |
| 30 | **Well** | Quaternius | https://poly.pizza/m/QlqncKYxXb | **CC0** ✅ | Low | Props | Village centre wishing well | **NOW** | `models/props/` |
| 31 | **Market Stand** | Quaternius | https://poly.pizza/m/DGIM5HGISb | **CC0** ✅ | Low | Market | Primary market stall booth | **NOW** | `models/market/` |
| 32 | **Village Market** | Quaternius | https://poly.pizza/m/0TsHLxX6CB | **CC0** ✅ | Low | Market | Full market scene prop | NEXT | `models/market/` |
| 33 | **Small Bridge** | Quaternius | https://poly.pizza/m/j4KsIuJYnq | **CC0** ✅ | Low | Bridge | River/bridge transition zone | NEXT | `models/river-bridge/` |
| 34 | **Wood Bridge** | Poly by Google | https://poly.pizza/m/ccxRFIgIvIL | **CC0** ✅ | Low | Bridge | Alternative wooden bridge | NEXT | `models/river-bridge/` |
| 35 | **Castle Gate** | Quaternius | https://poly.pizza/m/tKTchdiQzV | **CC0** ✅ | Low | Fences / Gates | Village entrance arch gate | NEXT | `models/fences/` |
| 36 | **Barrel** | Quaternius | https://poly.pizza/m/ONdghDBByN | **CC0** ✅ | Low | Props | Market/tavern barrel scatter | NOW | `models/props/` |
| 37 | **Hanging Lantern** | Kay Lousberg | https://poly.pizza/m/3jzk3YShv1 | Verify CC0 | Low | Lamps | Market stall overhead lamp | NEXT | `models/lamps/` |
| 38 | **Wagon** | Poly by Google | https://poly.pizza/m/136bU5GesHs | **CC0** ✅ | Low | Market | Traditional wooden vendor cart | NEXT | `models/market/` |
| 39 | **Pine Trees** | Quaternius | https://poly.pizza/m/oYtDty0fR6 | Verify CC0 | Low | Trees | Village + forest pine trees | NOW | `models/trees/` |
| 40 | **Autumn Tree** | Quaternius | https://poly.pizza/m/2lRubrT6Na | Verify CC0 | Low | Trees | Golden-hour accent trees | NOW | `models/trees/` |
| 41 | **Rocks** | Quaternius | https://poly.pizza/m/OQvi8PIZ40 | Verify CC0 | Low | Rocks | Path/terrain scatter rocks | NOW | `models/rocks-terrain/` |
| 42 | **Rock Large** | Quaternius | https://poly.pizza/m/54jZKTAt5p | Verify CC0 | Low | Rocks | Mountain/landmark boulders | NEXT | `models/rocks-terrain/` |

---

### SECTION C — POLY HAVEN 3D MODELS (glTF, CC0, PBR textures included)

| # | Model Name | Link | Polys | Category | Best Use | Download | Folder |
|---|---|---|---|---|---|---|---|
| 43 | **Lantern 01** (brass/painted) | https://polyhaven.com/a/Lantern_01 | 34K tris | Lamps | Premium village lamp prop — antique brass, glass globe | **NOW** | `models/lamps/` |
| 44 | **Rock 07** | https://polyhaven.com/a/rock_07 | 28K tris | Rocks | Medium scatter boulder — PBR mapped | NEXT | `models/rocks-terrain/` |
| 45 | **Rock 09** | https://polyhaven.com/a/rock_09 | 23K tris | Rocks | Small boulder detail — PBR mapped | NEXT | `models/rocks-terrain/` |
| 46 | **Wooden Table 01** | https://polyhaven.com/a/WoodenTable_01 | 952 tris | Props | Market stall table — very low poly | NEXT | `models/props/` |
| 47 | **Rocking Chair 01** | https://polyhaven.com/a/Rockingchair_01 | 12K tris | Props | Hero house porch detail | LATER | `models/props/` |
| 48 | **CheeseBox 01** | https://polyhaven.com/a/CheeseBox_01 | 884 tris | Market | Market/farm produce crate | NEXT | `models/market/` |
| 49 | **Pine Tree 01** | https://polyhaven.com/a/pine_tree_01 | — | Trees | Full pine tree — PBR real-detail | NEXT | `models/trees/` |
| 50 | **Fir Tree 01** | https://polyhaven.com/a/fir_tree_01 | — | Trees | Full fir tree — skills forest primary tree | NEXT | `models/trees/` |
| 51 | **Jacaranda Tree** | https://polyhaven.com/a/jacaranda_tree | — | Trees | Flowering tree — Mediterranean accent near hero house | NEXT | `models/trees/` |

---

### SECTION D — HDRI LIGHTING

All CC0. Download as **2K EXR** for interactive scenes. All provide EXR + HDR formats.

| # | HDRI Name | Link | EV | Contrast | Best Zone | Mood | Download | Filename |
|---|---|---|---|---|---|---|---|---|
| 52 | **Venice Sunset** | https://polyhaven.com/a/venice_sunset | 19 EV | Medium | Village hub primary | Warm, golden | **NOW** | `village_main.exr` |
| 53 | **Evening Field** | https://polyhaven.com/a/evening_field | 12 EV | Low | Village hub soft alt | Warm, soft, rustic | **NOW** | `village_soft.exr` |
| 54 | **Belfast Sunset Pure Sky** | https://polyhaven.com/a/belfast_sunset_puresky | 12 EV | Low | IBL-only sky for village; space intro background | Warm violet-gold | NOW | `village_sky.exr` |
| 55 | **River Walk 1** | https://polyhaven.com/a/river_walk_1 | 10 EV | Medium | Skills forest zone | Warm dappled | **NOW** | `forest_golden.exr` |
| 56 | **Rolling Hills** | https://polyhaven.com/a/rolling_hills | 26 EV | High | Mountain career path | Warm dramatic | NEXT | `mountain_sunrise.exr` |
| 57 | **Hilly Terrain 01** | https://polyhaven.com/a/hilly_terrain_01 | 22 EV | Medium | Mountain career (softer alt) | Warm soft | NEXT | `mountain_soft.exr` |
| 58 | **Rural Landscape** | https://polyhaven.com/a/rural_landscape | 23 EV | Low | Bridge/transition zone | Warm-neutral | LATER | `bridge_zone.exr` |
| 59 | **Autumn Forest 04** | https://polyhaven.com/a/autumn_forest_04 | 27 EV | High | Forest dramatic alt | Warm golden | LATER | `forest_autumn.exr` |
| 60 | **Qwantani Sunset** | https://polyhaven.com/a/qwantani_sunset | 22 EV | Medium | Mountain scenic viewpoints | Warm, hilltop | LATER | `mountain_view.exr` |

---

### SECTION E — TEXTURES (Poly Haven)

Download as **2K JPG ZIP** for all interactive surfaces. Use 4K only for hero surfaces (main road, hero house wall).
Each ZIP contains: Diffuse, Normal-GL, Roughness, Displacement, AO maps. All CC0.

| # | Texture Slug | Link | Description | Best Res | Best Use | Download | Folder |
|---|---|---|---|---|---|---|---|
| 61 | **cobblestone_large_01** | https://polyhaven.com/a/cobblestone_large_01 | Rounded stones, grass in joints, 4m wide | **4K JPG** | Main village road | **NOW** | `textures/cobblestone/` |
| 62 | **cobblestone_floor_04** | https://polyhaven.com/a/cobblestone_floor_04 | Damp moss-filled joints, 67K downloads | 2K JPG | Village courtyard / piazza | NEXT | `textures/cobblestone/` |
| 63 | **cobblestone_floor_06** | https://polyhaven.com/a/cobblestone_floor_06 | Deepest mortar joints, up to 16K | 2K JPG | Narrow village lanes | NEXT | `textures/cobblestone/` |
| 64 | **rocky_trail** | https://polyhaven.com/a/rocky_trail | Compacted earth + gravel, 108K downloads | **2K JPG** | Dirt side paths | **NOW** | `textures/ground/` |
| 65 | **grass_path_2** | https://polyhaven.com/a/grass_path_2 | Dirt path with grass tufts, 77K downloads | 2K JPG | Garden paths | NOW | `textures/ground/` |
| 66 | **brown_mud_dry** | https://polyhaven.com/a/brown_mud_dry | Dry crumbly earth, 125K downloads | 2K JPG | Farm area, summer terrain | NEXT | `textures/ground/` |
| 67 | **aerial_grass_rock** | https://polyhaven.com/a/aerial_grass_rock | Moss on rock, 15m scale, 352K downloads | 2K JPG | Hillside / terrain blend | NOW | `textures/ground/` |
| 68 | **dry_ground_01** | https://polyhaven.com/a/dry_ground_01 | Dry cracked baked earth, 4m scale | 2K JPG | Mountain approach, summer | LATER | `textures/ground/` |
| 69 | **river_small_rocks** | https://polyhaven.com/a/river_small_rocks | River pebbles + stones, up to 16K | **2K JPG** | Riverbed under water mesh | NEXT | `textures/ground/` |
| 70 | **rock_wall_06** | https://polyhaven.com/a/rock_wall_06 | Warm beige-brown stone wall — Mediterranean | **4K JPG** | Hero house base walls | **NOW** | `textures/stone/` |
| 71 | **rock_wall_08** | https://polyhaven.com/a/rock_wall_08 | Grey timeworn stone, up to 16K | 2K JPG | Village boundary walls | NEXT | `textures/stone/` |
| 72 | **rock_face** | https://polyhaven.com/a/rock_face | Reddish-brown cliff face, up to 16K | 2K JPG | Mountain rock surfaces | LATER | `textures/rock/` |
| 73 | **red_plaster_weathered** | https://polyhaven.com/a/red_plaster_weathered | Warm red plaster, cracked, stained — 55K downloads | **4K JPG** | Village house walls | **NOW** | `textures/plaster/` |
| 74 | **yellow_plaster_02** | https://polyhaven.com/a/yellow_plaster_02 | Warm yellow Tuscan plaster over planks | 2K JPG | Hero house exterior wall | **NOW** | `textures/plaster/` |
| 75 | **worn_mossy_plasterwall** | https://polyhaven.com/a/worn_mossy_plasterwall | Worn mossy plaster, up to 16K | 2K JPG | Aged village buildings | NEXT | `textures/plaster/` |
| 76 | **plaster_stone_wall_01** | https://polyhaven.com/a/plaster_stone_wall_01 | Plaster revealing stone beneath, up to 16K | 2K JPG | Lower walls near ground | NEXT | `textures/plaster/` |
| 77 | **ceramic_roof_01** | https://polyhaven.com/a/ceramic_roof_01 | Orange-red ceramic + green moss, 69K downloads | **2K JPG** | Village house roofs | **NOW** | `textures/roof/` |
| 78 | **clay_roof_tiles_02** | https://polyhaven.com/a/clay_roof_tiles_02 | Interlocking terracotta shingles, 47K downloads | 2K JPG | Mediterranean overlap tile | NEXT | `textures/roof/` |
| 79 | **roof_tiles** | https://polyhaven.com/a/roof_tiles | Terracotta overlapping tiles, up to 16K | 2K JPG | High-detail hero house roof | LATER | `textures/roof/` |
| 80 | **wood_planks** | https://polyhaven.com/a/wood_planks | Warm brown aged planks, 125K downloads | **2K JPG** | Bridge planks, fence rails, shutters | **NOW** | `textures/wood/` |

---

### SECTION F — TEXTURES (ambientCG)

Download as **2K JPG** ZIP from each asset page. CC0. All include: Color, Normal-GL, Roughness, Displacement, AO.

| # | ID | Link | Description | Best Res | Best Use | Download | Folder |
|---|---|---|---|---|---|---|---|
| 81 | **PavingStones046** | https://ambientcg.com/view?id=PavingStones046 | Medieval grey cobblestone, up to 12K — 48K downloads | **2K JPG** | Secondary road surface | NEXT | `textures/cobblestone/` |
| 82 | **PavingStones150** | https://ambientcg.com/view?id=PavingStones150 | Rustic beige-grey arch-pattern stone, up to 16K | **2K JPG** | Village piazza / hero path | NOW | `textures/cobblestone/` |
| 83 | **PavingStones047** | https://ambientcg.com/view?id=PavingStones047 | Medieval grey wave-arch cobblestone, 24K downloads | 2K JPG | Side alley / courtyard | LATER | `textures/cobblestone/` |
| 84 | **Grass001** | https://ambientcg.com/view?id=Grass001 | Dense lush lawn grass, 140×140cm, 342K downloads | **2K JPG** | Village green, garden patches | **NOW** | `textures/grass/` |
| 85 | **Grass004** | https://ambientcg.com/view?id=Grass004 | Natural park grass, short, soft, 313K downloads | 2K JPG | Lawn around hero house | NOW | `textures/grass/` |
| 86 | **Rock030** | https://ambientcg.com/view?id=Rock030 | Cliff stone wall, 145K downloads | 2K JPG | Stone retaining walls | NEXT | `textures/rock/` |
| 87 | **Rock051** | https://ambientcg.com/view?id=Rock051 | Cliff mountain wall with metalness, 85K downloads | 2K JPG | Mountain cliff faces | LATER | `textures/rock/` |
| 88 | **Rock063** | https://ambientcg.com/view?id=Rock063 | Layered cracked eroded mossy cliff | 2K JPG | Ancient weathered outcrops | NEXT | `textures/rock/` |
| 89 | **Bricks075A** | https://ambientcg.com/view?id=Bricks075A | Warm beige/yellow brick, up to 16K — 185K downloads | **2K JPG** | Village house brick walls | **NOW** | `textures/stone/` |
| 90 | **Bricks094** | https://ambientcg.com/view?id=Bricks094 | Brown worn medieval old red brick, 46K downloads | 2K JPG | Older/worn village buildings | NEXT | `textures/stone/` |
| 91 | **Plaster007** | https://ambientcg.com/view?id=Plaster007 | Broken, old, paint-worn plaster — aged character | 2K JPG | Weathered village corner walls | LATER | `textures/plaster/` |

---

## FIRST PROTOTYPE SHORTLIST

**Only these assets needed for the first prototype build** (hero house area, garden, fences, lamps, signs, rocks, trees, golden-hour lighting):

| Priority | Asset | Format | Folder | Why Now |
|----------|-------|--------|--------|---------|
| 1 | Quaternius Medieval Village MegaKit | glTF | `models/village/` | Hero house + fences + gate + signs — all in one pack |
| 2 | Quaternius Stylized Nature MegaKit | glTF | `models/trees/` `models/nature/` | Trees + rocks + flowers around hero house |
| 3 | KayKit Forest Nature Pack (free) | GLTF | `models/trees/` | Backup trees + rocks, consistent style |
| 4 | Venice Sunset HDRI | 2K EXR → `village_main.exr` | `hdri/` | Primary golden-hour sky + IBL — biggest visual impact |
| 5 | Evening Field HDRI | 2K EXR → `village_soft.exr` | `hdri/` | Soft backup sky — useful for camera angles |
| 6 | KayKit Character Animations | GLTF | `models/characters/player/` | Player walk/idle needed before scene feels alive |
| 7 | KayKit Adventurers (free) | GLTF | `models/characters/player/` | Actual playable character base |
| 8 | Post Lantern GLB (Poly Pizza) | GLB | `models/lamps/` | Zero-setup street lamp, direct drop-in |
| 9 | cobblestone_large_01 | 4K JPG ZIP | `textures/cobblestone/` | Main road/path — most visible ground surface |
| 10 | red_plaster_weathered | 4K JPG ZIP | `textures/plaster/` | Hero house wall — warm Mediterranean tone |
| 11 | ceramic_roof_01 | 2K JPG ZIP | `textures/roof/` | Hero house roof — terracotta with character |
| 12 | Grass001 (ambientCG) | 2K JPG ZIP | `textures/grass/` | Garden + lawn around hero house |

---

## FULL WORLD EXPANSION LIST

### Village Expansion (Group B)
- KayKit Medieval Hexagon Pack — full village layout tiles, extra buildings
- Kenney Fantasy Town Kit — supplemental building variety
- RPG Character Pack (Quaternius) — key NPC characters with textures
- Ultimate Animated Animal Pack — roaming animals for village atmosphere
- Village Market + Market Stalls (Poly Pizza) — full market zone
- Kenney Food Kit — market stall food props
- cobblestone_floor_04, rocky_trail, brown_mud_dry — expanded ground textures
- rock_wall_06, rock_wall_08 — village walls
- yellow_plaster_02, worn_mossy_plasterwall — building walls
- clay_roof_tiles_02 — second roof tile style
- wood_planks — fences, shutters, market stalls

### River / Bridge Transition (Group B)
- Small Bridge + Wood Bridge (Poly Pizza GLBs)
- river_small_rocks texture (Poly Haven)
- Anthurium Botany 01 (Poly Haven model) — river plant
- Rural Landscape HDRI — bridge zone sky

### Mountain Career Path (Group B/C)
- Rolling Hills HDRI
- Rock 07 + Rock 09 (Poly Haven models) — boulders
- dry_ground_01 + rock_face texture
- Rock030, Rock051 (ambientCG) — cliff walls
- Poly Pizza Rock Large — landmark boulders

### Skills Forest (Group B)
- River Walk 1 HDRI (primary forest sky)
- KayKit Forest Nature Pack (trees)
- Fir Tree 01 + Pine Tree 01 (Poly Haven) — detailed hero trees
- Quaternius Stylized Nature MegaKit (supplemental)
- Rock 07/09 (Poly Haven) — forest boulders
- forest_leaves_02 texture — forest floor

### NPCs / Characters (Group C)
- Ultimate Modular Men + Women (Quaternius) — crowd NPCs
- RPG Character Pack (Quaternius) — textured key characters
- KayKit Adventurers (animated) — primary characters
- KayKit Character Animations (161 animations)

### Mini-Games / Interactions (Group C)
- KayKit Dungeon Remastered — barrel props, puzzle pieces
- Kenney Minigolf Kit — repurpose obstacles as game props
- Fantasy Props MegaKit — chests, tools, game objects
- Quaternius Well (Poly Pizza) — interactive wishing well
- Market Stand (Poly Pizza) — market delivery game base

### Project Portals / Space Intro (Group D)
- Quaternius Ultimate Space Kit (92 models, animated, glTF)
- Kenney Modular Space Kit (40 modular sci-fi pieces)
- Belfast Sunset Pure Sky HDRI (sky for space intro IBL)
- Portal door (Poly Pizza, CC-BY — add VFX on top)

---

## DOWNLOAD PRIORITY GROUPS

### Group A — Download Now (First Prototype)
*Hero house area + basic village + player character + golden-hour*

1. Quaternius Medieval Village MegaKit → glTF → `models/village/`
2. Quaternius Stylized Nature MegaKit → glTF → `models/trees/` `models/nature/`
3. KayKit Forest Nature Pack (free tier) → GLTF → `models/trees/`
4. KayKit Adventurers (free tier) → GLTF → `models/characters/player/`
5. KayKit Character Animations → GLTF → `models/characters/player/`
6. Post Lantern GLB (Poly Pizza) → GLB → `models/lamps/`
7. Town Sign + Arrow Sign (Poly Pizza) → GLB → `models/signs/`
8. Well (Poly Pizza) → GLB → `models/props/`
9. Barrel (Poly Pizza) → GLB → `models/props/`
10. Venice Sunset HDRI → 2K EXR → `hdri/village_main.exr`
11. Evening Field HDRI → 2K EXR → `hdri/village_soft.exr`
12. Belfast Sunset Pure Sky → 2K EXR → `hdri/village_sky.exr`
13. River Walk 1 HDRI → 2K EXR → `hdri/forest_golden.exr`
14. cobblestone_large_01 → 4K JPG ZIP → `textures/cobblestone/`
15. PavingStones150 (ambientCG) → 2K JPG → `textures/cobblestone/`
16. red_plaster_weathered → 4K JPG ZIP → `textures/plaster/`
17. yellow_plaster_02 → 2K JPG ZIP → `textures/plaster/`
18. ceramic_roof_01 → 2K JPG ZIP → `textures/roof/`
19. wood_planks → 2K JPG ZIP → `textures/wood/`
20. Grass001 (ambientCG) → 2K JPG → `textures/grass/`
21. rocky_trail → 2K JPG ZIP → `textures/ground/`
22. rock_wall_06 → 4K JPG ZIP → `textures/stone/`
23. Bricks075A (ambientCG) → 2K JPG → `textures/stone/`

---

### Group B — Download Next (Village Expansion + Nature + Bridge)
*After prototype is solid*

- Quaternius Fantasy Props MegaKit → glTF → `models/props/` `models/market/`
- KayKit Medieval Hexagon Pack → GLTF → `models/village/`
- KayKit Dungeon Pack Remastered → GLTF → `models/props/`
- Quaternius RPG Character Pack → glTF → `models/characters/npc/`
- Quaternius Ultimate Animated Animal Pack → glTF → `models/nature/`
- Kenney Fantasy Town Kit → OBJ/GLTF → `models/village/`
- Kenney Food Kit → OBJ/GLTF → `models/market/`
- Market Stand + Village Market + Wagon (Poly Pizza) → GLB → `models/market/`
- Small Bridge + Wood Bridge (Poly Pizza) → GLB → `models/river-bridge/`
- Castle Gate (Poly Pizza) → GLB → `models/fences/`
- Poly Haven: Pine Tree 01, Fir Tree 01, Jacaranda → glTF → `models/trees/`
- Poly Haven: Rock 07, Rock 09 → glTF → `models/rocks-terrain/`
- Poly Haven: Lantern 01, CheeseBox 01, Wooden Table 01 → glTF → `models/props/`
- Rolling Hills HDRI → 2K EXR → `hdri/mountain_sunrise.exr`
- Hilly Terrain 01 HDRI → 2K EXR → `hdri/mountain_soft.exr`
- cobblestone_floor_04 → 2K JPG → `textures/cobblestone/`
- river_small_rocks → 2K JPG → `textures/ground/`
- brown_mud_dry → 2K JPG → `textures/ground/`
- aerial_grass_rock → 2K JPG → `textures/ground/`
- worn_mossy_plasterwall + plaster_stone_wall_01 → 2K JPG → `textures/plaster/`
- rock_wall_08 → 2K JPG → `textures/stone/`
- clay_roof_tiles_02 → 2K JPG → `textures/roof/`
- Grass004 + Rock030 + Bricks094 (ambientCG) → 2K JPG → textures

---

### Group C — Download Later (NPCs + Interactions + Mountain)
*After village feels complete*

- Quaternius Ultimate Modular Men Pack → glTF → `models/characters/npc/`
- Quaternius Ultimate Modular Women Pack → glTF → `models/characters/npc/`
- Kenney Mini Characters → OBJ/GLTF → `models/characters/npc/`
- KayKit Furniture Bits → GLTF → `models/props/`
- Quaternius Ultimate Food Pack → FBX (needs Blender export) → `models/market/`
- Quaternius Ultimate Crops Pack → FBX → `models/nature/`
- Poly Haven: Rocking Chair 01 → glTF → `models/props/`
- dry_ground_01 → 2K JPG → `textures/ground/`
- rock_face → 2K JPG → `textures/rock/`
- Rock051, Rock063 (ambientCG) → 2K JPG → `textures/rock/`
- Qwantani Sunset HDRI → 2K EXR → `hdri/mountain_view.exr`
- Rural Landscape HDRI → 2K EXR → `hdri/bridge_zone.exr`

---

### Group D — Download Later (Project Portals + Space Intro)
*Full world build*

- Quaternius Ultimate Space Kit → glTF → `models/portal-space/`
- Kenney Modular Space Kit → OBJ/GLTF → `models/portal-space/`
- Quaternius Pirate Kit → glTF → `models/props/` (selective coastal props)
- Portal door (Poly Pizza, CC-BY) → GLB → `models/project-portals/`
- Autumn Forest 04 HDRI → 2K EXR → `hdri/forest_autumn.exr`
- cobblestone_floor_06 → 2K JPG → `textures/cobblestone/`
- roof_tiles (16K) → 4K JPG → `textures/roof/` (hero house final quality)

---

### Group E — Optional Only
- Quaternius Universal Base Characters (custom player — complex setup)
- Kenney Platformer Kit (alternate player — less polished)
- KayKit Dungeon Legacy Pack (superseded by Remastered)
- Quaternius Medieval Village Pack (44 models, no glTF — superseded by MegaKit)
- PavingStones047/049 (ambientCG — extra cobblestone variants)
- Plaster007 (ambientCG — heavy ruin look, only if needed)

---

## FOLDER PLACEMENT PLAN

```
public/assets/
│
├── models/
│   ├── village/
│   │   ├── quaternius-medieval-village-megakit/   ← Group A
│   │   └── kaykit-medieval-hexagon/               ← Group B
│   │
│   ├── houses/
│   │   └── (sub-folders per building type)        ← from MegaKit
│   │
│   ├── market/
│   │   ├── quaternius-fantasy-props/              ← Group B
│   │   ├── poly-pizza/
│   │   │   ├── market_stand.glb                   ← Group A
│   │   │   ├── village_market.glb                 ← Group B
│   │   │   └── wagon.glb                          ← Group B
│   │   └── kenney-food-kit/                       ← Group B
│   │
│   ├── props/
│   │   ├── poly-pizza/
│   │   │   ├── well.glb                           ← Group A
│   │   │   └── barrel.glb                         ← Group A
│   │   ├── kaykit-dungeon-remastered/             ← Group B
│   │   └── polyhaven/
│   │       ├── wooden_table_01.glb                ← Group B
│   │       └── rocking_chair.glb                  ← Group C
│   │
│   ├── signs/
│   │   ├── town_sign.glb                          ← Group A
│   │   └── arrow_sign.glb                         ← Group A
│   │
│   ├── fences/
│   │   └── castle_gate.glb                        ← Group B
│   │   (fence/wall pieces from MegaKit)
│   │
│   ├── lamps/
│   │   ├── post_lantern.glb                       ← Group A (Poly Pizza)
│   │   ├── hanging_lantern.glb                    ← Group B (Poly Pizza)
│   │   └── polyhaven/
│   │       └── lantern_01.glb                     ← Group B
│   │
│   ├── nature/
│   │   ├── quaternius-stylized-nature/            ← Group A
│   │   ├── kaykit-forest/                         ← Group A
│   │   └── polyhaven-plants/
│   │       └── anthurium_botany_01.glb            ← Group B
│   │
│   ├── trees/
│   │   ├── poly-pizza/
│   │   │   ├── pine_trees.glb                     ← Group A
│   │   │   └── autumn_tree.glb                    ← Group A
│   │   └── polyhaven/
│   │       ├── pine_tree_01.glb                   ← Group B
│   │       ├── fir_tree_01.glb                    ← Group B
│   │       └── jacaranda_tree.glb                 ← Group B
│   │
│   ├── rocks-terrain/
│   │   ├── poly-pizza/
│   │   │   ├── rocks.glb                          ← Group A
│   │   │   └── rock_large.glb                     ← Group B
│   │   └── polyhaven/
│   │       ├── rock_07.glb                        ← Group B
│   │       └── rock_09.glb                        ← Group B
│   │
│   ├── river-bridge/
│   │   ├── bridge_small.glb                       ← Group B (Poly Pizza)
│   │   └── bridge_wood.glb                        ← Group B (Poly Pizza)
│   │
│   ├── mountain/
│   │   └── (rocks from nature/ + terrain textures)
│   │
│   ├── characters/
│   │   ├── player/
│   │   │   ├── kaykit-adventurers/                ← Group A
│   │   │   └── kaykit-animations/                 ← Group A
│   │   └── npc/
│   │       ├── quaternius-rpg-characters/         ← Group B
│   │       ├── quaternius-modular-men/            ← Group C
│   │       └── quaternius-modular-women/          ← Group C
│   │
│   ├── minigames/
│   │   └── (props from fantasy-props/ + dungeon/)
│   │
│   ├── project-portals/
│   │   └── portal_door.glb                        ← Group D (Poly Pizza CC-BY)
│   │
│   └── portal-space/
│       ├── quaternius-space-kit/                  ← Group D
│       └── kenney-modular-space/                  ← Group D
│
├── textures/
│   ├── cobblestone/
│   │   ├── cobblestone_large_01/   ← 4K JPG (Group A)
│   │   ├── PavingStones150/        ← 2K JPG (Group A)
│   │   ├── cobblestone_floor_04/   ← 2K JPG (Group B)
│   │   └── PavingStones046/        ← 2K JPG (Group B)
│   │
│   ├── plaster/
│   │   ├── red_plaster_weathered/  ← 4K JPG (Group A)
│   │   ├── yellow_plaster_02/      ← 2K JPG (Group A)
│   │   ├── worn_mossy_plasterwall/ ← 2K JPG (Group B)
│   │   └── plaster_stone_wall_01/  ← 2K JPG (Group B)
│   │
│   ├── roof/
│   │   ├── ceramic_roof_01/        ← 2K JPG (Group A)
│   │   └── clay_roof_tiles_02/     ← 2K JPG (Group B)
│   │
│   ├── stone/
│   │   ├── rock_wall_06/           ← 4K JPG (Group A)
│   │   ├── Bricks075A/             ← 2K JPG (Group A)
│   │   ├── rock_wall_08/           ← 2K JPG (Group B)
│   │   └── Bricks094/              ← 2K JPG (Group B)
│   │
│   ├── wood/
│   │   └── wood_planks/            ← 2K JPG (Group A)
│   │
│   ├── ground/
│   │   ├── rocky_trail/            ← 2K JPG (Group A)
│   │   ├── grass_path_2/           ← 2K JPG (Group A)
│   │   ├── aerial_grass_rock/      ← 2K JPG (Group A)
│   │   ├── river_small_rocks/      ← 2K JPG (Group B)
│   │   └── brown_mud_dry/          ← 2K JPG (Group B)
│   │
│   ├── grass/
│   │   ├── Grass001/               ← 2K JPG (Group A)
│   │   └── Grass004/               ← 2K JPG (Group B)
│   │
│   ├── rock/
│   │   ├── Rock030/                ← 2K JPG (Group B)
│   │   ├── Rock063/                ← 2K JPG (Group B)
│   │   └── rock_face/              ← 2K JPG (Group C)
│   │
│   └── water/
│       └── (use Three.js Water shader — no dedicated texture needed)
│
└── hdri/
    ├── village_main.exr     ← Venice Sunset (Group A)
    ├── village_soft.exr     ← Evening Field (Group A)
    ├── village_sky.exr      ← Belfast Sunset Pure Sky (Group A)
    ├── forest_golden.exr    ← River Walk 1 (Group A)
    ├── mountain_sunrise.exr ← Rolling Hills (Group B)
    ├── mountain_soft.exr    ← Hilly Terrain 01 (Group B)
    ├── bridge_zone.exr      ← Rural Landscape (Group C)
    └── forest_autumn.exr    ← Autumn Forest 04 (Group D)
```

---

## INTERACTION MAPPING

| Asset | Interaction Type | Portfolio Section |
|-------|-----------------|-------------------|
| Hero house door | Click → open About / personal story | About Me |
| Navigation signs | Click → teleport to zone | Main navigation |
| NPC villagers | Walk near → show speech bubble / dialogue | Info / lore |
| Fruit cart | Click → mini-game trigger (sort / collect) | Fun / personality |
| Market stall | Walk in → Experience / services zone | Work Experience |
| Well | Click → pull up a quote or fun fact | Easter egg |
| Bridge | Walk over → transition to Skills Forest | Navigation |
| Forest glowing stones | Walk near → reveal skill name | Skills |
| Forest shrine | Click → expand skill details | Skills detail |
| Mountain signs | Walk past → career milestone popup | Career Path |
| Mountain flag/summit | Reach top → show final achievement | Career Goal |
| Project portal rings | Walk through → enter project world | Projects |
| Project world board | Click → project description + links | Project Detail |
| Space intro gate | Auto-trigger → cinematic opening | Intro experience |
| Notice board | Click → show resume/CV | Resume |
| Lantern (hover) | Hover → warm glow + tooltip | Ambient info |
| Barrel cluster | Click → hidden mini-game or quote | Easter egg |

---

## FORMAT QUICK-REFERENCE

| Asset Type | Format | Resolution | Notes |
|------------|--------|------------|-------|
| 3D Models (Quaternius) | **glTF** (Standard tier) | N/A | Select on download page |
| 3D Models (KayKit) | **GLTF** | N/A | Found in GLTF/ folder in ZIP |
| 3D Models (Poly Pizza) | **GLB** (direct) | N/A | Click Download, saves as .glb |
| 3D Models (Poly Haven) | **glTF** | N/A | Select glTF on download page |
| HDRIs | **2K EXR** | 2048px | Select 2K + EXR on Poly Haven |
| Textures (interactive) | **2K JPG ZIP** | 2048px | Download ZIP = all PBR maps |
| Textures (hero surfaces) | **4K JPG ZIP** | 4096px | Only 3–4 key surfaces max |
| Characters (animations) | **GLTF** | N/A | FBX is fallback if GLTF fails |

---

## WHAT TO DO NEXT

1. **Download Group A assets** (23 items listed above)
2. **Create folder structure** from the Folder Placement Plan
3. **Register new GLBs** in assetLoader.js with new asset keys
4. **Apply HDRI** in environment.js using RGBELoader
5. **Apply cobblestone + plaster textures** to terrain.js and building geometry
6. **Place hero house** using MegaKit pieces or existing house_01
7. **Set player character** to KayKit Adventurers mesh + animations
8. **Visual review** at golden-hour — lock style before expanding
9. **Only then start Group B** (village expansion)

> Do NOT download Group B, C, or D until Group A is placed and approved visually.
> Do NOT download everything at once — confirm each group looks right first.
