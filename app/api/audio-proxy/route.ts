import { type NextRequest } from "next/server";
import { isAllowedProxyHost } from "@/lib/audioProxy";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url || !isAllowedProxyHost(url)) {
    return new Response("Invalid or disallowed url", { status: 400 });
  }

  const upstream = await fetch(url);

  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream fetch failed", { status: 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
      ...(upstream.headers.get("content-length")
        ? { "Content-Length": upstream.headers.get("content-length")! }
        : {}),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
