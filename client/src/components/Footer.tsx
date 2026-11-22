// Site footer. Rendered inside the app shell on every page.

import Link from "next/link";
import { Facebook, Github, Instagram, Mail, MapPin, Twitter } from "lucide-react";

const columns = [
  {
    title: "Marketplace",
    links: [
      { label: "Browse equipment", href: "/equipment" },
      { label: "Categories", href: "/equipment" },
      { label: "My rentals", href: "/my-rentals" },
      { label: "Favorites", href: "/favorites" },
    ],
  },
  {
    title: "For owners",
    links: [
      { label: "List equipment", href: "/add-equipment" },
      { label: "My listings", href: "/owner/listings" },
      { label: "Owner workspace", href: "/owner" },
      { label: "Create account", href: "/register" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Equiply", href: "/about" },
      { label: "Help center", href: "/help" },
      { label: "Profile", href: "/profile" },
      { label: "Sign in", href: "/login" },
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
              The equipment rental marketplace that connects people who need gear with
              people who have it. Rent smarter, waste less and get your project moving.
            </p>
            <p
              className="footer-about"
              style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}
            >
              <Mail size={16} /> support@equiply.example
            </p>
            <p
              className="footer-about"
              style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}
            >
              <MapPin size={16} /> Rajshahi · Dhaka · Chattogram
            </p>
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
          <span>© 2026 Equiply. Built for the equipment rental assignment.</span>
          <div className="footer-socials">
            <a href="https://twitter.com" aria-label="Twitter">
              <Twitter size={16} />
            </a>
            <a href="https://facebook.com" aria-label="Facebook">
              <Facebook size={16} />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="https://github.com" aria-label="GitHub">
              <Github size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
