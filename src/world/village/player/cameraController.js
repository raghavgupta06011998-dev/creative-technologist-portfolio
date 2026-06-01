import * as THREE from 'three'

// ── Camera constants ──────────────────────────────────────────────────────────
// Adjust these to tune the feel of the camera without touching logic.
const DISTANCE    = 5.5    // orbital distance from player
const LOOK_H      = 1.4    // look-at height above character feet
const PITCH_MIN   = -0.15  // radians — near-horizontal low limit
const PITCH_MAX   =  1.05  // radians — steep overhead limit
const PITCH_START =  0.32  // initial pitch (slightly above horizontal)
// Frame-rate-independent smoothing rate (units: 1/second).
// We use factor = 1 - exp(-SMOOTH_RATE * dt) per frame, which converges
// exponentially toward the target regardless of FPS.
//   SMOOTH_RATE = 8 → at 60fps gives ≈0.125 per-frame factor (matches the
//   old hardcoded 0.12 feel); at 30fps gives ≈0.234 — the camera "catches
//   up" twice as much per frame so total catch-up per SECOND is constant.
// Without this fix the camera felt jerky when FPS dipped because lerp speed
// was tied to frame count instead of elapsed time.
const SMOOTH_RATE =  8
const MOUSE_SENS  =  0.002 // mouse sensitivity

// ── Setup (called once on load) ───────────────────────────────────────────────
export function setupCamera(ctx) {
  ctx.cameraYaw   = 0
  ctx.cameraPitch = PITCH_START

  // Pointer lock — click anywhere to capture mouse
  document.body.addEventListener('click', () => {
    document.body.requestPointerLock()
  })

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== document.body) return

    // Right mouse = camera orbits clockwise (standard game convention)
    ctx.cameraYaw   += e.movementX * MOUSE_SENS
    // Down mouse = camera tilts up (standard game convention)
    ctx.cameraPitch += e.movementY * MOUSE_SENS
    ctx.cameraPitch  = Math.max(PITCH_MIN, Math.min(PITCH_MAX, ctx.cameraPitch))
  })
}

// ── Update (called every frame from playerController) ─────────────────────────
export function updateCamera(ctx) {
  if (!ctx.character) return

  const yaw   = ctx.cameraYaw   ?? 0
  const pitch = ctx.cameraPitch ?? PITCH_START

  // Spherical coordinates → cartesian offset from player
  // Camera sits at (sin(yaw), sinPitch, cos(yaw)) * DISTANCE from player.
  // yaw=0 → camera behind player (+z), looking toward -z.
  // Increasing yaw (mouse right) orbits camera clockwise viewed from above.
  const cosP   = Math.cos(pitch)
  const sinP   = Math.sin(pitch)
  const offX   =  Math.sin(yaw) * cosP * DISTANCE
  const offY   =  sinP * DISTANCE + LOOK_H * 0.4   // keep camera above ground
  const offZ   =  Math.cos(yaw) * cosP * DISTANCE

  const pPos   = ctx.character.position
  const target = new THREE.Vector3(pPos.x + offX, pPos.y + offY, pPos.z + offZ)

  // Frame-rate-independent exponential smoothing.
  // Falls back to 0.016 only on the very first frame before ctx.delta is set.
  const dt     = ctx.delta ?? 0.016
  const factor = 1 - Math.exp(-SMOOTH_RATE * dt)

  ctx.camera.position.lerp(target, factor)
  ctx.camera.lookAt(pPos.x, pPos.y + LOOK_H, pPos.z)
}
