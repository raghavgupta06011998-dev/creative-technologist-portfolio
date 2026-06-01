# GIT_ASSET_STRATEGY.md — Assets, Git, and the GitHub Push

> **Mode:** Audit + strategy. **Status:** ACTIVE · **Version:** 1.0 · **Date:** 2026-05-31
> **Based on the actual repository** (measured, not assumed). No git history was changed.

---

## §1 · Measured reality
- **`.git` history size:** **3.7 GB** (assets are committed into history).
- **Working asset tree:** **3.4 GB** in `public/assets/` (textures 1.1 GB · "new assets" 738 MB ·
  models 734 MB · forest 690 MB · characters 138 MB · hdri 91 MB · village 42 MB).
- **Tracked files:** 5,229 total — **5,084 are under `public/assets/`.**
- **`.gitignore` today:** ignores `node_modules`, `dist`, logs, editor files — **does NOT ignore
  `public/assets/`.** That is why 3.4 GB of binaries got committed.
- **Git LFS:** not installed; no `.gitattributes`.

## §2 · What caused the GitHub push failure (exact files)
GitHub rejects any single file **> 100 MB**. The repository has **4 tracked files over 100 MB**,
present in committed history — these block the push:

| File (tracked) | Size | Used at runtime? |
|---|---|---|
| `public/assets/new assets/Pine_trees.gltf/fir_tree_01.bin` | **456 MB** | No (raw source) |
| `public/assets/forest/forest/fir_tree_01_1k.gltf/fir_tree_01.bin` | **456 MB** | No (project uses Draco `fir_1k_draco.glb`) |
| `public/assets/forest/forest/jacaranda_tree_1k.gltf/jacaranda_tree.bin` | **199 MB** | No (uses Draco `jacaranda_1k_draco.glb`) |
| `public/assets/new assets/boardwalk_in_the_forest_-_point_cloud.glb` | **125 MB** | No |

Plus **1 file at 85 MB** (`new assets/final_forest.glb` — the disabled 85 MB forest) and others
40–48 MB (`models/character/player.glb` 48 MB, `src/assets/models/myhouse.glb` 43 MB). **5 files
≥ 50 MB total ~1.29 GB.** Critically, **all four push-blockers are unused** (raw gltf source /
point cloud / disabled GLB) — the runtime uses the small Draco-optimized copies.

> **Key fact:** deleting these files *now* does **not** fix the push — they remain in **history**.
> Fixing the push requires either rewriting history to purge them, or pushing a fresh snapshot
> that never contained them. (§6.)

## §3 · Which assets should stay in Git
**Only the curated ~50–80 MB that the runtime actually loads** (per `ASSET_AUDIT_REPORT.md`):
optimized Draco GLBs (`forest_fir`, `forest_jacaranda`), used village models/houses, the active
HDRI, used textures (laterite, gravel_sand, forest-ground, cobblestone), the active character.
**Every kept file must be < 100 MB** (ideally < 25 MB). This set is small enough to live in Git
**without LFS.**

## §4 · Which assets should NOT stay in Git
- All **> 100 MB** files (§2) — raw gltf `.bin` source, point clouds, the disabled `final_forest.glb`.
- **Unused multi-GB folders:** the bulk of `textures/` (~1.1 GB, ~3 of 45 folders used), unused
  `models/` packs (stylized-nature-pack normals 18–22 MB each, etc.), raw `forest/forest/*.gltf`
  source, unused HDRIs (only `village_sky2.exr` is active of ~14), `new assets/` heavy items.
- `.fbx` source (e.g., `characters/background-humans/*.fbx`) — source format, not runtime.

## §5 · Git LFS — appropriate or avoid?
**Recommendation: AVOID LFS for this repository.**
- **Why LFS would seem to fit:** it's the standard tool for binary assets in Git.
- **Why to avoid it here:**
  1. **Quota/cost:** GitHub LFS free tier is **1 GB storage + 1 GB/month bandwidth**. The asset
     tree is **3.4 GB** → LFS would require a paid plan, ongoing, for a solo portfolio.
  2. **Migration still needs history rewrite:** existing committed blobs must be migrated
     (`git lfs migrate`), which rewrites history anyway — same risk as purging.
  3. **It's unnecessary:** the *used* asset set is only ~50–80 MB. Once the unused 3.3 GB is out
     of Git, there is no large-binary problem left to solve.
- **When LFS WOULD be right:** if you decide to version *all* raw source assets in Git and accept
  the paid quota. For a portfolio, external hosting of raw source is cheaper and simpler.

## §6 · Recommended `.gitignore` structure (add to current file)
```gitignore
# ─── Assets: keep raw/large/unused binaries OUT of git ───────────────
# Runtime uses a small curated set; raw source is hosted externally.
# Big binary source formats (never runtime):
*.bin
*.fbx
# Heavy / unused asset folders (see GIT_ASSET_STRATEGY.md):
public/assets/new assets/
public/assets/forest/forest/*.gltf/
public/assets/models/stylized-nature-pack/
# Large media generally (override per-file with ! if a small used file matches):
*.exr
# Source models scratch:
src/assets/models/
```
*(Exact include/exclude must be finalized against the curated keep-set in §3 — use `!negation`
to force-keep the specific used files. Do not apply until the keep-set is confirmed.)*

## §7 · Long-term asset strategy for this Three.js portfolio
**"Code + docs + small used assets in Git; raw/large assets hosted out-of-band."**
1. **Git holds:** all `src/`, all docs, and the curated < 100 MB used-asset set.
2. **Raw/large assets live outside Git:** an external bucket (Cloudflare R2 / S3 / Backblaze),
   a GitHub *Release* artifact (zip), or a local/offline archive — referenced by a short
   `ASSET_SOURCES.md` manifest so they're reproducible and never lost.
3. **Optimize before commit:** Draco-compress GLBs, 2K JPG textures for runtime (4K only for hero
   surfaces), `.exr` only for the 1 active HDRI. (Mirrors existing `EXTERNAL_ASSET_DOWNLOAD_PLAN`
   guidance.)
4. **Net effect:** repo shrinks from 3.7 GB to tens of MB → fast clone, free GitHub, agent-friendly.

## §8 · The safest path to a working GitHub backup (two options)
- **Option A — Fresh clean snapshot (simplest, safest for a solo dev):** keep
  `backup-before-cleanup` **local** (full history + all assets = your recovery point), add the
  `.gitignore` (§6), and push a **new clean snapshot** (code + docs + used assets, no big-file
  history) to GitHub — e.g. a fresh repo or an orphan branch. No history-rewrite gymnastics; the
  full-fidelity past stays local + offline.
- **Option B — History rewrite in place:** `git filter-repo` (or BFG) to purge the > 100 MB (and
  unused) blobs from all commits, then push. More "correct" history, but **irreversible on the
  rewritten branch** — requires an offline backup first (§ REPOSITORY_STRATEGY recovery).

**Recommended: Option A** for getting an off-site backup quickly and safely; consider Option B
later only if you want a single clean canonical history on GitHub.

> Cross-refs: `ASSET_AUDIT_REPORT.md` (used vs unused), `EXTERNAL_ASSET_DOWNLOAD_PLAN.md`
> (provenance), `REPOSITORY_STRATEGY.md` (backup/recovery), `CLEANUP_STRATEGY.md` (sequencing).
