"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = [
    { name: "Archive", href: "/" },
    { name: "Analysis", href: "/analyze" },
    { name: "Studies", href: "/research" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-700">
      <div
        className={`w-full px-5 sm:px-8 md:px-16 py-4 md:py-6 flex items-center justify-between border-thick-b transition-all duration-700 ${
          scrolled || menuOpen ? "bg-editorial-cream/95 backdrop-blur-md md:py-4" : "bg-transparent"
        }`}
      >
        <Link href="/" className="group flex items-center gap-3">
          <span className="heading-display text-xl sm:text-2xl font-bold tracking-tight">Gooseberry</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 lg:gap-16">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative"
              >
                <span className={`text-base sm:text-lg transition-all duration-500 ${
                  isActive ? "text-editorial-charcoal italic" : "text-editorial-gray group-hover:text-editorial-charcoal"
                }`}>
                  {link.name}
                </span>
                <div className={`absolute -bottom-1 left-0 h-[1px] bg-editorial-charcoal transition-all duration-700 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <Link href="/analyze" className="px-6 py-2 border-thick-t border-thick-b text-meta hover:bg-editorial-charcoal hover:text-editorial-cream transition-all">
            Begin Study
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-[2px] bg-editorial-charcoal transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block w-6 h-[2px] bg-editorial-charcoal transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-[2px] bg-editorial-charcoal transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 bg-editorial-cream/95 backdrop-blur-md border-b border-editorial-charcoal/20 ${
        menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="px-5 py-6 flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`py-3 px-4 text-lg transition-all duration-300 border-b border-editorial-charcoal/10 ${
                  isActive
                    ? "text-editorial-charcoal italic font-bold"
                    : "text-editorial-gray"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/analyze"
            onClick={() => setMenuOpen(false)}
            className="mt-4 py-3 px-4 bg-editorial-charcoal text-editorial-cream text-center text-meta hover:bg-editorial-gold transition-all"
          >
            Begin Study
          </Link>
        </div>
      </div>
    </nav>
  );
}
