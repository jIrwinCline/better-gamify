---
name: xp-meter
description: "Implement an XP, level, or milestone progress display using an app's real progression rules and existing style. Use for experience counters, level bars, and goal meters; not loading indicators, spendable credit accounting, or leaderboards."
---

# XP & Level Meter

Show meaningful advancement using the product's existing progression model.
Explain the current state and next milestone even when the animation is absent.

## Discover the progression model

Inspect repository instructions, the target screen, design tokens, existing
progress indicators, authenticated account or workspace scope, progression
services, and tests. Find what earns experience and where totals, thresholds,
levels, and unlocks come from. Reuse established rules and UI primitives.

Ask for the target app if it cannot be identified. Ask only unresolved questions
that change implementation: the owner of progress, threshold schedule, maximum
level, and what the next level actually changes. If the user wants a new model,
propose explicit rules before integrating real awards or entitlements. Continue
with a labeled preview while product decisions remain open. Do not manufacture
a leveling system simply because a progress display was requested.

Examples include learning experience, contributor reputation, and milestones for
creators. A fixed goal can use a meter without inventing levels. Keep experience
separate from spendable credits unless the product deliberately equates them.
Implementation requests include integration and checks; a design-only request
does not authorize an account migration or live rollout.

## Make the numbers truthful

- Read progress from its authoritative application service. UI animation does
  not earn XP, and client-written totals cannot grant real unlocks. Keep any
  entitlement checks in the existing authorization layer.
- Establish whether thresholds are cumulative or per level. For cumulative
  thresholds, progress within a level is `(total - levelStart) / (next - levelStart)`.
  Convert other models explicitly rather than mixing their units. Handle exact
  boundaries, variable intervals, and several levels crossed by one update.
- Distinguish a maximum level from a missing next threshold. At the maximum,
  show an honest completed state without dividing by zero or promising another
  unlock. For invalid or unavailable data, use the app's unavailable state rather
  than inventing a total or silently changing the progression rules.
- Keep an existing known value while refreshing, with the app's stale/error cue
  when needed. An initial load failure is not zero XP. Reject stale responses for
  an old account, workspace, or revision. Respect legitimate corrections and
  resets; do not turn decreases into celebratory gains.
- Derive an animated delta from confirmed values for the same owner and rule
  period. Avoid replaying a gain on every mount. If a level-up celebration is
  included, trigger it from the confirmed change or event, not a CSS transition.

## Build the display in context

Choose a compact counter, horizontal level bar, or goal ring according to the
available space. Keep the unit, current level or goal, and remaining amount
readable. Explain any real next-level benefit; omit invented unlock copy.

Reuse the application's font, radius, color, and spacing. Animated numbers may
use tabular figures to prevent layout movement. The accessible value must describe
the actual progress; avoid announcing every interpolation frame. Use a named
progress element or equivalent semantics for a bounded goal. Pure totals need a
readable label, not a misleading progress-bar role. Do not add a keyboard stop to
a passive display. Any details control retains normal keyboard and focus behavior.

Respect reduced motion with immediate values and a stable fill. Ensure the state
is clear without color, and that large/localized values work on small screens.
Data refresh and error recovery should follow the app's existing patterns.

The optional [Better Gamify component](https://github.com/jIrwinCline/better-gamify/tree/main/components/xp-meter)
is a presentation starting point. Read its current API if using it; adapt to the
host stack when preferable. No adjacent component checkout is required by this
skill, and the display does not provide an XP ledger.

## Validate and deliver

Test the progression cases the integration actually supports: zero, mid-level,
exact threshold, multiple-level advance, maximum level, correction, missing data,
and an old response arriving after an owner change. Check the visible and
accessible values agree, and that refresh/remount does not replay an award.
Inspect small/large layouts and reduced motion, then run relevant repository
checks. Report the data source, level rules, placement, validation, and any
remaining integration. Label simulations clearly.
