const PROXIED_HOSTS = new Set(["cdn.sanity.io"]);

/**
 * The custom waveform player needs to `fetch()` + decode the audio buffer
 * client-side, which requires CORS — Sanity's asset CDN doesn't send
 * Access-Control-Allow-Origin for file assets, so absolute Sanity URLs are
 * routed through our own same-origin proxy. Relative/local paths (legacy
 * static data) are left untouched since same-origin fetches never need it.
 */
export function resolveAudioFetchUrl(audioSrc: string): string {
  let parsed: URL;
  try {
    parsed = new URL(audioSrc);
  } catch {
    return audioSrc;
  }

  if (!PROXIED_HOSTS.has(parsed.hostname)) {
    return audioSrc;
  }

  return `/api/audio-proxy?url=${encodeURIComponent(audioSrc)}`;
}

export function isAllowedProxyHost(rawUrl: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }
  return parsed.protocol === "https:" && PROXIED_HOSTS.has(parsed.hostname);
}
