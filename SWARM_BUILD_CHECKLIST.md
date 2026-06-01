# SWARM_BUILD_CHECKLIST.md — Living Swarm Production Task Board

> **Layer:** Implementation (execution-only). **Status:** ACTIVE · **Version:** 1.0 · **Updated:** 2026-05-31
> **Builds:** `LIVING_SWARM_IMPLEMENTATION_PLAN.md` (how) · `EXP_LIVING_SWARM.md` (LOCKED design).
> **Obeys:** `TECH_ARCHITECTURE.md` (stack/constraints) · `BUILD_ROADMAP.md` (phase/scope).
> **Rule:** do not redesign; do not add world-building docs. Build tasks **top to bottom**; never
> start a task while its dependencies are unmet or failing their Definition of Done (DoD).

**Status legend:** `[ ]` todo · `[~]` in progress · `[x]` done (DoD + tests pass).
**Primary file for almost every task:** `src/world/village/forest/livingSwarm.js` (new).
**Integration file:** `src/world/village/villageBuilder.js`.
**Reference-only (read, don't break):** `effects/dayNight.js`, `skills/skillTriggers.js`, `index.html`.

**Global prerequisites:** existing forest road/terrain build runs; `ctx` exposes `scene`,
`villageGroup`, `character`, `delta`, `dynamicUpdaters`, `dayNight`. Confirm before Task 1.

---

## PHASE A — Scaffolding & placement

### [ ] A1 · Create + wire the module
- **Goal:** an empty `createLivingSwarm(ctx)` exists and is called; a no-op updater is registered.
- **Why:** establish the integration seam before any behavior (TECH_ARCH §2/§3/§8).
- **Dependencies:** global prerequisites.
- **Files:** `forest/livingSwarm.js` (new), `villageBuilder.js` (one import + one call after forest terrain/road).
- **Complexity:** XS.
- **DoD:** app builds and runs with no errors; updater fires each frame (temporary console log ok, removed after).
- **Test:** run dev server → no console errors → confirm updater ticks → remove temp log.

### [ ] A2 · Local greybox of the clearing
- **Goal:** placeholder markers for the swarm **volume** (a wire/box at head–canopy height) and **3 dormant-point positions** along the existing forest curve.
- **Why:** confirm placement/scale in-world before any art (BUILD_ROADMAP §5 step 1).
- **Dependencies:** A1.
- **Files:** `forest/livingSwarm.js`.
- **Complexity:** S.
- **DoD:** walking the forest, the clearing volume + 3 markers sit correctly off the path, not on road/fence/bridge.
- **Test:** walk to the clearing → markers visible, sensible scale, clear of the corridor → note final coordinates.

---

## PHASE B — Swarm core (the look at rest)

### [ ] B1 · Spawn the instanced lights (static)
- **Goal:** ~50 instances (range 40–80) of a small camera-facing quad placed randomly within the volume; static.
- **Why:** establish the one-draw-call representation (TECH_ARCH §5/§9).
- **Dependencies:** A2.
- **Files:** `forest/livingSwarm.js`.
- **Complexity:** S.
- **DoD:** ~50 quads visible in the volume; **one InstancedMesh / one draw call**.
- **Test:** count reads as "a swarm, not a galaxy"; confirm single draw call (renderer.info).

### [ ] B2 · Warm emissive + additive material
- **Goal:** shared emissive, additive-blended, transparent material (`depthWrite=false`); honey-amber warm; soft halo.
- **Why:** glow via material, not lights; warm-not-neon (TECH_ARCH §5, EXP §14).
- **Dependencies:** B1.
- **Files:** `forest/livingSwarm.js`.
- **Complexity:** S.
- **DoD:** lights read as warm firefly/ember glow; **zero new lights added**; one shared material.
- **Test:** visually warm (not neon/cold); no z-fighting; confirm light count in scene unchanged.

### [ ] B3 · Per-instance data model
- **Goal:** arrays for `position`, `velocity`, `phase`, `brightness`, `role`, `target` per light.
- **Why:** foundation for motion + state (PLAN §1).
- **Dependencies:** B1.
- **Files:** `forest/livingSwarm.js`.
- **Complexity:** XS.
- **DoD:** data initialized for all instances; instance matrices update from `position` each frame.
- **Test:** manually nudge one position in code → that instance moves → revert.

### [ ] B4 · Idle motion: wander + twinkle
- **Goal:** gentle per-light wander + `phase`-driven brightness twinkle/breathing; **delta-scaled**.
- **Why:** "alive at rest" (EXP §8 IDLE, §18); frame-rate independence (TECH_ARCH §2).
- **Dependencies:** B3, B2.
- **Complexity:** S.
- **DoD:** lights drift slowly and twinkle; motion identical feel at varied frame rates.
- **Test:** observe 30s → organic, calm, no jitter; throttle FPS → same speed/feel.

### [ ] B5 · Flocking (separation / alignment / cohesion + bounds)
- **Goal:** capped boids (small neighbor sample or coarse grid) + soft bounds keeping lights in the volume.
- **Why:** coordinated organic motion = the intelligence signal at rest (EXP §8/§11, PLAN §3).
- **Dependencies:** B4.
- **Complexity:** M.
- **DoD:** swarm clusters/drifts/re-forms organically; never clumps to a point or escapes the volume; cost stays cheap.
- **Test:** watch for coordinated-but-loose motion; confirm no light leaves bounds; FPS stable at count.

---

## PHASE C — Player detection & intent (CRITICAL — tune hardest here)

### [ ] C1 · Player presence detection
- **Goal:** each frame read `ctx.character` position; compute whether player is within the clearing radius.
- **Why:** prerequisite for all responsiveness (PLAN §4); use the `skillTriggers` act-on-change pattern.
- **Dependencies:** B5.
- **Files:** `forest/livingSwarm.js` (pattern ref: `skills/skillTriggers.js`).
- **Complexity:** S.
- **DoD:** a `playerPresent` flag flips correctly on enter/leave; no per-frame churn.
- **Test:** walk in/out → flag toggles at the right boundary.

### [ ] C2 · Presence reaction (the swarm notices you)
- **Goal:** when present, nearby lights orient toward the player (still IDLE, attentive).
- **Why:** the trust/attention signal (EXP §10, §11).
- **Dependencies:** C1.
- **Complexity:** S.
- **DoD:** entering the clearing visibly turns the swarm's attention toward the player.
- **Test:** enter → subtle, legible orientation shift; leave → returns to neutral idle.

### [ ] C3 · Intent target selection
- **Goal:** choose the unlit dormant point that best matches the player's heading + proximity → set as swarm `target`.
- **Why:** the "where I go, the intelligence follows" mechanic (PLAN §4, EXP §9).
- **Dependencies:** C1, (A2 points).
- **Complexity:** M.
- **DoD:** moving toward a point selects it as target; redirecting re-selects smoothly (no flicker).
- **Test:** approach each point in turn → correct target each time; quick redirects don't thrash.

### [ ] C4 · Intent bias (DIRECTED following)
- **Goal:** in DIRECTED state, bias flocking toward `target`; a sub-group breaks off to lead.
- **Why:** the agency signal — swarm obeys your lead (EXP §8 DIRECTED, §11).
- **Dependencies:** C3, B5.
- **Complexity:** M.
- **DoD:** the swarm visibly flows toward where the player leads; motion stays organic (not a rigid line).
- **Test:** lead the swarm around → it follows believably; feels like a capable team, not a laggy chain.

### [ ] C5 · Parting & re-cohesion
- **Goal:** local avoidance so lights part as the player moves into them, then re-cohere.
- **Why:** the trust signal; never flee in fear (EXP §10).
- **Dependencies:** C4.
- **Complexity:** S–M.
- **DoD:** walking into the swarm parts it gracefully; it reforms after; no collisions, no panic-scatter.
- **Test:** walk through the swarm repeatedly → smooth part/reform every time.

> **Responsiveness gate:** do not proceed past Phase C until the swarm *feels* like it reads your
> intent (EXP §22 — the agency illusion is the make-or-break). Tune lead/lag and target smoothing.

---

## PHASE D — The DIRECT loop (dormant points → ignition → reward)

### [ ] D1 · Dormant points (data + dormant visuals)
- **Goal:** 3 dormant points (data: `position`, `lit=false`, visual ref) shown as clearly "want completing" (dim/unlit, naturally themed).
- **Why:** the targets of the loop (EXP §9).
- **Dependencies:** A2, B2.
- **Complexity:** S.
- **DoD:** 3 dormant points visible at the marked positions, reading as inert/awaiting.
- **Test:** points look dormant and inviting; positions match the greybox.

### [ ] D2 · State machine skeleton
- **Goal:** implement IDLE / DIRECTED / IGNITING / RESOLVING / COMPLETE with smooth, forgiving transitions.
- **Why:** governs all behavior (PLAN §2); forgiving = no fail state (INTERACTION §4).
- **Dependencies:** C4, D1.
- **Complexity:** M.
- **DoD:** states enter/exit per the table; wandering away or doing nothing is always valid (returns to IDLE).
- **Test:** drive each transition manually; confirm no dead-ends, no fail states, no stuck states.

### [ ] D3 · Ignition
- **Goal:** when the DIRECTED sub-group reaches a target → IGNITING: light spreads swarm→point; `lit=true`; point lights up warmly.
- **Why:** the core DIRECT payoff (EXP §9).
- **Dependencies:** D2.
- **Complexity:** S–M.
- **DoD:** reaching a point reliably ignites it; the point's visual transitions dormant→alive.
- **Test:** lead the swarm to each point → ignites once, stays lit, no double-fire.

### [ ] D4 · Per-ignition resolve flourish
- **Goal:** contributing lights briefly brighten/pulse on each ignition, then settle.
- **Why:** immediate, generous micro-reward (EXP §9 RESOLVING).
- **Dependencies:** D3.
- **Complexity:** S.
- **DoD:** each ignition gives a satisfying brief flourish; swarm returns to readiness.
- **Test:** ignite a point → visible, pleasing flourish; repeat per point.

### [ ] D5 · Final flourish + COMPLETE
- **Goal:** when all points lit → full-swarm synchronized brighten + gentle outward pulse → COMPLETE (most-alive state).
- **Why:** the payoff that resolves the loop (EXP §9).
- **Dependencies:** D3 (all points), D4.
- **Complexity:** S.
- **DoD:** lighting the last point triggers one strong synchronized flourish; clearing reaches its brightest, calmest state.
- **Test:** light all 3 → final flourish fires once → COMPLETE holds.

---

## PHASE E — Integration

### [ ] E1 · Day/Night registration
- **Goal:** register the swarm's emissive material with `ctx.dayNight` (existing hook); day-subtle, night-dominant; **no new lights**.
- **Why:** consistency with the world's day/night system (TECH_ARCH §5, EXP §16/§17).
- **Dependencies:** B2; `effects/dayNight.js` (read its registration API).
- **Files:** `forest/livingSwarm.js` (+ confirm `dayNight` hook signature).
- **Complexity:** S.
- **DoD:** toggling night raises swarm glow to dominant; day lowers it; light count unchanged in both.
- **Test:** toggle day↔night → glow scales correctly; confirm 0 new lights either mode.

### [ ] E2 · Real-agent overlay anchor
- **Goal:** on approach, surface one restrained line tying the swarm to the real agents (reuse the proximity-overlay system).
- **Why:** the evidence anchor — keeps it creative-technologist proof, not fantasy (EXP §13).
- **Dependencies:** C1; `skills/skillTriggers.js` + `#skill-overlay` (index.html) as the overlay mechanism.
- **Complexity:** S.
- **DoD:** approaching the clearing fades in the anchor line once; leaving fades it out; no per-frame DOM churn.
- **Test:** approach → line appears (correct copy); leave → fades; re-enter → reappears.

---

## PHASE F — Polish VFX (only after behavior + integration pass)

### [ ] F1 · Carried motes
- **Goal:** occasional brighter motes pass between lights (visible "work") during IDLE/DIRECTED.
- **Why:** reinforces coordinated intelligence (EXP §6, §18).
- **Dependencies:** D5, E1.
- **Complexity:** M.
- **DoD:** subtle motes transfer between nearby lights; reads as purposeful, not busy.
- **Test:** observe at rest → occasional tasteful mote-passes; never distracting/cluttered.

### [ ] F2 · Ignition spread + parting shimmer refinement
- **Goal:** polish the ignition light-spread and add a subtle shimmer as the player parts the swarm.
- **Why:** final tactile polish (EXP §18/§10).
- **Dependencies:** D3, C5.
- **Complexity:** S–M.
- **DoD:** ignition feels like flowing warmth; parting has a gentle shimmer; both subtle.
- **Test:** ignite + walk-through → refined, warm, never neon/flashy.

---

## PHASE G — Optimize & verify (Phase-1 signoff)

### [ ] G1 · Performance pass
- **Goal:** confirm budget: **1 draw call, 1 shared material, 0 new lights**, neighbor cap active, all motion delta-scaled.
- **Why:** smoothness is a feature (TECH_ARCH §5, EXP §24).
- **Dependencies:** F1, F2.
- **Complexity:** S–M.
- **DoD:** stable target FPS (60 desktop / ≥30 mid mobile) in **both** day and night; budget confirmed.
- **Test:** profile day + night; check renderer.info (draw calls, programs); throttle CPU → motion still smooth.

### [ ] G2 · Success-criteria verification
- **Goal:** verify against `EXP_LIVING_SWARM §25` + `LIVING_SWARM_IMPLEMENTATION_PLAN §13` DoD.
- **Why:** the gate to declare Phase 1 done and move to Jarvis (BUILD_ROADMAP §4).
- **Dependencies:** G1.
- **Complexity:** S.
- **DoD:** all three signals land (intelligence, trust, agency); warm-never-neon; smooth day+night; anchor present.
- **Test (run the full loop):** walk in → swarm notices → lead it → all points ignite → final flourish → reads intelligent/trusting/commandable → toggle night, repeat → check each `§25` criterion off.

---

## Feature Definition of Done (Phase 1 complete)
Every task `[x]`; `EXP_LIVING_SWARM §25` met; the three signals land; no neon/sci-fi; smooth in
day and night; real-agent anchor present. **Then — and only then — proceed to Phase 2 (Jarvis).**

## MVP fast-floor (if polish stalls)
A shippable floor = A1–A2, B1–B5, C1–C4, D1–D5, E1–E2 (skip F1/F2; 3 points; overlay-only anchor).
**Never skip:** C3–C4 (intent-following = agency) and the warm-organic look. (BUILD_ROADMAP §3,
PLAN §11.)
