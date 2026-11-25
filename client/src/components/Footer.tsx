 
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
} from "lucide-react";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Browse Equipment", href: "/equipment" },
      { label: "List Your Equipment", href: "/add-equipment" },
      { label: "About Equiply", href: "/about" },
      { label: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Your Account",
    links: [
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/register" },
      { label: "My Rentals", href: "/my-rentals" },
      { label: "Favorites", href: "/favorites" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Terms of Service", href: "/help" },
      { label: "Privacy Policy", href: "/help" },
      { label: "Cookie Policy", href: "/help" },
      { label: "Rental Agreement", href: "/help" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#E8DFD6] bg-[#F8F3EE] text-[#292723]">
      <div className="mx-auto max-w-[1400px] px-6 pb-6 pt-14 sm:px-10 lg:px-16 lg:pt-16">
        {/* Main footer */}
        <div className="grid gap-12 border-b border-[#E8DFD6] pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
          {/* Brand and contact */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#79563E] text-xl font-bold text-white">
                E
              </span>
              <span className="text-[23px] font-bold tracking-tight text-[#292723]">
                Equiply<span className="text-[#9A7656]">.</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-[#82776D]">
              The modern equipment rental marketplace for builders,
              creators and teams. Rent trusted gear when you need it,
              or earn by listing your own.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href="mailto:support@equiply.com"
                className="flex items-center gap-3 text-xs text-[#71665D] transition hover:text-[#79563E]"
              >
                <Mail size={16} className="text-[#9A7656]" />
                support@equiply.com
              </a>

              <a
                href="tel:+8801700000000"
                className="flex items-center gap-3 text-xs text-[#71665D] transition hover:text-[#79563E]"
              >
                <Phone size={16} className="text-[#9A7656]" />
                +880 1700-000000
              </a>

              <p className="flex items-center gap-3 text-xs text-[#71665D]">
                <MapPin size={16} className="text-[#9A7656]" />
                Dhaka, Bangladesh
              </p>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#292723]">
                {column.title}
              </h3>

              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-xs text-[#82776D] transition hover:text-[#79563E]"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 transition group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom footer */}
        <div className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-[#8B8177]">
            © {new Date().getFullYear()} Equiply. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E3D8CC] text-[#79563E] transition hover:border-[#79563E] hover:bg-[#79563E] hover:text-white"
            >
              <Facebook size={15} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E3D8CC] text-[#79563E] transition hover:border-[#79563E] hover:bg-[#79563E] hover:text-white"
            >
              <Instagram size={15} />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E3D8CC] text-[#79563E] transition hover:border-[#79563E] hover:bg-[#79563E] hover:text-white"
            >
              <Linkedin size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
