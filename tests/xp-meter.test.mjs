import test from "node:test";
import assert from "node:assert/strict";
import { normalizeProgress, summarizeProgress, XpMeter } from "../components/xp-meter/xp-meter.js";

const levels = [
  { threshold: 0, label: "Beginner" },
  { threshold: 100, label: "Explorer" },
  { threshold: 250, label: "Builder" },
  { threshold: 500, label: "Expert" },
];
const summarize = (value, suppliedLevels = levels) => summarizeProgress(normalizeProgress({ value, levels: suppliedLevels }));

test("unconfigured progress exposes no fabricated total, level, or determinate meter", () => {
  const meter = Object.create(XpMeter.prototype);
  meter._progress = null;
  meter._panel = {};
  meter._top = { hidden: false };
  meter._track = { hidden: false };
  meter._accessibleProgress = { hidden: false };
  meter._caption = { textContent: "" };
  meter._live = { textContent: "" };
  meter._render();
  assert.equal(meter.progress, null);
  assert.equal(summarizeProgress(meter.progress), null);
  assert.equal(meter._top.hidden, true);
  assert.equal(meter._track.hidden, true);
  assert.equal(meter._accessibleProgress.hidden, true);
  assert.equal(meter._caption.textContent, "Progress is not available yet.");
  assert.equal(meter._live.textContent, "");
  assert.throws(() => { meter.progress = { value: 0, levels: Array(1) }; }, TypeError);
  assert.equal(meter.progress, null);
});

test("progress uses the current level's interval, not the lifetime value", () => {
  const summary = summarize(180);
  assert.equal(summary.level.label, "Explorer");
  assert.equal(summary.nextLevel.label, "Builder");
  assert.equal(summary.levelNumber, 2);
  assert.equal(summary.intoLevel, 80);
  assert.equal(summary.levelSpan, 150);
  assert.equal(summary.remaining, 70);
  assert.equal(summary.fraction, 80 / 150);
});

test("exact thresholds belong to the newly reached level", () => {
  for (let index = 0; index < levels.length; index++) {
    const summary = summarize(levels[index].threshold);
    assert.equal(summary.levelIndex, index);
    assert.equal(summary.intoLevel, 0);
    assert.equal(summary.fraction, index === levels.length - 1 ? 1 : 0);
  }
  assert.equal(summarize(249).level.label, "Explorer");
});

test("max level remains complete without inventing another threshold or losing lifetime XP", () => {
  for (const value of [500, 1234, Number.MAX_SAFE_INTEGER]) {
    const summary = summarize(value);
    assert.equal(summary.value, value);
    assert.equal(summary.level.label, "Expert");
    assert.equal(summary.nextLevel, null);
    assert.equal(summary.remaining, 0);
    assert.equal(summary.levelSpan, 0);
    assert.equal(summary.fraction, 1);
    assert.equal(summary.isMax, true);
  }
});

test("decreasing server corrections immediately recompute the level", () => {
  assert.equal(summarize(500).level.label, "Expert");
  const corrected = summarize(99);
  assert.equal(corrected.level.label, "Beginner");
  assert.equal(corrected.remaining, 1);
  assert.equal(corrected.fraction, .99);
});

test("single-level and very large intervals remain finite and bounded", () => {
  assert.equal(summarize(0, [levels[0]]).fraction, 1);
  const largeLevels = [levels[0], { threshold: Number.MAX_SAFE_INTEGER, label: "Master" }];
  for (const value of [0, 1, Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER]) {
    const summary = summarize(value, largeLevels);
    assert.ok(Number.isFinite(summary.fraction));
    assert.ok(summary.fraction >= 0 && summary.fraction <= 1);
    assert.ok(Number.isSafeInteger(summary.remaining));
  }
});

test("data snapshots are independent of mutable host objects", () => {
  const input = { value: 180, levels: levels.map((level) => ({ ...level })) };
  const snapshot = normalizeProgress(input);
  input.value = 999;
  input.levels[1].threshold = 200;
  input.levels.pop();
  assert.equal(snapshot.value, 180);
  assert.equal(snapshot.levels[1].threshold, 100);
  assert.equal(snapshot.levels.length, 4);
  assert.ok(Object.isFrozen(snapshot));
  assert.ok(Object.isFrozen(snapshot.levels));
  assert.ok(Object.isFrozen(snapshot.levels[0]));
});

test("malformed numeric inputs are rejected without coercion or clamping", () => {
  for (const value of [-1, .5, NaN, Infinity, "180", null, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => normalizeProgress({ value, levels }), TypeError);
  }
  for (const input of [null, {}, [], { value: 0 }, { value: 0, levels: [] }]) {
    assert.throws(() => normalizeProgress(input), TypeError);
  }
});

test("level definitions must start at zero and strictly increase", () => {
  for (const suppliedLevels of [
    [{ threshold: 1, label: "A" }],
    [levels[0], { threshold: 0, label: "B" }],
    [levels[0], levels[2], levels[1]],
    [levels[0], { threshold: -1, label: "B" }],
    [levels[0], { threshold: Infinity, label: "B" }],
    [levels[0], { threshold: "100", label: "B" }],
    [levels[0], { threshold: .5, label: "B" }],
    [levels[0], { threshold: Number.MAX_SAFE_INTEGER + 1, label: "B" }],
    [{ threshold: 0, label: " " }],
    [{ threshold: 0, label: 1 }],
    [null],
    Array(1),
    [levels[0], , levels[2]],
  ]) assert.throws(() => normalizeProgress({ value: 0, levels: suppliedLevels }), TypeError);
});

test("a rejected snapshot leaves the meter's last valid progress intact", () => {
  const previous = normalizeProgress({ value: 180, levels });
  const meter = Object.create(XpMeter.prototype);
  meter._progress = previous;
  let renderCount = 0;
  meter._render = () => { renderCount++; };
  for (const malformedLevels of [Array(1), [levels[0], , levels[2]]]) {
    assert.throws(() => { meter.progress = { value: 0, levels: malformedLevels }; }, TypeError);
    assert.equal(meter.progress, previous);
  }
  assert.equal(renderCount, 0);
});
