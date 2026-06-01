# ZONE_MASTER_TEMPLATE.md — Schema for every `02-zones/MASTER_*.md`

> **Layer:** 05 · Templates
> **Status:** LOCKED
> **Version:** 1.0 · **Last updated:** 2026-05-31
> **Purpose:** the uniform schema every Zone master follows. Uniformity is what lets an AI agent
> parse any zone identically (the backbone of automated evaluation). Extracted from the shared
> shape of `MASTER_FOREST`, `MASTER_PROJECTS`, and `MASTER_VILLAGE`. Copy this; fill every section;
> do not drop sections (write "N/A — reason" if truly inapplicable).

---

```
# MASTER_<ZONE>.md — The <Zone> Zone

> Layer: 02 · Zones
> Status: LOCKED | DRAFT | BLOCKED  (+ note what's deferred)
> Version: x.y · Last updated: <date>
> Inherits from: 00-canon/*, 01-languages/*, relevant zone/experience docs
> Owns the question: "<the ONE question this zone answers>"
> Purpose: <one line — what this doc is authority for>

## §1 · What the zone OWNS
<the single thing; the feeling; the visitor takeaway>

## §2 · What the zone does NOT own
<each adjacent zone's territory + the wall rule that keeps the seam clean>

## §3 · Why the zone exists / why the visitor is here
<its job in the journey; what breaks if removed>

## §4 · Visitor / recruiter takeaway
<what they hold after leaving>

## §5 · The balances (zone tuning)
<story↔evidence · interaction↔observation · immersion↔usability · exploration↔efficiency —
state where this zone sits and why>

## §6 · Recruiter journey
<before entering · while exploring · after leaving>

## §7 · Emotional / narrative / experience journeys
<the three parallel tracks through this zone>

## §8 · Layout & landmarks
<spatial structure; every landmark + its meaning>

## §9 · Sub-components / functional elements
<the zone's defining pieces; LOCKED set, count justified by memory-over-completeness>

## §10 · Visitor flow
<arrival → key beats → onward; hub-and-spoke; Fast Path presence>

## §11 · Relationships
<each neighbouring zone + Fast Path; cross-links in/out>

## §12 · Expression rules
<how this zone must communicate; show-don't-tell vs verification; any deliberate exceptions>

## §13 · What BELONGS / what does NOT
<concrete accept/reject lists>

## §14 · Scope protection
<the "never add" list that prevents churn/bloat; the "allowed without reopening" list>

## §15 · Quality standards
<the bar; which Language checklists apply>

## §16 · Success criteria (checkable)
<numbered, testable outcomes; seeds the evaluation layer>

## §17 · Pressure-test record / rejected directions  (optional but recommended)
<what was challenged and decided, so settled debates aren't relitigated>

## §18 · Decision status / UNRESOLVED
<LOCKED items (ratified) vs open decisions; never treat UNRESOLVED as canon>

## §19 · Build order
<prototype → final for this zone>

## §20 · How to use this document
<for humans (build) and AI agents (evaluate) — the evaluation hooks>
```

---

**Rules for filling it:**
- One zone = **one question** (§ Owns). If you can't state it in one line, the zone isn't ready.
- Keep the **walls** (§2) explicit — they are the most re-merge-prone failure point.
- **Memory over completeness** in §9 — justify the count; do not proliferate.
- Mark deferred instance content (metrics, chronology, real names) as future content; it must not
  block the architecture from locking.
- Every section serves a human *and* an agent; success criteria (§16) must be checkable.
