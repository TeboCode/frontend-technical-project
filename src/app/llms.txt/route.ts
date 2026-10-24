import { buildLlmsTxt } from "@/lib/llms-txt";

// Served at /llms.txt. Uses no request data, so it's prerendered at build time.
export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
