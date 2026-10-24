# Better Gamify

**Gamification components for SaaS, with the skills to make them work in your app.**

[Explore the live gallery](https://jirwincline.github.io/better-gamify/) ·
[Action Credits guide](https://jirwincline.github.io/better-gamify/patterns/action-credits/) ·
[Download the skill](https://jirwincline.github.io/better-gamify/downloads/action-credits.zip)

Browse an interactive example, take the component, and use its implementation
skill to adapt the pattern to your product's design, data, and business rules.
The goal is useful product behavior: help people reach value, recognize progress,
and earn rewards they can actually use.

The library starts with **one pattern: Action Credits**, an optional onboarding
checklist where users complete useful actions to earn product credits. Its live
examples show three layouts: grid, list, and compact. More patterns can follow
the same component + example + skill structure.

## Try the examples

Download or clone this repository, then run the following from its root using a
current Node.js LTS release:

```sh
npm run dev
```

Open the local address printed by the server. The showcase is a static site with
simulated reward state; it does not connect to user accounts or issue real credits.
There are no third-party package dependencies to install.

```sh
npm test       # Run the repository checks
npm run build # Generate the static site in dist/
```

## Use the implementation skill

The [Action Credits skill](skills/action-credits/SKILL.md) guides an agent through
product discovery, action selection, reward economics, visual integration,
verification, and credit accounting. It inspects the target app before asking
for missing information and reuses that app's existing design and services.

To install it for Codex, copy the **whole folder**, including its references and
assets. From this repository's root, this command preserves any existing install:

```sh
skill_root="${CODEX_HOME:-$HOME/.codex}/skills"
if [ -e "$skill_root/action-credits" ] || [ -L "$skill_root/action-credits" ]; then
  printf '%s\n' "Action Credits already exists. Compare it before updating."
else
  mkdir -p "$skill_root"
  cp -R skills/action-credits "$skill_root/action-credits"
fi
```

In a Codex chat opened on your application, use:

```text
$action-credits Add an optional earn-credits onboarding flow to this app.
Inspect our existing onboarding, credit system, and styling first. Find useful
activation and growth actions, ask about unresolved reward decisions, and
implement the flow with server-verified awards.
```

The instructions are plain Markdown and can be adapted for other coding agents.
Agent-specific installation and behavior outside Codex have not been verified.

## Use the component directly

Copy [components/action-credits/](components/action-credits/) into your app's
served assets and import the module. It is a vanilla JavaScript Web Component;
no package registry or framework adapter is required.

```html
<action-credits id="onboarding-rewards" variant="grid"></action-credits>

<script type="module">
  import './components/action-credits/action-credits.js';

  const rewards = document.querySelector('#onboarding-rewards');
  rewards.heading = 'Make yourself at home';
  rewards.description = 'Optional actions to help you get started.';
  rewards.actions = [
    {
      id: 'first-project',
      title: 'Create your first project',
      description: 'Try the workflow with something of your own.',
      reward: 25,
      status: 'available',
      icon: 'rocket'
    }
  ];

  rewards.addEventListener('action-request', ({ detail }) => {
    // Use detail.actionId to start the action in your app.
    // Refresh rewards.actions with authoritative state from your server.
  });

  rewards.addEventListener('continue', () => {
    // Continue into your app without requiring reward completion.
  });
</script>
```

The displayed reward above is illustrative. The component presents supplied
state and emits events. Your server must determine eligibility, verify completion,
choose reward amounts, and grant credits exactly once. Opening a link is not
proof of a follow, share, or community membership.

See the [integration guide](docs/action-credits.md),
[component API](components/action-credits/README.md), and
[implementation skill](skills/action-credits/SKILL.md) for details.

## Repository layout

| Path | Purpose |
| --- | --- |
| `components/action-credits/` | Reusable component and public API |
| `skills/action-credits/` | Implementation skill, references, and planning template |
| `site/` | Interactive showcase and simulated examples |
| `docs/` | Application integration guidance |
| `scripts/` | Local development and static build tooling |
| `tests/` | Repository checks |

Have a useful pattern or an improvement? Read [CONTRIBUTING.md](CONTRIBUTING.md).
Code and documentation are available under the [MIT License](LICENSE).

The gallery uses [Press Start 2P](site/fonts/press-start-2p.ttf) by CodeMan38,
licensed separately under the [SIL Open Font License](site/fonts/press-start-2p-OFL.txt).
Retain its license notice when redistributing the font.

## Publishing the gallery

The GitHub Pages workflow tests and builds each change. Pushes to `main` publish
the generated `dist/` directory; pull requests run checks without deploying.
In a fork, enable Pages with GitHub Actions and update `site/project.json` with
your repository and site URLs before publishing. The gallery has no backend or
paid hosting dependency.

The skill download in `site/downloads/action-credits.zip` mirrors
`skills/action-credits/`. When changing the skill, regenerate that archive with
the entire `action-credits` directory at its root.
