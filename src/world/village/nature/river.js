import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════════════════
//  RIVER — code-only animated water, no external assets
// ═══════════════════════════════════════════════════════════════════════════
//
//  Method: custom ShaderMaterial on a hand-built ribbon BufferGeometry.
//
//  Geometry:
//    A CatmullRom spline of 6 control points is sampled at 80 steps.
//    Each step contributes 2 vertices (left + right bank edge), forming
//    a smooth ribbon that follows the curve.  No THREE.TubeGeometry — the
//    ribbon lies flat at Y = WATER_Y.
//
//  Animation (ShaderMaterial):
//    • Vertex shader — gentle sin/cos Y-displacement creates subtle rolling
//      surface movement.
//    • Fragment shader — two UV layers scroll in slightly different
//      directions at different speeds, producing a cross-hatch flow ripple.
//      A Fresnel-ish rim darkens the far and near edges.  Output is
//      alpha-blended (transparent:true).
//
//  Update:
//    The river pushes one function into ctx.dynamicUpdaters[] so the
//    `time` uniform is driven every frame from updateVillageWorld().
//    No modifications to villageBuilder.js update loop are needed beyond
//    the createRiver() call itself.
//
//  Placement:
//    Center z = −148,  x span −90 → +90
//    Midpoint bulges to z = −140  (gentle forward curve matching reference)
//    Leaves ≈48 u of open ground between backstreet (z=−100) and the river
//    for future: market street, farm yard, community square.
//    Bridge crossing placeholder: x=0, z=−148.
//
//  Key constants (easy to tweak):
//    RIVER_Y       water surface height above ground
//    RIVER_WIDTH   river width in world units
//    WAVE_AMP      vertex displacement amplitude
//    WAVE_SPEED    flow animation speed
// ═══════════════════════════════════════════════════════════════════════════

// ── Placement constants ───────────────────────────────────────────────────
//   RIVER_Y  = water surface height above terrain.
//              0.30 keeps the river visibly raised (feels deep, impassable on
//              foot) while keeping the earth banks visible above the water
//              edge — so the player sees solid ground on both sides of the
//              river and the bridge pillars can rest on that ground at y=0.
const RIVER_Y      =  0.30   // water surface — raised but banks stay above water
const BED_Y        = -0.50   // riverbed below terrain — dark murky channel
const RIVER_WIDTH  =  34     // wide river — still a clear obstacle to cross
const BANK_WIDTH   =   9     // muddy earth bank strips on each side
const CURVE_STEPS  =  80     // ribbon subdivision quality

// ── Animation constants ───────────────────────────────────────────────────
const WAVE_AMP     = 0.22    // vertex Y displacement (stronger surface roll)
const WAVE_SPEED   = 2.2     // base animation speed multiplier

// ── River spine control points  [x, z] ────────────────────────────────────
//   6 points describing a gentle west→east S-curve.
//   The mid-section bows toward z=−140 (toward the player) then settles back
//   to z=−148, creating a natural meander visible from spawn camera angle.
const SPINE_POINTS = [
  [-115, -144],   // west entry  — slightly angled
  [ -70, -151],   // west curve  — bows back
  [ -22, -141],   // left-centre — bows forward
  [  22, -155],   // right-centre — bows back
  [  70, -151],   // east curve
  [ 115, -144],   // east exit   — symmetric
]

// ─────────────────────────────────────────────────────────────────────────
//  Build a ribbon BufferGeometry along a CatmullRom spline
// ─────────────────────────────────────────────────────────────────────────
function buildRibbonGeometry(spinePoints2D, width, yOffset, steps) {
  const curve = new THREE.CatmullRomCurve3(
    spinePoints2D.map(([x, z]) => new THREE.Vector3(x, yOffset, z))
  )

  const positions = []
  const uvs       = []
  const indices   = []

  for (let i = 0; i <= steps; i++) {
    const t    = i / steps
    const pt   = curve.getPoint(t)
    const tan  = curve.getTangent(t).normalize()

    // perpendicular to tangent (in XZ plane) for left/right bank edges
    const perp = new THREE.Vector3(-tan.z, 0, tan.x).normalize()
    const halfW = width * 0.5

    // left edge
    positions.push(
      pt.x - perp.x * halfW,
      pt.y,
      pt.z - perp.z * halfW
    )
    // right edge
    positions.push(
      pt.x + perp.x * halfW,
      pt.y,
      pt.z + perp.z * halfW
    )

    uvs.push(0, t)   // left edge: u=0
    uvs.push(1, t)   // right edge: u=1
  }

  // stitch quads
  for (let i = 0; i < steps; i++) {
    const a = i * 2,     b = i * 2 + 1
    const c = (i+1)*2,   d = (i+1)*2 + 1
    indices.push(a, c, b,  b, c, d)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

// ─────────────────────────────────────────────────────────────────────────
//  Animated water ShaderMaterial
// ─────────────────────────────────────────────────────────────────────────
function buildWaterMaterial() {
  const uniforms = {
    uTime:      { value: 0 },
    uWaveAmp:   { value: WAVE_AMP },
    uWaveSpeed: { value: WAVE_SPEED },
  }

  const vertexShader = /* glsl */`
    uniform float uTime;
    uniform float uWaveAmp;
    uniform float uWaveSpeed;

    varying vec2  vUv;
    varying float vWave;

    void main() {
      vUv = uv;

      // Two-frequency surface roll — different phase per vertex position
      float w1 = sin(position.x * 0.25 + uTime * uWaveSpeed * 1.3) * 0.6
               + sin(position.z * 0.40 + uTime * uWaveSpeed * 0.9) * 0.4;
      float w2 = cos(position.x * 0.18 + uTime * uWaveSpeed * 0.7) * 0.5
               + cos(position.z * 0.30 + uTime * uWaveSpeed * 1.1) * 0.5;

      float wave = (w1 + w2) * 0.5 * uWaveAmp;
      vWave = wave / uWaveAmp;   // normalised, passed to fragment

      vec3 displaced = position;
      displaced.y += wave;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `

  const fragmentShader = /* glsl */`
    uniform float uTime;
    uniform float uWaveSpeed;

    varying vec2  vUv;
    varying float vWave;

    void main() {
      // ── Layer A — primary downstream flow ────────────────────────────
      vec2 uvA = vUv * vec2(8.0, 4.0) + vec2(uTime * uWaveSpeed * 0.14, 0.0);
      float rippleA = sin(uvA.x * 3.14159) * sin(uvA.y * 3.14159);

      // ── Layer B — cross-flow (diagonal), adds churn ───────────────────
      vec2 uvB = vUv * vec2(5.0, 7.0) + vec2(-uTime * uWaveSpeed * 0.07,
                                               uTime * uWaveSpeed * 0.10);
      float rippleB = sin(uvB.x * 3.4) * cos(uvB.y * 4.2);

      // ── Layer C — fine surface turbulence ─────────────────────────────
      vec2 uvC = vUv * vec2(14.0, 10.0) + vec2(uTime * uWaveSpeed * 0.22,
                                                uTime * uWaveSpeed * 0.05);
      float rippleC = sin(uvC.x * 2.1) * sin(uvC.y * 2.7) * 0.5;

      float ripple = rippleA * 0.5 + rippleB * 0.35 + rippleC * 0.15; // −1…+1

      // ── Water colour — deep blue-teal to bright cyan ──────────────────
      vec3 deepWater    = vec3(0.03, 0.18, 0.30);   // deep channel
      vec3 shallowWater = vec3(0.12, 0.54, 0.65);   // sunlit surface
      vec3 foamColor    = vec3(0.78, 0.92, 0.95);   // white-cap foam

      // high-contrast ripple mix
      float mixFactor = clamp(ripple * 0.7 + 0.5, 0.0, 1.0);
      vec3 waterColor = mix(deepWater, shallowWater, mixFactor);

      // stronger foam where wave crests
      float foam = smoothstep(0.45, 0.78, vWave * 0.5 + 0.5);
      waterColor  = mix(waterColor, foamColor, foam * 0.55);

      // ── Fresnel-like edge transparency ────────────────────────────────
      float edgeFade = smoothstep(0.0, 0.14, vUv.x) *
                       smoothstep(0.0, 0.14, 1.0 - vUv.x);

      // ── Surface sparkle — busier/faster ──────────────────────────────
      float sparkle = sin(vUv.x * 52.0 + uTime * 7.0) *
                      cos(vUv.y * 38.0 + uTime * 5.3) * 0.12;
      waterColor += max(0.0, sparkle);

      float alpha = 0.80 * edgeFade + 0.06;
      alpha = clamp(alpha, 0.0, 0.90);

      gl_FragColor = vec4(waterColor, alpha);
    }
  `

  return { material: new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent:    true,
    side:           THREE.DoubleSide,
    depthWrite:     false,      // transparent water: don't occlude things beneath
  }), uniforms }
}

// ─────────────────────────────────────────────────────────────────────────
//  Riverbed — flat dark plane below water surface
// ─────────────────────────────────────────────────────────────────────────
function buildRiverbed(spinePoints2D) {
  const geo = buildRibbonGeometry(spinePoints2D, RIVER_WIDTH + 6, BED_Y, 40)
  const mat = new THREE.MeshStandardMaterial({
    color:     0x1a3540,   // dark murky river bottom
    roughness: 0.95,
    metalness: 0,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.receiveShadow = true
  return mesh
}

// ─────────────────────────────────────────────────────────────────────────
//  Riverbanks — two earthy strips flanking the water
// ─────────────────────────────────────────────────────────────────────────
function buildBanks(spinePoints2D) {
  const bankMat = new THREE.MeshStandardMaterial({
    color:     0x6b5940,   // warm muddy earth — transitions from grass to water
    roughness: 0.98,
    metalness: 0,
  })

  const banks = []
  const halfRiver = RIVER_WIDTH * 0.5

  // For each bank (left / right) offset the spine outward by halfRiver + bankWidth/2
  for (const side of [-1, 1]) {
    const offset   = (halfRiver + BANK_WIDTH * 0.5) * side

    // build a shifted version of the spine for the bank centre line
    const shiftedPoints = SPINE_POINTS.map(([x, z]) => {
      const curve = new THREE.CatmullRomCurve3(
        SPINE_POINTS.map(([px, pz]) => new THREE.Vector3(px, 0.05, pz))
      )
      return [x, z]   // will apply offset in geometry builder
    })

    // Build bank ribbon by shifting each spine point perpendicularly
    const curve = new THREE.CatmullRomCurve3(
      SPINE_POINTS.map(([px, pz]) => new THREE.Vector3(px, 0.05, pz))
    )
    const steps = 40
    const bankSpine = []
    for (let i = 0; i <= steps; i++) {
      const t   = i / steps
      const pt  = curve.getPoint(t)
      const tan = curve.getTangent(t).normalize()
      const perp = new THREE.Vector3(-tan.z, 0, tan.x).normalize()
      bankSpine.push([
        pt.x + perp.x * offset,
        pt.z + perp.z * offset,
      ])
    }

    const bankGeo = buildRibbonGeometry(bankSpine, BANK_WIDTH, 0.05, 30)
    const bank    = new THREE.Mesh(bankGeo, bankMat)
    bank.receiveShadow = true
    banks.push(bank)
  }

  return banks
}

// ═══════════════════════════════════════════════════════════════════════════
//  EXPORT
// ═══════════════════════════════════════════════════════════════════════════
export function createRiver(ctx) {
  const g = ctx.villageGroup

  // ── Riverbed ──────────────────────────────────────────────────────────
  const bed = buildRiverbed(SPINE_POINTS)
  g.add(bed)

  // ── Banks ─────────────────────────────────────────────────────────────
  const banks = buildBanks(SPINE_POINTS)
  banks.forEach(b => g.add(b))

  // ── Water surface ─────────────────────────────────────────────────────
  const waterGeo = buildRibbonGeometry(SPINE_POINTS, RIVER_WIDTH, RIVER_Y, CURVE_STEPS)
  const { material: waterMat, uniforms } = buildWaterMaterial()
  const water = new THREE.Mesh(waterGeo, waterMat)
  water.renderOrder = 1   // render after opaque objects to respect transparency
  g.add(water)

  // ── Register animation updater ────────────────────────────────────────
  //   villageBuilder.updateVillageWorld() already calls ctx.dynamicUpdaters.
  //   We push one function — no changes needed to the update loop.
  if (!ctx.dynamicUpdaters) ctx.dynamicUpdaters = []
  ctx.dynamicUpdaters.push((perfNow) => {
    uniforms.uTime.value = perfNow * 0.001   // ms → seconds
  })
}
