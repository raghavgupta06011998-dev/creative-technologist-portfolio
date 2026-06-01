import * as THREE from 'three'
import { loadGLBModel } from '../../../utils/loaders.js'

const modelCache = new Map()
let activeSpawnCtx = null

// =====================================================
// ASSET CATALOGUE
// Maps asset type names → GLB paths + spawn config
// =====================================================

export const ASSETS = {
  // ── Houses ──────────────────────────────────────
  house_01:  { path: '/assets/models/houses/house_01.glb' },
  house_02:  { path: '/assets/models/houses/house_02.glb' },
  house_03:  { path: '/assets/models/houses/house_03.glb' },
  house_04:  { path: '/assets/models/houses/house_04.glb' },
  house_05:  { path: '/assets/models/houses/house_05.glb' },
  house_06:  { path: '/assets/models/houses/house_06.glb' },
  house_07:  { path: '/assets/models/houses/house_07.glb' },
  house_08:  { path: '/assets/models/houses/house_08.glb' },
  house_09:  { path: '/assets/models/houses/house_09.glb' },
  house_10:  { path: '/assets/models/houses/house_10.glb' },
  house_11:  { path: '/assets/models/houses/house_11.glb' },
  house_12:  { path: '/assets/models/houses/house_12.glb' },
  house_13:  { path: '/assets/models/houses/house_13.glb' },
  house_14:  { path: '/assets/models/houses/house_14.glb' },
  house_15:  { path: '/assets/models/houses/house_15.glb' },
  house_16:  { path: '/assets/models/houses/house_16.glb' },

  // ── Farm Buildings ───────────────────────────────
  farmbuilding_01: { path: '/assets/models/farmbuilding/farmbuilding_01.glb' },
  farmbuilding_02: { path: '/assets/models/farmbuilding/farmbuilding_02.glb' },
  farmbuilding_03: { path: '/assets/models/farmbuilding/farmbuilding_03.glb' },
  farmbuilding_04: { path: '/assets/models/farmbuilding/farmbuilding_04.glb' },
  farmbuilding_05: { path: '/assets/models/farmbuilding/farmbuilding_05.glb' },
  farmbuilding_06: { path: '/assets/models/farmbuilding/farmbuilding_06.glb' },
  farmbuilding_07: { path: '/assets/models/farmbuilding/farmbuilding_07.glb' },
  farmbuilding_08: { path: '/assets/models/farmbuilding/farmbuilding_08.glb' },

  // ── Farm Structures ──────────────────────────────
  farmstructure_01: { path: '/assets/models/farmstractures/farmstractures_01.glb' },
  farmstructure_02: { path: '/assets/models/farmstractures/farmstractures_02.glb' },
  farmstructure_03: { path: '/assets/models/farmstractures/farmstractures_03.glb' },
  farmstructure_04: { path: '/assets/models/farmstractures/farmstractures_04.glb' },
  farmstructure_05: { path: '/assets/models/farmstractures/farmstractures_05.glb' },
  farmstructure_06: { path: '/assets/models/farmstractures/farmstractures_06.glb' },
  farmstructure_07: { path: '/assets/models/farmstractures/farmstractures_07.glb' },
  farmstructure_08: { path: '/assets/models/farmstractures/farmstractures_08.glb' },
  farmstructure_09: { path: '/assets/models/farmstractures/farmstractures_09.glb' },
  farmstructure_10: { path: '/assets/models/farmstractures/farmstractures_10.glb' },
  farmstructure_11: { path: '/assets/models/farmstractures/farmstractures_11.glb' },
  farmstructure_12: { path: '/assets/models/farmstractures/farmstractures_12.glb' },
  farmstructure_13: { path: '/assets/models/farmstractures/farmstractures_13.glb' },
  farmstructure_14: { path: '/assets/models/farmstractures/farmstractures_14.glb' },
  farmstructure_15: { path: '/assets/models/farmstractures/farmstractures_15.glb' },
  farmstructure_16: { path: '/assets/models/farmstractures/farmstractures_16.glb' },
  farmstructure_17: { path: '/assets/models/farmstractures/farmstractures_17.glb' },
  farmstructure_18: { path: '/assets/models/farmstractures/farmstractures_18.glb' },
  farmstructure_19: { path: '/assets/models/farmstractures/farmstractures_19.glb' },
  farmstructure_20: { path: '/assets/models/farmstractures/farmstractures_20.glb' },
  farmstructure_21: { path: '/assets/models/farmstractures/farmstractures_21.glb' },
  farmstructure_22: { path: '/assets/models/farmstractures/farmstractures_22.glb' },
  farmstructure_23: { path: '/assets/models/farmstractures/farmstractures_23.glb' },
  farmstructure_24: { path: '/assets/models/farmstractures/farmstractures_24.glb' },
  farmstructure_25: { path: '/assets/models/farmstractures/farmstractures_25.glb' },
  farmstructure_26: { path: '/assets/models/farmstractures/farmstractures_26.glb' },
  farmstructure_27: { path: '/assets/models/farmstractures/farmstractures_27.glb' },
  farmstructure_28: { path: '/assets/models/farmstractures/farmstractures_28.glb' },

  // ── Fences ──────────────────────────────────────
  fence:    { path: '/assets/models/Fence/fence.glb'    },
  gate:     { path: '/assets/models/Fence/gate.glb'     },
  gatepost: { path: '/assets/models/Fence/gatepost.glb' },
  post:     { path: '/assets/models/Fence/post.glb'     },

  // ── Bridges ─────────────────────────────────────
  bridge_01: { path: '/assets/models/bridge/bridge_01.glb' },
  bridge_02: { path: '/assets/models/bridge/bridge_02.glb' },
  bridge_03: { path: '/assets/models/bridge/bridge_03.glb' },
  bridge_04: { path: '/assets/models/bridge/bridge_04.glb' },
  bridge_05: { path: '/assets/models/bridge/bridge_05.glb' },
  bridge_06: { path: '/assets/models/bridge/bridge_06.glb' },
  bridge_07: { path: '/assets/models/bridge/bridge_07.glb' },
  bridge_08: { path: '/assets/models/bridge/bridge_08.glb' },

  // ── Village Trees ────────────────────────────────
  tree_01:  { path: '/assets/models/trees/tree_01.glb' },
  tree_02:  { path: '/assets/models/trees/tree_02.glb' },
  tree_03:  { path: '/assets/models/trees/tree_03.glb' },
  tree_04:  { path: '/assets/models/trees/tree_04.glb' },
  tree_05:  { path: '/assets/models/trees/tree_05.glb' },
  tree_06:  { path: '/assets/models/trees/tree_06.glb' },
  tree_07:  { path: '/assets/models/trees/tree_07.glb' },
  tree_08:  { path: '/assets/models/trees/tree_08.glb' },
  tree_09:  { path: '/assets/models/trees/tree_09.glb' },
  tree_10:  { path: '/assets/models/trees/tree_10.glb' },

  // ── Forest Trees (Skills Realm) ──────────────────
  oak:             { path: '/assets/forest/forest/source/Oak.glb'             },
  maple:           { path: '/assets/forest/forest/source/Maple.glb'           },
  birch_1:         { path: '/assets/forest/forest/source/Birch1.glb'          },
  birch_2:         { path: '/assets/forest/forest/source/Birch2.glb'          },
  birch_3:         { path: '/assets/forest/forest/source/Birch3.glb'          },
  birch_orange_1:  { path: '/assets/forest/forest/source/BirchOrange1.glb'    },
  birch_orange_2:  { path: '/assets/forest/forest/source/BirchOrange2.glb'    },
  cherry:          { path: '/assets/forest/forest/source/CherryTree.glb'      },
  ash:             { path: '/assets/forest/forest/source/AshTree.glb'         },
  apple:           { path: '/assets/forest/forest/source/AppleTree.glb'       },
  plum:            { path: '/assets/forest/forest/source/PlumTree.glb'        },
  fir:             { path: '/assets/forest/forest/source/FirTree.glb'         },
  noble_fir:       { path: '/assets/forest/forest/source/NobleFirTree.glb'    },
  pine:            { path: '/assets/forest/forest/source/PineTree.glb'        },
  sapling_dec:     { path: '/assets/forest/forest/source/DeciduousSapling.glb'  },
  sapling_dec_2:   { path: '/assets/forest/forest/source/DeciduousSapling2.glb' },
  sapling_con:     { path: '/assets/forest/forest/source/Coniferous Sapling.glb' },
  shrub_dec:       { path: '/assets/forest/forest/source/DeciduousShrub.glb'   },
  shrub_dec_2:     { path: '/assets/forest/forest/source/DeciduousShrub2.glb'  },
  shrub_con:       { path: '/assets/forest/forest/source/ConiferousShrub.glb'  },
  shrub_holly:     { path: '/assets/forest/forest/source/HollyShrub.glb'       },
  shrub_rasp:      { path: '/assets/forest/forest/source/RaspberryShrub.glb'   },
  boulder_mossy_lg: { path: '/assets/forest/forest/source/BoulderMossyLarge.glb'        },
  boulder_plain_lg: { path: '/assets/forest/forest/source/BoulderPlainLarge.glb'        },
  boulder_outcrop:  { path: '/assets/forest/forest/source/BoulderOutcropMossyLarge.glb' },

  // ── Green / Bushes ───────────────────────────────
  green_01: { path: '/assets/models/green/green_01.glb' },
  green_02: { path: '/assets/models/green/green_02.glb' },
  green_03: { path: '/assets/models/green/green_03.glb' },
  green_04: { path: '/assets/models/green/green_04.glb' },
  green_05: { path: '/assets/models/green/green_05.glb' },
  green_06: { path: '/assets/models/green/green_06.glb' },
  green_07: { path: '/assets/models/green/green_07.glb' },
  green_08: { path: '/assets/models/green/green_08.glb' },
  green_09: { path: '/assets/models/green/green_09.glb' },
  green_10: { path: '/assets/models/green/green_10.glb' },
  green_11: { path: '/assets/models/green/green_11.glb' },
  green_12: { path: '/assets/models/green/green_12.glb' },
  green_13: { path: '/assets/models/green/green_13.glb' },
  green_14: { path: '/assets/models/green/green_14.glb' },
  green_15: { path: '/assets/models/green/green_15.glb' },
  green_16: { path: '/assets/models/green/green_16.glb' },

  // ── Rocks ────────────────────────────────────────
  rocks_01: { path: '/assets/models/rocks/rocks_01.glb' },
  rocks_02: { path: '/assets/models/rocks/rocks_02.glb' },
  rocks_03: { path: '/assets/models/rocks/rocks_03.glb' },
  rocks_04: { path: '/assets/models/rocks/rocks_04.glb' },
  rocks_05: { path: '/assets/models/rocks/rocks_05.glb' },
  rocks_06: { path: '/assets/models/rocks/rocks_06.glb' },

  // ── Street Lights & Signs ────────────────────────
  streetlight_01: { path: '/assets/models/streetlight and sign/streetlight_a001.glb' },
  streetlight_02: { path: '/assets/models/streetlight and sign/streetlight_a002.glb' },
  streetlight_03: { path: '/assets/models/streetlight and sign/streetlight_a003.glb' },
  streetlight_04: { path: '/assets/models/streetlight and sign/streetlight_a004.glb' },
  streetlight_05: { path: '/assets/models/streetlight and sign/streetlight_a005.glb' },
  streetlight_06: { path: '/assets/models/streetlight and sign/streetlight_a006.glb' },
  streetsign_01:  { path: '/assets/models/streetlight and sign/streetsign_a001.glb'  },
  streetsign_02:  { path: '/assets/models/streetlight and sign/streetsign_a002.glb'  },
  streetsign_03:  { path: '/assets/models/streetlight and sign/streetsign_a003.glb'  },
  streetsign_04:  { path: '/assets/models/streetlight and sign/streetsign_a004.glb'  },

  // ── Furniture ────────────────────────────────────
  bench_a: { path: '/assets/models/bench/bench_a001.glb' },
  bench_b: { path: '/assets/models/bench/bench_b001.glb' },
  bench_c: { path: '/assets/models/bench/bench_c001.glb' },
  bench_d: { path: '/assets/models/bench/bench_d001.glb' },
  chair_a: { path: '/assets/models/chair/chair_a001.glb' },
  chair_b: { path: '/assets/models/chair/chair_b001.glb' },
  table_a: { path: '/assets/models/table/table_a001.glb' },
  table_b: { path: '/assets/models/table/table_b001.glb' },

  // ── Decor Items ──────────────────────────────────
  barrel_a:   { path: '/assets/models/barrel/barrel_a001.glb'      },
  barrel_b:   { path: '/assets/models/barrel/barrel_b001.glb'      },
  crate_a:    { path: '/assets/models/cratebox/cratebox_a001.glb'   },
  crate_b:    { path: '/assets/models/cratebox/cratebox_b001.glb'   },
  crate_c:    { path: '/assets/models/cratebox/cratebox_c001.glb'   },
  crate_d:    { path: '/assets/models/cratebox/cratebox_d001.glb'   },
  bonfire:    { path: '/assets/models/bonfire/bonfire_a001.glb'     },
  brick_a:    { path: '/assets/models/brick/brick_a001.glb'         },
  bucket_a:   { path: '/assets/models/bucket/bucket_a001.glb'       },

  // ── Animals ──────────────────────────────────────
  horse: { path: '/assets/models/animals/horse.glb' },
  cow:   { path: '/assets/models/animals-pack/Cow.gltf' },

  // ── Props (misc) ─────────────────────────────────
  props_01: { path: '/assets/models/props/props_01.glb' },
  props_12: { path: '/assets/models/props/props_12.glb' },
  props_70: { path: '/assets/models/props/props_70.glb' },  // small wooden sign post
  props_28: { path: '/assets/models/props/props_28.glb' },
  props_44: { path: '/assets/models/props/props_44.glb' },
  props_72: { path: '/assets/models/props/props_72.glb' },
  props_91: { path: '/assets/models/props/props_91.glb' },  // wishing well (roofed)
  props_92: { path: '/assets/models/props/props_92.glb' },  // wishing well (open/winch)

  // ── Farm / Garden tools ──────────────────────────
  lawnmover_a: { path: '/assets/models/lawnmover/lawn mower_a001.glb' },
  milktank_a:  { path: '/assets/models/milktank/milktank_a001.glb'    },

  // ── Poly Pizza Individual GLBs ──────────────────
  pp_bridge:          { path: '/assets/models/polypizza/Bridge.glb'                       },
  pp_castle_gate:     { path: '/assets/models/polypizza/Castle Gate.glb'                  },
  pp_hanging_lantern: { path: '/assets/models/polypizza/Hanging Lantern.glb'              },
  pp_rock_large:      { path: '/assets/models/polypizza/Rock Large.glb'                   },
  pp_small_bridge:    { path: '/assets/models/polypizza/Small Bridge.glb'                 },
  pp_village_market:  { path: '/assets/models/polypizza/Village_Market.glb'               },
  new_village_market: { path: '/assets/new assets/Village Market.glb'                    },
  pp_wagon:           { path: '/assets/models/polypizza/Wagon.glb'                        },
  pp_wood_bridge:     { path: '/assets/models/polypizza/Wood bridge.glb'                  },
  pp_arrow_sign:      { path: '/assets/models/polypizza/Arrow Sign.glb'                   },
  pp_autumn_tree:     { path: '/assets/models/polypizza/Autumn Tree.glb'                  },
  pp_barrel:          { path: '/assets/models/polypizza/Barrel.glb'                       },
  pp_market_stand:    { path: '/assets/models/polypizza/Market Stand.glb'                 },
  pp_pine_trees:      { path: '/assets/models/polypizza/Pine Trees.glb'                   },
  pp_post_lantern:    { path: '/assets/models/polypizza/Post Lantern.glb'                 },
  pp_rocks:           { path: '/assets/models/polypizza/Rocks.glb'                        },
  pp_town_sign:       { path: '/assets/models/polypizza/Town Sign.glb'                    },
  pp_well:            { path: '/assets/models/polypizza/Well.glb'                         },
  pp_gate:            { path: '/assets/models/polypizza/Gate.glb'                         },
  pp_birch_trees:     { path: '/assets/models/polypizza/Birch Trees.glb'                  },
  pp_maple_trees:     { path: '/assets/models/polypizza/Maple Trees.glb'                  },
  pp_market_scene:    { path: '/assets/models/polypizza/Market Scene.glb'                 },
  pp_market_stalls:   { path: '/assets/models/polypizza/Market Stalls Compact.glb'        },
  pp_rock_bridge:     { path: '/assets/models/polypizza/Rock bridge and environment.glb'  },
  pp_torii_gate:      { path: '/assets/models/polypizza/Torii Gate.glb'                   },
  pp_rope_bridge:     { path: '/assets/models/polypizza/rope bridge.glb'                  },

  // ── Kenney Fantasy Town (selected useful pieces) ─
  kft_cart:              { path: '/assets/models/kenney-fantasy-town/cart.glb'                    },
  kft_cart_high:         { path: '/assets/models/kenney-fantasy-town/cart-high.glb'               },
  kft_fence:             { path: '/assets/models/kenney-fantasy-town/fence.glb'                   },
  kft_fence_curved:      { path: '/assets/models/kenney-fantasy-town/fence-curved.glb'            },
  kft_fence_gate:        { path: '/assets/models/kenney-fantasy-town/fence-gate.glb'              },
  kft_fence_broken:      { path: '/assets/models/kenney-fantasy-town/fence-broken.glb'            },
  kft_hedge:             { path: '/assets/models/kenney-fantasy-town/hedge.glb'                   },
  kft_hedge_curved:      { path: '/assets/models/kenney-fantasy-town/hedge-curved.glb'            },
  kft_hedge_large:       { path: '/assets/models/kenney-fantasy-town/hedge-large.glb'             },
  kft_hedge_large_curved:{ path: '/assets/models/kenney-fantasy-town/hedge-large-curved.glb'      },
  kft_hedge_gate:        { path: '/assets/models/kenney-fantasy-town/hedge-gate.glb'              },
  kft_watermill:         { path: '/assets/models/kenney-fantasy-town/watermill.glb'               },
  kft_rock_small:        { path: '/assets/models/kenney-fantasy-town/rock-small.glb'              },
  kft_lantern:           { path: '/assets/models/kenney-fantasy-town/lantern.glb'                 },
  kft_fountain_round:    { path: '/assets/models/kenney-fantasy-town/fountain-round.glb'          },
  kft_fountain_detail:   { path: '/assets/models/kenney-fantasy-town/fountain-round-detail.glb'   },
  kft_fountain_center:   { path: '/assets/models/kenney-fantasy-town/fountain-center.glb'         },

  // ── Kenney Nature — Cliff System (warm rock variant) ────────────
  // Modular cliff terrain tiles. Use kn_cliff_block as the main face,
  // kn_cliff_top as the grass-capped summit, kn_cliff_large for wide sections.
  kn_cliff_block:        { path: '/assets/models/kenney-nature/cliff_block_rock.glb'           },
  kn_cliff_large:        { path: '/assets/models/kenney-nature/cliff_large_rock.glb'           },
  kn_cliff_top:          { path: '/assets/models/kenney-nature/cliff_top_rock.glb'             },
  kn_cliff_half:         { path: '/assets/models/kenney-nature/cliff_half_rock.glb'            },
  kn_cliff_diagonal:     { path: '/assets/models/kenney-nature/cliff_diagonal_rock.glb'        },
  kn_cliff_corner:       { path: '/assets/models/kenney-nature/cliff_corner_rock.glb'          },
  kn_cliff_corner_top:   { path: '/assets/models/kenney-nature/cliff_cornerTop_rock.glb'       },
  kn_cliff_slope:        { path: '/assets/models/kenney-nature/cliff_blockSlope_rock.glb'      },

  // ── Kenney Nature — Rocks (large boulders + tall stones) ─────────
  kn_rock_large_a:       { path: '/assets/models/kenney-nature/rock_largeA.glb'               },
  kn_rock_large_b:       { path: '/assets/models/kenney-nature/rock_largeB.glb'               },
  kn_rock_large_c:       { path: '/assets/models/kenney-nature/rock_largeC.glb'               },
  kn_rock_large_d:       { path: '/assets/models/kenney-nature/rock_largeD.glb'               },
  kn_rock_large_e:       { path: '/assets/models/kenney-nature/rock_largeE.glb'               },
  kn_rock_large_f:       { path: '/assets/models/kenney-nature/rock_largeF.glb'               },
  kn_rock_tall_a:        { path: '/assets/models/kenney-nature/rock_tallA.glb'                },
  kn_rock_tall_b:        { path: '/assets/models/kenney-nature/rock_tallB.glb'                },
  kn_rock_tall_c:        { path: '/assets/models/kenney-nature/rock_tallC.glb'                },
  kn_rock_tall_d:        { path: '/assets/models/kenney-nature/rock_tallD.glb'                },

  // ── KayKit Hexagon — Mountains & Hills (GLTF+BIN, CC0) ───────────
  // Stylized low-poly mountain shapes. _grass_trees variants are warmest.
  // Use as primary mountain backdrop and valley-side landforms.
  kk_mountain_a:         { path: '/assets/models/kaykit-hexagon/decoration/nature/mountain_A.gltf'                },
  kk_mountain_b:         { path: '/assets/models/kaykit-hexagon/decoration/nature/mountain_B.gltf'                },
  kk_mountain_c:         { path: '/assets/models/kaykit-hexagon/decoration/nature/mountain_C.gltf'                },
  kk_mountain_a_trees:   { path: '/assets/models/kaykit-hexagon/decoration/nature/mountain_A_grass_trees.gltf'    },
  kk_mountain_b_grass:   { path: '/assets/models/kaykit-hexagon/decoration/nature/mountain_B_grass.gltf'          },
  kk_mountain_c_trees:   { path: '/assets/models/kaykit-hexagon/decoration/nature/mountain_C_grass_trees.gltf'    },
  kk_hill_a:             { path: '/assets/models/kaykit-hexagon/decoration/nature/hill_single_A.gltf'             },
  kk_hill_b:             { path: '/assets/models/kaykit-hexagon/decoration/nature/hill_single_B.gltf'             },
  kk_hill_c:             { path: '/assets/models/kaykit-hexagon/decoration/nature/hill_single_C.gltf'             },
  kk_rock_a:             { path: '/assets/models/kaykit-hexagon/decoration/nature/rock_single_A.gltf'             },
  kk_rock_b:             { path: '/assets/models/kaykit-hexagon/decoration/nature/rock_single_B.gltf'             },
  kk_rock_c:             { path: '/assets/models/kaykit-hexagon/decoration/nature/rock_single_C.gltf'             },

  // ── Kenney Nature (trees, fences, garden props) ──
  kn_tree_oak:           { path: '/assets/models/kenney-nature/tree_oak.glb'              },
  kn_tree_detailed:      { path: '/assets/models/kenney-nature/tree_detailed.glb'         },
  kn_tree_fat:           { path: '/assets/models/kenney-nature/tree_fat.glb'              },
  kn_tree_tall:          { path: '/assets/models/kenney-nature/tree_tall.glb'             },
  kn_tree_default:       { path: '/assets/models/kenney-nature/tree_default.glb'          },
  kn_tree_thin:          { path: '/assets/models/kenney-nature/tree_thin.glb'             },
  kn_tree_pineRoundA:    { path: '/assets/models/kenney-nature/tree_pineRoundA.glb'       },
  kn_tree_pineRoundB:    { path: '/assets/models/kenney-nature/tree_pineRoundB.glb'       },
  kn_tree_pineTallA:     { path: '/assets/models/kenney-nature/tree_pineTallA.glb'        },
  kn_tree_cone:          { path: '/assets/models/kenney-nature/tree_cone.glb'             },
  kn_fence_planks:       { path: '/assets/models/kenney-nature/fence_planks.glb'          },
  kn_fence_planks2:      { path: '/assets/models/kenney-nature/fence_planksDouble.glb'    },
  kn_fence_gate:         { path: '/assets/models/kenney-nature/fence_gate.glb'            },
  kn_fence_simple:       { path: '/assets/models/kenney-nature/fence_simple.glb'          },
  kn_plant_bush:         { path: '/assets/models/kenney-nature/plant_bush.glb'            },
  kn_plant_bush_detail:  { path: '/assets/models/kenney-nature/plant_bushDetailed.glb'    },
  kn_plant_bush_large:   { path: '/assets/models/kenney-nature/plant_bushLarge.glb'       },
  kn_plant_bush_small:   { path: '/assets/models/kenney-nature/plant_bushSmall.glb'       },
  kn_flower_red:         { path: '/assets/models/kenney-nature/flower_redA.glb'           },
  kn_flower_yellow:      { path: '/assets/models/kenney-nature/flower_yellowA.glb'        },
  kn_flower_purple:      { path: '/assets/models/kenney-nature/flower_purpleA.glb'        },
  kn_pot_large:          { path: '/assets/models/kenney-nature/pot_large.glb'             },
  kn_pot_small:          { path: '/assets/models/kenney-nature/pot_small.glb'             },
  kn_log_stack:          { path: '/assets/models/kenney-nature/log_stack.glb'             },

  // ── Poly Haven 3D Models (GLTF with embedded textures) ──
  ph_lantern:         { path: '/assets/models/polyhaven/Lantern_01_4k/Lantern_01_4k.gltf'                       },
  ph_fir_tree:        { path: '/assets/models/polyhaven/fir_tree_01_4k/fir_tree_01_4k.gltf'                     },
  ph_pine_tree:       { path: '/assets/models/polyhaven/pine_tree_01_4k/pine_tree_01_4k.gltf'                   },
  ph_jacaranda:       { path: '/assets/models/polyhaven/jacaranda_tree_4k/jacaranda_tree_4k.gltf'               },
  ph_island_tree_1:   { path: '/assets/models/polyhaven/island_tree_01_4k/island_tree_01_4k.gltf'               },
  ph_island_tree_2:   { path: '/assets/models/polyhaven/island_tree_02_4k/island_tree_02_4k.gltf'               },
  ph_fir_sapling:     { path: '/assets/models/polyhaven/fir_sapling_4k/fir_sapling_4k.gltf'                     },
  ph_fir_sapling_med: { path: '/assets/models/polyhaven/fir_sapling_medium_4k/fir_sapling_medium_4k.gltf'       },
  ph_rock_07:         { path: '/assets/models/polyhaven/rock_07_4k/rock_07_4k.gltf'                             },
  ph_rock_09:         { path: '/assets/models/polyhaven/rock_09_4k/rock_09_4k.gltf'                             },
  ph_dead_tree:       { path: '/assets/models/polyhaven/dead_tree_trunk_4k/dead_tree_trunk_4k.gltf'             },
  ph_tree_stump:      { path: '/assets/models/polyhaven/tree_stump_01_4k/tree_stump_01_4k.gltf'                 },
  ph_wooden_table:    { path: '/assets/models/polyhaven/WoodenTable_01_4k/WoodenTable_01_4k.gltf'               },
  ph_rocking_chair:   { path: '/assets/models/polyhaven/Rockingchair_01_4k/Rockingchair_01_4k.gltf'             },
  ph_wooden_chair:    { path: '/assets/models/polyhaven/WoodenChair_01_4k/WoodenChair_01_4k.gltf'               },
  ph_anthurium:       { path: '/assets/models/polyhaven/anthurium_botany_01_4k/anthurium_botany_01_4k.gltf'     },

  // ── Forest Trees — optimized 1K builds (Draco-compressed GLB) ───────────
  // Source: public/assets/forest/forest/1K GLTF originals
  // Pipeline: weld → simplify (4%) → dedup → prune → reorder → Draco GLB
  // Original sizes: fir 465 MB, jacaranda 206 MB  →  after: fir 12 MB, jacaranda 8 MB
  // Decoder:  /draco/  (Three.js DRACOLoader, configured in src/utils/loaders.js)
  // Pine excluded — original .bin is 921 MB, too large even after optimization.
  forest_fir:       { path: '/assets/forest/forest/optimized/fir_1k_draco.glb'       },
  forest_jacaranda: { path: '/assets/forest/forest/optimized/jacaranda_1k_draco.glb' },
}

// =====================================================
// CONTEXT HELPERS
// =====================================================

export function addToVillage(ctx, object) {
  ctx.villageGroup.add(object)
  return object
}

export function setActiveSpawnContext(ctx) {
  activeSpawnCtx = ctx
}

export function clearActiveSpawnContext() {
  activeSpawnCtx = null
}

export function rand(min, max) {
  return min + Math.random() * (max - min)
}

// =====================================================
// MODEL LOADER (with caching)
// =====================================================

export function loadModel(ctx, path, position, scale = 1, rotationY = 0) {
  const holder = new THREE.Group()
  holder.position.set(position[0], position[1], position[2])
  holder.scale.setScalar(scale)
  holder.rotation.y = rotationY
  addToVillage(ctx, holder)

  const cached = modelCache.get(path)

  if (cached?.template) {
    holder.add(cached.template.clone(true))
    return holder
  }

  if (cached) {
    cached.waiting.push(holder)
    return holder
  }

  const entry = { template: null, waiting: [holder] }
  modelCache.set(path, entry)

  const basePath = path.substring(0, path.lastIndexOf('/') + 1)

  loadGLBModel(ctx.scene, path, [0, 0, 0], 1, 0, {
    path:        basePath,
    addToScene:  false,
    center:      false,
    groundAlign: true,
    onLoad: (model) => {
      model.traverse((child) => {
        if (child.isMesh) {
          // castShadow=false by default — sun.castShadow is disabled scene-wide.
          // Three.js still tracks shadow-casting meshes per-light; with ~100
          // placed assets each having 2–5 sub-meshes, that's 200–500 entries
          // maintained every frame for zero visual benefit. Flip back on if
          // shadows are re-enabled in environment.js.
          child.castShadow    = false
          child.receiveShadow = true
        }
      })
      entry.template = model
      entry.waiting.forEach((h) => h.add(model.clone(true)))
      entry.waiting.length = 0
    }
  })

  return holder
}

// =====================================================
// CONVENIENCE: place a single named asset
// =====================================================

export function placeAsset(ctx, assetKey, x, y, z, scale = 1, rotationY = 0) {
  const asset = ASSETS[assetKey]
  if (!asset) {
    console.warn(`placeAsset: unknown asset key "${assetKey}"`)
    return null
  }
  return loadModel(ctx, asset.path, [x, y, z], scale, rotationY)
}
