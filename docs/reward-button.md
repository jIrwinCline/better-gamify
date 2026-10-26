# Reward Button

A small completion or claim control with three visual variants and five explicit
states. The dependency-free Web Component sends a request and renders the state
your application supplies.

Use it for a lesson reward, an earned benefit, or another meaningful product
action. It is the presentation layer of a reward flow, not its verification or
accounting service.

## Install and configure

Copy `components/reward-button/reward-button.js` into your project and import it
once as an ES module:

```html
<script type="module" src="./reward-button.js"></script>
<reward-button
  label="Claim lesson reward"
  reward-label="+25 XP"
  status="ready"
  variant="raised"
  theme="dark"
></reward-button>
```

| Setting | Values / meaning |
| --- | --- |
| `label` | Readable action text |
| `reward-label` | Display text describing the reward; never an award amount to trust |
| `status` | `ready`, `pending`, `earned`, `error`, or `unavailable` |
| `variant` | `raised`, `compact`, or `outline` |
| `theme` | `light` or `dark` |
| `disabled` | Boolean attribute that suppresses requests regardless of state |

Set state with `button.status = 'pending'` or the `status` attribute. Use
`setAttribute()` for the other settings.

- **Ready:** an action can be requested.
- **Pending:** the application is processing or checking the request.
- **Earned:** the application has confirmed the result.
- **Error:** the attempt did not complete; the user can request a retry.
- **Unavailable:** the action cannot currently be requested. Explain why nearby.

## Connect the request

The component emits `reward-request` when an actionable button is selected.
Your host must take ownership of the pending and result states:

```js
import './reward-button.js';

const button = document.querySelector('reward-button');

button.addEventListener('reward-request', async () => {
  if (!['ready', 'error'].includes(button.status)) return;
  button.status = 'pending';
  try {
    const result = await requestExistingReward();
    button.status = result.status;
  } catch {
    button.status = 'error';
  }
});
```

`requestExistingReward()` is a placeholder for your existing application
adapter. It should resolve the authenticated beneficiary, check meaningful
completion, derive amounts and eligibility on the server, and grant a reward
once. It returns authoritative state using the component's state names.

The component neither verifies completion nor grants or persists a reward.
Do not treat a click, a timer, or the displayed `reward-label` as evidence of
an award. A successful request with a lost response needs reconciliation through
the host's durable idempotency rules before presenting an earned state.

If the surrounding view can reset, change accounts, or be replaced while a
request is pending, discard stale responses in the host. A disabled pending
button alone does not solve concurrent requests or repeated claims.

## Fit the app

Use the raised variant for a primary action, compact for smaller surfaces, or
outline for a quiet secondary control. The font inherits from the host.

Shared CSS hooks are `--bg-accent`, `--bg-surface`, `--bg-text`,
`--bg-muted`, `--bg-border`, and `--bg-radius`:

```css
reward-button {
  --bg-accent: #bce58b;
  --bg-surface: #20251c;
  --bg-text: #f2f6ed;
  --bg-muted: #a7b19c;
  --bg-border: #3a4431;
  --bg-radius: 12px;
}
```

Check the full set of states after changing colors. Keep the label useful without
the decorative effect, and leave ordinary product navigation available.

## Verify the integration

Check keyboard activation, ready-to-pending-to-earned behavior, failed-request
retry, unavailable state, and reduced-motion presentation. Test authoritative
award deduplication, simultaneous requests, lost responses, and account
switches in the application service.

The guide's failure switch and short delay are explicitly simulated. Its reset
cancels pending demonstration callbacks; it does not reset a production award.

Use the [Reward Button implementation skill](../skills/reward-button/SKILL.md)
to adapt the interaction and existing reward flow to a specific app.
