"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, PackageSearch, CalendarDays, Heart, PlusCircle,
  ListChecks, UserRound, Settings, CircleHelp, Info, Menu, X, Shield,
} from "lucide-react";

const links = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Browse equipment", href: "/equipment", icon: PackageSearch },
  { label: "My rentals", href: "/my-rentals", icon: CalendarDays },
  { label: "Favorites", href: "/favorites", icon: Heart },
  { label: "Add equipment", href: "/add-equipment", icon: PlusCircle },
  { label: "My listings", href: "/owner/listings", icon: ListChecks },
  { label: "Owner workspace", href: "/owner", icon: PackageSearch },
  { label: "Admin", href: "/admin", icon: Shield },
  { label: "Profile", href: "/profile", icon: UserRound },
];
const secondary = [
  { label: "About Equiply", href: "/about", icon: Info },
  { label: "Help center", href: "/help", icon: CircleHelp },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function NavLinks({ close }: { close?: () => void }) {
    return <>{[links, secondary].map((group, index) => (
      <div className="sidebar-group" key={index}>
        {group.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
          return <Link key={href} href={href} onClick={close} className={`sidebar-link${active ? " active" : ""}`}>
            <Icon size={18} /><span>{label}</span>
          </Link>;
        })}
      </div>
    ))}</>;
  }

  return <>
    <button className="sidebar-mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
      {open ? <X size={21}/> : <Menu size={21}/>}
    </button>
    {open && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <aside className={`equiply-sidebar${open ? " sidebar-open" : ""}`}>
      <Link href="/" className="sidebar-brand" onClick={() => setOpen(false)}>
        <span className="brand-mark">E</span><span>Equiply</span>
      </Link>
      <p className="sidebar-caption">WORKSPACE</p>
      <NavLinks close={() => setOpen(false)} />
      <div className="sidebar-bottom">
        <div className="sidebar-help"><strong>Need a hand?</strong><span>Find answers in our help center.</span><Link href="/help" onClick={() => setOpen(false)}>Get help →</Link></div>
        <Link href="/login" className="sidebar-link" onClick={() => setOpen(false)}>Sign in</Link>
        <Link href="/register" className="sidebar-cta" onClick={() => setOpen(false)}>Create account</Link>
      </div>
    </aside>
  </>;
}
