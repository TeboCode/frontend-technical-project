import { buildLlmsFullTxt } from "@/lib/llms-txt";

// Served at /llms-full.txt. Uses no request data, so it's prerendered at build time.
export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
