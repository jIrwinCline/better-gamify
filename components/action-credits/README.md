# Action Credits component

A dependency-free Web Component for an optional onboarding checklist. It presents
offers and confirmed awards using your app’s typography and colors. Your app owns
completion verification, eligibility, persistent state, and credit accounting.

## Use it

Serve the module over HTTP and import it once. No build step is required.

```html
<script type="module" src="/components/action-credits/action-credits.js"></script>
<action-credits id="rewards" variant="grid"></action-credits>
```

```js
const rewards = document.querySelector('#rewards');
await customElements.whenDefined('action-credits');

// Display data comes from your authenticated application API.
rewards.actions = [
  { id: 'verified-email', title: 'Verify your email',
    description: 'Keep your account secure.', reward: 25,
    status: 'awarded', icon: 'mail' },
  { id: 'first-project', title: 'Create your first project',
    description: 'Make room for your next idea.', reward: 50,
    status: 'available', icon: 'rocket' },
];

rewards.addEventListener('action-request', async ({ detail: { actionId } }) => {
  // Begin the normal product workflow, then reload authoritative action state.
  // A click is not evidence of completion and must not issue credits.
  await beginProductAction(actionId);
  rewards.actions = await fetchAccountRewardActions();
});

rewards.addEventListener('continue', () => navigateIntoProduct());
```

`beginProductAction`, `fetchAccountRewardActions`, and `navigateIntoProduct` above
are integration points for your application, not exports from this module. The
sample reward amounts are illustrative; choose amounts against your actual credit
budget. Only display `awarded` after your server confirms the grant.

## Properties and attributes

| Property | Attribute | Default | Purpose |
| --- | --- | --- | --- |
| `actions` | — | `[]` | Immutable snapshot of action display records. Reassign to update. |
| `heading` | `heading` | `A little momentum goes a long way.` | Section heading. |
| `description` | `description` | `Complete a few quick actions to earn extra credits for your account.` | Introductory copy. An empty string hides it. |
| `variant` | `variant` | `grid` | `grid`, `list`, or `compact`. Unknown values render as a grid. |
| `creditLabel` | `credit-label` | `credits` | Display unit, such as `tokens`. |
| — | `theme` | `light` | Use `dark` for the built-in dark palette. |

Each action has the following shape:

```ts
type Action = {
  id: string;           // Stable, unique, nonempty action identifier.
  title: string;        // Required nonempty text; rendered as text, never HTML.
  description?: string;
  reward: number;       // Non-negative safe integer in the product’s credit unit.
  status?: 'available' | 'pending' | 'awarded' | 'unavailable';
  icon?: string;
};
```

Omitted status is `available`. Validation throws for invalid records, duplicate
IDs, unsupported states, or unsafe reward totals, leaving the previous catalog
intact. Records are copied and frozen to prevent accidental in-place changes.
Reassign `actions` with fresh server state to render updates.

Named icons: `sparkle`, `mail`, `rocket`, `users`, `share`, `book`, `check`, `github`,
and `discord`. Unknown names use the sparkle icon. Icons are decorative; the title
and status communicate the meaning. An icon’s presence is not an endorsement of
incentivizing engagement on that service; check current platform rules.

## Events and state

| Event | Detail | When |
| --- | --- | --- |
| `action-request` | `{ actionId: string }` | An available action’s button is activated. |
| `continue` | `null` | The always-available Continue button is activated. |

Both events bubble across the Shadow DOM boundary. Neither changes action state,
navigates, calls external services, nor awards credits. Only the parent application
can assign new statuses. Hosts should reconcile on reload and return from an
external workflow, and supply `pending` while verification remains unresolved.

Available buttons display `+25 credits`; pending buttons display `Checking…`;
awarded buttons display `+25 earned`. Unavailable, pending, and awarded buttons
are disabled. Progress counts awarded actions over all actions except unavailable
ones; the earned total sums only awarded actions. This is the checklist’s earned
total, **not the account’s spendable credit balance**.

Place qualifying conditions in the description. When a provider check fails, the
host can restore `available` with clear retry copy or set `unavailable` with an
explanation. Prefer omitting irrelevant actions. Continue remains available in
every state, including an empty catalog.

## Match your app

The component inherits typography and renders in an open Shadow DOM. Set CSS
custom properties on the host:

```css
action-credits {
  font-family: inherit;
  --ac-accent: #252c27;
  --ac-bg: #ffffff;
  --ac-surface: #fafbf9;
  --ac-text: #252c27;
  --ac-muted: #6b746e;
  --ac-border: #e3e8e3;
  --ac-radius: 12px;
}
```

The Continue button uses `--ac-bg` for its text on `--ac-accent`; keep that pairing
readable when changing themes. Exported parts are `panel`, `header`, `heading`,
`progress`, `actions`, `card`, `icon`, `action-button`, `footer`, and
`continue-button`.

```css
action-credits::part(panel) { padding: 32px; }
action-credits::part(continue-button) { border-radius: 999px; }
```

The grid adapts to the viewport. Use `variant="list"` or `variant="compact"` when
embedding it in a narrow sidebar within a wide page. Theme tokens take precedence
over both built-in palettes.

## Accessibility and rendering

Actions and continuation are semantic buttons with visible keyboard focus. Status
changes have a polite live announcement; awarded states also use text and icons.
Keyed updates retain the same DOM nodes. When the focused action becomes pending
or awarded, focus moves to its card; removing a focused card moves focus to
Continue. No animation, third-party script, HTML interpolation, or external icon
request is used. Text content and icon names cannot inject markup.

The component requires a browser with Custom Elements and Shadow DOM. Importing
the module in Node is safe for the exported pure helpers; constructing the UI
requires a browser. Exported helpers are `normalizeActions`, `summarizeActions`
(expects normalized actions), and `actionButtonLabel`.

Run the data/state checks from the repository root:

```sh
node --test tests/action-credits.test.mjs
```

These tests verify presentation invariants, not server accounting. Real grants
need authenticated evidence, server-defined amounts, transactional or durable
idempotent awards, and appropriate limits. The accompanying `action-credits` skill
describes that integration contract.
