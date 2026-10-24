# Experience and measurement

## Fit the existing product

Inspect the actual screen and nearby components, not only a Tailwind/config file.
Reuse the application's content width, density, typography, colors, corner radii,
button hierarchy, icons, breakpoints, dark mode, and status messaging. Record
component/token reuse points in the implementation plan. Add no animation or UI
library merely for this feature.

The reference pattern has an optional welcome section, a brief reward explanation,
a compact card grid, clearly different awarded states, and an always-available
Continue action. Transfer those interaction ideas. Orange buttons, green cards,
six items, large blank areas, and a four-step wizard are not required.

Keep candidate rejections, missing-code explanations, provider policy research,
and budget deliberations in the owner's handoff, outside the end-user flow. Omit
excluded actions from the product checklist; do not fill it with disabled tasks
or proposed rewards that users cannot earn. For a requested design demonstration,
use a clear preview marker and separate owner annotations. Simulated states are
acceptable when labeled, but must not imply an integrated credit balance.

Choose placement from the app's journey: an optional onboarding step, welcome
checklist, or account reward panel. Add a return path so skipping does not forfeit
eligible rewards. Do not force a modal ahead of first value without a product
reason. A simple app does not need an additional multi-step onboarding wizard.

## Card anatomy and states

Each card should make the offer understandable before action:

- Clear verb and concrete object: “Create your first report.”
- One brief benefit or qualifying condition.
- Exact reward in the app's unit, including applicable conditions/expiry.
- One obvious action, and truthful progress or completion feedback.

| State | Example display | Behavior |
|---|---|---|
| Available | Create a report · +20 credits | Begin the action in the normal product flow |
| Pending | Checking completion… | Preserve progress; allow continuation and later retry |
| Eligible | Claim 20 credits | Only when explicit claiming serves the chosen flow |
| Awarded | 20 credits added ✓ | Render from the confirmed award; no repeat claim |
| Retryable failure | Couldn't check yet · Try again | Explain without blaming the user |
| Unavailable | Not available for this account | Hide irrelevant tasks or explain useful restrictions |

Numbers here illustrate copy, not recommended reward amounts. Auto-award a trusted
completion when extra claiming would be needless friction. If a user action is
needed for consent or offer acceptance, preserve that step.

Update the real balance only after the server confirms it. A restrained success
message can celebrate the award; never fake “verified” or inflate progress for a
click. Honor-system copy should say that it is self-reported. A timeout does not
erase a successful award; reconcile before encouraging another claim.

Progress must have a defined denominator: “2 of 4 rewards earned” is different from
“Step 1 of 4” in a separate onboarding wizard. Base reward progress on eligible
tasks and persisted awards. Avoid misleading completion percentages when the
catalog changes or rewards are still pending.

## Accessibility and resilience

Use semantic links for navigation and buttons for actions, visible keyboard focus,
accessible names, textual status beyond color, and appropriate live announcements
for grants/errors. Avoid a clickable card containing conflicting nested controls.
Keep touch targets usable, narrow screens readable, longer labels contained, and
loading states stable. Respect reduced motion and the application's localization.

Check external return, back navigation, refresh, repeated visits, all-awarded and
empty catalogs. Keep Continue/Skip usable during provider failures. Avoid public
sharing of private output by default; users choose the content and destination.
Do not auto-post, follow, subscribe, or send invitations during implementation tests.

## Measurement proportional to the app

Use existing analytics if present; otherwise offer a small integration seam instead
of adding a vendor without reason. Useful events are program viewed, action
started, verification result, award committed, skipped, and returned. Attach
stable program/action/entitlement IDs, experiment variant if used, and credit
amount/unit only where relevant. Award events come from the authoritative path and
deduplicate by award ID. Avoid storing provider credentials or unnecessary PII.

Measure more than claimed credits: completion per eligible user, subsequent use
of the rewarded product capability, retained activation, qualified referral
conversion, and cost per activated user. Label these as metrics to measure unless
actual data exists. A holdout or staged rollout is useful when the application
already supports it; do not build an experimentation platform for a few cards.
