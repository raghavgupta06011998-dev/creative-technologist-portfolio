---
name: living-swarm-kb
description: >-
  Build-time knowledge bundle for the Living Swarm Forest experience. Use ONLY when building,
  tuning, or reviewing the Living Swarm (the warm directed swarm-of-lights, verb = DIRECT).
  Bundles the LOCKED spec + the L2 implementation plan + the task checklist + the make-or-break
  constraints. Dormant otherwise (does not fire during R0 or other zones). Defers generic runtime
  rules to threejs-portfolio-standards and overall vision to design-bible-reader.
---

# Living Swarm — Knowledge Base

A thin index to the Swarm's authoritative docs, carrying only the make-or-break constraints
inline so build + review never drift. For anything not here, open the docs listed below.

## Essence (LOCKED)
A swarm of warm living lights, scattered and waiting, that reads the visitor's intent from their
movement and organises itself to do the work — so they FEEL what it is to command an intelligence.
Verb = **DIRECT**. Capability = AI agents / orchestration. It is the Forest's centerpiece and the
signature memory of the whole portfolio.

## The three signals it MUST land (EXP sec 11 / sec 25)
- **Intelligence** — coordination + purpose: lights move together toward goals, hand work between
  each other, resolve tasks. Emergent/organised, never a particle effect.
- **Trust** — willing, calm responsiveness: parts for the visitor, follows their lead, never flees
  or malfunctions.
- **Agency (the visitor's)** — cause and effect: visitor moves -> swarm acts -> task completes.
  **This is the make-or-break.** Non-responsiveness is the single most damaging failure (sec 22).

## Behaviour model (EXP sec 8-10)
Three organic states: **Idle/waiting** (slow boids drift, occasional brighter mote passed between
lights) -> **Directed** (reads movement intent, flows to the spot, ignites a dormant point) ->
**Resolved** (synchronised flourish, then back to readiness). Presence: nearby lights turn toward
the visitor. Parting: lights yield around the visitor and reform — never collide, never flee.

## DIRECT loop (EXP sec 9)
A few dormant points sit at the clearing edges (unlit lantern / dim flower / cold ember). Visitor
moves toward one -> swarm rushes and ignites it -> clearing progressively blooms -> when all lit,
a final synchronised flourish. Trivial, generous, no wrong move, no fail state, no puzzle.

## Anti-fantasy discipline — HARD (EXP sec 14 / sec 21 / sec 23)
- Warm natural light ONLY (firefly/ember/lantern; honey-amber to warm gold). **NEVER neon, never
  cold blue, never sci-fi cyan.**
- Organic weighted flocking motion. **Never** geometric/grid/robotic formations or UI snapping.
- **No literal AI iconography** — no neural nets, code-rain, circuitry, HUD, wireframes.
- Grounded in the real Forest (foliage/stone/golden shafts), not floating in a void.
- Anchored to real work (a single restrained overlay/portal tying it to the real Agent Suite) —
  the metaphor felt first, evidence second.
- Restraint: tens of lights, legible behaviour, subtle glow. Spectacle is the enemy of meaning.
Any neon / sci-fi / AI-iconography / random-motion / non-responsive result = automatic rejection.

## Procedural performance rules — HARD (EXP sec 24 / TECH sec 5/sec 9)
Fully procedural (no GLB). **1 draw call** (single InstancedMesh or Points), **1 shared emissive
material** (additive blend, transparent, depthWrite off), **0 new real lights** (glow via emissive;
day/night via `ctx.dayNight` intensity). Light count in the **tens**. Frame-rate-independent boids
(separation/alignment/cohesion + intent bias toward the player). One updater in `ctx.dynamicUpdaters`.
Reuse the `skillTriggers.js` proximity pattern (act on state-change only). Non-colliding.

## Day / Night (EXP sec 16-17)
Day: gentle warm motes catching golden-hour shafts, glow LOW, coexists with daylight. Night: the
dominant warm light of the clearing, glow RAISED via emissive only (no added lights), most magical
but still warm/organic/never neon.

## Build order note (LIVING_SWARM_IMPLEMENTATION_PLAN / SWARM_BUILD_CHECKLIST)
Checklist runs A1 -> G2. **Build the C-phase intent-following FIRST** — agency is the make-or-break
signal; prove the swarm reliably obeys the visitor's movement before polishing idle/flourish/audio.
Proposed code home: `src/world/village/forest/livingSwarm.js` (create) + one `createLivingSwarm(ctx)`
call in `villageBuilder.js` + register its updater in `ctx.dynamicUpdaters`.

## Scope protection (do NOT)
No literal AI/tech imagery · no real minigame (difficulty/fail/score) · no second swarm / competing
AI set-piece in the Forest · no neon or sci-fi restyle regardless of "cool factor" · no text as the
primary carrier of meaning. Allowed: tuning count/glow/motion/audio, refining the real-agent anchor,
polishing day/night.

## Success criteria (checkable — EXP sec 25)
1) Visitor directs the swarm and feels it obey. 2) Reads as intelligent/coordinated, not random.
3) Wonder -> quiet power lands. 4) Never neon/sci-fi/fairy-magic. 5) Visitor connects it to real
AI capability via the anchor. 6) It is the moment they remember. 7) Smooth in day AND night with
zero added lights at night.

## Authoritative documents
- `design-bible/03-experiences/forest/EXP_LIVING_SWARM.md` — LOCKED spec (primary; sec 8-25).
- `LIVING_SWARM_IMPLEMENTATION_PLAN.md` — how to build it (L2).
- `SWARM_BUILD_CHECKLIST.md` — the A1->G2 task board (L2).
- `design-bible/02-zones/MASTER_FOREST.md` — the clearing's place + verb + emotional arc.
- Defer to: `threejs-portfolio-standards` (runtime/perf), `design-bible-reader` (vision/verdict),
  `LIGHTING_LANGUAGE.md sec 4/sec 7` + `INTERACTION_PHILOSOPHY.md sec 2-5` (language detail).

## When this skill fires, output
- The make-or-break constraints relevant to the current Swarm task, plus the specific doc section
  to open for detail. Hold the anti-fantasy + procedural-perf rules as non-negotiable.
