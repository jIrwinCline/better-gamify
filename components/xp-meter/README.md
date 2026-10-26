# XP & Level Meter

A dependency-free meter that renders an authoritative XP total and ordered level
thresholds. It supports bar, compact, and ring variants. The host supplies each
complete snapshot; the component never increments XP or grants a level reward.

```html
<script type="module" src="/components/xp-meter/xp-meter.js"></script>
<xp-meter id="experience" variant="bar"></xp-meter>
```

```js
const meter = document.querySelector('#experience');
await customElements.whenDefined('xp-meter');
meter.progress = {
  value: 180,
  levels: [
    { threshold: 0, label: 'Beginner' },
    { threshold: 100, label: 'Explorer' },
    { threshold: 250, label: 'Builder' },
    { threshold: 500, label: 'Expert' },
  ],
};
// After a confirmed update, replace the entire snapshot from your application.
meter.progress = await fetchCurrentExperience();
```

`fetchCurrentExperience` is an application integration point, not an export.
The example thresholds are illustrative. Choose your scoring and progression
rules in the host product, and distinguish lifetime XP from any spendable balance.

## Data contract

`progress` is a property, not a JSON attribute. The setter validates before
replacing the previous snapshot. `value` and all `threshold` values must be
non-negative safe integers. Levels must be nonempty, start at zero, and strictly
increase. Every level needs a nonempty text label. Invalid input throws
`TypeError`; strings, fractions, duplicate thresholds, and non-finite values are
not silently coerced. Snapshots and their nested levels are copied and frozen.

At 180 XP in the example, the user is an Explorer with 80 / 150 XP toward Builder,
and 70 XP remaining. Exactly 250 XP enters Builder at the start of its interval.
At or beyond 500 XP, the meter is full, retains the lifetime total, and shows
“Highest level reached.” Decreases and corrected thresholds recompute the current
level immediately; they do not preserve a stale higher rank. A single supplied
level is valid and is treated as the maximum level. Before the host supplies a
valid snapshot, `progress` returns `null` and the component shows “Progress is not
available yet.” It exposes no level, XP total, or determinate progressbar in that
state. Missing data is not treated as zero XP or a maximum level. Invalid updates
leave the previous valid snapshot intact.

`variant="bar"` is the default; `compact` reduces space, and `ring` uses a circular
indicator. `theme="dark"` switches the default palette. Unknown variants use the
bar layout. There are no emitted completion events: level-up decisions and event
IDs belong to the host, which can separately trigger a Milestone Celebration.

## Styling and accessibility

The component inherits typography. Override `--bg-accent`, `--bg-surface`,
`--bg-text`, `--bg-muted`, `--bg-border`, and `--bg-radius`. Exported parts are
`panel`, `level-badge`, `level`, `value`, `track`, `fill`, and `caption`.

All variants expose one progressbar with current interval values and a full text
description. The decorative ring is hidden from assistive technology. New
snapshots get a polite announcement while connected; changing appearance does
not repeat the announcement. The progress fill moves in either direction, and
reduced-motion preferences remove the transition. Numeric text always shows the
current supplied value, never an interpolated or fabricated total.

## Pure helpers

Node imports are safe. `normalizeProgress(input)` returns the frozen validated
snapshot. `summarizeProgress(null)` returns `null` for an unconfigured meter;
`summarizeProgress(normalized)` returns:

```js
{
  value, level, levelIndex, levelNumber, nextLevel,
  intoLevel, levelSpan, remaining, fraction, isMax
}
```

`levelIndex` is zero-based and `levelNumber` one-based. `nextLevel` is `null` at
the maximum; `levelSpan` and `remaining` are then zero and `fraction` is one.
`intoLevel` still reports XP beyond the current threshold. The summary helper
expects normalized data or `null`; the `progress` setter still requires a valid
snapshot.

Run `node --test tests/xp-meter.test.mjs` from the repository root.
