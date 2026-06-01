# EVALUATION_FRAMEWORK.md — How Anything Is Judged Against the Bible

> **Layer:** 04 · Evaluation
> **Status:** LOCKED (framework)
> **Version:** 1.0 · **Last updated:** 2026-05-31
> **Inherits from:** all of `00-canon`, `01-languages`, `02-zones`, `03-experiences`,
> `MASTER_WORLD_MAP.md`, `MASTER_WORLD_BLUEPRINT.md` (esp. §5/§7)
> **Purpose:** the formal, repeatable procedure a human reviewer or AI agent uses to decide
> whether any asset, environment, layout, interaction, story beat, or idea **belongs.** It turns
> the Bible from prose into a decision engine.

---

## §1 · The principle
**Evaluation follows the inheritance chain.** Higher layers outrank lower ones. A thing can be
beautifully crafted (passes the Languages) and still be **rejected** because it violates a law
(Bible) or a zone wall (Spine). Quality never overrides meaning.

## §2 · The evaluation algorithm (run in order; stop-on-fail at steps 1–3)
For any candidate artifact/idea:

1. **Proof-of-claim** — does it strengthen *"the artifact embodies the claim — a designer who
   builds intelligent experiences"*? (`PORTFOLIO_BIBLE §0`) → fail = **reject.**
2. **Laws & non-negotiables** — show-don't-tell · humane-not-cold · one-identity · memory-over-
   completeness · evidence-or-fast-path · meaning-before-form · realistic-cinematic.
   (`BIBLE §5/§9`) → fail = **reject.**
3. **Zone ownership** — does it serve the target zone's *one question* and respect the Law of
   Walls? (`NARRATIVE_SPINE §2–3`) → belongs to another zone = **reject/relocate.**
4. **Languages** — run the relevant checklist(s): Visual, Lighting, Material, Interaction,
   Environmental Storytelling, Asset. → fail = **revise** (fix-it notes).
5. **Zone master** — belongs/doesn't, scope protection, success criteria of the target
   `02-zones/MASTER_*`. → fail = **revise** or **reject** (if it hits scope protection).
6. **Experience spec** — if it touches a specific Experience, its `03-experiences/*` rules.
   → fail = **revise.**
7. **Complexity budget** — is it earning its detail, or filler/overbuild?
   (`BLUEPRINT §4`) → fail = **revise/cut.**

**Verdict rule:** steps 1–3 are **gates** (binary, meaning-level). Steps 4–7 are **graders**
(produce fixes). A gate failure cannot be "made up for" by craft.

## §3 · Status-tag handling (mandatory)
- **LOCKED** content is **enforced.**
- **DRAFT** content is **advisory** — note it, don't enforce as law.
- **BLOCKED** content **cannot be evaluated against** — flag that the blocking decision is needed.
- **UNRESOLVED** items: **never assume an answer.** If a candidate depends on an UNRESOLVED
  decision, return `needs-decision` and name it.
- An evaluator may **flag** a suspected strategic flaw in LOCKED canon, but may **not** silently
  override it. Canon changes are human decisions (logged in `DECISION_LOG.md`).

## §4 · Verdict output shape (humans and agents both produce this)
```
VERDICT:   accept | revise | reject | needs-decision
SCOPE:     <zone / experience / global>
CITED:     <doc §clause>, <doc §clause>, ...        # every claim cites a clause
REASONS:   <one line per cited clause: pass/fail + why>
REQUIRED:  <concrete changes to reach "accept"> (empty if accept)
```
**Cite-or-it-didn't-happen:** an unsourced verdict is invalid. Every pass/fail names the clause it
rests on, so the decision is auditable and consistent across reviewers.

## §5 · Worked example (illustrative)
*Candidate:* "A glowing neon holographic skill-tree placed in the Forest's Living Swarm clearing."
```
VERDICT:  reject
SCOPE:    Forest / EXP_LIVING_SWARM
CITED:    BIBLE §5 (show-don't-tell, humane), ENV §9 (no logo/skill exhibits),
          EXP_LIVING_SWARM §14 (no neon/sci-fi/AI-iconography), MASTER_FOREST scope
REASONS:  Gate fail §5 — neon/sci-fi violates "humane, not cold"; Gate-adjacent ENV §9 —
          skill-tree is a labelled exhibit (museum failure); EXP §14 — neon + AI-iconography
          are explicitly forbidden in the Swarm.
REQUIRED: none — concept is rejected at the meaning gate, not salvageable by restyle.
```

## §6 · The reviewer roles (who runs which slice)
Mirrors `BLUEPRINT §7`. Each role runs a scoped subset of §2; the **Orchestrator** routes and
aggregates by inheritance priority.

| Role | Runs | Needs as input |
|---|---|---|
| **Asset Reviewer** | step 4 (Asset+Visual+Material) via `ASSET_ACCEPTANCE_RUBRIC` | asset + target zone |
| **Environment / Layout Reviewer** | Visual composition, Lighting, Visibility (`WORLD_MAP §3`), §7 budget | scene/blockout + zone |
| **Storytelling Reviewer** | step 3 + Environmental Storytelling checklist | scene + zone intent |
| **Interaction Reviewer** | Interaction checklist (`INTERACTION §11`) | interaction description |
| **Consistency / Scope Auditor** | steps 2–3 + scope-protection + budget; flags drift/duplication | the change + docs touched |
| **Orchestrator** | routes, aggregates, resolves by priority, returns one verdict | the candidate |

## §7 · How to use
**Humans:** use §2 as a checklist and §4 as the report format in reviews and PRs.
**Agents:** §2 is the algorithm, §4 is the required output, §3 governs authority, §6 is the role
map. Load `GLOSSARY.md` for vocabulary. Never enforce DRAFT/BLOCKED/UNRESOLVED as law.
**Cross-refs:** `MASTER_WORLD_BLUEPRINT §5/§7` (source), `ASSET_ACCEPTANCE_RUBRIC.md` (the asset
slice in full).
