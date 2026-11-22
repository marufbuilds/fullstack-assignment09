import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const columns = [
  {
    title: "Navigation",
    links: [
      { label: "Browse Equipment", href: "/equipment" },
      { label: "List Your Equipment", href: "/add-equipment" },
      { label: "About", href: "/about" },
      { label: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Sign Up", href: "/register" },
      { label: "My Rentals", href: "/my-rentals" },
      { label: "Favorites", href: "/favorites" },
    ],
  },
  {
    title: "Legal",
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
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <span className="brand-mark">E</span>
              <span>Equiply</span>
            </div>
            <p className="footer-about">
              The modern equipment rental marketplace for builders, creators and teams.
              Rent trusted gear when you need it, or earn by listing your own.
            </p>
            <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
              <p
                className="footer-about"
                style={{ display: "flex", alignItems: "center", gap: 10, margin: 0 }}
              >
                <Mail size={16} /> support@equiply.com
              </p>
              <p
                className="footer-about"
                style={{ display: "flex", alignItems: "center", gap: 10, margin: 0 }}
              >
                <Phone size={16} /> +880 1700-000000
              </p>
              <p
                className="footer-about"
                style={{ display: "flex", alignItems: "center", gap: 10, margin: 0 }}
              >
                <MapPin size={16} /> Dhaka, Bangladesh
              </p>
            </div>
          </div>

          {columns.map((column) => (
            <div className="footer-col" key={column.title}>
              <h4>{column.title}</h4>
              {column.links.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© 2026 Equiply. All rights reserved.</span>
          <div className="footer-socials">
            <a href="https://facebook.com" aria-label="Facebook">
              <Facebook size={16} />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
