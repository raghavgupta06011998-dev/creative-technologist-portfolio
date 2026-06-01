import * as THREE from 'three'
import { placeAsset } from '../utils/assetLoader.js'

// ── Layout constants ─────────────────────────────────────────────────────────
const PLAZA_Z   = -105   // circular plaza centre (matches roads.js)
const PORTAL_X  =  42    // Projects portal — right-front side
const PORTAL_Z  = -30    // Z position of Projects portal

// ── Well plaza dressing ───────────────────────────────────────────────────────
// All positions use `dz` (delta from PLAZA_Z) so shifting PLAZA_Z moves the
// whole plaza.  Keep sparse — the space should breathe.
const PLAZA_PROPS = [
  // Benches — 4 sides of the fountain, facing inward
  { key: 'bench_c',          x:  -8,  dz: +4,   s: 1.0,   ry:  Math.PI / 2   },  // left
  { key: 'bench_c',          x:  +8,  dz: +4,   s: 1.0,   ry: -Math.PI / 2   },  // right
  { key: 'bench_d',          x:   0,  dz: +11,  s: 1.0,   ry:  Math.PI       },  // back
  { key: 'bench_d',          x:   0,  dz: -11,  s: 1.0,   ry:  0             },  // road-side

  // Natural accents — rocks
  { key: 'rocks_02',         x: -11,  dz:  -6,  s: 0.75,  ry:  0.4           },
  { key: 'rocks_04',         x: +12,  dz:  +7,  s: 0.70,  ry:  2.1           },

  // Garden bushes beside back benches
  { key: 'kn_plant_bush',    x:  -9,  dz:  +8,  s: 0.90,  ry:  0.3           },
  { key: 'kn_plant_bush',    x:  +9,  dz:  +8,  s: 0.90,  ry: -0.3           },

  // Flower accents near road entry
  { key: 'kn_flower_yellow', x:  -6,  dz:  -9,  s: 0.85,  ry:  0.5           },
  { key: 'kn_flower_purple', x:  +6,  dz:  -9,  s: 0.85,  ry: -0.4           },
]

// ── Warm plaza point light ────────────────────────────────────────────────────
function addPlazaGlow(ctx) {
  const light = new THREE.PointLight(0xffaa44, 2.0, 36)
  light.position.set(0, 4, PLAZA_Z)
  ctx.scene.add(light)
}

// ── Main export ───────────────────────────────────────────────────────────────
export function createDecorItems(ctx) {

  // ── Plaza centrepiece: kenney-fantasy-town fountain ─────────────────────
  // fountain-round is the basin; fountain-round-detail adds the centre spout.
  placeAsset(ctx, 'kft_fountain_round',  0, 0, PLAZA_Z, 1.4, 0)
  placeAsset(ctx, 'kft_fountain_detail', 0, 0, PLAZA_Z, 1.4, 0)

  // ── Plaza dressing — benches, rocks, plants, barrel ──────────────────────
  for (const p of PLAZA_PROPS) {
    placeAsset(ctx, p.key, p.x, 0, PLAZA_Z + p.dz, p.s, p.ry)
  }

  // Warm plaza glow
  addPlazaGlow(ctx)

  // ── Projects portal: Poly Pizza Castle Gate ───────────────────────────────
  // Right-front side — player can see and walk toward it
  placeAsset(ctx, 'pp_castle_gate', PORTAL_X, 0, PORTAL_Z, 1.3, -Math.PI * 0.3)

  // ── Road-edge rocks — natural framing along the path ─────────────────────
  // Entrance pair — visible from spawn, frames the gate
  placeAsset(ctx, 'rocks_03',  -16, 0,   -8, 0.70, 0.4)
  placeAsset(ctx, 'rocks_05',   16, 0,   -8, 0.65, 2.1)
  // Hero approach — one rock to mark the lane narrowing
  placeAsset(ctx, 'rocks_06',  -14, 0, -130, 0.65, 1.8)
}
