import type { Graph, Thing, WithContext } from "schema-dts";
import { serializeJsonLd } from "@/lib/structured-data";

type JsonLdProps = {
  data: Graph | WithContext<Thing>;
};

/** Renders schema.org structured data. Server-rendered, so crawlers see it without running JavaScript. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
