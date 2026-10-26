# Reward Button

A small, dependency-free action control with raised, compact, and outline variants.
It requests a product action and reflects state supplied by the host. It never
issues XP, confirms task completion, or calls an API on its own.

```html
<script type="module" src="/components/reward-button/reward-button.js"></script>
<reward-button id="lesson" label="Complete lesson" reward-label="+25 XP"></reward-button>
```

```js
const button = document.querySelector('#lesson');
await customElements.whenDefined('reward-button');
button.addEventListener('reward-request', async () => {
  // Set pending synchronously to guard additional activations during this request.
  button.status = 'pending';
  try {
    // Your application validates actual completion and reconciles retries.
    const result = await completeLessonAndFetchRewardState();
    button.status = result.awarded ? 'earned' : 'unavailable';
  } catch {
    button.status = 'error';
  }
});
```

`completeLessonAndFetchRewardState` is an application integration point, not an
export. After an uncertain network result, the host should reload authoritative
state before allowing a new attempt. Production awards need server-side
idempotency; disabling this button is only a usability guard.

## API

| Property | Attribute | Default | Meaning |
| --- | --- | --- | --- |
| `label` | `label` | `Complete action` | Action description. |
| `rewardLabel` | `reward-label` | Empty | Display-only reward copy, such as `+25 XP`. |
| `status` | `status` | `ready` | `ready`, `pending`, `earned`, `error`, or `unavailable`. |
| `disabled` | `disabled` | `false` | Prevent all requests while keeping the control focusable. |
| — | `variant` | `raised` | `raised`, `compact`, or `outline`. |
| — | `theme` | `light` | `light` or `dark`. |

`reward-request` bubbles across the Shadow DOM boundary and has no detail payload.
Only `ready` and `error` allow requests. The host owns all state transitions:
`ready → pending → earned`, or `pending → error` when a retry is appropriate.
The property setter rejects unsupported statuses; unknown attribute values render
as `unavailable`. Re-entrant clicks during one event dispatch are ignored.

The label stays visible in every state. Pending adds “Working…”, earned adds
“Earned”, error adds “Try again”, and unavailable adds “Unavailable”. Supply actual
eligibility/error explanations near the button when needed. The reward label
remains offer copy in pending/error states; it is not a receipt.

## Styling and accessibility

The component inherits your font. Theme variables are `--bg-accent`,
`--bg-surface`, `--bg-text`, `--bg-muted`, `--bg-border`, and `--bg-radius`.
`--bg-on-accent` controls the text on the raised/compact accent background; choose
an accessible contrast pair when overriding the accent. Parts are `button`,
`label`, and `reward`.

The same native button survives state updates, preserving keyboard focus.
`aria-disabled` communicates ineligible states while the click handler blocks
activation; `aria-busy` marks pending work. State changes receive a polite live
announcement. Enter and Space use native button behavior. Press movement is
removed with reduced motion. Host text is always literal text, never markup.

Importing in Node is safe. The exported `rewardButtonState(status, disabled)`
helper returns frozen display state; it has no persistence or reward side effects.

Run `node --test tests/reward-button.test.mjs` from the repository root.
