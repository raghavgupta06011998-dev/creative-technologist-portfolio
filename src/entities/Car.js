import * as THREE from 'three'
import { loadGLBModel } from '../utils/loaders.js'
import { addHotspot } from '../systems/interaction.js'

export function addVillageCar(ctx) {
  const carModel = loadGLBModel(
    ctx.scene,
    '/assets/models/car/car_01.glb',
    [5, 0, 5],
    4,
    0,
    {
      addToScene: false,
      onLoad: (model, gltf, holder) => {
        ctx.villageGroup.add(holder)
        console.log('Car loaded:', model)

        const boxHelper = new THREE.BoxHelper(holder, 0xff0000)
        ctx.scene.add(boxHelper)

        ctx.car = holder
        ctx.rockColliders.push({ mesh: holder, radius: 2 })

        addHotspot(
          ctx,
          [5, 0.1, 5],
          0x8ad7ff,
          'Car',
          'Press E to drive. Press E again to exit.',
          'car'
        )
      }
    }
  )

  return carModel
}
