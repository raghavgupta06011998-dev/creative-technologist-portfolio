# REPOSITORY_STRATEGY.md — The Repository Operating Manual

> **Mode:** Repository Architect / Technical Lead. **Status:** ACTIVE · **Version:** 1.0 · **Date:** 2026-05-31
> **Scope:** how the *repository* is structured, versioned, backed up, and operated for the next
> 12 months — for humans **and** AI agents. Not a vision document. Vision is LOCKED in
> `design-bible/`; this governs the container around it.

---

## §1 · Repository hierarchy (top-level intent)
```
raghav-portfolio/
├── src/                  ← CODE (the product) — Three.js app
├── design-bible/         ← VISION (canonical, LOCKED)
├── public/assets/        ← ASSETS (mostly out-of-git long-term; see GIT_ASSET_STRATEGY)
├── archive/              ← LEGACY (history snapshots; immutable)
│   └── legacy-code/      ← (planned) archived orphaned/duplicate code modules
├── *.md (root)           ← OPERATIONAL + IMPLEMENTATION docs
└── .git/                 ← history (currently 3.7 GB — to be slimmed)
```

## §2 · Source-of-truth hierarchy (already established in CLAUDE.md)
- **Level 1 — VISION (canonical):** `design-bible/` — what the world is/means. **Higher level wins.**
- **Level 2 — BUILD (canonical for implementation):** `BUILD_ROADMAP`, `TECH_ARCHITECTURE`,
  `LIVING_SWARM_IMPLEMENTATION_PLAN`, `SWARM_BUILD_CHECKLIST`.
- **Level 3 — STATE (reference):** `PROJECT_FULL_CONTEXT`, `PROJECT_PROGRESS`, `ASSET_MAP`,
  `ASSET_AUDIT_REPORT`, `EXTERNAL_ASSET_DOWNLOAD_PLAN`, `CLAUDE.md`.
- **Level 4 — OPERATIONS (this set):** `REPOSITORY_STRATEGY`, `GIT_ASSET_STRATEGY`,
  `CLEANUP_STRATEGY`, `REPOSITORY_HEALTH_REPORT`, `DECISION_LOG`, audit docs.
- **The reality check:** `CURRENT_BUILD_AUDIT.md` records where code diverges from L1; when code
  and vision disagree, vision is the *target*, code is the *current truth* — reconcile toward L1.

## §3 · Documentation hierarchy
- **Canonical & stable:** `design-bible/` (LOCKED).
- **Build-authoritative:** the four implementation docs.
- **Reference (volatile):** the Level-3 state docs.
- **Operational (this set):** repo ops + audits.
- **Immutable history:** `archive/` (never edited).
- **Rule:** vision→L1, build plan→L2, build-state→L3, repo ops→L4. Never put vision in L3 or
  build-state in L1 (already enforced in `CLAUDE.md`).

## §4 · Active vs Reference vs Legacy (classification policy)
- **ACTIVE:** imported by the live graph (`main.js`→`villageBuilder.js`→…) **or** LOCKED vision /
  current build docs. Touch with care; covered by tests/smoke-loads.
- **REFERENCE:** accurate but non-authoritative (Level-3 state docs, asset inventories). Read,
  don't enforce.
- **LEGACY:** superseded, proven unused, or historical (`archive/`, orphaned code per
  `ARCHIVE_PLAN.md`). **Never imported; never the basis for new work.**
- Source of truth for which-is-which: `R0_CLEANUP_AUDIT.md` + `ARCHIVE_PLAN.md` (code),
  `ASSET_AUDIT_REPORT.md` (assets).

## §5 · Archive philosophy
- **Preserve, don't destroy.** Superseded work moves to `archive/` (or `archive/legacy-code/`),
  never deleted, so design lineage and recovery remain. (Matches the existing `archive/README.md`
  policy for docs.)
- **Immutable:** archived files are not edited; they are snapshots.
- **Proof-gated:** code is archived only when proven unused (two-scan evidence in `ARCHIVE_PLAN.md`).
- **Twin-safe:** when archiving same-named files, archive the **exact path** (e.g.
  `buildings/heroHouse.js`, never the active `structures/heroHouse.js`).

## §6 · Branch strategy
- **`main`** — the canonical, pushable, *clean* line (code + docs + curated assets). Always
  loadable; never carries > 100 MB files going forward.
- **`backup-before-cleanup`** — **frozen recovery point** holding the full pre-cleanup state
  (all assets, full history). **Keep local; do not delete; do not push** (it contains the
  > 100 MB blockers). This is the safety net for every irreversible step.
- **Feature branches** — one per build (`feat/living-swarm`, `chore/archive-legacy-code`,
  `chore/git-asset-slim`). Short-lived; merge to `main` after a smoke-load.
- **Rule:** irreversible operations (history rewrite) happen on a *copy*, validated, then adopted —
  never directly on the only copy of anything.

## §7 · Commit strategy
- **Small, focused, descriptive commits** (mirrors the project's "one change per task" rule).
- **Conventional prefixes** for agent legibility: `feat:`, `fix:`, `chore:`, `docs:`,
  `refactor:`, `archive:`, `assets:`.
- **Never mix** a code change with a large-asset add or a history rewrite.
- **Reference the doc**: commits that act on the bible cite the section/decision (e.g.
  `docs: lock Project Zero meta-reveal (DECISION_LOG D-005)`).

## §8 · Tag strategy
- **`baseline-pre-cleanup`** — tag the current `backup-before-cleanup` HEAD as an immutable
  recovery marker.
- **Milestone tags:** `slice-living-swarm`, `demo-v1` (first convincing demo), etc.
- Tags are cheap, permanent reference points — prefer a tag over a long-lived branch for "a moment
  in time."

## §9 · Backup strategy
- **Three independent copies before any irreversible step (3-2-1 lite):**
  1. **Local full repo** (current working dir, incl. `.git` + assets).
  2. **`backup-before-cleanup` branch** (in-repo recovery point) **+ a `baseline-pre-cleanup` tag.**
  3. **An offline/off-machine copy** of the entire folder (external drive or cloud) — because the
     branch lives inside the same `.git` that history rewrite will alter.
- **Raw assets** additionally backed up per `GIT_ASSET_STRATEGY §7` (external bucket / release zip)
  and manifested so they're reproducible.

## §10 · Recovery strategy
- **Lost a file:** restore from `backup-before-cleanup` (`git checkout backup-before-cleanup -- path`).
- **Botched history rewrite:** discard the rewritten branch; re-derive from
  `backup-before-cleanup` / the offline copy. (This is why the rewrite happens on a copy.)
- **Lost an asset:** re-fetch from the external bucket / release per `ASSET_SOURCES` (planned) +
  `EXTERNAL_ASSET_DOWNLOAD_PLAN`.
- **Recovery drill:** before the first irreversible action, verify the offline copy *opens and the
  app builds* from it.

## §11 · AI-agent workflow strategy
- **Read order for any agent:** `CLAUDE.md` (hierarchy) → `design-bible/README.md` (vision) →
  relevant L2 build doc → `design-bible/04-evaluation/EVALUATION_FRAMEWORK.md` (how to judge).
- **Before editing code:** consult `R0_CLEANUP_AUDIT.md` / `ARCHIVE_PLAN.md` to avoid editing a
  **dead twin** (e.g. `buildings/heroHouse.js`). Only ACTIVE files are valid edit targets.
- **Evaluate changes** against the inheritance chain (Bible §0/§5/§9 → Spine walls → Languages →
  zone master). Cite clauses (the evaluation framework's "cite-or-it-didn't-happen" rule).
- **Respect status tags:** LOCKED enforced, DRAFT advisory, UNRESOLVED never assumed.
- **One concern per branch/commit;** smoke-load the app after structural changes.
- **Never** introduce new heavy deps, real-time shadows, per-object lights, or large committed
  assets (TECH_ARCHITECTURE §10; GIT_ASSET_STRATEGY).
- **Append, don't rewrite,** `DECISION_LOG.md` when reversing a decision.

## §12 · The one operating principle
**Preserve first, change second, prove before destroy.** Every irreversible step (history rewrite,
deletion) is preceded by a verified backup and happens on a copy. The repo is optimized so a cold
agent can find the truth fast and cannot accidentally break the playable experience.

> Cross-refs: `GIT_ASSET_STRATEGY.md`, `CLEANUP_STRATEGY.md`, `REPOSITORY_HEALTH_REPORT.md`,
> `ARCHIVE_PLAN.md`, `CLAUDE.md`.
