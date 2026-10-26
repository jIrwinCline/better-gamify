---
name: milestone-celebration
description: "Implement restrained milestone feedback such as inline success, achievement toasts, or level-up reveals tied to real app events. Use for celebrating meaningful completed accomplishments; not generic notifications, decorative confetti, or determining achievement eligibility."
---

# Milestone Celebration

Celebrate an accomplishment the application has actually confirmed. Match the
intensity to the moment and keep the result understandable after the effect ends.

## Find a meaningful trigger

Inspect repository instructions, the target user journey, design tokens, existing
notification/dialog components, event producers, account scope, preferences, and
tests. Locate the authoritative completed event and distinguish it from attempts,
requests, loading completion, and replayed history. Reuse the app's notification
and event infrastructure.

Ask for the target application if missing. Ask only consequential unresolved
questions: which accomplishment deserves feedback, who should see it, and whether
it should appear once per session, device, or account. Use established product
rules when present. Continue visual work with clearly simulated triggers while
real event integration is unavailable. Keep deployment and real awards within
the user's authorized scope.

Examples include a first published project, a completed course, a confirmed new
personal record, or a level-up. If the source merely establishes a first baseline,
do not call it a new record. If a reward is still pending, celebrate only the
confirmed accomplishment and describe the reward's state accurately.

## Choose the smallest useful response

- **Inline success:** a quiet check or short spark beside a completed action.
- **Achievement toast:** a concise milestone message that preserves the current
  task and can link to details.
- **Major reveal:** an intentional dialog for a significant unlock when the user
  benefits from its explanation. Do not interrupt every small gain with a modal.

Use existing typography and surfaces. A brief pixel accent or particle burst can
add character when it fits the app; the text and icon carry the meaning. Do not
invent an amount, badge, level, or entitlement for a more impressive animation.
Do not add sound, vibration, or new permissions unless within the requested scope.

## Integrate delivery and dismissal

Use a stable milestone event ID plus recipient scope to deduplicate the confirmed
event. An animation-end callback, button click, or component mount is not a source
of achievement evidence. The presentation component neither awards points nor
determines eligibility.

Choose storage that matches the product's delivery promise. In-memory suppression
only covers the current instance; browser storage does not establish account-wide
delivery. Reuse durable acknowledgments when the app promises cross-device or
cross-session suppression. Decide when delivery is recorded, and document any
remaining replay/loss tradeoff rather than claiming exactly-once visual delivery.
Reset event scope on sign-out or account changes.

For bursts of events, use a bounded queue or coalesce related gains. Apply existing
preferences and dismissal behavior. Cancel timers/effects when disposed and avoid
reopening a dismissed reveal during an unrelated refresh. A failed source request
uses normal error/retry feedback and never schedules a celebration. If an optional
details action fails, keep the confirmed accomplishment visible and make that
action retryable without presenting a second award.

## Keep the experience accessible

Announce the concise result once through the existing status/notification pattern;
avoid separate live regions competing to repeat the same event. Decorations are
hidden from assistive technology and cannot block interaction. Reduced motion
uses a stable icon and message instead of particles, bounce, or large movement.

Background feedback should preserve focus. An intentional dialog needs its usual
accessible name, focus management, Escape/dismiss action, and focus restoration.
Keep keyboard-operable actions and visible focus. Do not make essential details
available only in a fleeting toast; retain them in the relevant progress/history
view or use the app's accessible persistent notification pattern.

The optional [Better Gamify component](https://github.com/jIrwinCline/better-gamify/tree/main/components/milestone-celebration)
can supply presentation behavior. Inspect its current API before integration, or
reuse the app's native primitives. This skill needs no adjacent library checkout;
application-level evidence and durable delivery remain the host's responsibility.

## Validate and deliver

Exercise a real success, a failure with no celebration, duplicate delivery,
remount, account switch, bursts, dismissal, and the delivery policy actually
chosen. Verify reduced motion, keyboard/focus behavior, one accessible
announcement, and narrow/wide layouts. Run relevant repository checks and report
the event source, intensity, suppression scope, results, and remaining setup.
Clearly distinguish a preview trigger from a completed production integration.
