# Milestone Celebration

A presentation component for a confirmed milestone. Choose inline, toast, or
dialog feedback according to the importance of the moment. It accepts a stable
event ID and suppresses repeat calls with that ID during the component's lifetime.

The component does not create milestones, grant rewards, or persist seen-state.

## Install and configure

Copy `components/milestone-celebration/milestone-celebration.js` into your
project, import it once, and add the element:

```html
<script type="module" src="./milestone-celebration.js"></script>
<milestone-celebration
  variant="inline"
  theme="dark"
></milestone-celebration>
```

| Setting | Values / meaning |
| --- | --- |
| `variant` attribute | `inline`, `toast`, or `dialog` |
| `theme` attribute | `light` or `dark` |
| `celebrate(event)` | Show a new event; returns whether it was accepted |
| `dismiss()` | Hide the current presentation; retain seen IDs |
| `reset()` | Hide it and clear this instance's seen IDs |

An event has `id`, `title`, `description`, and an optional `rewardLabel`:

```js
const celebration = document.querySelector('milestone-celebration');

const shown = celebration.celebrate({
  id: 'first-project:confirmed-event-123',
  title: 'Your first project is ready.',
  description: 'A useful first step. Keep going.',
  rewardLabel: '+25 XP',
});
```

Use a stable ID from the actual product event. Replacing it with a timestamp or a
new random value on each render defeats duplicate suppression.

## Choose the right presentation

- **Inline:** an acknowledgment that belongs beside the completed work.
- **Toast:** lightweight feedback without replacing the current task.
- **Dialog:** an occasional significant milestone worth focusing on.

All three variants describe the same event. Avoid escalating ordinary repeated
actions into dialogs. Keep the title specific, the description concise, and any
reward label consistent with what the application has already confirmed.

The component respects reduced-motion preferences. Check focus and dismissal in
the real app, especially when using the dialog presentation.

## Connect real milestone events

```js
import './milestone-celebration.js';

const celebration = document.querySelector('milestone-celebration');
const event = await getLatestUnseenMilestone();

if (event) {
  const shown = celebration.celebrate({
    id: event.id,
    title: event.title,
    description: event.description,
    rewardLabel: event.rewardLabel,
  });

  if (shown) await recordMilestoneSeen(event.id);
}
```

`getLatestUnseenMilestone()` and `recordMilestoneSeen()` represent your app's
own adapters. Decide what “seen” means for the product and record it consistently
in that service. Treat `shown` as an accepted presentation request, not proof
that a person read the message or completed an activity.

The component remembers IDs only in the current instance. Reloads, new instances,
other tabs, or other devices require durable host-owned seen-state if repeats
should stay suppressed. Account changes must also use the correct host-owned
event history.

A repeated event is ignored even after `dismiss()`. Calling `reset()` clears
that local history and permits the same ID again. Reset is useful for demos and
intentional instance reuse; it must not erase production reward records.

Keep event creation, reward accounting, and presentation separate. A local
celebration must never be the condition that grants an entitlement.

## Fit the app

The component inherits the host's font. Adapt these shared CSS hooks:
`--bg-accent`, `--bg-surface`, `--bg-text`, `--bg-muted`, `--bg-border`,
and `--bg-radius`. Set `theme="light"` or `theme="dark"` for the starting
palette.

Use a calm default treatment and save larger celebrations for rare milestones.
Keep a clear continuation path and honor reduced-motion preferences without
removing the milestone's meaning.

## Verify the integration

Test a fresh event, the same ID twice, replay after dismissal, reset followed by
replay, and a new milestone arriving while another is displayed. Check all three
variants, keyboard dismissal, focus restoration for dialogs, reduced motion, and
narrow screens.

Test reload and account changes against the host's durable seen-state. Failed
seen-state writes must not accidentally grant or duplicate any underlying reward.

The guide includes new-event, replay, dismiss, and reset controls. Its milestones
and rewards are simulated and its history lasts only for that demonstration.

Use the [Milestone Celebration implementation skill](../skills/milestone-celebration/SKILL.md)
to select and integrate an appropriate product moment.
