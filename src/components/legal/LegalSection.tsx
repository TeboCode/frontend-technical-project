import type { LegalBlock, LegalSection as LegalSectionData } from "@/lib/legal/content";

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul className="list-disc space-y-1.5 pl-5">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        // Scrolls on its own on narrow screens instead of widening the page.
        <div className="overflow-x-auto rounded-sm border border-line">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="bg-muted text-heading">
              <tr>
                {block.columns.map((column) => (
                  <th key={column} scope="col" className="px-3 py-2 font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {block.rows.map(([name, ...cells]) => (
                <tr key={name}>
                  <th scope="row" className="px-3 py-2 align-top font-mono text-xs font-normal text-heading">
                    {name}
                  </th>
                  {cells.map((cell) => (
                    <td key={cell} className="px-3 py-2 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/** One titled section of the legal page; its id is the anchor used by the table of contents. */
export function LegalSection({ section }: { section: LegalSectionData }) {
  const headingId = `${section.id}-heading`;

  return (
    <section
      id={section.id}
      aria-labelledby={headingId}
      className="scroll-mt-6 rounded-md bg-card p-5 shadow-card sm:p-6"
    >
      <h2 id={headingId} className="text-lg font-semibold text-heading">
        {section.title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-body">
        {section.blocks.map((block, index) => (
          <Block key={index} block={block} />
        ))}
      </div>
    </section>
  );
}
