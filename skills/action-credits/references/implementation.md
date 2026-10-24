# Implementation contract

Adapt these invariants to the host app. They describe responsibilities, not a
required database, framework, provider, or collection of new services.

## Trace the existing path

Find the authenticated principal, membership/tenant checks, canonical credit owner,
balance/ledger, usage deduction, expiry rules, and existing bonus/referral grants.
Find the exact code that proves each proposed completion. Identify whether the
reward is once per user, once per workspace, or once per qualifying referral.
The actor who performs an action and the beneficiary who receives it can differ.

Do not introduce an onboarding-only balance. If an existing system gives the same
reward, use its entitlement and completion record. A user's membership in several
workspaces must not accidentally multiply a reward meant to be once per person.

## Logical records

Use the smallest representation consistent with the app:

- **Action definition:** stable action ID, stable entitlement key, program,
  eligibility, destination, server reward amount/unit, verification mode, enabled
  state, and display order. Presentation copy can change independently.
- **Offer/evidence:** beneficiary, actor as needed, definition version or offer
  snapshot, evidence source and stable identifier, validity/verification time,
  and minimal evidence metadata. Do not store provider tokens in these records.
- **Award:** beneficiary, stable entitlement/occurrence, amount, unit, ledger
  transaction ID, and awarded timestamp. It is the durable proof credits exist.

If all lifetime actions are one-time, use a constant occurrence. For a repeatable
referral use its qualifying referral ID. The durable unique key is conceptually
`(program, beneficiary, entitlement, occurrence)` with any required tenant/global
identity boundary. A display label, experiment assignment, amount, or catalog
version must not reset entitlement. Use a new entitlement only for an intentional
new award opportunity with defined eligibility.

Separate display states from accounting: `available`, `pending`, `eligible`,
`awarded`, and `unavailable` cover most cases; checking/error can be transient UI
states. Skip/dismiss is an experience preference, never a credit ledger event.

## Claim boundary

The client submits an action identifier plus only necessary evidence references.
The server derives the authenticated actor, permitted beneficiary, authoritative
action definition, amount, and limits. It validates that evidence establishes the
required action and belongs to the correct principal/account.

Authenticated evidence does not automatically imply authorized access. Enforce
membership/ownership when reading action state and when issuing credit. Use the
app's request/CSRF protections and rate limits as appropriate. Use configured
official destinations; do not let arbitrary claim URLs drive server fetches.

Provider events require validated authenticity, replay handling, correct identity
binding, and minimal permissions. Client flags, return URLs, elapsed timers,
referrer headers, screenshots alone, and opening a share composer are not trusted
proof of external completion. Provider timeout means pending/retry, not success.
For a selected honor-system action, the self-attestation is the defined evidence;
it is not proof that an external action occurred.

## One award despite retries

For a local ledger, the claim reservation, limit accounting, credit entry, and
balance update (if materialized) must commit atomically. Enforce uniqueness in
durable storage; a UI-disabled button or read-then-write check is insufficient.
Serialize/check shared caps atomically so two different actions cannot exceed a
beneficiary or program budget concurrently.

Conceptual sequence:

1. Authenticate and resolve the beneficiary; load the action and validate evidence.
2. Enter the application's transaction/locking boundary.
3. Recheck mutable eligibility, offer rules, enabled state, and relevant limits.
4. Return any existing award for the entitlement without crediting again.
5. Reserve the entitlement under a unique constraint and consume the applicable
   budget. Insert the credit entry and update the balance through its usual path.
6. Commit; return the persisted award and canonical balance. Emit award analytics
   after commit, using a durable event/outbox when the application has one.

Exact ordering can vary with the existing service, but retries, collisions, and
crashes must preserve one economic effect. A lost HTTP response after commit is
recoverable by returning the same stored award. An authenticated owner can still
read an existing award if new awards are subsequently disabled.

For a separate credit service, do not pretend a local transaction covers the
remote call. Persist an intent/outbox, send a stable idempotency key accepted by
that service, and reconcile a lost response using that key. Keep the award pending
until the credit service confirms it. If the service offers neither idempotency
nor reconciliation, identify that blocker before enabling real grants.

## Offers, rollout, and recovery

- Define a server-enforced offer policy: either honor a stored, bounded offer, or
  clearly refresh changed terms before the user commits effort. A signed or
  server-stored offer still needs validation; client-supplied amounts are not offers.
- Specify whether pending offers survive pausing the program. Keep a control to
  stop new awards, preserving read access and the audit trail.
- Preserve existing credit expiry, spend ordering, and bonus-credit treatment.
  Do not introduce expiration, clawbacks, or negative balances by accident.
- If a reversal is actually required, use the existing adjustment path and an
  auditable compensating entry. Never silently delete an awarded record.
- For missing integrations, omit/disable the affected action with accurate copy.
  Keep secrets server-side and reference environment variable names in handoff.
- Add only the indexes, migrations, and operational controls needed by this app.
  Follow its deployment conventions; local implementation is not a live rollout.

## Evidence to test

Choose the cases implicated by the implementation. Real award changes require
tests of economic invariants, not just snapshots of labels:

- Parallel clicks/tabs and duplicate events produce one award and one balance delta.
- Two different actions race against the same cap without overspending it.
- A response is lost after crediting; retry returns the original award.
- An attacker changes the amount, beneficiary, tenant, or evidence reference; no
  unauthorized award or cross-tenant state disclosure occurs.
- A provider link is opened with no actual completion; no verified award appears.
- Existing signup/referral rewards and historical completion follow the declared
  eligibility rule without double-paying.
- A label, amount, or experiment changes without creating a fresh entitlement.
- Provider failure, delayed evidence, a disabled program, and refresh/resume show
  accurate states. Caps/expiry/offer changes follow the actual contract.

For a UI-only task, do not create a backend test suite or a pretend credit service.
Label simulated states and report that no real credits are issued.
