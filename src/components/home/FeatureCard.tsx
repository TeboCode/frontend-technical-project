import Image from "next/image";
import Link from "next/link";
import type { Feature } from "@/config/features";

type FeatureCardProps = {
  feature: Feature;
};

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <article className="flex flex-col items-center">
      <Image
        src={feature.image}
        alt={feature.imageAlt}
        sizes="(min-width: 400px) 300px, 90vw"
        placeholder="blur"
        className="aspect-square w-full rounded-sm object-cover"
      />

      <div className="relative -mt-12 w-[75%] rounded-sm bg-surface px-4 py-3 text-center shadow-raised">
        <h3 className="sr-only">{feature.title}</h3>
        <p className="text-xs leading-relaxed text-body">
          {feature.description}
        </p>
        <Link
          href={feature.href}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-brand-dark hover:underline"
        >
          {feature.ctaLabel}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}
