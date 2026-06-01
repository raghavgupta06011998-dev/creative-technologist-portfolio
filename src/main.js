import { createCamera, resizeCamera } from './core/camera.js'
import { createClock } from './core/clock.js'
import { createRenderer, resizeRenderer } from './core/renderer.js'
import { createScene } from './core/scene.js'
import { loadPlayer } from './entities/Player.js'
import { handleInteraction, updateVillageInteractions } from './systems/interaction.js'
import { updateMovement } from './systems/movement.js'
import { setupKeyboardControls, setupMouseLookControls } from './systems/controls.js'
import { toggleDrivingMode } from './systems/driving.js'
import { addOverlayText } from './ui/overlayText.js'
import { createMarsScene, updateMarsScene } from './world/mars/marsScene.js'
import { addVillageWorld, updateVillageWorld } from './world/village/villageBuilder.js'

const scene = createScene()
const renderer = createRenderer()
const camera = createCamera()
const clock = createClock()
const look = setupMouseLookControls()

const ctx = {
  scene,
  renderer,
  camera,
  clock,
  look,
  keys: {},
  activeScene: 'mars',
  currentInteraction: null,
  hasMap: false,
  transitionQueued: false,
  transitioning: false,
  drivingMode: false,
  time: 0,
  player: null,
  villageGroup: null,
  interactionPrompt: null,
  interactionPanel: null,
  villagePlayer: null,
  activeCharacter: null,
  car: null,
  materialsCache: null,
  earthGroup: null,
  cloudMesh: null,
  portalMat: null,
  gateLight: null,
  rockColliders: [],
  villageHotspots: [],
  waterMeshes: []
}

ctx.triggerTransition = () => {
  if (ctx.transitionQueued) return
  ctx.transitionQueued = true
  ctx.transitioning = true

  const fade = document.createElement('div')
  fade.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:white;opacity:0;
    transition:opacity 1.5s ease;z-index:999;pointer-events:none;
  `
  document.body.appendChild(fade)
  setTimeout(() => fade.style.opacity = '1', 50)
  setTimeout(() => {
    addVillageWorld(ctx)
    setTimeout(() => fade.remove(), 300)
  }, 1600)
}

setupKeyboardControls(ctx, () => {
  if (handleInteraction(ctx) === 'car') {
    toggleDrivingMode(ctx)
  }
})

createMarsScene(ctx)
loadPlayer(ctx)

if (window.location.hash !== '#village') addOverlayText()
if (window.location.hash === '#village') {
  setTimeout(() => addVillageWorld(ctx), 500)
}

function animate() {
  requestAnimationFrame(animate)

  // Real-time delta in seconds. clock.tick() now returns elapsed-since-last-frame
  // so downstream systems (player movement, gravity, mixer) stay frame-rate
  // independent. ctx.delta is read by villageBuilder → updatePlayer.
  ctx.delta = clock.tick()
  ctx.time  = clock.time
  updateMovement(ctx)

  if (ctx.activeScene === 'village') {
    updateVillageInteractions(ctx)
    updateVillageWorld(ctx)
  }

  updateMarsScene(ctx)
  renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {
  resizeCamera(camera)
  resizeRenderer(renderer)
})
