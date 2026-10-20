import { Logo } from "@/components/ui/Logo";
import { LogoutButton } from "./LogoutButton";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Header() {
  return (
    <header className="relative z-10 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="container-page flex h-[60px] items-center justify-between">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-14 md:flex">
          <NavLinks className="flex items-center gap-7" />
          <LogoutButton />
        </nav>

        <MobileMenu>
          <nav aria-label="Main mobile">
            <NavLinks className="flex flex-col gap-1" linkClassName="block py-2" />
            <LogoutButton className="mt-3 w-full" />
          </nav>
        </MobileMenu>
      </div>
    </header>
  );
}
