export function disposeObject(object) {
  object.traverse((child) => {
    if (!child.isMesh && !child.isPoints) return

    child.geometry?.dispose()
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.forEach((material) => material?.dispose())
  })
}

export function clearSceneForNextLevel(ctx) {
  const keepPlayer = ctx.player && ctx.scene.children.includes(ctx.player)
  if (keepPlayer) ctx.scene.remove(ctx.player)

  for (let i = ctx.scene.children.length - 1; i >= 0; i--) {
    const child = ctx.scene.children[i]
    ctx.scene.remove(child)
    disposeObject(child)
  }

  if (ctx.player) ctx.scene.add(ctx.player)

  ctx.earthGroup = null
  ctx.cloudMesh = null
  ctx.portalMat = null
  ctx.gateLight = null
  ctx.rockColliders = []
  ctx.villageHotspots.length = 0
  ctx.waterMeshes.length = 0
}
