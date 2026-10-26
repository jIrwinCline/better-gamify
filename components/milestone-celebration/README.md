# Milestone Celebration

A dependency-free presentation for confirmed achievements. Use an inline card,
non-modal toast, or native modal dialog. It starts hidden and has no timers,
autoplay loops, automatic awards, or storage dependencies.

```html
<script type="module" src="/components/milestone-celebration/milestone-celebration.js"></script>
<milestone-celebration id="milestone" variant="inline"></milestone-celebration>
```

```js
const celebration = document.querySelector('#milestone');
await customElements.whenDefined('milestone-celebration');

// Use a durable event ID supplied by your app after the milestone is confirmed.
celebration.celebrate({
  id: 'lesson-completed:lesson-42:member-7',
  title: 'Your first lesson, complete.',
  description: 'A small step toward a lasting skill.',
  rewardLabel: '+25 XP',
});

celebration.addEventListener('milestone-dismiss', ({ detail: { id } }) => {
  // Optional: record the user's dismissal according to your product's policy.
});
```

## API

| API | Meaning |
| --- | --- |
| `celebrate({ id, title, description?, rewardLabel? })` | Show a new event. Returns `true` when accepted, `false` when that ID was already shown by this instance. |
| `dismiss()` | Hide the visible event. Retains its presentation history. |
| `reset()` | Hide and clear all presentation history. Intended for demos or an explicitly changed account/context. |
| `visible` | Read-only boolean indicating a requested visible celebration. |
| `variant` attribute | `inline` (default), `toast`, or `dialog`. |
| `theme` attribute | `light` (default) or `dark`. |

IDs and titles must be nonempty strings; optional copy must be strings. Validation
throws before consuming an ID. Events are copied and frozen, and content is
rendered as text. A new event replaces the currently visible one. Duplicate IDs
do not replace content, even when their text differs. Changing theme or variant
does not clear history or replay the entrance animation.

Deduplication is only for presentation within this instance's lifetime. It is not
an award ledger, survives neither a page reload nor a new instance, and does not
replace server idempotency. If a product should celebrate only once across devices
or sessions, the host must supply eligible unseen events. `reset()` deliberately
allows an old ID to be presented again; do not call it during routine rerenders.

`milestone-dismiss` bubbles across the Shadow DOM boundary with `{ id }`. It fires
once when a visible celebration is dismissed via its close button, Escape in the
dialog, a native dialog close, or `dismiss()`. It does not fire for `reset()`, for
replacing one event with another, or for dismissing an already hidden component.
Removing the component hides it without clearing history. Calling `celebrate()`
before mounting stores the explicit request and shows it when connected.

## Display and accessibility

Inline and toast variants use a polite live announcement without moving focus.
The toast appears at the bottom right, adapts to narrow screens, and remains until
dismissed. No essential information expires on a timer. Use inline for routine
successes and reserve dialog for milestones worth interrupting the user.

The dialog uses native `showModal()` behavior: background content is inert,
keyboard focus stays within the modal, Escape closes it, and the browser restores
focus to the prior control. Its title and description supply accessible names.
All variants have a labeled close button and visible focus styles. The entrance
animation is bounded to 480 ms and skipped for reduced-motion preferences. There
is no confetti loop, sound, notification permission, or third-party media.

Typography is inherited. Tokens are `--bg-accent`, `--bg-surface`, `--bg-text`,
`--bg-muted`, `--bg-border`, and `--bg-radius`. Parts are `panel`, `dialog`, `icon`,
`title`, `description`, `reward`, and `dismiss-button`.

Node imports are safe. `normalizeMilestone(event)` validates and freezes copy;
`MilestoneHistory` exposes `accept(event)` (snapshot or `null` for a duplicate)
and `reset()` for the same local presentation-history behavior used by the UI.

Run `node --test tests/milestone-celebration.test.mjs` from the repository root.
