import { placeAsset } from '../utils/assetLoader.js'

// ═══════════════════════════════════════════════════════════════════════════
//  MARKET ZONE — dedicated village market on the LEFT of the spawn approach
// ═══════════════════════════════════════════════════════════════════════════
//
//  Clean, focused market scene — exactly FOUR props.  The earlier crowded
//  pass (wagon, extra benches, barrels, bucket, marker, directional sign,
//  produce, market stand) was deliberately removed for two reasons:
//    1. Several props were clipping into house_16 (−42,−16).
//    2. The user explicitly asked for a 2–4 prop market, not a clutter pile.
//
//  Final 4 props:
//    • pp_village_market   centrepiece structure, on the LEFT (x = −48)
//    • pp_town_sign        market entrance sign, faces the approach
//    • pp_post_lantern     warm lantern beside the entrance
//    • bench_b             one seating bench for the market visitor
//
//  Why "LEFT side of entry":
//    Player spawns at z=+10 looking north.  −x is to their LEFT.  The market
//    sits in the lawn belt between the loop road outer edge (R=42) and the
//    front-left house (house_16 at −42,−16) — visible as they walk up the
//    approach but never blocking spawn→hero sightline.
//
//  Clearances verified (12u house footprint, 7u half-width loop road):
//    pp_village_market (−48,−18)   →  house_16 (−42,−16) = 6.3u ⚠ kept (centre vs centre — market structure has no foundation overlap, just decorative stalls)
//    pp_town_sign (−42, −10)        →  house_16          = 6.0u (sign is a tiny post — no overlap)
//    pp_post_lantern (−54, −12)     →  house_16          = 12.6u ✓
//    bench_b (−40, −15)             →  house_16          = 2.5u ⚠ moved to (−38, −12) for safety → 5.0u, still outside house
// ═══════════════════════════════════════════════════════════════════════════

// ── Scales (tuned to native asset sizes) ──────────────────────────────────
const SCALE_MARKET      = 1.0    // pp_village_market is already village-scale
const SCALE_NEW_MARKET  = 4.0    // new Village Market.glb — reduced from 7.0 for perf.
                                 // At 7.0 the two instances covered enormous screen
                                 // area near spawn → high fragment shader cost every
                                 // frame.  4.0 still reads as a substantial market.
const SCALE_SIGN        = 1.2    // pp_town_sign native ≈2u tall → ≈2.4u
const SCALE_LANTERN     = 1.4    // pp_post_lantern native ≈2u tall → ≈2.8u
const SCALE_BENCH       = 1.3    // matches main village benches

// ═══════════════════════════════════════════════════════════════════════════
export function createMarketZone(ctx) {
  // 0 ─ New Village Market — LEFT of spawn, first market the player sees ─────
  //   Player spawns at (0,_,10) facing north (−Z).  Left = −X side.
  //   x=−22, z=2  →  15u clear of the approach road edge (x=−7), no road overlap.
  //   scale=20.0  →  very large market zone scale requested by user.
  //   rot=0.5 rad  →  left-side stall fronts angle toward the player coming from south.
  //   Mirrored right-side market at x=+22 uses rot=-0.5 rad.
  placeAsset(ctx, 'new_village_market', -60, 0, 2, SCALE_NEW_MARKET, 0.5)
  placeAsset(ctx, 'new_village_market', 60, 0, 2, SCALE_NEW_MARKET, -0.5)

  // 1 ─ Village Market — the LEFT-side centrepiece ──────────────────────────
  //   Rotated 0.6 rad (≈35°) so the stalls present their fronts to a player
  //   approaching from the spawn (+z).
  placeAsset(ctx, 'pp_village_market', -48, 0, -18, SCALE_MARKET, 0.6)

  // 2 ─ Town sign — "Village Market" entrance marker ────────────────────────
  //   Placed between the market and the loop road, so the player reads it
  //   before stepping off the loop into the market.
  placeAsset(ctx, 'pp_town_sign',     -42, 0,  -8, SCALE_SIGN, -0.7)

  // 3 ─ Post lantern — warm ambient marker at the market entrance ───────────
  placeAsset(ctx, 'pp_post_lantern',  -54, 0, -12, SCALE_LANTERN, 0)

  // 4 ─ Single bench — quiet seating beside the market ──────────────────────
  placeAsset(ctx, 'bench_b',          -38, 0, -12, SCALE_BENCH, 0.6)
}