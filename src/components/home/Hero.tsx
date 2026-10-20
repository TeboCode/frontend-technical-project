import Image from "next/image";
import heroBanner from "@/assets/images/hero-banner.png";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="bg-surface">
      <div className="container-page grid items-center gap-10 py-5 md:min-h-[400x] md:grid-cols-2 md:py-5">
        <div className="text-center md:text-left">
          <h1
            id="hero-heading"
            className="text-3xl font-semibold leading-tight text-heading sm:text-4xl"
          >
            Insights, eligibility, &amp; branches
            <span className="mt-2 block text-brand">All in one place.</span>
          </h1>
          <p className="mt-6 text-base text-body">
            Make informed financial decisions with the right information at
            your fingertips.
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src={heroBanner}
            alt="Illustration of a developer holding a laptop beside a large monitor showing code and flowcharts"
            sizes="(min-width: 768px) 273px, 70vw"
            className="h-auto w-full max-w-[273px]"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
