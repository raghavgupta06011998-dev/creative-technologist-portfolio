import * as THREE from 'three'
import { placeAsset } from '../utils/assetLoader.js'
import { createEntranceSign, createExitArch } from './skillPlaque.js'
import { createSkillPillars } from './skillPillars.js'   // Hybrid 5 Pillar Monument system (Phase 1: Pillar 1 only)

// ═══════════════════════════════════════════════════════════════════════════
//  SKILLS FOREST — Tool / Brand Logo Trail
// ═══════════════════════════════════════════════════════════════════════════
//
//  The earlier rocks-and-boards / glowing emblems system is REMOVED.
//  The forest now hosts a clean alternating L/R logo trail:
//
//    Entrance sign at z = -178                    (just past the bridge)
//    Figma       z = -200  LEFT
//    Photoshop   z = -223  RIGHT
//    Illustrator z = -246  LEFT
//    Framer      z = -269  RIGHT
//    Blender     z = -292  LEFT
//    Three.js    z = -315  RIGHT
//    ChatGPT     z = -338  LEFT
//    Claude      z = -361  RIGHT
//    Campfire    z = -360  (deeper, x = -28)  — atmospheric centrepiece
//    Exit arch   z = -375  ("Career Mountains Ahead")
//
//  Station placement + visuals live in ./logoStations.js so this file
//  stays focused on the forest's narrative scaffolding (entrance, exit,
//  campfire). Triggers (proximity overlay) live in skillTriggers.js.
//
//  Forest, road, fence, gravel shoulders, terrain, bridge — all
//  unchanged.
// ═══════════════════════════════════════════════════════════════════════════


// ── Atmospheric anchors (kept) ───────────────────────────────────────────
const ENTRANCE_POS = { x: -15, z: -178, rotY: -1.40 }
const EXIT_POS     = { x:   0, z: -375 }
const CAMPFIRE_POS = { x: -28, z: -360 }
const ZONE4_LOGS = [
  { x: -25, z: -358, r: 1.0 },
  { x: -25, z: -362, r: 2.1 },
  { x: -31, z: -362, r: 4.1 },
  { x: -31, z: -358, r: 5.2 },
]


// Helper: register a PointLight with the day/night toggle so it dims by
// day and burns brighter by night. Defers registration if the toggle
// system hasn't initialised yet.
function registerNightLight(ctx, light) {
  if (ctx.dayNight && typeof ctx.dayNight.registerLight === 'function') {
    ctx.dayNight.registerLight(light)
  } else {
    ctx._pendingLights = ctx._pendingLights || []
    ctx._pendingLights.push(light)
  }
}


// ═══════════════════════════════════════════════════════════════════════════
export function createSkillsForest(ctx) {
  // ── ENTRANCE ────────────────────────────────────────────────────────
  ctx.villageGroup.add(createEntranceSign({
    x:    ENTRANCE_POS.x,
    z:    ENTRANCE_POS.z,
    rotY: ENTRANCE_POS.rotY,
    title:     'Skills Forest',
    italicSub: 'Tools of the craft',
  }))
  placeAsset(ctx, 'pp_post_lantern', -13, 0, -178, 1.4, 0)
  const lampE = new THREE.PointLight(0xffa050, 1.6, 14)
  lampE.position.set(-13, 2.6, -178)
  ctx.scene.add(lampE)
  registerNightLight(ctx, lampE)

  // ── SKILL PILLARS — Hybrid 5 Pillar Monument system ─────────────────
  //   Phase 1: only Pillar 1 (Design) is in PILLAR_DATA. To roll out
  //   Phase 2, uncomment the remaining 4 entries in skillPillars.js.
  createSkillPillars(ctx)

  // ── CAMPFIRE (atmospheric centrepiece, off the road on the LEFT) ─────
  placeAsset(ctx, 'bonfire', CAMPFIRE_POS.x, 0, CAMPFIRE_POS.z, 1.4, 0)
  for (const l of ZONE4_LOGS) {
    placeAsset(ctx, 'kn_log_stack', l.x, 0, l.z, 1.1, l.r)
  }
  const fireLight = new THREE.PointLight(0xff6a30, 2.6, 16)
  fireLight.position.set(CAMPFIRE_POS.x, 1.4, CAMPFIRE_POS.z)
  ctx.scene.add(fireLight)
  registerNightLight(ctx, fireLight)

  // ── EXIT ARCH ───────────────────────────────────────────────────────
  ctx.villageGroup.add(createExitArch({
    x:         EXIT_POS.x,
    z:         EXIT_POS.z,
    title:     'Career Mountains Ahead',
    italicSub: 'The climb begins here',
  }))
}
