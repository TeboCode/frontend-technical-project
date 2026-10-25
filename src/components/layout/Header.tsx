import { Logo } from "@/components/ui/Logo";
import { LogoutButton } from "./LogoutButton";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="relative z-10 bg-card shadow-card">
      <div className="container-page flex h-[60px] items-center justify-between">
        <Logo />

        <div className="flex items-center gap-2 md:gap-8">
          <nav aria-label="Main" className="hidden items-center gap-14 md:flex">
            <NavLinks className="flex items-center gap-7" />
            <LogoutButton />
          </nav>

          <ThemeToggle />

          <MobileMenu>
            <nav aria-label="Main mobile">
              <NavLinks className="flex flex-col gap-1" linkClassName="block py-2" />
              <LogoutButton className="mt-3 w-full" />
            </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
