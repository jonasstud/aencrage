import type { ReactNode } from "react";

const ORDINAL_SUFFIX = /(\d+)(ère|ème|nde|er|re|e)\b/g;

export function renderOrdinalTitle(title: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  const re = new RegExp(ORDINAL_SUFFIX);
  let match: RegExpExecArray | null;

  while ((match = re.exec(title))) {
    const [full, number, suffix] = match;
    parts.push(title.slice(lastIndex, match.index));
    parts.push(number);
    parts.push(<sup key={match.index}>{suffix}</sup>);
    lastIndex = match.index + full.length;
  }
  parts.push(title.slice(lastIndex));

  return parts;
}
