import test from "node:test";
import assert from "node:assert/strict";
import { normalizeMilestone, MilestoneHistory, MilestoneCelebration } from "../components/milestone-celebration/milestone-celebration.js";

const milestone = (id = "award-1") => ({ id, title: "First lesson complete", description: "A good start.", rewardLabel: "+25 XP" });

test("one event is presented once even if a replay changes its title or reward copy", () => {
  const history = new MilestoneHistory();
  assert.equal(history.accept(milestone()).id, "award-1");
  assert.equal(history.accept({ ...milestone(), title: "Replayed", rewardLabel: "+999 XP" }), null);
  assert.equal(history.accept(milestone("award-2")).id, "award-2");
});

test("deduplication belongs to each component lifetime and reset explicitly starts over", () => {
  const first = new MilestoneHistory();
  const second = new MilestoneHistory();
  first.accept(milestone());
  assert.equal(first.accept(milestone()), null);
  assert.ok(second.accept(milestone()));
  first.reset();
  assert.ok(first.accept(milestone()));
});

test("invalid events do not consume the event identifier", () => {
  const history = new MilestoneHistory();
  assert.throws(() => history.accept({ ...milestone(), title: "" }), TypeError);
  assert.ok(history.accept(milestone()));
});

test("milestone snapshots preserve literal copy without allowing later mutation", () => {
  const input = { ...milestone(), title: "<img src=x onerror=alert(1)>" };
  const snapshot = normalizeMilestone(input);
  input.title = "Changed";
  assert.equal(snapshot.title, "<img src=x onerror=alert(1)>");
  assert.ok(Object.isFrozen(snapshot));
  assert.throws(() => { snapshot.id = "award-2"; }, TypeError);
});

test("optional description and reward label remain optional", () => {
  assert.deepEqual(normalizeMilestone({ id: "a", title: "Nice work" }), { id: "a", title: "Nice work", description: "", rewardLabel: "" });
});

test("malformed milestone identity and text are rejected", () => {
  for (const event of [null, {}, { ...milestone(), id: " " }, { ...milestone(), id: 1 }, { ...milestone(), title: null }, { ...milestone(), description: {} }, { ...milestone(), rewardLabel: 25 }]) {
    assert.throws(() => normalizeMilestone(event), TypeError);
  }
});

test("reduced motion cancels existing effects and starts no new animations", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "matchMedia");
  const queries = [];
  let canceled = 0;
  let started = 0;
  const component = Object.create(MilestoneCelebration.prototype);
  component.isConnected = true;
  component._animations = [{ cancel() { canceled++; } }];
  component._panel = { animate() { started++; } };
  component._medallion = { animate() { started++; } };
  Object.defineProperty(globalThis, "matchMedia", {
    configurable: true,
    writable: true,
    value(query) { queries.push(query); return { matches: true }; },
  });
  try {
    component._animate();
    assert.deepEqual(queries, ["(prefers-reduced-motion: reduce)"]);
    assert.equal(canceled, 1);
    assert.equal(started, 0);
    assert.deepEqual(component._animations, []);
  } finally {
    if (original) Object.defineProperty(globalThis, "matchMedia", original);
    else delete globalThis.matchMedia;
  }
});

test("dismiss and reset cancel effects while retaining their distinct history behavior", () => {
  const component = Object.create(MilestoneCelebration.prototype);
  component._history = new MilestoneHistory();
  component._current = component._history.accept(milestone());
  component._visible = true;
  component._live = { textContent: "First lesson complete" };
  component._render = () => {};
  const events = [];
  component.dispatchEvent = (event) => { events.push(event); return true; };
  let canceled = 0;
  component._animations = [{ cancel() { canceled++; } }];

  component.dismiss();
  assert.equal(canceled, 1);
  assert.equal(component.visible, false);
  assert.equal(component._live.textContent, "");
  assert.equal(component._history.accept(milestone()), null);
  assert.equal(events.length, 1);
  assert.equal(events[0].type, "milestone-dismiss");
  assert.deepEqual(events[0].detail, { id: "award-1" });
  component.dismiss();
  assert.equal(events.length, 1);

  component._visible = true;
  component._animations = [{ cancel() { canceled++; } }];
  component.reset();
  assert.equal(canceled, 2);
  assert.equal(component.visible, false);
  assert.equal(component._current, null);
  assert.equal(events.length, 1);
  assert.ok(component._history.accept(milestone()));
});
