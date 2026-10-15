import { Link } from "@tanstack/react-router";
import { CompanyBrand, ContactStrip } from "@/components/company-brand";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <>
      <ContactStrip />
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3">
        <CompanyBrand />
        <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/gallery" className="hover:text-primary" activeProps={{ className: "text-primary" }}>Gallery</Link>
          <Link to="/projects" className="hover:text-primary" activeProps={{ className: "text-primary" }}>Projects</Link>
          <Button asChild><Link to="/" hash="contact">Free quote</Link></Button>
        </nav>
      </header>
    </>
  );
}
