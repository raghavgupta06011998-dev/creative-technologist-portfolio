import { placeAsset } from '../utils/assetLoader.js'

// ── Layout constants ──────────────────────────────────────────────────────────
// LAMP_X = offset from road centre.  Road is 14 wide (edges at ±7).
// At LAMP_X=9 each lamp stands just outside the road edge, in the grass verge.
const LAMP_X = 9

// ── Lamp pair Z positions ─────────────────────────────────────────────────────
// One pair per house pair + one flanking the well plaza.
// Values match the HOUSE_Z_1–4 constants in streetHouses.js so each pair
// of lamps stands beside its house pair.
// Change any Z here to shift a lamp pair independently.
const LAMP_PAIRS = [
   -8,   // beside house pair 1
  -26,   // beside house pair 2
  -44,   // beside house pair 3
  -62,   // beside house pair 4
  -107,  // flanking the well plaza
]

// ── Main export ───────────────────────────────────────────────────────────────
export function createStreetLamps(ctx) {
  for (const z of LAMP_PAIRS) {
    placeAsset(ctx, 'kft_lantern', -LAMP_X, 0, z, 1.0)
    placeAsset(ctx, 'kft_lantern', +LAMP_X, 0, z, 1.0)
  }
}
