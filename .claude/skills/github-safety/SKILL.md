---
name: github-safety
description: >-
  Enforce repository git-safety for the 3D portfolio before ANY git action. Use
  whenever about to run git add / commit / push / branch / merge / rebase, edit
  .gitignore or .gitattributes, or whenever assets are about to be staged,
  committed, or pushed (including from Dispatch routines or before opening a PR).
  Prevents the 3.4 GB asset tree from re-entering git, blocks files >=100 MB,
  protects backup-branch invariants, and enforces branch discipline.
---

# GitHub Safety

Make the repository safe-by-construction. A single careless `git add .` can re-stage
~3.4 GB and re-break the GitHub push. This skill is the guardrail for every git action.

## Measured reality (why this matters)
- `.git` history is ~3.7 GB; working `public/assets/` is ~3.4 GB.
- Only ~50-80 MB of assets are actually used at runtime (optimized Draco GLBs, the
  one active HDRI `village_sky2.exr`, a few used textures, the active character).
- GitHub rejects any single file > 100 MB. Four push-blocker files already exist in
  history and are UNUSED (raw source): `new assets/Pine_trees.gltf/fir_tree_01.bin`
  (456 MB), `forest/forest/fir_tree_01_1k.gltf/fir_tree_01.bin` (456 MB),
  `forest/forest/jacaranda_tree_1k.gltf/jacaranda_tree.bin` (199 MB),
  `new assets/boardwalk_in_the_forest_-_point_cloud.glb` (125 MB).

## Branch map + invariants (NEVER violate)
- `clean-snapshot` — the working branch. Do all work here or on a branch off it.
- `backup/main` (GitHub) — off-site clean snapshot (~226 MB). The off-site recovery point.
- `backup-before-cleanup @ 541e08f` — LOCAL-ONLY full-history recovery point (full 3.4 GB).
  **NEVER push it (it contains >100 MB files), NEVER delete it, NEVER build on it.**
- `main` — stale, tracks old origin. Leave untouched.

## Hard rules
1. **Never `git add .` / `git add -A`.** Always stage explicit paths (`git add src/ <file>`).
2. **No file >= 100 MB may ever be staged or pushed.** Ideally keep files < 25 MB.
3. **No Git LFS** and **no history rewrite on the backup.** (Decided + rejected — do not reopen.)
4. **Raw/large source stays OUT of git** (`*.bin`, `*.fbx`, point clouds, unused folders);
   it is hosted out-of-band and referenced by a manifest. Git holds code + docs + the
   curated < 100 MB used-asset set only.
5. Every commit happens on a working branch off `clean-snapshot` — never on the backup branches.

## Required checks before any commit/push
1. Run `git status` and confirm NO `public/assets/` binaries are staged unintentionally.
2. Confirm the asset `.gitignore` block is present on `clean-snapshot` BEFORE the first
   asset-touching commit. If absent, add it first (structure below).
3. Confirm no staged file is >= 100 MB (e.g. `git diff --cached --stat`; spot-check large paths).
4. Confirm you are NOT on `backup-before-cleanup` or `main`.

## The asset .gitignore block (add to current .gitignore; finalize against the keep-set)
```gitignore
# --- Assets: keep raw/large/unused binaries OUT of git -----------------
*.bin
*.fbx
public/assets/new assets/
public/assets/forest/forest/*.gltf/
public/assets/models/stylized-nature-pack/
*.exr
src/assets/models/
# Force-keep the specific small used files with ! negation, e.g.:
# !public/assets/hdri/village_sky2.exr
```
Use `!negation` to force-keep each curated used file (confirm against ASSET_AUDIT_REPORT.md
before applying). Note: removing a big file now does NOT fix the push if it is already in
history — that is why the clean snapshot exists.

## Authoritative references (read when a decision is non-obvious)
- `GIT_ASSET_STRATEGY.md` — primary: measured sizes, push-blockers, .gitignore, Option A.
- `PROJECT_HANDOFF.md` (GIT / BACKUP section) — branch invariants + recovery points.
- `REPOSITORY_STRATEGY.md` — backup/recovery strategy.
- `ASSET_AUDIT_REPORT.md` — the used-vs-unused keep-set (which files to force-keep).
- `EXTERNAL_ASSET_DOWNLOAD_PLAN.md` — provenance/licence manifest for out-of-band assets.

## When this skill fires, output
- A go / stop decision, the exact safe command(s), and a one-line reason citing the rule.
- If a violation is proposed, refuse and give the safe alternative.
