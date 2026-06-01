// ═══════════════════════════════════════════════════════════════════════════
//  CLOCK — real-time delta provider for frame-rate-independent updates
// ═══════════════════════════════════════════════════════════════════════════
//
//  Why this matters:
//    Movement that does `position += speed * delta` only stays consistent
//    when `delta` is the ACTUAL elapsed seconds between frames.
//    Previous version returned a fake constant time — when FPS dropped, the
//    player appeared to move slower because each frame only moved a fixed
//    amount × (fewer frames per second) = less distance per second.
//
//  API:
//    tick() → returns elapsed-since-last-tick in SECONDS (capped to 0.1s
//             so tab-switches / breakpoints don't teleport the player).
//    time   → running total of elapsed time in seconds (for animations).
//    delta  → last computed delta in seconds (also returned by tick()).
//
//  Cap rationale:
//    0.1s = 10 FPS floor. Below this we clamp so a paused tab returning
//    after several seconds doesn't blast the player across the map in one
//    frame (and physics integrators don't explode).
// ═══════════════════════════════════════════════════════════════════════════

const MAX_DELTA = 0.1   // 100ms — equivalent to 10 FPS minimum

export function createClock() {
  return {
    time:   0,
    delta:  0,
    _last:  performance.now(),

    /**
     * Advance the clock. Returns delta in SECONDS since the last tick.
     * Call exactly once per frame from the main animate loop.
     */
    tick() {
      const now = performance.now()
      let dt = (now - this._last) / 1000   // ms → seconds
      this._last = now

      if (dt > MAX_DELTA) dt = MAX_DELTA   // tab-switch protection
      if (dt < 0)         dt = 0           // clock skew guard

      this.delta = dt
      this.time += dt
      return dt
    }
  }
}
