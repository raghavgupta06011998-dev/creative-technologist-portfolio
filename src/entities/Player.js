import { loadGLBModel } from '../utils/loaders.js'

export function loadPlayer(ctx) {
  return loadGLBModel(
    ctx.scene,
    'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    [0, 0, 2],
    1.2,
    0,
    {
      center: false,
      groundAlign: false,
      onLoad: (model, gltf, holder) => {
        ctx.player = model
        model.position.copy(holder.position)
        model.scale.copy(holder.scale)
        holder.remove(model)
        ctx.scene.remove(holder)

        if (ctx.activeScene === 'village') {
          model.visible = false
        }

        ctx.scene.add(model)
      }
    }
  )
}
