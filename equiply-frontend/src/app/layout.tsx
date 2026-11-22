import "./globals.css";
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Equiply | Equipment, when you need it",
  description: "A practical marketplace for renting equipment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <div className="app-content">
          <main>{children}</main>
          <footer className="wrap app-footer">
            <b>Equiply</b>
            <span className="muted">Rent smarter. Build more.</span>
            <span className="muted">© 2026 Equiply</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
