import { test } from "node:test";
import assert from "node:assert/strict";
import { computePeaksFromSamples } from "./audioPeaks";

test("returns an array with exactly numBars entries", () => {
  const samples = new Float32Array(1000).fill(0.1);
  const peaks = computePeaksFromSamples(samples, 10);
  assert.equal(peaks.length, 10);
});

test("each bar reflects the max absolute amplitude in its slice", () => {
  const samples = new Float32Array(10).fill(0);
  samples[2] = 0.9; // inside bar 0 (samples 0-4)
  samples[7] = -0.5; // negative, inside bar 1 (samples 5-9) — abs should be used
  const peaks = computePeaksFromSamples(samples, 2);
  assert.ok(peaks[0] > 0.8, `expected bar 0 to reflect the 0.9 spike, got ${peaks[0]}`);
  assert.ok(peaks[1] > 0.4 && peaks[1] < 0.6, `expected bar 1 to reflect abs(-0.5), got ${peaks[1]}`);
});

test("applies a visible floor for silence so bars are never zero-height", () => {
  const samples = new Float32Array(100).fill(0);
  const peaks = computePeaksFromSamples(samples, 10);
  for (const p of peaks) {
    assert.ok(p > 0, `expected a nonzero floor, got ${p}`);
  }
});

test("last bar absorbs any remainder when length isn't evenly divisible", () => {
  const samples = new Float32Array(23).fill(0.3);
  const peaks = computePeaksFromSamples(samples, 5);
  assert.equal(peaks.length, 5);
  assert.ok(peaks.every((p) => p > 0.2));
});

test("returns an empty array for zero bars or empty input", () => {
  assert.deepEqual(computePeaksFromSamples(new Float32Array(10), 0), []);
  assert.deepEqual(computePeaksFromSamples(new Float32Array(0), 10), []);
});

test("works with a plain number array, not just Float32Array", () => {
  const peaks = computePeaksFromSamples([0.1, 0.2, -0.9, 0.1], 2);
  assert.equal(peaks.length, 2);
});
