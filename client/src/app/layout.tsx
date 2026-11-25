 
import "./globals.css";
import type { Metadata } from "next";

import ThemeProvider from "@/components/ThemeProvider";
import { AuthProvider } from "@/lib/auth";
import { FavoritesProvider } from "@/lib/favorites";
import { ToastProvider } from "@/lib/toast";
import { Shell } from "@/components/Shell";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <FavoritesProvider>
                <Shell>{children}</Shell>
              </FavoritesProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
