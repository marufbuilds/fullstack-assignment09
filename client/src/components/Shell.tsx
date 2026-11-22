"use client";

// Holds the mobile menu state and renders the whole app shell:
// top navbar, sidebar navigation, page content and footer.

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function Shell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Always close the drawer when the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <Navbar onToggleMenu={() => setMenuOpen((open) => !open)} />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="app-content">
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
