import { placeAsset } from '../utils/assetLoader.js'

// ── Performance note ──────────────────────────────────────────────────────────
// Removed from scene:
//   - shrub_holly     (HollyShrub.glb = 6.6 MB)
//   - shrub_dec       (DeciduousShrub.glb = 9.0 MB)
//   - ph_fir_sapling_med (119 MB of 4K textures)
// Using only green_01/02 plants (lightweight, self-contained).

const HERO_Z        = -165
const FENCE_HALF    =  18
const FENCE_FRONT_Z = HERO_Z - 20

// ── Main export ───────────────────────────────────────────────────────────────
export function createGardenPlants(ctx) {
  // 4 corner plants inside the garden fence
  placeAsset(ctx, 'green_03', -10, 0, HERO_Z - 10, 0.9,  0.3)
  placeAsset(ctx, 'green_03',  10, 0, HERO_Z - 10, 0.9, -0.3)
  placeAsset(ctx, 'green_05', -10, 0, HERO_Z + 10, 0.85,  0.6)
  placeAsset(ctx, 'green_05',  10, 0, HERO_Z + 10, 0.85, -0.6)
}
