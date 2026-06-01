# LIVING_SWARM_IMPLEMENTATION_PLAN.md — Production Plan

> **Layer:** Implementation. **Status:** ACTIVE · **Version:** 1.0 · **Last updated:** 2026-05-31
> **Builds:** `design-bible/03-experiences/forest/EXP_LIVING_SWARM.md` (LOCKED design — **do not
> redesign**). This doc is *how to build it* within `TECH_ARCHITECTURE.md`. No code — technical
> design, task breakdown, state machines, algorithms-in-prose.
> **The non-negotiable design facts** (from the spec): warm organic swarm; verb = DIRECT;
> dormant→alive; three signals = **intelligence, trust, agency**; anti-fantasy discipline (no
> neon/sci-fi/AI-iconography); real-agent evidence anchor; day-subtle/night-dominant; ~tens of
> lights.

---

## §1 · Technical representation
- **One `InstancedMesh`** of a small camera-facing glowing quad (preferred for control of
  per-light size/brightness), **or** a single `Points` cloud. **One draw call, one shared
  emissive+additive material, zero new lights.**
- **Per-light data** (instanced attributes / arrays): `position`, `velocity`, `phase` (for
  twinkle/bob), `brightness`, `role` (free / carrying / igniting), and a transient `target`.
- **Count:** start at ~50 (range 40–80). Legibility over spectacle (`EXP §7`).
- A cheap **shared halo/bloom** per light (additive); no per-light lights, no shadows.

## §2 · The state machine (swarm-level)
| State | Meaning | Behavior | Enter when | Exit when |
|---|---|---|---|---|
| **IDLE** | Waiting, unled | Loose flocking + slow wander; occasional mote-pass between two lights | start; or no player intent | player intent detected |
| **DIRECTED** | Following the player's lead | Flock biases toward the player's intended target (a dormant point); a sub-group breaks off to act | player heads toward a dormant point | target reached or player redirects |
| **IGNITING** | Acting on a target | Sub-group converges on the dormant point; light spreads into it | target reached | point lit |
| **RESOLVING** | A task just completed | Brief synchronized brightening + gentle outward pulse, then settle | a point lit, or all points lit (final flourish) | flourish ends |
| **COMPLETE** | All points lit | Full swarm at its most alive; calm coordinated readiness | last point lit | (terminal for the session) |

Transitions are smooth (eased), never instant. The machine is **forgiving**: redirecting,
wandering away, or doing nothing is always valid (no fail state — `INTERACTION §4`).

## §3 · Flocking behavior (boids, capped)
Each light each frame combines (all delta-scaled, weighted):
- **Separation** — steer away from too-near neighbors (prevents clumping).
- **Alignment** — match average heading of nearby neighbors (coordinated motion).
- **Cohesion** — drift toward the local group's center (reads as "together").
- **Wander** — small noise so idle motion feels alive, not mechanical.
- **Intent bias** (DIRECTED/IGNITING only) — a pull toward the current `target`.
- **Bounds** — soft return force keeping the swarm within the clearing volume at head–canopy
  height.
**Performance cap:** neighbor checks limited (fixed small neighbor sample or a coarse spatial
grid), so cost stays ~O(n·k) with small n,k. Motion is **weighted with momentum**, eased, **never
teleporting/jittering**.

## §4 · Player detection & intent (the agency engine — build & tune FIRST)
This is the **critical** system; if it feels unresponsive the whole experience fails (`EXP §22`).
- Read `ctx.character` **position** and **movement direction** each frame.
- **Presence:** when the player enters the clearing radius, nearby lights orient toward them
  (the swarm "notices" — IDLE still, but attentive).
- **Intent target selection:** the swarm's `target` = the **dormant point the player is moving
  toward / facing / approaching** (pick the unlit point that best matches the player's heading and
  proximity). This is the "where I go, the intelligence follows" mechanic.
- **Parting:** if the player moves *into* the swarm, lights apply local avoidance to part
  gracefully, then re-cohere (trust signal). Never flee in fear.
- Use the **proximity pattern** from `skillTriggers.js` (act on state change, not per-frame churn).
**Tuning bar:** the player must *feel* the swarm read their intent within the first interaction.
Tune responsiveness (lead/lag, target-switch smoothing) until it feels like a capable team, not a
laggy follower and not a clingy pet.

## §5 · Dormant points & ignition (the DIRECT loop)
- **3–4 dormant points** at the clearing edges (data: `position`, `lit` flag, `visual` ref). They
  are naturally themed (unlit lantern / dim flower / dark hollow) — clearly "want completing."
- When the DIRECTED swarm's sub-group reaches a point → **IGNITING**: light spreads from the swarm
  into the point; `lit = true`; the point comes warmly alive.
- Each ignition → a small **RESOLVING** flourish from the contributing lights.
- When **all** points lit → the **final flourish** (full-swarm synchronized brighten + pulse) →
  **COMPLETE**; the clearing reaches its most-alive state.
- The loop is the reward; no scoring, no timer, no failure.

## §6 · Visual effects (in priority order)
1. **Warm glow** per light (emissive + additive; honey-amber day, brighter night). *(MVP)*
2. **Idle twinkle/breathing** (per-light phase). *(MVP)*
3. **Ignition spread** — warm light flowing swarm→point. *(MVP)*
4. **Final flourish** — synchronized brighten + gentle outward pulse. *(MVP)*
5. **Carried motes** — brighter motes briefly passing between lights (visible "work"). *(polish)*
6. **Parting shimmer** — subtle reaction as the player moves through. *(polish)*
- **Color stays in the warm band**; brightness/warmth vary, **never into neon hues** (`EXP §14`).

## §7 · Day / Night
- Register the swarm's emissive material with `ctx.dayNight` (existing `registerLogoMaterial`-style
  hook).
- **Day:** low emissive; warm motes coexisting with golden light.
- **Night:** raised emissive; the swarm becomes the clearing's dominant beacon. **No new lights**
  — intensity only (`TECH_ARCHITECTURE §5`).

## §8 · Integration points (plugging into the existing engine)
- New module `src/world/village/forest/livingSwarm.js` exposing `createLivingSwarm(ctx)`.
- `createLivingSwarm(ctx)` builds the InstancedMesh + dormant points, adds them to
  `ctx.villageGroup`, registers the emissive material with `ctx.dayNight`, and pushes its updater
  into `ctx.dynamicUpdaters`.
- Add one call in `villageBuilder.js` (after forest terrain/road exist).
- Overlay anchor: reuse the proximity-overlay system to surface the single real-agent line on
  approach (`EXP §13`).
- **Placement:** the existing forest's centerpiece clearing along the `LANE_PTS` curve (confirm
  with the local greybox, BUILD_ROADMAP §5 step 1).

## §9 · Performance considerations
- 1 InstancedMesh / 1 material / 0 new lights / count in the tens → ~1 draw call.
- Boids neighbor cost capped (sample or coarse grid).
- All motion delta-scaled (frame-rate-independent).
- No shadows; additive material with `depthWrite=false`; cheap shared halo.
- Verify stable fps in **both** day and night before calling Phase 1 done.

## §10 · Task breakdown (build order + sizing)
1. **Local greybox** of the clearing (placeholder markers for swarm volume + dormant points) — **S**
2. **Swarm core**: InstancedMesh + emissive material + idle flocking + twinkle — **M**
3. **Player detection + intent-following + parting** (tune until responsive) — **M (critical)**
4. **Dormant points + ignition + state machine** — **S–M**
5. **Final flourish + COMPLETE** — **S**
6. **Day/night registration + real-agent overlay anchor** — **S**
7. **Polish VFX** (carried motes, ignition spread refinement, parting shimmer) — **M**
8. **Optimize + verify against `EXP §25` success criteria** — **S–M**

## §11 · MVP simplifications (acceptable cuts for the first playable)
- Simplified flocking (fewer neighbor checks; looser tuning) — refine later.
- Fixed light count; no dynamic scaling.
- Skip carried-mote and parting-shimmer VFX (keep glow, twinkle, ignition, flourish).
- No audio.
- Real-agent anchor = overlay text only (defer the portal-to-Agent-Suite).
- 3 dormant points (not 4).
**Do NOT cut:** intent-following (the agency signal), warm-organic look (anti-fantasy), the
ignition→flourish reward loop. These are the experience.

## §12 · Risks (Swarm-specific)
| Risk | Mitigation |
|---|---|
| Unresponsive feel → agency fails | Build/tune detection (step 3) first; ship nothing that feels laggy |
| Reads as neon/sci-fi/fairy | Warm band only; organic motion; overlay anchor; `EXP §14` as a hard gate |
| Flocking cost spikes | Cap neighbors; instanced; delta-scaled; count in tens |
| Polish before behavior | Steps 2–5 (behavior) before step 7 (polish) |
| Placement wrong in forest | Local greybox (step 1) before any art |

## §13 · Definition of done (Phase 1)
Walk into the clearing → swarm notices and follows your lead → light all dormant points → final
flourish → it reads as **intelligent (coordinated), trusting (parts/follows), and yours to command
(agency)** → warm, never neon → smooth in day and night → overlay anchors it to the real agents.
Meets `EXP_LIVING_SWARM §25`. Then — and only then — move to Phase 2 (Jarvis).
