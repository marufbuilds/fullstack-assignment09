 
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function Shell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen w-full bg-[#FFFCFA] text-[#292723]">
      <Navbar
        onToggleMenu={() => {
          if (!isHomePage) {
            setMenuOpen((open) => !open);
          }
        }}
      />

      <div className="flex min-h-[calc(100vh-72px)] w-full">
        {!isHomePage && (
          <Sidebar
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
          />
        )}

        <div className="min-w-0 w-full flex-1">
          <main className="min-h-[60vh] w-full">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
