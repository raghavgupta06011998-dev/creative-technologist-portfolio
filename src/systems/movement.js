import * as THREE from 'three'
import { hasCollision } from './collision.js'
import { updateDrivingMovement } from './driving.js'

export function updateMovement(ctx) {
  const controlledObject = ctx.activeScene === 'village'
    ? ctx.activeCharacter
    : ctx.player

  if (!controlledObject) return

  const speed = ctx.drivingMode ? 0.18 : 0.06
  const next = controlledObject.position.clone()

  if (ctx.drivingMode) {
    updateDrivingMovement(ctx, controlledObject)
  } else {
    if (ctx.keys.ArrowUp || ctx.keys.w) next.z -= speed
    if (ctx.keys.ArrowDown || ctx.keys.s) next.z += speed
    if (ctx.keys.ArrowLeft || ctx.keys.a) next.x -= speed
    if (ctx.keys.ArrowRight || ctx.keys.d) next.x += speed

    if (!hasCollision(next, controlledObject, ctx.rockColliders)) {
      controlledObject.position.copy(next)
    }

    if (ctx.keys.ArrowUp || ctx.keys.w) controlledObject.rotation.y = Math.PI
    if (ctx.keys.ArrowDown || ctx.keys.s) controlledObject.rotation.y = 0
    if (ctx.keys.ArrowLeft || ctx.keys.a) controlledObject.rotation.y = -Math.PI / 2
    if (ctx.keys.ArrowRight || ctx.keys.d) controlledObject.rotation.y = Math.PI / 2

    controlledObject.position.y = Math.sin(Date.now() * 0.003) * 0.03
  }

  if (ctx.activeScene === 'mars' && ctx.player) {
    ctx.player.position.y = Math.sin(Date.now() * 0.0018) * 0.08
  }

  updateFollowCamera(ctx, controlledObject)
  updateMarsGateTransition(ctx)
}

function updateFollowCamera(ctx, controlledObject) {
  const camTarget = new THREE.Vector3(
    controlledObject.position.x,
    controlledObject.position.y + (ctx.activeScene === 'village' ? 1.25 : ctx.drivingMode ? 1.15 : 1.8),
    controlledObject.position.z - (ctx.activeScene === 'village' && !ctx.drivingMode ? 1.8 : 0)
  )
  const camPos = ctx.drivingMode
    ? new THREE.Vector3(
        controlledObject.position.x - Math.sin(controlledObject.rotation.y) * 10,
        controlledObject.position.y + 5,
        controlledObject.position.z - Math.cos(controlledObject.rotation.y) * 10
      )
    : ctx.activeScene === 'village'
      ? new THREE.Vector3(
          controlledObject.position.x,
          controlledObject.position.y + 2.5,
          controlledObject.position.z + 6
        )
      : new THREE.Vector3(
          controlledObject.position.x,
          controlledObject.position.y + 4,
          controlledObject.position.z + 9
        )

  ctx.camera.position.lerp(camPos, 0.08)
  ctx.camera.rotation.y += (ctx.look.targetRotationY - ctx.camera.rotation.y) * 0.05
  ctx.camera.rotation.x += (ctx.look.targetRotationX - ctx.camera.rotation.x) * 0.05
  ctx.camera.lookAt(camTarget)
}

function updateMarsGateTransition(ctx) {
  if (ctx.activeScene === 'mars' && ctx.player && !ctx.transitioning) {
    const p = ctx.player.position
    if (p.z < -5.5 && Math.abs(p.x) < 3.4) {
      ctx.transitioning = true
    }
  }

  if (ctx.activeScene === 'mars' && ctx.transitioning && ctx.player) {
    const target = new THREE.Vector3(0, ctx.player.position.y, -14)
    ctx.player.position.lerp(target, 0.08)

    if (ctx.player.position.distanceTo(target) < 0.5) {
      ctx.triggerTransition()
    }
  }
}
