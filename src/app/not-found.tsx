import { House, SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { primaryActionClass, StatusMessage } from "@/components/ui/StatusMessage";
import { routes } from "@/config/navigation";

// Shown for unmatched URLs and notFound() calls. Next.js returns a 404 status
// and adds a noindex robots tag automatically.
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <StatusMessage
      icon={SearchX}
      eyebrow="Error 404"
      title="Oops! We can't find that page."
      description="The page you're looking for doesn't exist or may have moved. Check the address, or head back to the home page."
      actions={
        <Link href={routes.home} className={primaryActionClass}>
          <House aria-hidden="true" className="size-4" />
          Go to home
        </Link>
      }
    />
  );
}
