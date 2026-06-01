# REPOSITORY_HEALTH_REPORT.md — Brutally Honest Assessment

> **Mode:** Technical Lead. **Status:** ACTIVE · **Version:** 1.0 · **Date:** 2026-05-31
> **Measured against the real repository.** Optimized for 12-month maintainability, not for
> protecting past decisions.

---

## §1 · What is HEALTHY ✅
- **The documentation/vision system.** `design-bible/` is mature, layered, internally consistent,
  agent-evaluable (glossary + evaluation framework + templates). Genuinely above-average.
- **The runtime foundations.** Terrain, roads (CatmullRom ribbons), bridge (walkable), river,
  Day/Night toggle, environment/lighting, player/camera/collision, asset pipeline (`modelCache` +
  instancing). These are real, working, and on-vision-tone.
- **Performance discipline.** Shadows off, InstancedMesh (~5–10 draw calls for ~1,240 forest
  instances), shared materials, delta-time movement, frame-rate-independent camera. Strong.
- **Backup posture.** A `backup-before-cleanup` branch exists; the environment auto-commits edits,
  so this session's docs are already tracked (not at-risk locally).

## §2 · What is DANGEROUS ⚠
- **3.7 GB `.git` with 4 files > 100 MB in history.** GitHub push is impossible without a history
  rewrite or a fresh snapshot. **There is currently no off-site backup of the work.** This is the
  single most dangerous condition: a disk failure loses everything.
- **No `.gitignore` rule for `public/assets/`** → 5,084 binaries (3.4 GB) committed, and the
  problem compounds with every asset added.
- **Duplicate architectures with identical filenames** (`buildings/heroHouse` vs
  `structures/heroHouse`, `systems/playerController` vs `player/playerController`). An agent or a
  human can easily edit the **dead twin** and "fix" nothing — a real correctness hazard.

## §3 · Technical debt
- ~24–29 orphaned/duplicate code modules (whole `buildings/` + `systems/` trees, 6 legacy
  `*Builder.js`, dead skill systems). Not dangerous at runtime (unreachable) but **cognitive debt**
  — they inflate the surface area an agent must reason about and invite twin-trap edits.
- A `skills/` folder that is a **graveyard of 6 iterations**, with one live system
  (`skillPillars`) whose own header comment is stale ("Logo Trail").
- Two parallel entry-era stacks (`src/entities`+`src/systems` driving game vs the village world).

## §4 · Documentation debt
- **Low and shrinking.** The hierarchy is reconciled (`CLAUDE.md` routes L1–L4; `PROJECT_FULL_CONTEXT`
  marked superseded-in-place). Remaining: `COWORK_INSTRUCTIONS.md` is a completed one-time task
  retained as provenance reference (not yet labeled legacy). Risk: the *volume* of docs vs. built
  product is high — guard against adding more planning docs (the project already pivoted to build).

## §5 · Asset debt
- **3.4 GB on disk; ~50–80 MB actually used.** ~98% of committed asset weight is unused (raw gltf
  source, unused texture/model packs, 13 of ~14 HDRIs, disabled GLBs). The 4 push-blockers are all
  **unused**. This is the largest single debt and the root of the Git debt.

## §6 · Git debt
- History is permanently inflated by committed binaries; even after deleting files, the 3.7 GB
  history persists until rewritten or replaced. No LFS, no `.gitattributes`. `backup-before-cleanup`
  cannot be pushed (it contains the blockers). **Git debt = asset debt that got committed.**

## §7 · What becomes a problem in ~3 months
- **No off-site backup → catastrophic-loss risk** is the 3-month clock that's already ticking.
- As building starts, **the duplicate twins cause a wrong-file edit** (agent or human), costing
  debugging time and trust in the codebase.
- Every new asset added without a `.gitignore` rule **deepens the un-pushable hole.**

## §8 · What becomes a problem in ~12 months
- **Unmaintainable surface area:** if dead code isn't archived, a year of building on top leaves
  agents unable to distinguish live from dead — refactors get risky, velocity drops.
- **Asset sprawl:** without an external-asset strategy, the 3.4 GB grows, clone/onboarding becomes
  painful, and GitHub remains impossible.
- **Vision/code drift hardens:** `CURRENT_BUILD_AUDIT` shows code is far behind the bible; if the
  gap isn't closed by building (not documenting), the bible becomes shelf-ware and the codebase
  becomes the de-facto (off-vision) truth.

## §9 · The honest one-paragraph verdict
The **vision and the runtime foundations are healthy**; the **repository plumbing is not.** The
project spent heavily on documentation and now carries three concrete liabilities — **no off-site
backup, an un-pushable 3.7 GB asset history, and dead duplicate code** — none fatal, all fixable,
and all *reversible if sequenced correctly*. The highest-leverage move is not more design: it's
**(a) get an off-site backup, (b) slim the assets out of Git, (c) archive the dead twins** — after
which the repo is genuinely ready for 12 months of agent-driven building toward the Living Swarm.

---

# FINAL ANSWERS

**1. Recommended order of operations**
1. **Backups & tag** (`baseline-pre-cleanup` + offline copy; verify it builds).
2. **CLASS A code archive** (29 dead/duplicate files → `archive/legacy-code/`; smoke-load). *Safe,
   reversible, makes the repo agent-safe.*
3. **CLASS B verify-then-archive** (`Car.js`, `MarsWorld.js`, the two UI modules, village
   `materials.js`).
4. **Git/asset slim + GitHub backup** (finalize `.gitignore` + keep-set; push a clean snapshot).
5. **Build the Living Swarm.**
*(Steps 2–3 and step 4 are independent and can run in parallel.)*

**2. First action requiring your approval**
Adding the **`.gitignore` asset rules + finalizing the curated keep-set** (CLASS C) — because it
changes what Git tracks. (CLASS A archiving is low-risk but, per your standing instruction, also
awaits your go.)

**3. First irreversible action**
The **Git history rewrite** (if you choose Option B to purge > 100 MB blobs). Everything before it
(archiving code, adding `.gitignore`, tagging) is reversible from `backup-before-cleanup`. **Do an
offline backup before this step.** *(Option A — a fresh clean snapshot — avoids the irreversible
rewrite entirely.)*

**4. Safest path to a successful GitHub backup**
**Option A (recommended):** keep `backup-before-cleanup` local (full history + assets = recovery),
add the `.gitignore` asset rules, and **push a fresh clean snapshot** (code + docs + curated
< 100 MB assets) to a new GitHub repo/branch. No history rewrite, no LFS, no data loss — the full
past stays local + offline. (Option B, in-place history rewrite, is "cleaner history" but
irreversible — only after an offline backup.)

**5. Should cleanup happen before the GitHub backup is fixed?**
**Partly.** Separate the two:
- The **GitHub backup fix is the priority** (you currently have *no* off-site copy) and is
  **independent of code cleanup** — do it ASAP via Option A.
- **CLASS A code archiving does not block the push** and can be done before or after; doing it
  *before* the snapshot gives you a cleaner first backup, but it's optional.
- **Do NOT** gate the backup on finishing all cleanup. Get the off-site backup first; refine later.

**6. Is the repository ready for AI-agent-driven development?**
**Docs: yes. Code & Git: not yet.**
- ✅ **Vision/process** is agent-ready (bible, evaluation framework, glossary, hierarchy in CLAUDE.md).
- ⚠ **Code** needs the CLASS A archive first — the duplicate twins are a genuine agent hazard
  (wrong-file edits). After archiving, it's agent-safe.
- ⚠ **Git/assets** must be slimmed so agents can clone/push and so the backup exists.
- **Verdict:** ready after **(1) off-site backup, (2) CLASS A archive, (3) asset/git slim** — a
  small, sequenced, mostly-reversible effort. Until then, an agent can safely *build the Living
  Swarm in the live forest* (additive, low-risk), but should not refactor or touch Git/assets
  without those three steps.

> Cross-refs: `GIT_ASSET_STRATEGY.md`, `CLEANUP_STRATEGY.md`, `REPOSITORY_STRATEGY.md`,
> `ARCHIVE_PLAN.md`, `CURRENT_BUILD_AUDIT.md`.
