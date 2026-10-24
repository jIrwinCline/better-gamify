import test from "node:test";
import assert from "node:assert/strict";
import {
  actionButtonLabel,
  normalizeActions,
  summarizeActions,
} from "../components/action-credits/action-credits.js";

const action = (id, status = "available", reward = 25) => ({
  id,
  title: `Action ${id}`,
  description: "A useful step.",
  reward,
  status,
});

test("only authoritative awarded states contribute earned credits", () => {
  const catalog = normalizeActions([
    action("first", "available", 100),
    action("second", "pending", 200),
    action("third", "awarded", 25),
    action("fourth", "unavailable", 50),
  ]);
  assert.deepEqual(summarizeActions(catalog), {
    total: 3,
    awarded: 1,
    earned: 25,
  });
});

test("empty, unavailable, and all-awarded catalogs have honest totals", () => {
  assert.deepEqual(summarizeActions(normalizeActions([])), {
    total: 0,
    awarded: 0,
    earned: 0,
  });
  assert.deepEqual(
    summarizeActions(normalizeActions([action("a", "unavailable")])),
    { total: 0, awarded: 0, earned: 0 },
  );
  assert.deepEqual(
    summarizeActions(
      normalizeActions([action("a", "awarded", 0), action("b", "awarded", 25)]),
    ),
    { total: 2, awarded: 2, earned: 25 },
  );
});

test("catalog snapshots cannot be mutated behind the renderer", () => {
  const input = [action("a")];
  const catalog = normalizeActions(input);
  input[0].status = "awarded";
  input.push(action("b"));
  assert.equal(catalog.length, 1);
  assert.equal(catalog[0].status, "available");
  assert.ok(Object.isFrozen(catalog));
  assert.ok(Object.isFrozen(catalog[0]));
});

test("catalog rejects duplicate IDs and invalid states instead of implying completion", () => {
  for (const input of [
    null,
    {},
    [null],
    [action("")],
    [action("same"), action("same")],
    [action("a", "verified")],
  ]) {
    assert.throws(() => normalizeActions(input), TypeError);
  }
});

test("display rewards reject malformed values and unsafe aggregate arithmetic", () => {
  for (const value of [
    -1,
    1.2,
    Infinity,
    NaN,
    "25",
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    assert.throws(
      () => normalizeActions([action("a", "available", value)]),
      TypeError,
    );
  }
  assert.throws(
    () =>
      normalizeActions([
        action("a", "awarded", Number.MAX_SAFE_INTEGER),
        action("b", "awarded", 1),
      ]),
    RangeError,
  );
});

test("button labels distinguish starting, verification, earned, and unavailable states", () => {
  assert.equal(
    actionButtonLabel(action("a", "available", 1250), "tokens"),
    "+1,250 tokens",
  );
  assert.equal(actionButtonLabel(action("a", "pending")), "Checking…");
  assert.equal(actionButtonLabel(action("a", "awarded")), "+25 earned");
  assert.equal(actionButtonLabel(action("a", "unavailable")), "Unavailable");
});

test("copy remains literal data; unknown icon names are inert strings", () => {
  const hostileCopy = "<img src=x onerror=alert(1)>";
  const catalog = normalizeActions([
    {
      ...action("a"),
      title: hostileCopy,
      description: hostileCopy,
      icon: hostileCopy,
    },
  ]);
  assert.equal(catalog[0].title, hostileCopy);
  assert.equal(catalog[0].description, hostileCopy);
  assert.equal(catalog[0].icon, hostileCopy);
});

test("omitted optional status defaults to available, never awarded", () => {
  const catalog = normalizeActions([
    { id: "a", title: "Create a report", reward: 20 },
  ]);
  assert.equal(catalog[0].status, "available");
  assert.equal(catalog[0].description, "");
  assert.equal(summarizeActions(catalog).earned, 0);
});
