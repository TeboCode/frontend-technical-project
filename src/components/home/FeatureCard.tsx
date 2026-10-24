import Image from "next/image";
import Link from "next/link";
import type { Feature } from "@/config/features";

type FeatureCardProps = {
  feature: Feature;
};

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <article className="flex w-full flex-col items-center">
      <Image
        src={feature.image}
        alt={feature.imageAlt}
        sizes="(min-width: 400px) 300px, 90vw"
        placeholder="blur"
        className="aspect-square w-full rounded-sm object-cover"
      />

      {/* Grows to fill the card so, with the button pinned to the bottom,
          buttons line up across cards whatever the description length. */}
      <div className="relative -mt-12 flex w-[75%] flex-1 flex-col rounded-sm bg-surface px-4 py-3 text-center shadow-raised">
        <h3 className="sr-only">{feature.title}</h3>
        <p className="mb-4 text-xs leading-relaxed text-body">
          {feature.description}
        </p>
        {/* A link styled as a button: it navigates to another page. */}
        <Link
          href={feature.href}
          className="group mt-auto inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brand-solid px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {feature.ctaLabel}
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          >
            &rarr;
          </span>
        </Link>
      </div>
    </article>
  );
}
