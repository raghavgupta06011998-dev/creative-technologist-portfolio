# Design Bible — Index & Operating Manual

The **single source of truth** for the entire portfolio world. Humans build from it; AI agents
evaluate against it; a future version of the Maker continues from it. If every conversation
disappeared, this directory alone rebuilds the vision.

> **Identity it serves:** *"I design and build intelligent tools, agents, and experiences that
> make work smarter."* (Creative Technologist.)
> **Headline idea:** the portfolio *is* the proof of its own claim — a built, playable world.

---

## How the Bible is layered (and what each layer authorises)

```
design-bible/
├── README.md                  ← you are here (index + reading order)
├── MASTER_WORLD_MAP.md        ← WHERE everything is: layout, sightlines, paths, build order
├── MASTER_WORLD_BLUEPRINT.md  ← HOW it's produced: philosophies, assets, pipeline, agent framework
│
├── 00-canon/                  ← WHY & WHAT (the constitution — highest authority)
│   ├── PORTFOLIO_BIBLE.md         the constitution; identity, laws, the movie narrative
│   ├── NARRATIVE_SPINE.md         zone ownership, walls, transitions, access model
│   └── GLOSSARY.md                canonical vocabulary (shared by humans + agents)
│
├── 01-languages/              ← TASTE (global design systems; inherited by every zone)
│   ├── VISUAL_LANGUAGE.md          look, realism, composition, color, scale, detail
│   ├── LIGHTING_LANGUAGE.md        golden hour, glow, day/night, light-as-wayfinding
│   ├── MATERIAL_LANGUAGE.md        PBR realism, wear, shared materials, emissive
│   ├── INTERACTION_PHILOSOPHY.md   verbs, dormant→alive, fast path, motion feel
│   ├── ENVIRONMENTAL_STORYTELLING.md  show-don't-tell, absent maker, evidence anchors
│   └── ASSET_LANGUAGE.md           sourcing, quality, procedural-vs-downloaded, licensing, perf
│
├── 02-zones/                  ← ZONE SPECIFICS (one MASTER per zone; one schema)
│   ├── MASTER_VILLAGE.md           where I come from / what shaped me (LOCKED)
│   ├── MASTER_FOREST.md            what I can do (LOCKED)
│   ├── MASTER_MOUNTAINS.md         where I've done it / professional record (LOCKED)
│   └── MASTER_PROJECTS.md          what I've built / proof (LOCKED)
│
├── 03-experiences/            ← COMPONENT SPECS (one per Experience)
│   └── forest/
│       └── EXP_LIVING_SWARM.md     the AI-orchestration centerpiece (LOCKED design)
│
├── 04-evaluation/             ← HOW AGENTS JUDGE (the decision engine)
│   ├── EVALUATION_FRAMEWORK.md     the inheritance-chain evaluation algorithm
│   └── ASSET_ACCEPTANCE_RUBRIC.md  the Asset Reviewer's scored checklist
│
├── 05-templates/              ← UNIFORM SCHEMAS (so docs stay parseable)
│   ├── ZONE_MASTER_TEMPLATE.md
│   └── EXPERIENCE_SPEC_TEMPLATE.md
│
└── DECISION_LOG.md            ← append-only record of decisions & reversals
```

*(Operational docs at the repo root — `PROJECT_FULL_CONTEXT.md`, `CLAUDE.md`, `ASSET_MAP.md`,
etc. — are the **volatile build state**, separate from this **stable vision**. The Bible says what
*should* be; operational docs track what *is*.)*

---

## What each document does

| Document | Does | Authoritative for |
|---|---|---|
| **MASTER_WORLD_MAP** | Maps space, sightlines, paths, transitions, landmarks, dependencies, build order | *Where* things are and *how you move* |
| **MASTER_WORLD_BLUEPRINT** | Production philosophies, asset systems, complexity budget, agent-evaluation framework, pipeline | *How* the World is produced + evaluated |
| **PORTFOLIO_BIBLE** | The constitution: identity, audience, laws, non-negotiables, the full narrative, success criteria, scope | *Why* it exists, *what* it is |
| **NARRATIVE_SPINE** | Zone ownership (one question each), the Law of Walls, transitions, hub-and-spoke access | Zone boundaries; "does this belong to this zone?" |
| **GLOSSARY** | One canonical term per concept | Shared vocabulary for humans + agents |
| **01-languages/** | Global taste + checklists | "Does this look/feel/source right?" |
| **02-zones/MASTER_** | Per-zone purpose, landmarks, belongs/doesn't, scope, success | Zone-level decisions |
| **03-experiences/EXP_** | One buildable Experience in full | Component build + evaluation |

---

## Reading order

**First-time (full vision):** `PORTFOLIO_BIBLE` → `NARRATIVE_SPINE` → `MASTER_WORLD_MAP` →
`MASTER_WORLD_BLUEPRINT` → `GLOSSARY` → the `01-languages` → the `02-zones` → the `03-experiences`.

**Builder starting a zone:** that zone's `MASTER_*` → the `01-languages` checklists →
`MASTER_WORLD_BLUEPRINT §6` (pipeline) → the relevant `EXP_*`.

**AI agent evaluating something:** `MASTER_WORLD_BLUEPRINT §5` (the evaluation chain) → the cited
canon/language/zone clauses → `GLOSSARY` for terms.

---

## Status legend (every doc carries one)

- **LOCKED** — authoritative; change only on a genuine strategic flaw, not a preference.
- **DRAFT** — in progress; advisory, not yet authoritative.
- **BLOCKED** — cannot be written until a named decision is made.
- **UNRESOLVED** (within a doc) — an open decision; agents must not assume an answer.

## Stable vs evolving

- **Stable (LOCKED):** PORTFOLIO_BIBLE (core), NARRATIVE_SPINE, GLOSSARY, all `01-languages`,
  MASTER_VILLAGE, MASTER_FOREST, MASTER_MOUNTAINS, MASTER_PROJECTS, EXP_LIVING_SWARM, the two
  Masterplan docs (world structure & principles), `04-evaluation` (EVALUATION_FRAMEWORK,
  ASSET_ACCEPTANCE_RUBRIC), `05-templates` (zone + experience schemas).
- **Living / append-only:** DECISION_LOG.
- **Evolving:** instance content inside every doc (metrics, chronology, responsibilities, real
  influences, copy); the `01-languages` Audio/Motion (Motion folded into Interaction for now;
  Audio principles defined in Blueprint §1, full doc pending real decisions).

---

## Authoritative vs implementation

- **Authoritative (vision):** everything in `design-bible/`.
- **Implementation (build state):** the codebase + the repo-root operational docs. When the two
  disagree, the Bible defines the *intent*; the operational docs record *reality*; reconcile toward
  the Bible.
