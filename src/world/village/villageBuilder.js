import * as THREE from 'three'
import { clearSceneForNextLevel } from '../../utils/helpers.js'

// environment + terrain (always needed)
import { setupEnvironment } from './environment/environment.js'
import { createTerrain }             from './terrain/terrain.js'
import { createSkillsForestTerrain } from './terrain/skillsForestTerrain.js'

// roads
import { createRoads }            from './roads/roads.js'
import { createBackStreet }       from './roads/backStreet.js'
import { createBackLanes }        from './roads/backLanes.js'
import { createSkillsForestRoad } from './roads/skillsForestRoad.js'

// ── FOUNDATION PASS: structures, props, signs, lamps are DISABLED ────────────
// Uncomment each block when ready to add that layer back.
// Do NOT delete these imports — they are re-enabled one by one later.
import { createEntrance }            from './structures/entrance.js'
import { createStreetHouses }       from './structures/streetHouses.js'
import { createHeroHouse }           from './structures/heroHouse.js'
// import { createGardenPlants }    from './nature/gardenPlants.js'
// import { createMountain }        from './nature/mountain.js'
// import { createStreetLamps }     from './props/streetLamps.js'
// import { createDecorItems }      from './props/decorItems.js'
// import { createNavigationSigns } from './props/signs.js'

// nature — trees only (foundation pass keeps entrance + backdrop trees)
import { createStreetTrees }       from './nature/streetTrees.js'
import { createSkillsForestTrees } from './nature/skillsForestTrees.js'
import { createSkillsForestFence } from './nature/skillsForestFence.js'
import { createOuterRocks }  from './nature/outerRocks.js'
import { createRiver }       from './nature/river.js'
import { createBridge }      from './nature/bridge.js'
import { createFinalForest } from './nature/finalForest.js'

// skills forest content (zones, plaques, trail, entrance, exit)
import { createSkillsForest }    from './skills/skillsForest.js'
import { registerSkillTriggers } from './skills/skillTriggers.js'

// effects — day/night toggle
import { setupDayNightToggle } from './effects/dayNight.js'

// props — village detail layer
import { createVillageProps } from './props/villageProps.js'
import { createMarketZone }   from './props/marketZone.js'
import { createFarmZone }     from './props/farmZone.js'

// player + camera
import { setupPlayer } from './player/playerController.js'
import { setupCamera } from './player/cameraController.js'

// utils
import { setActiveSpawnContext, clearActiveSpawnContext } from './utils/assetLoader.js'

// =====================================================
// INIT
// =====================================================

export function addVillageWorld(ctx) {
  ctx.activeScene      = 'village'
  ctx.transitioning    = false
  ctx.transitionQueued = false
  ctx.car              = null

  clearSceneForNextLevel(ctx)

  if (ctx.player) {
    ctx.scene.remove(ctx.player)
    ctx.player = null
  }

  // village root group — everything attaches here
  ctx.villageGroup = new THREE.Group()
  ctx.scene.add(ctx.villageGroup)

  // ── environment ─────────────────────────────────
  setupEnvironment(ctx)

  // ── day / night toggle ──────────────────────────
  // Set up early (right after environment lights exist) so subsequent
  // systems (skills forest, logo stations) can register their lights
  // and emissive materials with it directly.
  setupDayNightToggle(ctx)

  // ── terrain ─────────────────────────────────────
  createTerrain(ctx)

  // ── ground raycaster targets (terrain + bridge deck added later) ─────────
  //   bridge.js pushes the bridge group here once it loads, so applyGravity
  //   can walk on the bridge deck as well as the flat terrain plane.
  ctx.groundObjects = [ctx.groundMesh]

  // ── roads ───────────────────────────────────────────────────────────────
  createRoads(ctx)
  createBackStreet(ctx)         // dirt outer path connecting the planned outer zones
  createBackLanes(ctx)          // cobblestone back lanes behind left/right house rows
  createSkillsForestRoad(ctx)   // laterite earth trail leading from bridge into skills forest zone
  createSkillsForestTerrain(ctx)// rocky (left) + coast-sand-rocks (right) strips flanking that road

  // ── nature: trees only ───────────────────────────
  // Structures / props spawn after ctx is populated — keep setActiveSpawnContext
  setActiveSpawnContext(ctx)
  ctx.villageOccupied = []

  // ── nature framing (forest band + cluster groves) ─
  createStreetTrees(ctx)
  createSkillsForestTrees(ctx) // dense modular trees flanking the skills forest road
  createSkillsForestFence(ctx) // wooden plank fence following the road curve
  createSkillsForest(ctx)      // skill zones: entrance, 4 zones, tool trails, exit arch, lights
  createOuterRocks(ctx)      // rough rocky landscape around the village

  // ── structures ───────────────────────────────────
  createEntrance(ctx)        // welcoming arch + sign at spawn
  createHeroHouse(ctx)       // emotional centre of the world
  createStreetHouses(ctx)    // organic side hamlets framing the hero

  // ── props: village detail layer (first pass) ─────
  createVillageProps(ctx)    // streetlights, signs, benches, storage props
  createMarketZone(ctx)      // small front-left market / food corner
  createFarmZone(ctx)        // back-right farm / storage working corner

  // ── river — animated code-only water behind the village ─────────────
  createRiver(ctx)

  // ── bridge — bridge_01 crossing at x=0, z=−148 ───────────────────────
  createBridge(ctx)

  // ── forest — story zone reached by crossing the bridge ──────────────
  createFinalForest(ctx)

  // ── DISABLED: secondary nature ───────────────────
  // createGardenPlants(ctx)
  // createMountain(ctx)

  // ── DISABLED: props / signs / lamps ──────────────
  // createStreetLamps(ctx)
  // createDecorItems(ctx)
  // createNavigationSigns(ctx)

  clearActiveSpawnContext()

  ctx.rockColliders = []

  // ── player + camera ─────────────────────────────
  setupPlayer(ctx)
  setupCamera(ctx)

  // ── proximity overlay updater ────────────────────
  // Pushed AFTER setupPlayer so ctx.character exists; checked each frame
  // by the dynamicUpdaters loop in updateVillageWorld().
  registerSkillTriggers(ctx)
}

// =====================================================
// UPDATE (called every frame)
// =====================================================

export function updateVillageWorld(ctx) {
  if (ctx.updatePlayer) {
    ctx.updatePlayer(ctx.delta || 0.016)
  }

  if (ctx.dynamicUpdaters) {
    const time = performance.now()
    ctx.dynamicUpdaters.forEach((fn) => fn(time))
  }
}
