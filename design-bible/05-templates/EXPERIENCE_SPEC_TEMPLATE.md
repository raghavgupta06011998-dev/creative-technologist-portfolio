# EXPERIENCE_SPEC_TEMPLATE.md — Schema for every `03-experiences/*/EXP_*.md`

> **Layer:** 05 · Templates
> **Status:** LOCKED
> **Version:** 1.0 · **Last updated:** 2026-05-31
> **Purpose:** the uniform schema for a single buildable Experience (an interactive moment /
> set-piece within a zone). Extracted from `EXP_LIVING_SWARM.md`. An Experience spec must be
> detailed enough that a developer, animator, VFX artist, environment artist, or AI agent can
> build and evaluate the piece from it alone. Copy this; fill every section.

---

```
# EXP_<NAME>.md — <Experience Name>

> Layer: 03 · Experiences (component of <Zone>)
> Status: LOCKED | DRAFT | BLOCKED (+ deferred notes)
> Version: x.y · Last updated: <date>
> Inherits from: 00-canon/*, 01-languages/*, MASTER_<ZONE>.md, + any anchor docs
> Zone: <zone> · Location: <where> · Verb: <the one verb> · Capability/meaning: <what it proves>
> Purpose: the complete authority to build and evaluate this Experience.

## §1 · Essence (one line)
## §2 · Purpose
## §3 · Narrative role
## §4 · Recruiter role
## §5 · Emotional role
## §6 · Symbolism
## §7 · What it physically IS  (form, material, light — grounded per Languages)
## §8 · How it behaves  (states: idle / engaged / resolved; the behavioural model)
## §9 · Interaction design  (the verb; dormant→alive; the loop; the reward; trivial-not-frustrating)
## §10 · How it reacts to the player  (presence, leading, parting, feedback)
## §11 · What it must communicate  (the 2–3 signals it MUST land)
## §12 · Environmental storytelling  (how the space carries meaning without labels)
## §13 · Evidence anchor  (the real work/fact it ties to — magic + artifact)
## §14 · How it stays grounded  (anti-fantasy / anti-sci-fi / anti-cliché discipline)
## §15 · User journey  (discovery sequence, moment-to-moment)
## §16 · Day version
## §17 · Night version
## §18 · Visual behaviour
## §19 · Motion behaviour
## §20 · Audio behaviour  (principles even if AUDIO_LANGUAGE is unwritten)
## §21 · What BELONGS / what does NOT
## §22 · Failure modes  (each tied to the rule it violates)
## §23 · Scope protection
## §24 · Quality standards  (Language bars + procedural/perf requirements)
## §25 · Success criteria (checkable)
## §26 · How to use this document  (builders + evaluating agents)
```

---

**Rules for filling it:**
- One Experience = **one verb** (§ header / §9). If you can't name the verb, it isn't designed.
- §11 (the signals it must land) is the heart — everything else serves it.
- §13 (evidence anchor) is mandatory for any metaphorical/immersive piece — *magic + artifact*,
  never magic alone (`ENVIRONMENTAL_STORYTELLING §6`).
- §14 (grounding) prevents the piece drifting into fantasy/sci-fi/cliché — the most common
  failure for evocative set-pieces.
- §22 failure modes must each cite the rule/section they violate, so an agent can detect them.
- Procedural-vs-downloaded and performance discipline (`ASSET §5/§6`) are hard constraints in §24.
