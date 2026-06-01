---
name: design-bible-reader
description: >-
  Answer any design/vision/tone/"does this belong?" question from LOCKED canon with
  citations, and carry the evaluation algorithm + verdict format. Use whenever a request
  touches the world's identity, narrative, a zone, an experience, asset look, lighting,
  materials, interaction, or story; before reviewing work against the vision; and whenever
  a previously REJECTED idea risks resurfacing. Routes the L1>L2>L3 source-of-truth hierarchy.
---

# Design Bible Reader

The on-ramp to the LOCKED vision. Answer from canon with citations — never from memory.
Higher layer wins: L1 design-bible/ (vision) > L2 build docs > L3 state docs.

## Identity (LOCKED)
Creative Technologist: "I design and build intelligent tools, agents, and experiences that
make work smarter." The portfolio IS the proof of its own claim. Build is the engine;
design is the differentiator.

## Core laws (non-negotiable; a violation = reject at the gate)
experience-over-documentation · show-don't-tell · one-identity (no diffusion) ·
memory-over-completeness · humane-not-cold (warm golden-hour, NEVER neon/sci-fi) ·
evidence-or-fast-path · **meaning-before-form** · realistic / semi-realistic (never cartoon/toy).

## Narrative spine + Law of Walls (LOCKED)
Portal -> Village -> Hero House -> Forest -> Mountains -> Projects -> Future. Each zone owns
ONE question; hub-and-spoke fast path to proof is required.
- Portal: "Am I entering somewhere real?" (concept)
- Village: "What shaped me?" — functional places (Workshop/Studio/Library/Market), NEVER labelled.
- Hero House: "Who am I?" — emotional core.
- Forest: "What can I do?" — the Maker's Forest = 5 performed experiences.
- Mountains: "Where have I done it?" — Hall of Gates, context-not-content.
- Projects: "What have I built?" — TWO worlds only: Jarvis + Agent Suite.
- Future: "What now?" — CTA (concept).
Forest's 5 verbs: Workshop-REVEAL · Living Swarm-DIRECT · Waterworks-CONNECT · Overlook-SEE ·
Story Fire-KINDLE.

## The evaluation algorithm (EVALUATION_FRAMEWORK sec 2; run in order, stop-on-fail 1-3)
1. Proof-of-claim — strengthens "a designer who builds intelligent experiences"? fail=reject
2. Laws & non-negotiables (above). fail=reject
3. Zone ownership — serves the target zone's one question + Law of Walls? else reject/relocate
4. Languages — Visual/Lighting/Material/Interaction/Env-Storytelling/Asset checklists. fail=revise
5. Zone master — scope + success criteria of the target 02-zones/MASTER_*. fail=revise/reject
6. Experience spec — if it touches an experience, its 03-experiences/* rules. fail=revise
7. Complexity budget — earning its detail vs filler? fail=revise/cut
Gates 1-3 are binary (meaning-level); craft cannot buy back a gate failure. 4-7 produce fixes.

## Status tags (sec 3, mandatory)
LOCKED = enforce. DRAFT = advisory, do not enforce as law. BLOCKED = cannot evaluate against,
flag the needed decision. UNRESOLVED = never assume an answer; return needs-decision and name it.
You may FLAG a suspected flaw in LOCKED canon but may NOT silently override it — canon changes
are human decisions logged in DECISION_LOG.md.

## Verdict output shape (sec 4 — cite-or-it-didn't-happen)
```
VERDICT:   accept | revise | reject | needs-decision
SCOPE:     <zone / experience / global>
CITED:     <doc sec clause>, ...
REASONS:   <one line per cited clause: pass/fail + why>
REQUIRED:  <concrete changes to reach accept> (empty if accept)
```

## REJECTED — never reopen (PROJECT_HANDOFF DO-NOT-REPEAT)
skill boards/plaques · cartoon glowing skill-trees · rock/monolith monuments · floating-logo
trails / logo stations · skill emblems · Mountains "continuous-climb" model · Project Zero as a
peer world · a 3rd project world for symmetry · Git LFS · history rewrite of the backup.
If a candidate matches any of these, reject at the gate and cite it.

## Reference map (load the specific doc the question needs)
- `design-bible/README.md` — index + reading order (start here).
- `design-bible/00-canon/` — `PORTFOLIO_BIBLE.md`, `NARRATIVE_SPINE.md`, `GLOSSARY.md`.
- `design-bible/01-languages/` — `VISUAL_LANGUAGE.md`, `LIGHTING_LANGUAGE.md`,
  `MATERIAL_LANGUAGE.md`, `INTERACTION_PHILOSOPHY.md`, `ENVIRONMENTAL_STORYTELLING.md`,
  `ASSET_LANGUAGE.md`.
- `design-bible/02-zones/` — `MASTER_FOREST.md`, `MASTER_VILLAGE.md`, `MASTER_MOUNTAINS.md`,
  `MASTER_PROJECTS.md`.
- `design-bible/03-experiences/forest/EXP_LIVING_SWARM.md`.
- `design-bible/04-evaluation/` — `EVALUATION_FRAMEWORK.md`, `ASSET_ACCEPTANCE_RUBRIC.md`.
- `design-bible/MASTER_WORLD_MAP.md`, `MASTER_WORLD_BLUEPRINT.md`, `DECISION_LOG.md`.
- `PROJECT_HANDOFF.md` — LOCKED summary + DO-NOT-REPEAT.

## When this skill fires, output
- A canon-grounded answer in the verdict shape (or a direct cited answer for lookups). Every
  pass/fail names the doc + clause it rests on. Never enforce DRAFT/BLOCKED/UNRESOLVED as law.
