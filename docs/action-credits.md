# Action Credits

Action Credits is an optional set of onboarding tasks that earns the product's
existing credits. It works best when the tasks help people experience the product
and the reward unlocks something useful in it.

The repository provides a presentation component, three example layouts, and an
[implementation skill](../skills/action-credits/SKILL.md). The showcase simulates
completion. Production verification, credits, and account state belong to the
application integrating the pattern.

## Choose the right actions

Start with a short set of actions, often three to six. Favor a clear first product
success, such as creating a project, connecting a useful integration, or completing
a tutorial. Add community or growth actions when they suit the product and can
be offered honestly.

For every action, decide the user benefit, reward, eligible beneficiary, completion
evidence, and whether previous completion counts. Set a total reward budget using
the product's real credit economics. The examples' amounts are demonstrations,
not recommended defaults.

External follows, shares, subscriptions, and stars need an additional check:
confirm the platform's current rules and what its APIs actually let you verify.
A link click or return to the application proves neither completion nor ownership.
If verification is unavailable, leave the action disabled or choose another task.
An explicitly selected honor-system reward must be described and capped as such.

The skill includes a fuller [action catalog and discovery guide](../skills/action-credits/references/action-design.md)
and an optional [planning template](../skills/action-credits/assets/action-plan.template.yaml).

## Fit the host application

Use `variant="grid"`, `variant="list"`, or `variant="compact"` to select a layout.
Use the host's type and spacing conventions, and adapt the component's CSS tokens
to its palette. Fonts inherit from the host. For example:

```css
action-credits {
  --ac-accent: #5965e8;
  --ac-bg: #ffffff;
  --ac-surface: #f7f8fc;
  --ac-text: #171b2d;
  --ac-muted: #5d6478;
  --ac-border: #dfe3ef;
  --ac-radius: 16px;
}
```

The `theme="dark"` attribute supplies a dark starting point. Custom tokens take
precedence; check contrast after adapting them.

Place the checklist where it supports onboarding, keep an immediate Continue
path, and give users a way to return. Do not make optional community engagement
a prerequisite for entering the product. Explain pending verification in plain
language and preserve a useful experience when an external service is down.

## Connect actions and state

Set the component's `actions` property to an array with stable, unique action IDs.
Each item has `id`, `title`, `description`, a non-negative integer `reward`, and
one of these states:

| State | Meaning supplied by the host |
| --- | --- |
| `available` | The user can start or request the action |
| `pending` | Completion or the resulting award is still being checked |
| `awarded` | The authoritative credit grant succeeded |
| `unavailable` | The action cannot currently be requested |

An optional `icon` selects a built-in icon. Component-level properties are
`heading`, `description`, `variant`, and `creditLabel`; these also have attributes
(`credit-label` for the last one). See the [complete component API](../components/action-credits/README.md).

When a user selects an available action, the component emits `action-request`
with `event.detail.actionId`. The host decides whether to navigate into the
product, open an approved destination, or request a completion check. The
component does not open external links, change action state, or award credits.
Its `continue` event lets the host navigate onward.

Fetch current action state from your application after sign-in, on resume, and
after a relevant completion event. Assign a fresh array to `element.actions`
when state changes. Show `awarded` only after the server confirms the grant;
a successful click handler or verification request is not enough.

## Keep the award authoritative

The host application must implement the following sequence using its existing
authentication and credit service:

1. Resolve the signed-in beneficiary and confirm action eligibility.
2. Establish completion from trusted product events or supported provider evidence.
3. Look up the reward and limits on the server. Ignore client-supplied amounts.
4. Grant the entitlement once using durable deduplication, including simultaneous
   requests and retries after a lost response.
5. Return the authoritative action state and updated credit balance.

Where the credit service is remote, use its idempotency support and reconcile
uncertain results before declaring the action awarded. Do not keep a second
balance in the component or in browser storage. Handle tenant ownership,
previous signup rewards, program limits, and disabled offers within the host's
existing rules.

The [implementation contract](../skills/action-credits/references/implementation.md)
covers the accounting boundary and failure cases in more detail. No server
endpoints, provider credentials, or production credit service are supplied by
this repository.

## Verify the integration

Test that a replay or concurrent claim awards once, another account's beneficiary
cannot be selected, modified browser reward amounts do not affect the grant, and
a lost response can be retried safely. Check pending and unavailable providers,
reload/resume, and the Continue path.

Inspect the component in the actual application at narrow and wide widths and
with keyboard navigation. Use the app's analytics to measure which actions lead
to activation and continued use, alongside credit cost and failed verification.
The [experience guide](../skills/action-credits/references/experience.md) gives a
small measurement framework without requiring another analytics service.
