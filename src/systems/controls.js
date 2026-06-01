export function setupMouseLookControls() {
  const look = {
    mouseX: 0,
    mouseY: 0,
    targetRotationY: 0,
    targetRotationX: 0
  }

  window.addEventListener('mousemove', (e) => {
    look.mouseX = (e.clientX / window.innerWidth) * 2 - 1
    look.mouseY = (e.clientY / window.innerHeight) * 2 - 1
    look.targetRotationY = look.mouseX * 0.8
    look.targetRotationX = look.mouseY * 0.3
  })

  return look
}

export function setupKeyboardControls(ctx, onInteract) {
  window.addEventListener('keydown', (e) => {
    ctx.keys[e.key] = true

    if (e.key.toLowerCase() === 'e' && ctx.currentInteraction) {
      onInteract()
    }
  })

  window.addEventListener('keyup', (e) => {
    ctx.keys[e.key] = false
  })
}
