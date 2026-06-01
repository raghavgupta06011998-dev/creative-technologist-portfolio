# Asset Map — Raghav 3D Portfolio
> Visual inspection completed 2026-05-16. Every GLB was matched to its JPG preview.
> All JPG previews are for visual reference only. Placement, rotation, and scale in-scene are separate decisions.

---

## Critical Bugs Found

| Bug | Detail |
|-----|--------|
| `crate_a/b/c/d` wrong path | ASSETS points to `/assets/models/cratebox/` but files are in `/assets/models/Dont Use/cratebox/`. Will fail to load silently. |
| `chair_a/b` wrong path | ASSETS points to `/assets/models/chair/` but files are in `/assets/models/Dont Use/chair/`. Will fail to load silently. |
| `green_01–16` mislabelled | Comment says "Green / Bushes" but they are tropical plants and fruits (watermelon, pumpkin, apple, pear, peach, persimmon, melon, leafy palms). Wrong assets used as garden shrubs in `gardenPlants.js`. |
| `props_91/92` not in catalogue | Best wishing-well assets in the library not registered in ASSETS yet. |

---

## Summary by Category

| Category | Total GLBs | In ASSETS Catalogue | Currently Placed in Scene |
|----------|-----------|--------------------|-----------------------------|
| Houses | 16 | 16 | 8 (hero + zone houses) |
| Farm Buildings | 8 | 8 | 7 |
| Farm Structures | 28 | 28 | ~20 |
| Fences / Gates | 4 | 4 | all |
| Bridges | 8 | 8 | 2 |
| Trees (village) | 10 | 10 | all |
| Trees (forest) | ~18 | 18 | many |
| Green (tropical/fruits) | 16 | 16 | 16 (misused as garden shrubs) |
| Rocks | 6 | 6 | all |
| Streetlights | 6 | 6 | streetlight_01 only |
| Street Signs | 4 | 4 | 0 |
| Benches | 4 types | 4 | all |
| Barrels | 2 types | 2 | barrel_a, barrel_b |
| Bonfire | 1 | 1 | 2 placed |
| Buckets | 2 types | 1 (bucket_a) | 2 placed |
| Bricks | 1 registered | 1 | 2 placed |
| Tables | 2 types | 2 | 0 |
| Props (misc) | 91 | 5 (01,12,28,44,72) | 0 |
| Cars / Carts | 14 | 0 | 0 (car controller separate) |
| Animals | 1 (horse.glb) | 1 | 0 |
| Water Dish | 3 variants | 0 | 0 |
| Water Sprinkler | 5 variants | 0 | 0 |
| Milk Tank | 3 variants | 0 | 0 |
| Lawn Mower | 3 variants | 0 | 0 |
| Little Food Holder | 6 variants | 0 | 0 |
| Food Dish | 4 variants | 0 | 0 |
| Chairs (in Dont Use) | 15 | 2 (broken paths) | 0 |
| Cratebox (in Dont Use) | 29 | 4 (broken paths) | 0 |

---

## 1. Houses

All houses are low-poly, stylised village architecture. Two colour families: beige/tan (cream walls, tiled roofs) and red half-timbered (dark red/brown timber framing, white/cream plaster). All have similar overall scale appropriate for a walkable village.

| Key | GLB Path | Preview | Appearance | Recommended Placement |
|-----|----------|---------|------------|----------------------|
| house_01 | `/assets/models/houses/house_01.glb` | `houses/house_01.jpg` | Small beige cottage, single storey, simple pitched roof | Side street filler |
| house_02 | `/assets/models/houses/house_02.glb` | `houses/house_02.jpg` | Beige, slightly larger, L-shaped or extended | Right-zone main house |
| house_03 | `/assets/models/houses/house_03.glb` | `houses/house_03.jpg` | Beige, medium two-storey | Village mid-zone filler |
| house_04 | `/assets/models/houses/house_04.glb` | `houses/house_04.jpg` | Red half-timbered, compact | Left-zone main house |
| house_05 | `/assets/models/houses/house_05.glb` | `houses/house_05.jpg` | Beige, large footprint | Zone filler |
| house_06 | `/assets/models/houses/house_06.glb` | `houses/house_06.jpg` | Red half-timbered, medium | Zone filler |
| house_07 | `/assets/models/houses/house_07.glb` | `houses/house_07.jpg` | Beige, medium | Zone filler |
| house_08 | `/assets/models/houses/house_08.glb` | `houses/house_08.jpg` | Red half-timbered, tall | Side zone |
| house_09 | `/assets/models/houses/house_09.glb` | `houses/house_09.jpg` | Beige, medium | Side zone |
| house_10 | `/assets/models/houses/house_10.glb` | `houses/house_10.jpg` | Red half-timbered | Side zone |
| house_11 | `/assets/models/houses/house_11.glb` | `houses/house_11.jpg` | **Grandest house** — large two-storey beige manor | Hero House (personal story) |
| house_12 | `/assets/models/houses/house_12.glb` | `houses/house_12.jpg` | Red half-timbered, large | Zone filler |
| house_13 | `/assets/models/houses/house_13.glb` | `houses/house_13.jpg` | Beige, medium | Zone filler |
| house_14 | `/assets/models/houses/house_14.glb` | `houses/house_14.jpg` | Red half-timbered, two-storey | Left-zone secondary house |
| house_15 | `/assets/models/houses/house_15.glb` | `houses/house_15.jpg` | Beige variant | Zone filler |
| house_16 | `/assets/models/houses/house_16.glb` | `houses/house_16.jpg` | Red half-timbered variant | Zone filler |

---

## 2. Farm Buildings

8 barn-shaped structures in two colours (beige/tan and red). Same silhouette — large gabled barn roof — just different colour variants.

| Key | GLB Path | Preview | Appearance | Recommended Placement |
|-----|----------|---------|------------|----------------------|
| farmbuilding_01 | `/assets/models/farmbuilding/farmbuilding_01.glb` | `farmbuilding/farmbuilding_01.jpg` | Large beige barn | Farm cluster, far left/right zone |
| farmbuilding_02 | `farmbuilding_02.glb` | `farmbuilding_02.jpg` | Large red barn | Farm cluster |
| farmbuilding_03–04 | `farmbuilding_03/04.glb` | — | Smaller beige barn variants | Farm cluster |
| farmbuilding_05–06 | `farmbuilding_05/06.glb` | — | Red barn variants | Farm cluster |
| farmbuilding_07–08 | `farmbuilding_07/08.glb` | — | Mixed size/colour | Farm cluster background |

---

## 3. Farm Structures

28 structures split into 3 distinct sub-categories based on visual inspection:

### 3a. Platform Decks / Gazebos (farmstructure_01–08)
Low wooden platforms, raised walkways, open gazebos, and covered pavilions. Excellent for interactive gathering spots.

| Key | Appearance |
|-----|-----------|
| farmstructure_01–02 | Small flat wooden deck platforms |
| farmstructure_03–04 | Slightly larger deck with railings |
| farmstructure_05–06 | Covered gazebo / watchpost with roof |
| farmstructure_07–08 | Open-air pavilion, longer footprint |

**Best uses:** Entrance watchtowers (farmstructure_05), hero garden seating area, interactive project-world stages.

### 3b. Stilt Houses / Towers (farmstructure_09–18)
Tall elevated structures on stilts — treehouse-like or watchtower aesthetic.

| Key | Appearance |
|-----|-----------|
| farmstructure_09–12 | Single-room stilt house on tall legs |
| farmstructure_13–15 | Two-storey stilt tower |
| farmstructure_16–18 | Larger multi-platform stilt complex |

**Best uses:** Forest zone towers (skills area), mountain lookout points, creative project-world structures.

### 3c. Industrial Silos / Water Towers (farmstructure_19–28)
Large cylindrical or tower-shaped industrial structures. NOT rural cottages.

| Key | Appearance |
|-----|-----------|
| farmstructure_19–22 | Short squat silo, round base |
| farmstructure_23–25 | Tall cylindrical silo on legs |
| farmstructure_26–28 | Water tower / elevated tank |

**Best uses:** Background silhouette dressing for far farm zone, industrial/career metaphor area (mountain path).

---

## 4. Fences / Gates

White picket fence system. All pieces snap together logically.

| Key | GLB Path | Appearance |
|-----|----------|-----------|
| fence | `/assets/models/Fence/fence.glb` | Standard white picket fence panel |
| gate | `/assets/models/Fence/gate.glb` | Swinging gate with same picket style |
| gatepost | `/assets/models/Fence/gatepost.glb` | Square post, taller than fence panel |
| post | `/assets/models/Fence/post.glb` | Simple corner/end post |

**Notes:** Current scene uses these for hero house garden perimeter and entrance fencing. Style is charming/cottage-garden.

---

## 5. Bridges

8 bridge types in two style families:

### Stone Arch Bridges (bridge_01, 02)
- Solid stone construction, arched underside, fits river crossing.

### Wooden Arc Bridges (bridge_03, 04)
- Curved wooden plank bridge, lower profile, warm colour.

### Rope / Suspension Bridges (bridge_05, 06, 07, 08)
- Rope-and-plank suspension bridges. Great for forest crossings or ravines.

| Key | Style | Recommended Use |
|-----|-------|----------------|
| bridge_01 | Stone arch | Main river crossing (currently placed at x=-48) |
| bridge_02 | Stone arch (variant) | Wide water crossing |
| bridge_03 | Wooden arc | River crossing (currently placed at x=+48) |
| bridge_04 | Wooden arc (variant) | Narrow stream crossing |
| bridge_05 | Rope suspension | Forest zone ravine |
| bridge_06 | Rope suspension (variant) | Forest zone |
| bridge_07 | Rope suspension, wider | Mountain path ravine |
| bridge_08 | Rope suspension, wider variant | Mountain path |

---

## 6. Trees (Village)

10 low-poly stylised trees in three visual families:

| Keys | Family | Description |
|------|--------|-------------|
| tree_01, 03, 05, 07 | Plain green canopy | Round or layered canopy, no berries |
| tree_02, 04, 06, 08 | Red berry / autumn | Same shape but red fruit clusters on branches |
| tree_09, 10 | Orange citrus / tropical | Wider spread, orange fruit, more exotic look |

**Notes:** Currently tree_01–10 used alternating along main road. tree_09/10 could be used in garden or tropical-themed area.

---

## 7. Green / Tropical Plants & Fruits

> **WARNING**: These are NOT garden shrubs. They are tropical plants and produce items. Using them as hedges/bushes (current `gardenPlants.js`) will look wrong in-scene. Consider replacing with `shrub_dec`, `shrub_con`, or `shrub_holly` from the forest asset set.

| Key | GLB Path | Preview | Actual Appearance |
|-----|----------|---------|------------------|
| green_01 | `green/green_01.glb` | `green_01.jpg` | Large tropical broad-leaf plant (dark green) |
| green_02 | `green/green_02.glb` | `green_02.jpg` | Similar tropical leaf plant (slightly different) |
| green_03 | `green/green_03.glb` | `green_03.jpg` | Tropical palm-like plant |
| green_04 | `green/green_04.glb` | `green_04.jpg` | Low-lying spiky tropical plant |
| green_05 | `green/green_05.glb` | `green_05.jpg` | Watermelon (green/striped) |
| green_06 | `green/green_06.glb` | `green_06.jpg` | Pumpkin (orange) |
| green_07 | `green/green_07.glb` | `green_07.jpg` | Honeydew melon (yellow-green) |
| green_08 | `green/green_08.glb` | `green_08.jpg` | Round melon / similar produce |
| green_09 | `green/green_09.glb` | `green_09.jpg` | Peach (peachy-orange) |
| green_10 | `green/green_10.glb` | `green_10.jpg` | Pear (yellow-green) |
| green_11 | `green/green_11.glb` | `green_11.jpg` | Apple — red/orange banded |
| green_12 | `green/green_12.glb` | `green_12.jpg` | Round fruit (orange tones) |
| green_13 | `green/green_13.glb` | `green_13.jpg` | Apple — red |
| green_14 | `green/green_14.glb` | `green_14.jpg` | Apple — green |
| green_15 | `green/green_15.glb` | `green_15.jpg` | Persimmon or similar |
| green_16 | `green/green_16.glb` | `green_16.jpg` | Persimmon — orange |

**Recommended Placement**: Farm area produce scatter, market stall decorations, fruit-tree dressing beneath apple/plum trees. NOT appropriate as garden shrubs.

---

## 8. Rocks

All 6 are low-poly gray stone clusters. Good variety for natural scene dressing.

| Key | GLB Path | Preview | Appearance | Best Use |
|-----|----------|---------|------------|---------|
| rocks_01 | `rocks/rocks_01.glb` | `rocks_01.jpg` | Wide flat boulder cluster, multiple pieces | Road edges, river bank |
| rocks_02 | `rocks/rocks_02.glb` | `rocks_02.jpg` | Tall upright standing stones (menhir-like), dramatic | Mountain zone, forest edge |
| rocks_03 | `rocks/rocks_03.glb` | `rocks_03.jpg` | Flat scattered slabs and rubble | Riverbank, road edge |
| rocks_04 | `rocks/rocks_04.glb` | `rocks_04.jpg` | Small angular chunks + one upright slab | Tight spaces, path edges |
| rocks_05 | `rocks/rocks_05.glb` | `rocks_05.jpg` | Mid-size rounded cluster with small pebbles | Natural scatter, mountain base |
| rocks_06 | `rocks/rocks_06.glb` | `rocks_06.jpg` | **Inukshuk / stone totem** — 2-3 stacked columns on flat base | Landmark / trail marker for mountain zone |

**Note**: rocks_06 is unique — it looks like a deliberate stone marker/totem, not random rubble. Great for the mountain path as a trail marker.

---

## 9. Street Lights

6 variants, all wooden or metal post with a hanging oil-lantern style head. All share the same warm orange lantern face.

| Key | GLB Path | Preview | Post Colour | Style |
|-----|----------|---------|-------------|-------|
| streetlight_01 | `streetlight and sign/streetlight_a001.glb` | `streetlight_a001.jpg` | Brown wood | Diagonal arm, large double-panel lantern |
| streetlight_02 | `streetlight_a002.glb` | `streetlight_a002.jpg` | Brown wood | Diagonal arm, smaller lantern |
| streetlight_03 | `streetlight_a003.glb` | `streetlight_a003.jpg` | Teal/green metal | Diagonal arm, small lantern |
| streetlight_04 | `streetlight_a004.glb` | `streetlight_a004.jpg` | Brown wood | Straight vertical, lantern on top |
| streetlight_05 | `streetlight_a005.glb` | `streetlight_a005.jpg` | Red/terracotta | Straight vertical, lantern on top |
| streetlight_06 | `streetlight_a006.glb` | `streetlight_a006.jpg` | Dark slate/teal | Straight vertical, small lantern on top |

**Notes**: Currently only `streetlight_01` used throughout. streetlight_01/02 (diagonal arm) are charming for main road. streetlight_04/05/06 (upright torch style) suit garden paths and hero house. Mix styles for variety.

---

## 10. Street Signs

4 directional signpost variants. All are pole + 2 arrow-shaped sign boards pointing in opposite directions.

| Key | Preview | Post Colour | Sign Colour | Best Use |
|-----|---------|-------------|-------------|---------|
| streetsign_01 | `streetsign_a001.jpg` | Green | White/beige | Y-junction direction sign |
| streetsign_02 | `streetsign_a002.jpg` | Red | Tan/wood | Zone entrance markers |
| streetsign_03 | `streetsign_a003.jpg` | Dark slate | Red | High-contrast road markings |
| streetsign_04 | `streetsign_a004.jpg` | Dark brown | Wood | Rustic village look |

**Recommended**: Place streetsign_04 (rustic brown) at Y-junction pointing "Experiences →" / "← Skills". Place streetsign_01 (green) at entrance.

---

## 11. Benches

4 styles. Mix for natural variety across the village.

| Key | GLB Path | Preview | Appearance |
|-----|----------|---------|-----------|
| bench_a | `bench/bench_a001.glb` | `bench_a001.jpg` | Classic garden bench, green frame + orange slats, arched backrest |
| bench_b | `bench/bench_b001.glb` | `bench_b001.jpg` | Same shape, brown/dark wooden frame |
| bench_c | `bench/bench_c001.glb` | `bench_c001.jpg` | Modern minimal bench — dark stone block legs, flat plank seat, no back |
| bench_d | `bench/bench_d001.glb` | `bench_d001.jpg` | Simple natural wood bench with low backrest |

---

## 12. Decor Props (Barrels, Bonfire, Bucket, Brick)

| Key | GLB Path | Preview | Appearance |
|-----|----------|---------|-----------|
| barrel_a | `barrel/barrel_a001.glb` | `barrel_a001.jpg` | Metal oil drum (teal/green, cylindrical, industrial) |
| barrel_b | `barrel/barrel_b001.glb` | `barrel_b001.jpg` | Wooden wine/storage barrel (round, bulging, brown with iron bands) |
| bonfire | `bonfire/bonfire_a001.glb` | `bonfire_a001.jpg` | Stone ring circle with crossed logs inside (unlit) |
| brick_a | `brick/brick_a001.glb` | `brick_a001.jpg` | Single concrete block (hollow gray cinder block) |
| bucket_a | `bucket/bucket_a001.glb` | `bucket_a001.jpg` | Wooden barrel bucket, red-brown, iron handle, water inside |
| bucket_b | `bucket/bucket_b001.glb` | `bucket_b001.jpg` | Small dark metal/iron bucket, squat, with water |

**Notes**: barrel_a (metal drum) is industrial-looking — better for farm/storage zones. barrel_b (wood barrel) is more village-charming. bucket_b is not in the ASSETS catalogue but the GLB exists.

---

## 13. Tables

| Key | GLB Path | Preview | Appearance |
|-----|----------|---------|-----------|
| table_a | `table/table_a001.glb` | `table_a001.jpg` | Standard rectangular dining table, 4 legs, medium size, warm brown |
| table_b | `table/table_b001.glb` | `table_b001.jpg` | Long narrow trestle table (A-frame folding legs, banquet style) |

**Recommended**: Place table_a + bench_a/b pairs near campfire spots for a gathering area. table_b near market stalls.

---

## 14. Farm/Animal Props (not in ASSETS catalogue yet)

These are loaded GLBs with no current ASSETS entry. Add to catalogue before using.

| Folder | JPG Key | Preview | Appearance | Recommended Use |
|--------|---------|---------|------------|----------------|
| waterdish | waterdish_a001 | `waterdish_a001.jpg` | Long stone water trough, rectangular, water inside | Near horse/animal area of farm |
| watersprinkler | watersprinkler_a001 | `watersprinkler_a001.jpg` | Small watering can (green handle, white body) | Garden area prop detail |
| milktank | milktank_a001 | `milktank_a001.jpg` | Octagonal milk churn/jug (low-poly gray) | Farm area near buildings |
| lawnmover | lawn mower_a001 | `lawn mower_a001.jpg` | Push lawn mower (yellow/orange body, black handle + wheels) | Hero house garden area |
| foodish | fooddish_a001 | `fooddish_a001.jpg` | Flat metal tray filled with sand/soil (animal feed dish) | Near animal pens on farm |
| little foodholder | littlefoodholder_a001 | `littlefoodholder_a001.jpg` | Elevated feed station — two posts, wooden trough, blue/teal roof | Animal feeding station, farm |
| little foodholder | littlefoodholder_b001 | `littlefoodholder_b001.jpg` | Open V-trough without roof (red-brown), two post legs | Farm or stable area |

---

## 15. Animals

| Key | GLB Path | Preview | Notes |
|-----|----------|---------|-------|
| horse | `/assets/models/animals/horse.glb` | None — no JPG provided | Single horse model, no preview available. No animations documented. |

**Recommended**: Place near farm stable or as a grazing prop. Combine with waterdish + littlefoodholder for a proper stable scene.

---

## 16. Cars & Carts (car folder — not in ASSETS catalogue)

The car folder contains 14 vehicles across two eras: modern trucks and historic horse-drawn carts.

### Modern Vehicles (driven by player — separate car controller)
| File | Preview | Appearance |
|------|---------|-----------|
| car_01.glb | `car_01.jpg` | Dark red/maroon pickup truck + flatbed trailer attached |
| car_02.glb | `car_02.jpg` | Olive/tan pickup truck + box trailer |
| car_03.glb | `car_03.jpg` | Black off-road SUV, bull bar, roof rack |
| car_04.glb | — | Unknown — likely another SUV variant |
| car_05.glb | `car_05.jpg` | Gray Hummer-style high-suspension SUV |
| car_06.glb | — | Unknown |
| car_08.glb | — | Unknown |
| car_09.glb | — | Unknown |

### Historic Carts / Trailers (decorative props)
| File | Preview | Appearance | Recommended Use |
|------|---------|------------|----------------|
| car_07.glb | `car_07.jpg` | 4-wheeled wooden hay cart, slatted sides, horse shafts | Farm area — decorative parked cart |
| car_10.glb | `car_10.jpg` | 2-wheeled wooden tilting dump cart, spoke wheels | Farm area — small cart near barn |
| car_11.glb | `car_11.jpg` | Red flatbed hand trolley (warehouse dolly, wheels + push handle) | Warehouse/market area — props_XX area |
| car_12.glb | — | Unknown | — |
| car_13.glb | — | Unknown | — |
| car_14.glb | `car_14.jpg` | Single-axle wooden/metal cargo trailer (no tow vehicle) | Farm or loading dock area |

---

## 17. Props (props_01 – props_92)

Large utility/construction/warehouse prop set. 91 files total. Only 5 currently in ASSETS catalogue (`props_01, 12, 28, 44, 72`). **None placed in scene yet.**

### Category Breakdown (from visual inspection)

| Range | Category | Count | Description |
|-------|----------|-------|-------------|
| props_01–04 | Lumber pallets | 4 | Stacks of flat planks/boards on wooden pallets — 2 bundle configs, 2 colour shades |
| props_05–16 | Cardboard shipping boxes | 12 | Various sizes: cube, tall narrow, wide flat, large cube — all with CE/recycling marks and strapping |
| props_17–24 | Palletised boxes | 8 | Multiple boxes stacked on pallets — 3×2 grids, tall stacks |
| props_25–29 | Industrial drums | 5 | Dark blue metal barrels — single, and 6-pack on pallet |
| props_30–34 | More box variants | 5 | Flat cardboard box, open flap box, orange large box |
| props_35 | Open cardboard box | 1 | Orange cardboard box with top flaps open |
| props_36–39 | Mixed | 4 | (not sampled — likely boxes or pallet variants) |
| props_40 | Drum pallet | 1 | 6 dark blue drums on a single wooden pallet |
| props_41–48 | Brick pallets | 8 | Red clay bricks stacked on pallets, various stack heights |
| props_49–51 | Pallet (empty/stacked) | 3 | Wooden pallets — single flat, two stacked, three disorganised |
| props_52–54 | Box variants | 3 | More cardboard box sizes |
| props_55–57 | Metal shelving (empty) | 3 | Industrial metal rack shelving units — 4-shelf and 5-shelf versions, empty or loaded with boxes |
| props_58–59 | Road barriers (wedge) | 2 | Striped wedge/jersey barrier — red/white and orange/black |
| props_60–61 | Road barricades (A-frame) | 2 | Construction sawhorse barricade with warning stripes + lights |
| props_62–64 | Metal shelving (empty) | 3 | More shelving rack variants (different widths) |
| props_65–69 | Metal shelving (brown shelves) | 5 | Shelving units with warm brown shelf boards — full and partial stock |
| props_70–79 | Sign posts | 10 | Small wooden square sign posts — various post colours (brown, dark gray, charcoal), single square panel on top |
| props_80 | Flat plank stack | 1 | Very flat stack of thin wooden boards (loose pile, no pallet) |
| props_81–84 | More lumber | 4 | Plank/board stacks, various thicknesses |
| props_85–88 | Log bundles | 4 | Bundled round logs, 6 per bundle, dark bark |
| props_89–90 | Log piles | 2 | Loose pile of logs + standing log arrangement |
| **props_91** | **Wishing well (roofed)** | **1** | **Stone circular well, octagonal stone base, wooden roof with tiled cap, hanging bucket. EXCELLENT village centrepiece.** |
| **props_92** | **Wishing well (open)** | **1** | **Stone circular well, octagonal base, wooden cross-beam with winch and hanging bucket. More rustic variant.** |

### Notable Standout Props

| File | Why It's Notable |
|------|-----------------|
| `props_91.glb` | **Stone wishing well with roofed shelter** — this is the best single decorative centrepiece in the entire library. Perfect for village square, hero house garden, or Y-junction gathering spot. |
| `props_92.glb` | **Stone wishing well with winch** — simpler variant of 91, also excellent, more rustic. |
| props_60/61 | **Construction barricades** — use to block off "under construction" zones, future project worlds not yet built. Fun meta-storytelling. |
| props_55–57 | **Shelving racks** — good for a warehouse/storage interior scene or a market display area. |
| props_70–79 | **Sign posts** — standalone small signs, very useful at path intersections and zone entrances. More intimate than streetsign directional signs. |

### Adding Props to ASSETS Catalogue

The props_91 and props_92 wishing wells should be added immediately. Suggested additions:

```js
props_91: { path: '/assets/models/props/props_91.glb' },  // wishing well (roofed)
props_92: { path: '/assets/models/props/props_92.glb' },  // wishing well (open)
```

---

## 18. Chairs & Crateboxes (in "Dont Use" folder)

The GLBs exist but are stored under `Dont Use/`. Their paths in the ASSETS catalogue are broken (pointing to non-existent paths without "Dont Use/"). These will fail silently.

**Chairs**: 2 series × multiple variants
- chair_a (a001–a006): Likely style A chair, 6 variants
- chair_b (b001–b009): Likely style B chair, 9 variants

**Crateboxes**: 4 series
- cratebox_a (a001–a011): 11 variants
- cratebox_b (b001–b006): 6 variants
- cratebox_c (c001–c005): 5 variants
- cratebox_d (d001–d007): 7 variants

**Action Required**: Either move these folders out of "Dont Use" and fix ASSETS paths, OR remove chair_a/b and crate_a/b/c/d from ASSETS catalogue to avoid silent load failures.

---

## 19. Scene Placement Recommendations

### Village Hub (current active zone)

| Zone | Recommended Additions |
|------|-----------------------|
| Entrance | streetsign_01 (green) at gate post, bench_a pair flanking entrance |
| Main road | Mix streetlight_01 + streetlight_02 alternating for variety |
| Y-junction | streetsign_04 (rustic) pointing to "Experiences" and "Skills", props_91 wishing well as centrepiece focal point |
| Left zone (Experiences) | table_a + bench_b pairs, barrel_b clusters, car_07 hay cart near barn |
| Right zone (Skills) | table_b (trestle), bench_d, metal shelving (props_55) visible through windows |
| Hero house garden | lawnmover near shed, watersprinkler, bench_c (modern), streetlight_04 path lamps |
| Farm area | horse + waterdish + littlefoodholder_a grouping, car_10 cart, milktank near barn |
| River crossing | rocks_06 (inukshuk totem) as trail marker near bridge |

### Forest / Skills Zone
| rocks_02 | Tall standing stones create dramatic ancient atmosphere |
| farmstructure_09–12 | Stilt houses as hidden forest dwellings |
| bridge_05–08 | Rope bridges over forest ravines |
| shrub_dec / shrub_holly | Proper bush assets (from forest set, not green_XX) |

### Mountain / Career Zone
| Asset | Use |
|-------|-----|
| rocks_06 (inukshuk) | Trail markers up the mountain |
| farmstructure_19–28 (silos) | Industrial past visible in background |
| props_60/61 (barricades) | "Under construction" zone blocking future career steps |
| bridge_07/08 (rope suspension) | Dramatic mountain crossing |

### Project Worlds (future)
| Asset | Use |
|-------|-----|
| props_55–57 (shelving) | Interior workshop scene |
| props_85–90 (log bundles) | Rustic cabin or outdoor workspace |
| streetsign_03 (dark slate, red) | High-contrast modern project world |

---

## 20. Assets NOT Yet in ASSETS Catalogue (Available to Add)

| Asset | Path | Priority |
|-------|------|---------|
| props_91 (wishing well, roofed) | `/assets/models/props/props_91.glb` | HIGH — great centrepiece |
| props_92 (wishing well, open) | `/assets/models/props/props_92.glb` | HIGH |
| props_60/61 (road barricades) | `props/props_60.glb`, `props_61.glb` | MED — meta "under construction" storytelling |
| props_70–79 (sign posts) | `props/props_7X.glb` | MED — zone entrance markers |
| waterdish_a | `/assets/models/waterdish/waterdish_a001.glb` | MED — animal area detail |
| lawnmover_a | `/assets/models/lawnmover/lawn mower_a001.glb` | LOW |
| milktank_a | `/assets/models/milktank/milktank_a001.glb` | LOW |
| watersprinkler_a | `/assets/models/watersprinkler/watersprinkler_a001.glb` | LOW |
| littlefoodholder_a | `/assets/models/little foodholder/littlefoodholder_a001.glb` | LOW |
| bucket_b | `/assets/models/bucket/bucket_b001.glb` | LOW |
| car_07 (hay cart) | `/assets/models/car/car_07.glb` | MED — farm area dressing |
| car_10 (dump cart) | `/assets/models/car/car_10.glb` | MED |
| streetsign_04 | Already in catalogue | READY |
| streetlight_02–06 | Already in catalogue | READY |
