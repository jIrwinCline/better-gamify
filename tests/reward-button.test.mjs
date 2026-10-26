import test from "node:test";
import assert from "node:assert/strict";
import { rewardButtonState } from "../components/reward-button/reward-button.js";

test("only ready and retryable errors allow reward requests", () => {
  for (const status of ["ready", "pending", "earned", "error", "unavailable"]) {
    assert.equal(rewardButtonState(status).canRequest, ["ready", "error"].includes(status));
    assert.equal(rewardButtonState(status).busy, status === "pending");
  }
});

test("disabled overrides request eligibility for every state", () => {
  for (const status of ["ready", "pending", "earned", "error", "unavailable"]) {
    assert.equal(rewardButtonState(status, true).canRequest, false);
  }
});

test("unknown states fail closed instead of enabling another request", () => {
  for (const status of ["success", "READY", "", null, {}, 1]) {
    const state = rewardButtonState(status);
    assert.equal(state.status, "unavailable");
    assert.equal(state.canRequest, false);
    assert.equal(state.busy, false);
  }
});

test("deriving button state cannot mutate the host's state or imply an award", () => {
  const ready = rewardButtonState("ready");
  const pending = rewardButtonState("pending");
  assert.ok(Object.isFrozen(ready));
  assert.throws(() => { ready.status = "earned"; }, TypeError);
  assert.equal(pending.status, "pending");
  assert.equal(rewardButtonState("ready").status, "ready");
});
