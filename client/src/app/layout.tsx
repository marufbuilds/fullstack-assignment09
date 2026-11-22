
import "./globals.css";
import type { Metadata } from "next";

import ThemeProvider from "@/components/ThemeProvider";
import { AuthProvider } from "@/lib/auth";
import { FavoritesProvider } from "@/lib/favorites";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: {
    default: "Equiply | Rent the equipment you need",
    template: "%s | Equiply",
  },
  description: "Equiply is a modern equipment rental marketplace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <FavoritesProvider>
              <Shell>{children}</Shell>
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
