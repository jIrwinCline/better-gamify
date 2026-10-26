---
name: reward-button
description: "Implement a completion or reward-claim button with tactile feedback and honest pending, earned, and retry states in an existing app. Use for individual lesson, task, or reward actions; not an entire onboarding rewards program or a generic button restyle."
---

# Reward Button

Make a meaningful action feel satisfying while keeping the application's actual
completion and reward rules in charge. A press requests an action; success comes
from the application's authoritative result.

## Find the action and its authority

Inspect repository instructions, the target screen, existing buttons, design
tokens, action handlers, authentication, and relevant tests. Locate the service
that completes the task or grants the reward, including its response and retry
behavior. Reuse those paths instead of adding a parallel reward system.

If the target app is missing, ask for it. Otherwise ask only unresolved questions
that affect the behavior: what counts as completion, whether the action repeats,
who receives the benefit, and whether completion and claiming are separate steps.
Proceed with independent UI work while consequential reward rules remain open.
Preserve the requested scope: exploration can end in a design; implementation
includes wiring and validation. Publishing or issuing real awards is not implied
by building the control.

Useful applications include completing a lesson, recording a finished focus
session, or claiming an already eligible perk. Do not introduce points when a
simple completed check matches the product. Use the existing currency and approved
amounts when a reward is present; any proposed values remain labeled demo data.

## Connect honest states

- Map available, pending, success, failure, and unavailable states to the actual
  action lifecycle. A timer or animation finishing cannot establish completion.
  When task completion succeeds but reward delivery is pending, represent both.
- Resolve the authenticated beneficiary and eligibility in the existing service.
  For real grants, the server determines amounts and enforces durable uniqueness
  for the entitlement or repeatable occurrence. A disabled button is not duplicate
  award protection. Reuse a stable claim identity when retrying a lost response.
- Prevent overlapping requests in the control. On timeout or an ambiguous result,
  reconcile the service's state before displaying failure or retrying a grant.
  Offer an explicit retry for recoverable errors; do not retry indefinitely.
- Render the returned result and actual award, if any. Reconcile on remount and
  scope changes. Reset to ready only when a genuinely new repeatable action is
  available, rather than allowing another award after a cosmetic reset.

If no service exists, build an explicitly simulated preview or the smallest
authorized integration. Do not describe browser-only success as a real grant.
Leave missing integration setup precise and visible.

## Fit the host interface

Reuse the app's type, spacing, color, icons, and component conventions. Raised,
compact, and progress-to-check treatments are useful options; choose for the
screen rather than installing a new design system. Keep the action verb visible
and the meaning understandable without sound, color, movement, or an XP label.

Use native button semantics with Enter/Space activation, a visible focus ring,
and an accessible name. Keep focus stable across state changes, expose busy and
unavailable states, and announce a concise result once. Respect reduced motion;
use a static success state instead of forcing a celebratory movement. Keep touch
targets and longer translated labels usable at narrow widths.

The optional [Better Gamify component](https://github.com/jIrwinCline/better-gamify/tree/main/components/reward-button)
can provide a starting point. Inspect its current API before using it, or adapt
the interaction to the app's framework. The skill works without a local library
checkout and does not assume component files are bundled with it.

## Validate and deliver

Exercise keyboard activation, pending, successful completion, unavailable state,
and recoverable failure. For real grants, verify repeated or concurrent requests
and a lost response cannot award twice, and that the client cannot choose another
beneficiary or amount. Check reload reconciliation and repeatable occurrences
when relevant. Inspect the integrated control at small and large widths and with
reduced motion; run the repository's appropriate checks.

Report the placement, connected action, reward source, relevant validation, and
remaining setup. Distinguish an integrated feature from a simulated demonstration.
