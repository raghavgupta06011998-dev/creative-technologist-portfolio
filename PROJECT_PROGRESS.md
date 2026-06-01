# PROJECT_PROGRESS.md

> Short milestone tracker. For full project state see `PROJECT_FULL_CONTEXT.md`.
> Last refreshed: 2026-05-25

## Project goal
A cinematic 3D interactive portfolio in Three.js — a playable narrative world: space → portal → village → bridge → forest → mountain career → projects → future.

---

## Status legend
✅ done · 🟡 in progress · ⚠ blocked / has open issues · ⬜ not started

---

## Village hub — what's in

| Item | Status | Notes |
|---|---|---|
| Player + camera | ✅ | kaykit Knight + 3rd-person orbit |
| Terrain (multi-layer) | ✅ | base + gravel + worn + shoulders + mud, no green-lawn |
| Approach + loop + north road | ✅ | cobblestone, CatmullRom ribbon |
| Back lanes (left + right) | ✅ | narrower cobblestone behind side houses |
| Back street (outer dirt path) | ✅ | |
| Entrance welcome sign | ✅ | "RAGHAV'S WORLD" canvas board |
| Hero house | ✅ | centre at (0, 0, −48) |
| 8 side houses | ✅ | ring R = 53–60 |
| Market zone | ✅ | original `pp_village_market` + 2 × `new_village_market` |
| Farm zone | ✅ | pasture + fences + 8 farm buildings/structures + back-soil patch |
| Street trees (28) | ✅ | jacaranda + fir mix |
| Outer rocks | ✅ | |
| River (code water) | ✅ | crosses at z ≈ −140 |
| Bridge (bridge_01.glb) | ✅ | walkable deck registered with gravity raycaster |
| Collision system (80+ colliders) | ✅ | circles + AABBs, horizontal-only resolver |
| Village props (lamps/benches/signs/storage) | ✅ | |
| Final forest (single 85 MB GLB) | ⚠ | placed and walkable via invisible plane, but problematic — see below |
| Backing land behind forest | ✅ | 600×600u plane to fill horizon |

---

## Open issues (live)

| Severity | Issue | Plan |
|---|---|---|
| 🔴 high | Final forest is a single 85 MB GLB — walkability is hacked, can't draw custom paths through it | Replace with modular Poly Haven trees (Pine Tree 01, Fir Tree 01, Jacaranda, Island Tree 03, Root Cluster 01) + build the road ourselves |
| 🟡 med | Player character is the stylised default kaykit Knight | Ready Player Me avatar + Mixamo animation retarget in Blender |
| 🟡 med | River is plain — no directional flow under the bridge | Upgrade to `THREE.Water2` with hand-painted flow map |
| 🟢 low | No distant mountain ring around the village | Poly Haven cliff-side texture draped on curved background plane |

---

## Next steps (priority order)

1. 🔴 Replace `final_forest.glb` with modular Poly Haven trees + custom road
2. 🟡 Swap player character (Ready Player Me + Mixamo)
3. 🟡 Upgrade river to `Water2` with flow map
4. 🟡 Add village background ring (cliff-side draped plane)
5. ⬜ Mountain career path — 5 mountain zones, each with a gate
6. ⬜ Project worlds (each major project as a portal / mini world)
7. ⬜ Future / sunrise area
8. ⬜ Hero house interior story content
9. ⬜ Experience street (internships timeline)
10. ⬜ Space intro + portal arrival

---

## Recently resolved

- ✅ Collision system extended to ~80 colliders (trees, benches, lamps, signs, fences, all farm buildings, both markets)
- ✅ Back lanes redesigned + connected to main road at entrance
- ✅ Mountain terrain GLB removed (was causing yellow base bleed-through)
- ✅ Bridge made walkable, deck registered with gravity raycaster
- ✅ Forest brought forward to butt the bridge exit (no walking gap)
- ✅ Backing land plane added behind the forest

---

## Documentation cleanup (2026-05-25)

- ✅ 9 historical direction / blueprint MDs archived into `archive/DIRECTION_HISTORY.md` and `archive/BLUEPRINT_HISTORY.md`
- ✅ `PROJECT_FULL_CONTEXT.md` rewritten as live source of truth
- ✅ `CLAUDE.md` refreshed — stripped obsolete Y-road section, now points at PROJECT_FULL_CONTEXT.md
- ✅ Root MD count: 16 → 7 + 1 archive folder
