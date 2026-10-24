# Contributing to Better Gamify

Better Gamify is a small library of gamification patterns for software products. Each
pattern should help a user do something useful and come with both a working UI
example and instructions for integrating it into an existing application.

## Work locally

Use a current Node.js LTS release. There are no third-party package dependencies.

```sh
npm run dev
npm test
npm run build
```

Edit the component in `components/`, the showcase in `site/`, or its matching
instructions in `skills/`. Build output in `dist/` is generated.

## Fixes and improvements

Keep changes focused and explain the user problem in your pull request. Include
the checks you ran and a screenshot for visible changes. Preserve keyboard
access, readable states, small-screen usability, and the ability to skip optional
onboarding tasks.

For reward features, include meaningful tests of the behavior changed. A visual
demo must clearly identify simulated state. Do not imply that a UI component
verifies external activity or safely issues production credits on its own.

## Add a pattern

Open an issue describing the use case before building a large addition. A pattern
is ready to join the catalog when it includes:

- A focused component with a documented public API and no showcase dependencies.
- At least one runnable example that covers its useful interaction and states.
- A matching implementation skill, including discovery questions, integration
  boundaries, and guidance for adopting the host application's design.
- Documentation of user value, appropriate uses, data ownership, and limitations.
- Tests proportional to its behavior and a check of its responsive and accessible
  experience.

Keep framework-specific adapters separate from the core pattern. Avoid a new
design system or backend framework for a single component. Use original assets
or assets with compatible licenses and retain required attribution.

Contributions are licensed under the repository's [MIT License](LICENSE).
