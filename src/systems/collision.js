export function hasCollision(nextPosition, controlledObject, colliders) {
  for (const collider of colliders) {
    if (collider.mesh === controlledObject) continue
    if (nextPosition.distanceTo(collider.mesh.position) < collider.radius + 0.55) {
      return true
    }
  }

  return false
}
