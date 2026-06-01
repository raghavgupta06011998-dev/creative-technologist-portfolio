# BUILD_ROADMAP.md — Execution Roadmap (Implementation Layer)

> **Layer:** Implementation (bridges `design-bible/` vision → code). **Not** canon — execution only.
> **Status:** ACTIVE · **Version:** 1.0 · **Last updated:** 2026-05-31
> **Authority for vision:** `design-bible/` (LOCKED — do not reopen). This doc decides *order and
> scope of building*, never *what the world means.*
> **Companion docs:** `TECH_ARCHITECTURE.md`, `LIVING_SWARM_IMPLEMENTATION_PLAN.md`.

---

## §1 · The execution thesis
Build the **proof spine first** (`MASTER_WORLD_MAP §8`): **Living Swarm → Jarvis → Projects.**
The world should be able to *convince* before it is *complete.* Framing zones (Portal, Future,
Village polish, Mountains) wait. We ship a *vertical slice* before breadth.

**Three execution laws (from the Bible, applied to building):**
1. **Vertical slice over horizontal coverage** — finish one experience end-to-end before starting
   the next.
2. **Reuse the engine you have** — extend existing systems (ctx, dynamicUpdaters, assetLoader,
   day/night, proximity overlay); do not rebuild them.
3. **Performance is a feature** — smooth first, pretty second (a stuttering world breaks the
   proof-of-claim).

## §2 · What to build first / what to ignore now
**Build now:** the **Living Swarm** as a complete, polished vertical slice inside the *existing*
forest (road/fence/trees/terrain already exist), integrated with the existing day/night and
proximity-overlay systems.

**Explicitly ignore for now (defer, do not touch):**
- Hero House interior, Portal, Future, Mountains, Village beautification.
- The other four Forest clearings (Workshop, Waterworks, Overlook, Story Fire).
- Audio (principles only; no audio build yet).
- Any new zone documents.
- Cleanup of the disabled `skills/` experiments (skillEmblems, logoStations, skillPillars) — a
  later chore, not a blocker.

## §3 · MVP scope (the smallest thing that proves the thesis)
**A working Living Swarm in the forest clearing that a visitor can DIRECT.**
- ~40–80 warm procedural lights with believable idle flocking.
- Player-presence detection + intent-following (swarm moves toward where the player heads).
- 3–4 dormant points that ignite when the swarm reaches them.
- A final resolve flourish when all are lit.
- Day/night-aware emissive glow (no new lights).
- One overlay line anchoring it to the real agents.
**MVP cuts (acceptable):** simplified flocking, fixed light count, no carried-mote micro-VFX, no
audio, no portal-to-Agent-Suite (overlay text only). *(Full cut list: `LIVING_SWARM_IMPLEMENTATION_PLAN §11`.)*

**MVP is "done" when:** you can walk into the clearing, feel the swarm follow your lead, light all
points, see the flourish, and it reads as *intelligent and warm* at a stable frame rate.

## §4 · Phase scope

**Phase 1 — Living Swarm (the prototype / vertical slice).**
MVP (§3) → then polish to spec: carried-mote VFX, parting/reforming around the player, ignition
spread, night-dominant glow, the real-agent overlay anchor. **Definition of done:** clears
`EXP_LIVING_SWARM §25` success criteria; lands the three signals (intelligence, trust, agency);
smooth in day and night. **This phase alone validates the entire experiential language.**

**Phase 2 — The proof completes (Jarvis + Projects access).**
Stand up the **Jarvis** flagship (your real tool, embedded/usable) and a minimal **Projects** hub
entry + **Fast Path**. After this, the portfolio can *convince* a recruiter even though the world
is unfinished. **Definition of done:** a visitor can reach Jarvis, use it, and a rushed visitor
can Fast-Path to it.

**Phase 3+ — Breadth (deferred; only after Phases 1–2 land).**
Forest body (remaining clearings + Overlook handoff) → Mountains (Hall of Gates) → Village finish
+ Hero House → bookends (Portal, Future) → world-wide polish/audio. Order per `MASTER_WORLD_MAP §8`.

## §5 · Development order (concrete)
1. **Local greybox of the Swarm clearing** — confirm placement/scale within the existing forest
   curve (a *sliver* of blockout, scoped to the Swarm only — not the whole world).
2. **Swarm core** — procedural lights + idle flocking (the look at rest).
3. **Player detection + intent-following** — the swarm responds to presence and lead.
4. **Dormant points + ignition state machine** — the DIRECT loop + reward.
5. **Resolve flourish** — the payoff.
6. **Day/night integration + overlay anchor** — register emissive; wire the real-agent line.
7. **Polish VFX** — carried motes, parting, ignition spread, night dominance.
8. **Optimize + verify** — instance/material discipline, frame-rate independence, success criteria.

## §6 · Risk analysis
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Swarm reads as fairy magic / sci-fi | Med | High | Hold `EXP §14` discipline: warm light, organic motion, real-agent anchor, no neon/iconography |
| Agency illusion breaks (unresponsive swarm) | Med | **Critical** | Make intent-following the *first* thing built & tuned (step 3); never ship if it feels unresponsive |
| Flocking too costly at count | Low–Med | Med | Cap count (tens); spatial/neighbor cap; instanced; frame-rate-independent |
| Over-polishing before behavior works | Med | Med | Behavior before VFX (steps 2–5 before 7); MVP gate |
| Scope creep into other clearings | Med | Med | Phase discipline; §2 ignore-list |
| Building in isolation, doesn't fit world | Low | Med | The local greybox (step 1) confirms fit before art |
| Solo-builder stall on a hard first piece | Med | Med | MVP cuts (§3) give a shippable floor; ship MVP, then polish |

## §7 · Estimated complexity (relative T-shirt sizing)
- Local greybox: **S**
- Swarm core + idle flocking: **M**
- Player detection + intent-following: **M** (highest-value, tune carefully)
- Dormant points + state machine: **S–M**
- Resolve flourish: **S**
- Day/night + overlay integration: **S** (systems already exist)
- Polish VFX: **M**
- Optimize/verify: **S–M**
- **Phase 1 total: M–L.** Jarvis (Phase 2): **L** (real product integration). Projects access: **S–M**.

## §8 · How to use
Build top-down through the phases; never start a phase while the prior fails its definition of
done. Evaluate any built artifact with `design-bible/04-evaluation/EVALUATION_FRAMEWORK.md`.
