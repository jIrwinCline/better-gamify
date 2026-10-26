# Better Gamify component roadmap

**Status: first three additions available · October 25, 2026.** This roadmap
contains ten component families beyond Action Credits. Reward Button,
XP & Level Meter, and Milestone Celebration are implemented with examples and
skills in v0.2. The other seven remain proposals; their build sequence is a
recommendation, not a release commitment.

Better Gamify should work across learning, fitness, productivity, community,
commerce, creative tools, and SaaS. Each family should pair an interactive
component with a skill that adapts its behavior to a real application.

## Browse by component type

GodUI separates its [core components](https://godui.design/docs/components)
into groups such as Overlays, Forms, and Feedback & Display. Its
[Lab](https://godui.design/docs/lab) uses groups including Buttons, Navigation,
Layout, Collaboration, and Effects. The useful organizing idea is a familiar
component category with room for multiple examples and variants.

Adapt that approach for Better Gamify:

| Proposed sidebar category | Component families |
| --- | --- |
| Buttons & Actions | Reward Button **(available)**; Action Credits **(available)** |
| Feedback & Celebration | XP & Level Meter **(available)**; Milestone Celebration **(available)**; Achievement Card; Personal Best Card |
| Progression & Habits | Streak Calendar; Unlockable Path |
| Challenges & Community | Leaderboard; Challenge Hub |
| Rewards & Economy | Reward Store |

Use separate filters for **Simple / Composed / Full flow** and for app type
(learning, fitness, productivity, community, commerce, AI). Size describes the
integration, not the visual footprint: a small streak widget still needs rules
for dates and qualifying activity. A component has one primary home; filters
can expose its other uses without duplicate catalog entries.

Keep variants inside a family. A compact leaderboard, a full leaderboard, and
a team leaderboard are three examples of one component family.

## The ten additions

### 1. Reward Button

**Category:** Buttons & Actions · **Size:** Simple · **Status:** Available

A satisfying completion or claim control that communicates ready, working,
earned, and retry states. Earned feedback appears after the application confirms
success. The potential reward can be shown up front. It also works without
points, with a clear completion check.

- **Examples:** finish a lesson; complete a focus session; claim an eligible reward.
- **Variants:** raised press button, compact claim button, outline button. Each
  supports pending, earned, retry, and unavailable states.
- **GodUI inspiration:** the tactile depth of [Magic Button](https://godui.design/docs/lab/buttons/magic-button)
  and the visible pending state of [Progress Fold Button](https://godui.design/docs/lab/buttons/progress-fold-button).
- **Implementation skill:** find the qualifying event and success response;
  reuse the app's action service; define repeatability, pending/error/retry
  states, and the reward label. A press is a request, not proof of an award.

### 2. XP & Level Meter

**Category:** Feedback & Celebration · **Size:** Simple · **Status:** Available

A compact display of earned experience, the current level, and distance to
the next meaningful milestone. Include a plain-language explanation of what
the next level changes, if anything.

- **Examples:** learning proficiency, contributor reputation, creator milestones.
- **Variants:** header XP counter, horizontal level bar, circular goal meter.
- **GodUI inspiration:** [Number Ticker](https://godui.design/docs/lab/text/number-ticker)
  for changing totals and [Progress](https://godui.design/docs/components/progress)
  for visible advancement.
- **Implementation skill:** identify the source of points, owner, thresholds,
  maximum level, corrections, and any unlocks. Keep experience separate from
  spendable credits unless the product deliberately defines them as the same.

### 3. Milestone Celebration

**Category:** Feedback & Celebration · **Size:** Simple · **Status:** Available

Feedback whose intensity matches the accomplishment: a tiny inline spark for
a small win, a toast for a milestone, or a reveal dialog for a major unlock.

- **Examples:** first published project, a completed course, a new personal record.
- **Variants:** inline success, achievement toast, level-up reveal.
- **GodUI inspiration:** Confetti in the [Lab effects collection](https://godui.design/docs/lab)
  and the expanding interaction of [Morphing Dialog](https://godui.design/docs/lab/overlays/morphing-dialog).
- **Implementation skill:** select meaningful triggers, assign intensity,
  prevent repeat delivery on refresh, and support reduced motion. The
  accomplishment must remain understandable without the animation.

### 4. Achievement Card

**Category:** Feedback & Celebration · **Size:** Composed

A badge or collectible card that explains what was accomplished and how to
earn the next achievement. Show locked, progressing, and earned states with
an optional detail view and collection shelf.

- **Examples:** first 5K, ten published articles, helpful community contributor.
- **Variants:** compact badge, progress card, earned collection card.
- **GodUI inspiration:** an optional foil treatment from [Holographic Card](https://godui.design/docs/lab/layout/holographic-card)
  and a [Morphing Dialog](https://godui.design/docs/lab/overlays/morphing-dialog) for details.
- **Implementation skill:** define achievement evidence, tiers, ownership,
  award dates, public/private visibility, and corrections. Sharing is optional.

### 5. Personal Best Card

**Category:** Feedback & Celebration · **Size:** Composed

Show improvement against the user's own history: the previous best, new result,
and understandable difference. This provides a form of progression for apps
where ranking people against each other would be unhelpful.

- **Examples:** longest focus session, best practice accuracy, fastest comparable run.
- **Variants:** new-record reveal, previous-versus-current comparison, weekly recap.
- **GodUI inspiration:** [Number Ticker](https://godui.design/docs/lab/text/number-ticker)
  for numerical changes and the Lab's card/layout approach for compact summaries.
- **Implementation skill:** establish comparable measurements, whether higher
  or lower is better, baseline period, minimum evidence, and corrected data.
  A first result establishes a baseline; it should not invent an improvement.

### 6. Streak Calendar

**Category:** Progression & Habits · **Size:** Composed

A history of consistent participation with today's status and the next
achievable target. Support a realistic weekly cadence as well as daily streaks.

- **Examples:** journaling, language practice, exercise, regular creative work.
- **Variants:** seven-day strip, monthly calendar, contribution-style history grid.
- **GodUI inspiration:** the compact month and selected-day feedback of
  [Calendar](https://godui.design/docs/components/calendar), adapted to activity history.
- **Implementation skill:** determine qualifying activity, timezone, day
  boundaries, cadence, grace rules, offline/backdated activity, and resets.
  Explain those rules clearly wherever the user sees a streak at risk.

### 7. Leaderboard

**Category:** Challenges & Community · **Size:** Composed

A ranking that provides useful context around the current user, with a clear
scoring period and comparison group. Support personal, friends, cohort, and
team contexts without forcing every app into a global ranking.

- **Examples:** weekly learning league, team activity contest, community contributions.
- **Variants:** compact top five, full standings, team rankings with a pinned own row.
- **GodUI inspiration:** [Segmented Control](https://godui.design/docs/lab/navigation/segmented-control)
  for periods/cohorts and Number Ticker for score changes.
- **Implementation skill:** specify score evidence, eligibility, cohort size,
  tie handling, reset schedules, names/privacy, and moderation. Choose a
  comparable scoring method before adding animated rank movement.

### 8. Unlockable Path

**Category:** Progression & Habits · **Size:** Full flow

A route through lessons, milestones, or capabilities. Each node makes its
state and prerequisite clear: available, in progress, complete, or locked.
Users can understand the path in a plain list as well as a graphical layout.

- **Examples:** learning curriculum, product mastery, training program, creator journey.
- **Variants:** professional stepper, vertical timeline, playful lesson map.
- **GodUI inspiration:** the connected progress and completion markers of
  [Stepper](https://godui.design/docs/lab/layout/stepper).
- **Implementation skill:** map prerequisites, branching, completion evidence,
  resuming progress, entitlement checks, and optional versus required steps.
  Visual locking must reflect real application permissions when access is gated.

### 9. Challenge Hub

**Category:** Challenges & Community · **Size:** Full flow

Time-bounded goals with enrollment, ongoing progress, and a conclusion. A solo
challenge and a cooperative team goal belong to the same family, with different
aggregation rules.

- **Examples:** a seven-day writing sprint, team distance target, monthly learning goal.
- **Variants:** solo challenge card, cooperative progress board, full challenge detail.
- **GodUI inspiration:** Presence Facepile and Agent Timeline from the
  [Lab](https://godui.design/docs/lab) for participants and progress history.
- **Implementation skill:** define objectives, time windows, enrollment,
  membership, participant contributions, reward rules, and completed/expired
  states. Clarify whether progress before enrollment can count.

Action Credits rewards discrete onboarding actions. Challenge Hub coordinates
progress toward a goal over time, potentially across multiple people.

### 10. Reward Store

**Category:** Rewards & Economy · **Size:** Full flow

A transparent exchange of earned currency for useful benefits, with prices,
eligibility, balance, confirmation, and a redemption receipt.

- **Examples:** loyalty perks, community benefits, themes, additional AI usage.
- **Variants:** compact reward picker, catalog grid, reward detail and redemption flow.
- **GodUI inspiration:** [Morphing Dialog](https://godui.design/docs/lab/overlays/morphing-dialog)
  for reward details and tactile button feedback for confirmation.
- **Implementation skill:** connect a spendable balance, catalog, availability,
  redemption eligibility, and fulfillment. Deduction and redemption must be
  coordinated on the server; retries must not spend twice. Handle unavailable
  rewards, insufficient balance, failed fulfillment, and reversals.

## Make every component page useful

GodUI's Lab links component docs with separate anatomy explanations. Better
Gamify can add the implementation layer to that learning-oriented structure:

1. **Preview:** a working example with a clear simulation label and reset control.
2. **Variants:** useful layouts and behaviors, with desktop/mobile previews.
3. **States:** success, pending, empty, locked, error, and other relevant states.
4. **How it works:** what the mechanism helps users do and which app types fit.
5. **Code:** component source, interface, styling hooks, and integration example.
6. **Implementation skill:** installable instructions that inspect the host app,
   discover existing services and design tokens, ask only unresolved questions,
   and implement the behavior with appropriate validation.

Preserve the approved **75% professional / 25% retro-game** direction in the
showcase. Use pixel type for short reward labels, level numbers, and occasional
badges. Keep body copy, tables, forms, and primary navigation easy to read.
Use tactile buttons and short celebrations at moments of progress. Components
should inherit the host application's styling when installed.

The references above inspire interaction and organization. They do not provide
the gamification rules, data models, or award services proposed here. Develop
original implementations; check the applicable license before reusing source.

## Recommended build sequence

1. **Reward Button + XP & Level Meter + Milestone Celebration.** Establish the
   shared feedback primitives and use them in examples of later families.
2. **Achievement Card + Personal Best Card.** Add accomplishment and improvement.
3. **Streak Calendar.** Add repeated engagement with explicit calendar rules.
4. **Unlockable Path + Challenge Hub.** Compose the smaller pieces into journeys.
5. **Leaderboard + Reward Store.** Add integrations that need scoring across
   people or durable currency transactions.

A family becomes available in the live catalog only when its reusable
component, examples, skill, documentation, and relevant checks are complete.
