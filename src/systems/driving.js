import * as THREE from 'three'
import { showInteractionPanel } from './interaction.js'

export function toggleDrivingMode(ctx) {
  if (!ctx.car || !ctx.villagePlayer) return

  ctx.drivingMode = !ctx.drivingMode

  if (ctx.drivingMode) {
    ctx.villagePlayer.visible = true
    ctx.villagePlayer.position.set(0, 0.6, 0)
    ctx.car.add(ctx.villagePlayer)
    ctx.activeCharacter = ctx.car

    showInteractionPanel(ctx, {
      title: 'Driving Mode',
      body: 'Now driving 🚗 Use WASD to move. Press E to exit.'
    })
  } else {
    ctx.car.remove(ctx.villagePlayer)
    ctx.villagePlayer.visible = true

    const exitOffset = new THREE.Vector3(-2, 0, 1.5)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), ctx.car.rotation.y)

    ctx.villagePlayer.position.copy(ctx.car.position).add(exitOffset)
    ctx.activeCharacter = ctx.villagePlayer

    showInteractionPanel(ctx, {
      title: 'Walking Mode',
      body: 'You exited the car. Explore on foot.'
    })
  }
}

export function updateDrivingMovement(ctx, controlledObject) {
  let acceleration = 0

  if (ctx.keys.ArrowUp || ctx.keys.w) acceleration = 0.12
  if (ctx.keys.ArrowDown || ctx.keys.s) acceleration = -0.08

  if (ctx.keys.ArrowLeft || ctx.keys.a) controlledObject.rotation.y += 0.03
  if (ctx.keys.ArrowRight || ctx.keys.d) controlledObject.rotation.y -= 0.03

  const forward = new THREE.Vector3(
    Math.sin(controlledObject.rotation.y),
    0,
    Math.cos(controlledObject.rotation.y)
  )

  controlledObject.position.addScaledVector(forward, acceleration)
}
