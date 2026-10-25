import { features } from "@/config/features";
import { FeatureCard } from "./FeatureCard";

export function Features() {
  return (
    <section aria-labelledby="features-heading" className="bg-card">
      <div className="container-page py-12 md:py-12">
        <h2
          id="features-heading"
          className="text-center text-2xl font-semibold text-heading sm:text-3xl"
        >
          Manage your entire system
        </h2>

        <ul className="mt-10 flex flex-wrap justify-center gap-x-16 gap-y-12 md:mt-14">
          {features.map((feature) => (
            // `flex` lets each card stretch to the row's height so buttons line up.
            <li key={feature.href} className="flex w-full max-w-[300px]">
              <FeatureCard feature={feature} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
