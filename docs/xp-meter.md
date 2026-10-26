# XP & Level Meter

A read-only presentation of cumulative experience and level progression. It
provides bar, compact, and ring layouts. The host supplies the total and level
definitions; the component does not award XP or store a score.

Use it where the product has meaningful progression: learning, practice,
contributions, or another activity with an understandable relationship to levels.

## Install and configure

Copy `components/xp-meter/xp-meter.js` into your project and import it once.
Add the element, then assign a complete progress snapshot:

```html
<xp-meter variant="bar" theme="dark"></xp-meter>
<script type="module">
  import './xp-meter.js';

  const meter = document.querySelector('xp-meter');
  meter.progress = {
    value: 180,
    levels: [
      { threshold: 0, label: 'Beginner' },
      { threshold: 100, label: 'Explorer' },
      { threshold: 250, label: 'Builder' },
      { threshold: 500, label: 'Expert' },
    ],
  };
</script>
```

| Setting | Values / meaning |
| --- | --- |
| `progress` property | Object containing `value` and `levels` |
| `progress.value` | The current cumulative XP total |
| `progress.levels` | Array of `{ threshold, label }` objects |
| `variant` attribute | `bar`, `compact`, or `ring` |
| `theme` attribute | `light` or `dark` |

Supply non-negative safe integers, unique ascending thresholds beginning at zero,
and nonempty labels. Invalid progress throws a TypeError. Thresholds are cumulative:
250 means 250 total XP, not 250 more
XP after the previous level.

The current level is the highest threshold the total has reached. Progress within
a level is measured from its threshold toward the next one. In the example, 180
XP is Explorer, with 70 XP remaining before Builder. At or above 500, Expert is
the highest configured level.

Assign a fresh `progress` snapshot when state changes. Do not mutate a previously
assigned object and expect it to rerender automatically.

## Connect authoritative progress

Use the existing progress or scoring service:

```js
async function refreshProgress() {
  meter.progress = await loadMyProgress();
}
```

`loadMyProgress()` is your application adapter, not a supplied endpoint. It
should resolve the signed-in person or workspace, return its current score, and
provide the intended level definitions. Refresh after confirmed activity and
when resuming a session.

The meter is display-only. It does not write balances, determine eligibility,
unlock privileges, or emit an authoritative level-up. Handle real entitlements
on the server and celebrate confirmed milestone events using stable event IDs.

XP corrections can move progress backward; render the actual result. Decide in
the host whether a previously earned entitlement stays unlocked after a
correction. Keep that rule separate from the displayed score.

## Fit the app

- **Bar:** a prominent dashboard or course summary.
- **Compact:** a smaller progress summary near related content.
- **Ring:** a profile or dashboard space where a circular indicator fits.

The font inherits from the page. Adapt `--bg-accent`, `--bg-surface`,
`--bg-text`, `--bg-muted`, `--bg-border`, and `--bg-radius` to the existing
design. Set the `theme` attribute to `light` or `dark` as the starting palette.

Keep level names readable and the meaning of XP discoverable in the surrounding
product. Progress should still be clear with animation reduced or disabled.

## Verify the integration

Check zero XP, a value inside a level, an exact threshold, a jump across several
levels, the highest level, a correction, and updated level definitions. Test
loading and unavailable-service handling in the host; the component has no
network loader or service-error surface.

Inspect every variant on narrow and wide screens, and verify the accessible
progress value alongside the visual presentation.

The guide's add, subtract, and highest-level controls change only a temporary
demonstration. Its scores and thresholds are illustrative.

Use the [XP Meter implementation skill](../skills/xp-meter/SKILL.md) to connect
progress to the actual product model.
