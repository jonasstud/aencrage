import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveAudioFetchUrl, isAllowedProxyHost } from "./audioProxy";

test("routes a Sanity CDN audio URL through the same-origin proxy", () => {
  const url = resolveAudioFetchUrl(
    "https://cdn.sanity.io/files/dhukk50e/production/abc123.mp3",
  );
  assert.equal(
    url,
    "/api/audio-proxy?url=" +
      encodeURIComponent(
        "https://cdn.sanity.io/files/dhukk50e/production/abc123.mp3",
      ),
  );
});

test("leaves a relative local path unchanged", () => {
  const url = resolveAudioFetchUrl("/fonds/portraits/werner-stappung.mp3");
  assert.equal(url, "/fonds/portraits/werner-stappung.mp3");
});

test("leaves an unrelated absolute URL unchanged", () => {
  const url = resolveAudioFetchUrl("https://example.com/audio.mp3");
  assert.equal(url, "https://example.com/audio.mp3");
});

test("allows https URLs on the Sanity CDN host", () => {
  assert.equal(
    isAllowedProxyHost("https://cdn.sanity.io/files/dhukk50e/production/abc123.mp3"),
    true,
  );
});

test("rejects a non-Sanity host", () => {
  assert.equal(isAllowedProxyHost("https://evil.example.com/abc123.mp3"), false);
});

test("rejects http (non-https) even on the right host", () => {
  assert.equal(
    isAllowedProxyHost("http://cdn.sanity.io/files/dhukk50e/production/abc123.mp3"),
    false,
  );
});

test("rejects a malformed URL", () => {
  assert.equal(isAllowedProxyHost("not-a-url"), false);
});
