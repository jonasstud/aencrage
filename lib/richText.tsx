import type { ReactNode } from "react";

const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Parses `[label](url)` markdown-style links out of plain text and renders them as anchors. */
export function renderTextWithLinks(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  const re = new RegExp(MARKDOWN_LINK);
  let match: RegExpExecArray | null;

  while ((match = re.exec(text))) {
    const [full, label, url] = match;
    parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-1 underline-offset-2 hover:opacity-70"
      >
        {label}
      </a>,
    );
    lastIndex = match.index + full.length;
  }
  parts.push(text.slice(lastIndex));

  return parts;
}
