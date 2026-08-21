// Next.js re-blurs this SVG heavily (Gaussian stdDeviation 20) before showing
// it as the placeholder, so the source needs strong color contrast — a subtle
// gradient gets smoothed into an almost flat wash and becomes invisible
// against the surrounding bg-placeholder box.
const blurSvg = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop stop-color="#C3D0E0" offset="0%" />
      <stop stop-color="#DCE3EC" offset="50%" />
      <stop stop-color="#EEF1F5" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const shimmerBlurDataUrl = (w = 700, h = 525) =>
  `data:image/svg+xml;base64,${toBase64(blurSvg(w, h))}`;
