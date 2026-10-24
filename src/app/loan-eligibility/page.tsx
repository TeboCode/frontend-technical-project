import { LoanSimulator } from "@/components/loans/LoanSimulator";
import { routes } from "@/config/navigation";
import { publicPageMetadata } from "@/lib/seo";
import { getLoanProducts, getValidationRules } from "@/lib/loans/api";

// Title and description come from publicPages, shared with sitemap and llms.txt.
export const metadata = publicPageMetadata(routes.loanEligibility);

export default async function LoanEligibilityPage() {
  const [{ products }, rules] = await Promise.all([getLoanProducts(), getValidationRules()]);

  return (
    <div className="bg-surface">
      <div className="container-page py-8 md:py-10">
        <header className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold text-heading sm:text-3xl">
            Loan Eligibility Simulator
          </h1>
          <p className="mt-1 text-sm text-body">
            Tell us about your income, expenses and the loan you need, and we&apos;ll estimate
            what you could qualify for. It takes about two minutes.
          </p>
        </header>

        <LoanSimulator products={products} rules={rules} />
      </div>
    </div>
  );
}
