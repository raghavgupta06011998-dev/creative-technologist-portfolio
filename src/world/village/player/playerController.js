import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { updateCamera } from './cameraController.js'
import { resolveCollisions, buildCollisionHelpers } from './collision.js'

const loader = new GLTFLoader()

function loadPlayer() {
  return new Promise((resolve, reject) => {
    loader.load(
      '/assets/characters/kaykit-adventurers/Knight.glb',
      (gltf) => {
        const model = gltf.scene
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow    = true
            child.receiveShadow = true
          }
        })
        resolve({ model, animations: gltf.animations })
      },
      undefined,
      reject
    )
  })
}

export async function setupPlayer(ctx) {
  if (ctx.character) {
    ctx.scene.remove(ctx.character)
    ctx.character = null
  }

  const { model, animations } = await loadPlayer()

  // fit to ground
  const box    = new THREE.Box3().setFromObject(model)
  const offset = -box.min.y

  model.scale.setScalar(0.72)   // human-scale vs village buildings
  model.position.set(0, offset + 0.08, 10)
  model.rotation.y = Math.PI

  ctx.character       = model
  ctx.characterOffset = offset + 0.08
  ctx.car             = null
  ctx.cameraYaw       = 0
  ctx.cameraPitch     = 0.32   // match PITCH_START in cameraController.js

  ctx.scene.add(model)

  // ── collision debug helpers ───────────────────────
  //   Hidden by default.  Press Alt + C to toggle.
  //   Or from browser console: window.__showCollision(true/false)
  const collisionHelpers = buildCollisionHelpers()
  collisionHelpers.forEach(h => ctx.scene.add(h))
  let collisionVisible = false
  window.__showCollision = (v) => {
    collisionVisible = v
    collisionHelpers.forEach(h => h.visible = collisionVisible)
  }

  // ── animation mixer ──────────────────────────────
  let mixer   = null
  let idleAct = null
  let walkAct = null
  let runAct  = null

  if (animations && animations.length > 0) {
    mixer = new THREE.AnimationMixer(model)

    const find = (...names) =>
      animations.find((a) => names.some((n) => a.name.toLowerCase().includes(n)))

    const idleClip = find('idle', 'stand')
    const walkClip = find('walk')
    const runClip  = find('run', 'sprint', 'jog')

    if (idleClip) idleAct = mixer.clipAction(idleClip)
    if (walkClip) walkAct = mixer.clipAction(walkClip)
    if (runClip)  runAct  = mixer.clipAction(runClip)

    if (idleAct) idleAct.play()
  }

  function crossFadeTo(next, duration = 0.2) {
    if (!next || next.isRunning()) return
    ;[idleAct, walkAct, runAct].forEach((a) => {
      if (a && a !== next) a.fadeOut(duration)
    })
    next.reset().fadeIn(duration).play()
  }

  // ── input ────────────────────────────────────────
  const keys = {}
  let velocityY  = 0
  let isOnGround = true

  const GRAVITY    = 14
  const JUMP_FORCE = 6.5

  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase()
    keys[k] = true
    if (e.key === 'ArrowUp')    keys['w'] = true
    if (e.key === 'ArrowDown')  keys['s'] = true
    if (e.key === 'ArrowLeft')  keys['a'] = true
    if (e.key === 'ArrowRight') keys['d'] = true
    if (k === ' ' && isOnGround) {
      velocityY  = JUMP_FORCE
      isOnGround = false
    }
    // Alt + C → toggle collision debug wireframes
    if (k === 'c' && e.altKey) {
      collisionVisible = !collisionVisible
      collisionHelpers.forEach(h => h.visible = collisionVisible)
    }
  })

  document.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase()
    keys[k] = false
    if (e.key === 'ArrowUp')    keys['w'] = false
    if (e.key === 'ArrowDown')  keys['s'] = false
    if (e.key === 'ArrowLeft')  keys['a'] = false
    if (e.key === 'ArrowRight') keys['d'] = false
  })

  // ── update loop ──────────────────────────────────
  ctx.updatePlayer = (delta) => {
    delta = Math.min(delta, 0.05)
    if (!ctx.character) return

    if (mixer) mixer.update(delta)

    const isSprinting = !!keys['shift']
    const speed       = isSprinting ? 11 : 5.5

    const move = new THREE.Vector3()
    if (keys['w']) move.z -= 1
    if (keys['s']) move.z += 1
    if (keys['a']) move.x -= 1
    if (keys['d']) move.x += 1

    const isMoving = move.lengthSq() > 0

    if (isMoving) {
      move.normalize()
      const yaw = ctx.cameraYaw ?? 0

      // Camera-relative movement.
      // Camera orbits at (sin(yaw), _, cos(yaw)) * DIST from player.
      //   Camera forward (XZ projected) = (-sin(yaw), 0, -cos(yaw))
      //   Camera right   (XZ projected) = ( cos(yaw), 0, -sin(yaw))
      // W = move.z=-1 → move in camera forward direction.
      // D = move.x=+1 → move in camera right direction.
      const rx =  move.x * Math.cos(yaw) + move.z * Math.sin(yaw)
      const rz = -move.x * Math.sin(yaw) + move.z * Math.cos(yaw)

      ctx.character.position.x += rx * speed * delta
      ctx.character.position.z += rz * speed * delta

      // Push player out of any overlapping collision zone
      resolveCollisions(ctx.character.position)

      // Normalise rotation difference → no more spinning the long way round
      const targetAngle = Math.atan2(rx, rz)
      let   diff        = targetAngle - ctx.character.rotation.y
      while (diff >  Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      ctx.character.rotation.y += diff * Math.min(1, 12 * delta)

      if (mixer) crossFadeTo(isSprinting ? runAct : walkAct)
    } else {
      if (mixer) crossFadeTo(idleAct)
    }

    updateCamera(ctx)
    applyGravity(ctx, delta, GRAVITY, {
      velocityY,
      isOnGround,
      setVelocityY: (v) => { velocityY  = v },
      setOnGround:  (v) => { isOnGround = v }
    })
  }
}

function applyGravity(ctx, delta, gravity, state) {
  if (!ctx.character || !ctx.groundMesh) return

  const ray    = new THREE.Raycaster()
  const origin = ctx.character.position.clone()
  origin.y += 5
  ray.set(origin, new THREE.Vector3(0, -1, 0))

  const hits = ray.intersectObjects(ctx.groundObjects ?? [ctx.groundMesh], true)
  if (!hits.length) return

  const targetY = hits[0].point.y + (ctx.characterOffset || 0.08)

  let vy = state.velocityY
  vy -= gravity * delta
  ctx.character.position.y += vy * delta

  if (ctx.character.position.y <= targetY) {
    ctx.character.position.y = targetY
    vy = 0
    state.setOnGround(true)
  } else {
    state.setOnGround(false)
  }

  state.setVelocityY(vy)
}
