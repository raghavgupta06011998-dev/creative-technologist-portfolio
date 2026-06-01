# MASTER_WORLD_BLUEPRINT.md — The Production Masterplan

> **Layer:** Masterplan (production authority above all zones)
> **Status:** LOCKED (principles) · evolving sections marked
> **Version:** 1.0 · **Last updated:** 2026-05-31
> **Inherits from:** `00-canon/*`, `01-languages/*`, `MASTER_WORLD_MAP.md`
> **Audience:** creative director, game director, world designer, technical director, environment
> artist, developer, and future AI evaluation agents.
> **Purpose:** the *how the World is produced* authority — philosophies, asset systems, complexity
> budget, the agent-evaluation framework, the production pipeline, and the future-agent
> architecture. Where the Languages define *taste*, this defines *production discipline.*

---

## §1 · Philosophies (the production laws)

**World Design.** One coherent valley-to-peak world (`WORLD_MAP §1`), built as an *experience that
proves its claim* (Bible §0). Coherence over spectacle; every region belongs to one journey by one
maker.

**Scale.** Believable human scale everywhere; hero landmarks grand but never cartoonish (`VISUAL
§6`). The World is **compact and dense with meaning, not vast and empty** — walkable, legible,
never a chore to cross. Altitude encodes progression; distance is meaningful, never padding.

**Navigation.** Narrative linear, **access hub-and-spoke** (`SPINE §6`). The visitor is *guided,
never railroaded.* Light, landmarks, and leading lines do the guiding (`LIGHTING §2`). The **Fast
Path** is always present. Nobody is ever lost; nobody is ever trapped.

**Exploration.** Discovery is the core loop (tension → discovery → reward → warmth). Exploration is
**optional and rewarded, never mandatory.** The curious get depth; the rushed get the Fast Path.

**Environmental Storytelling.** The space tells the story; words are the last resort (`ENV §2`).
Absent maker, evidence anchors, every element earns meaning, redundancy over proliferation.
Verification facts (Mountains) are the sole legibility exception.

**Asset.** Realistic, game-ready, modular, cleanly licensed; **reuse before download; procedural
when it moves/glows/reacts** (`ASSET §5`). Quality and coherence over quantity.

**Performance.** Shadows globally off; instancing for high counts; shared materials; emissive glow
not per-object lights; day/night via emissive not new lights; no heavy visual mesh as collision
(`ASSET §6`, `LIGHTING §5`). **Smoothness is a feature, not an afterthought** — a stuttering world
breaks the proof-of-claim.

**Visibility.** The visitor can always see *where they came from and where they're going*
(`WORLD_MAP §3`). Sightlines are designed: Hero House from arrival, Mountains as distant backdrop,
the reveal at the Overlook, the whole journey from the Summit. Visibility is wayfinding.

**Landmark.** A few strong landmarks anchor each region and the whole World (`WORLD_MAP §6`). Hero
landmarks get the strongest silhouettes; dressing stays quiet. Landmarks are meaning-anchors, never
decoration.

**Progression.** Encoded spatially (altitude) and experientially (the World grows more alive as you
advance; dormant→alive). The visitor *feels* momentum without a progress bar.

**Player Guidance.** Diegetic first (`INTERACTION §6`): light, paths, landmarks, the responsive
world. UI/overlay is restrained fallback. The visitor is gently *pulled*, never *pushed*.

**Interaction.** The verb model; dormant→alive; **trivial, never frustrating**; responsive world;
no fail states; smooth frame-rate-independent motion (`INTERACTION_PHILOSOPHY`). A portfolio, not a
puzzle game.

**Lighting.** Golden hour is the master key; warm subtle emissive glow; light as mood *and*
wayfinding; day/night via emissive; strict light budget; no real-time shadows
(`LIGHTING_LANGUAGE`).

**Sound** *(principles only — `AUDIO_LANGUAGE` not yet authored; these bind it):* warm, organic,
diegetic, atmospheric; ambient beds per zone; subtle reactive cues on interaction; **never
electronic beeps, sci-fi UI sounds, or intrusive music.** Silence is a usable tool. The World must
be **fully legible with sound muted** (audio enhances, never gates meaning). Humane, not cold —
the audio equivalent of golden hour.

---

## §2 · Asset Categories

For each: purpose · quality · style · usage rules · reuse rules. All clear `01-languages` bars.

| Category | Purpose | Quality | Style | Usage rules | Reuse rules |
|---|---|---|---|---|---|
| **Architecture** | Houses, Market, functional places, Mountain Hall | High (hero); med (dressing) | Semi-real, warm, handcrafted | Hero buildings get strongest silhouettes; no futuristic/corporate | Modular kit; shared materials; vary by scale/rotation |
| **Nature** | Trees, terrain, rock, moss | Med–high | Realistic, living | Dense for backdrop, curated for focal | Heavy **instancing**; pool variants |
| **Foliage** | Ferns, plants, ground cover, petals | Med | Realistic, soft | Enrich without clutter; serve focal points | Instanced; CC0 packs (Quaternius) |
| **Water** | River, waterworks flow | Med–high | Soft, flowing | River as leading line; flow procedural | Shared shader/material |
| **Props (static)** | Workshop tools, books, lanterns, furniture | Med–high | Worn, hand-touched (`MATERIAL §3`) | Earn meaning (`ENV §5`); no filler | Reuse from cache; Poly Haven CC0 |
| **Interactive props** | Sketch, gate, fire, swarm targets | High | Realistic + warm glow | One clear verb each (`INTERACTION §2`); trivial | Bespoke per verb; shared materials where possible |
| **Lighting assets** | Lanterns, fire, windows, emissive | High (hero glow) | Warm, golden, emissive | Emissive-first; day/night-aware | Shared emissive materials; cap real lights |
| **VFX** | Living Swarm, embers, motes, shafts, ripples | High | Warm, organic, **never neon/sci-fi** | Procedural (`ASSET §5`); legibility over spectacle | Shared particle/material systems |
| **Storytelling assets** | Real work (designs, reel), the Maker's artifacts | High | Authentic | Evidence anchors (`ENV §6`); the Maker's own | Reused as textures across Workshop/Story Fire |
| **Signage / wayfinding** | Functional navigation only | Med | Diegetic, warm | **Navigation only — never skill/value/board content** | Shared style |
| **Landmarks** | Hero House, Bridge, Swarm, Overlook, Summit, Hall | Highest | Cinematic, distinct | One strong silhouette each; anchor sightlines | Mostly bespoke |

---

## §3 · Asset Priority Matrix

- **Custom / highest investment (the proof + the memory):** the **Living Swarm**, **Jarvis**, the
  **Hero House**, the **Summit + Project Zero reveal**, the **Story Fire** real reel. These carry
  the claim and the memory — do not cut corners.
- **High (hero landmarks + interactive verbs):** Overlook, Waterworks, Workshop reveal, Mountain
  Gates, the Bridge.
- **Kitbash / sourced (the believable backdrop):** architecture kits, nature/foliage, rocks,
  furniture, lanterns — Poly Haven/Quaternius CC0, reused and instanced.
- **Background (lowest detail, never focal):** distant terrain, far Mountains backdrop, dense
  forest mass, crowd-of-trees. Cheapest, instanced, no shadows.

Rule: **investment follows memory.** Spend where the recruiter will look longest and remember most;
economize on what frames it.

---

## §4 · World Complexity Budget (anti-overbuilding)

- **Detail concentrates at:** focal points, discovery moments, interactive verbs, hero landmarks,
  and anything the recruiter touches or remembers.
- **Detail stays low at:** transitional space, backdrop, distant masses, anything off the walkable
  sightline.
- **Hard rule:** *curated density, never filler* (`VISUAL §7`, memory over completeness). Every
  asset earns meaning/navigation/composition (`ENV §5`). If it doesn't, it's cut.
- **The overbuild trap (named, to be avoided):** do not gold-plate framing zones (Portal, dressing)
  or add "completeness" content. The proof spine (Swarm, Jarvis, Projects) outranks polish
  everywhere else. **Ship the proof before perfecting the frame.**

---

## §5 · Agent Evaluation Framework

How a future agent judges any artifact/idea against the Bible. The evaluation path is the
**inheritance chain**:

1. **Proof-of-claim (Bible §0):** does it strengthen "the artifact embodies the claim"?
2. **Laws & non-negotiables (Bible §5/§9):** show-don't-tell, humane, one-identity, memory-over-
   completeness, evidence-or-fast-path, meaning-before-form.
3. **Zone ownership (SPINE §2–3):** does it serve the zone's *one question*, and respect the walls?
4. **Languages (`01-languages` checklists):** Visual, Lighting, Material, Interaction, Environmental
   Storytelling, Asset — run the relevant checklist(s).
5. **Zone master (`02-zones/MASTER_*`):** belongs/doesn't, scope protection, success criteria.
6. **Experience spec (`03-experiences/*`) if applicable:** the component's specific rules.
7. **Complexity budget (§4):** is it earning its detail, or is it filler/overbuild?

**Verdict rule:** any failure in steps 1–3 is a **reject/flag regardless of visual quality.** Steps
4–7 produce *fix-it* notes. Every evaluation cites the specific clause it passed/failed (so the
verdict is auditable). Vocabulary must match `GLOSSARY.md`.

**Output shape an agent should produce:** `VERDICT (accept / revise / reject)` · `cited clauses` ·
`reasons` · `required changes`.

---

## §6 · Environment Production Pipeline

Per region, in order — each stage gated by the prior:

1. **Concept** — restate the region's one question (SPINE), the feeling, the verbs. Meaning before
   form.
2. **Reference** — gather mood/lighting/composition refs within the Languages; mark licences.
3. **Blockout** — pure geometry primitives: prove scale, sightlines (`WORLD_MAP §3`), navigation,
   focal points. No art yet.
4. **Greybox** — playable: movement, paths, the verb interactions stubbed, the Fast Path. Test the
   *feeling* and *flow* before art.
5. **Assets** — source (Poly Haven/Quaternius CC0) or build procedurally per the procedural-vs-
   downloaded rule; reuse from cache; shared materials.
6. **Assembly** — place assets to the composition rules; curated density; landmarks anchor
   sightlines.
7. **Lighting** — golden-hour pass; emissive glow; day/night behavior; wayfinding light.
8. **Interaction** — wire the verb(s), dormant→alive, responsive-world reactions, overlays/Fast
   Path; trivial-never-frustrating.
9. **Optimization** — instancing, shared materials, draw-call/light budget, shadows-off, frame-rate
   independence. Must be smooth.
10. **Polish** — atmosphere, audio, micro-detail at focal points, final composition pass.

**Gate:** never advance a stage while the prior fails its Language/zone checklist. Blockout proves
*space*; greybox proves *feeling*; art is earned last.

---

## §7 · Future AI Agent Architecture

The long-term goal: agents that review Blender scenes, assets, layouts, storytelling,
interactions, and overall consistency against this Bible. What they need and how they'd be shaped:

**What every agent needs from the Bible:**
- The **inheritance chain** (§5) as its rulebook.
- The **GLOSSARY** as its controlled vocabulary.
- The relevant **Language checklists** and **zone master** belongs/doesn't + success criteria.
- **Status tags** (LOCKED/DRAFT/BLOCKED/UNRESOLVED) so it never enforces unsettled content or
  invents answers to UNRESOLVED items.

**Recommended agent set (each scoped to one concern, all sharing the inheritance chain):**
- **Asset Reviewer** — runs `ASSET_LANGUAGE §10` + Visual/Material checklists on a proposed asset
  (format, realism, licence, perf, exclusions, zone-fit). Needs: asset metadata + target zone.
- **Environment/Layout Reviewer** — runs Visual composition, Lighting, Visibility/sightlines
  (`WORLD_MAP §3`), and complexity budget on a scene/blockout. Needs: scene structure + zone.
- **Storytelling Reviewer** — runs `ENVIRONMENTAL_STORYTELLING §11` + zone ownership: does the space
  say the right thing without labels; absent-maker; evidence anchors. Needs: scene + zone intent.
- **Interaction Reviewer** — runs `INTERACTION_PHILOSOPHY §11`: verb clarity, dormant→alive,
  trivial-never-frustrating, fast-path respect, motion feel. Needs: interaction description.
- **Consistency / Scope Auditor** — checks any change against zone ownership walls (SPINE §2),
  scope-protection lists, and the complexity budget; flags drift, duplication, and overbuild.
  Needs: the change + which docs it touches.
- **Orchestrator** — routes an artifact to the relevant reviewers, aggregates verdicts, resolves
  conflicts by the inheritance priority (steps 1–3 outrank 4–7), and returns one auditable verdict.

**Architecture principles for the agent system:**
- **One concern per agent**, shared rulebook (mirrors the doc layering).
- **Cite-or-it-didn't-happen:** every verdict names the clause. No vibes.
- **Respect status tags:** LOCKED is enforced; DRAFT advises; UNRESOLVED is never assumed.
- **Human-in-the-loop for UNRESOLVED and LOCKED-overrides:** an agent may *flag* a strategic flaw
  but may not silently rewrite canon.
- **The Bible is the model's context, not its training:** agents read these docs at evaluation
  time; updating a doc updates every agent's behavior with no retraining.

*(This section seeds the future `04-evaluation/` layer — `EVALUATION_FRAMEWORK.md` and per-agent
rubrics — which formalizes the above.)*

---

## §8 · How to use this document
**Builders:** follow the pipeline (§6), spend per the priority matrix (§3) and complexity budget
(§4), obey the philosophies (§1) and the Language checklists.
**Agents:** §5 is your evaluation algorithm; §7 is your architecture.
**Cross-refs:** `MASTER_WORLD_MAP.md` (space/layout), `00-canon/*` (why/what), `01-languages/*`
(taste/checklists), `02-zones/*` & `03-experiences/*` (specifics).
