import { Link } from "@tanstack/react-router";
import { Phone, Instagram } from "lucide-react";
import logo from "@/assets/calipro-logo-transparent.png";

export function CompanyBrand() {
  return (
    <Link to="/" aria-label="Calipro Painting home" className="flex shrink-0 items-center gap-3">
      <img src={logo} alt="Calipro Painting logo" width={768} height={768} className="h-20 w-20 object-contain sm:h-24 sm:w-24" />
      <span className="hidden font-display text-lg font-bold md:inline">Calipro Painting</span>
    </Link>
  );
}

export function HeaderPhone() {
  return (
    <a href="tel:+16696664552" className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-bold text-primary-foreground hover:underline">
      <Phone className="h-4 w-4" aria-hidden="true" /> 669-666-4552
    </a>
  );
}

export function ContactStrip() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2.5">
        <span className="text-xs font-semibold sm:text-sm">Serving the East Bay &amp; North Bay</span>
        <div className="flex items-center gap-5">
          <HeaderPhone />
          <a href="https://instagram.com/calipro.painting" target="_blank" rel="noopener noreferrer" aria-label="Calipro Painting on Instagram" className="hidden sm:block"><Instagram className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
  );
}