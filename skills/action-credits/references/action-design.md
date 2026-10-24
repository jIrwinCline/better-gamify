# Discover and select worthwhile actions

## Evidence before questions

Build a brief product map from the app: intended customer, first useful outcome,
credit-consuming activity, current onboarding drop-off if measured, distribution
channels, and existing rewards. Separate observed facts from assumptions. Prefer
repository configuration and official product links over an account-name match.
Do not collect unrelated private customer data for action research.

If the objective is unclear, offer a small choice such as activation, qualified
referrals, or community adoption. Avoid a long questionnaire. If the owner asks
for a particular channel, evaluate it directly instead of silently changing the
growth goal.

Rank candidates qualitatively by user benefit, business benefit, user effort,
verification friction, reward cost, and likely abuse. A low-effort action that
helps someone reach value can be better than a larger list of social tasks.
Choose the smallest useful set. Do not promise measured growth without evidence.

## Candidate catalog

These are possibilities, not default enabled tasks. External actions require a
current policy/capability check for the particular platform and mechanism.

| Candidate | What counts | Useful evidence | Design concern |
|---|---|---|---|
| Verify email | Auth system records verified ownership | Existing trusted auth event/state | Check for a signup reward already paying for this |
| Complete first useful result | A defined successful project, export, or generation | Server record tied to the beneficiary | Draft creation or a button click may not establish value |
| Connect a relevant integration | A usable account connection succeeds | Server integration status | Reward the connection, not unnecessary data access |
| Invite a teammate | Eligible new teammate accepts/activates | Invitation and membership records | Sending many invites alone can reward spam; workspace dedup matters |
| Refer a new customer | Defined qualified activation/conversion occurs | Existing referral attribution and qualifying event | Reuse the referral system; prevent self-referral and duplicate rewards |
| Learn a key workflow | Defined in-product exercise is completed | Exercise outcome, not just time on page | Do not relabel paid video views as learning |
| Join a relevant community | Membership is established | Authorized membership check or trusted event | Consent, identity binding, provider access, and platform rules |
| Share a useful artifact | A permitted, user-chosen publication step completes | Product publication record or supported provider evidence | Public sharing must be intentional; a copied link is not a published post |
| Submit product feedback | Feedback reaches the product | Existing submission record | Reward participation, not praise; do not turn it into paid positive reviews |
| Follow, subscribe, star, repost | Exact permitted engagement happens | Supported authenticated provider evidence | Many platforms restrict incentivized metrics; never assume permission or API access |

Existing completions need a rule: count eligible historical events once, or make
the offer explicitly prospective. Show already verified email as complete when
appropriate, but do not issue a second signup bonus. Define eligibility before
asking a user to spend effort.

## External actions and honest verification

For each selected external candidate, record the official policy/capability URL,
the date checked, the applicable restriction, and a disposition: eligible,
excluded, or unresolved. Read only policies relevant to selected channels; this
is an action feasibility check, not a general compliance project.

Starting references checked on **2026-10-24**; recheck when used:

- [GitHub acceptable use, section 4](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies#4-spam-and-inauthentic-activity-on-github)
  addresses reward-incentivized activity and inauthentic engagement, including
  credits. A credit-for-star task is not a safe default.
- [X authenticity](https://help.x.com/en/rules-and-policies/authenticity)
  prohibits compensation for account metric inflation, including follows and
  reposts. Do not default to paying users to inflate those metrics.
- [YouTube terms](https://www.youtube.com/static?template=terms)
  restrict incentives that increase views, likes, or subscribers.

These findings explain why the example screenshot's social items cannot be copied
blindly. They do not imply that every community action or voluntary share is
prohibited. Check the concrete use. For LinkedIn, Discord, and other selected
services, inspect their current official policies and integration documentation.
Do not infer that a public profile or OAuth login grants relationship-read access.

If a reward is disallowed, exclude it and offer a relevant permitted action or an
unrewarded social link. Changing the label or paying for a click instead must not
be used to disguise the same prohibited engagement incentive. If policy or access
remains unresolved, keep that candidate disabled and complete other work.

Choose a verification mode per action:

- **Product evidence:** trusted server data/event already establishes completion.
- **Provider evidence:** supported API check or authenticated event proves the
  exact action by an account bound to the current beneficiary.
- **Manual review:** a real reviewer and workflow exist; pending until reviewed.
- **Honor system:** the actual reward is for self-attestation, selected knowingly
  for a permitted low-value action with a small cap. Tell users how it works;
  record it as self-attested, not provider verified.

Avoid adding an OAuth connection with substantial friction solely for a tiny
reward when a better product action exists. Do not ask users for account passwords
or use scraping to simulate missing verification access.

## Reward sizing

Read how credits are denominated, spent, rounded, purchased, expired, and owned.
Keep promotional and purchased entitlements consistent with existing semantics;
credits are not cash unless the product already defines that relationship.

Choose a target useful outcome: enough credit for one more export, a few runs, or
another trial workflow. Estimate internal cost when the product supplies data:

`maximum variable cost per beneficiary ≈ total awarded credits × marginal cost per credit`

Use a range when workloads vary and identify uncertainty. Retail price is not
marginal cost. Set a total beneficiary cap and any needed program-wide budget;
do not select arbitrary amounts just because the screenshot shows +50 or +75.
Use modest differentiation for value/effort, and label any unapproved proposed
amounts as proposals. Preview work can proceed while financial decisions are open.

The action table should let the owner understand both sides: what the user gains
and why the action helps the product. Avoid creating busywork to fill six cards.
