import Link from "next/link";
import { ArrowUpRight, Heart, ShieldCheck, Sparkles, Users } from "lucide-react";

const values = [
  {
    title: "Flexible",
    text: "Rent for exactly the time your project needs — an hour, a weekend or a month.",
    icon: Sparkles,
  },
  {
    title: "Community",
    text: "Discover equipment shared by owners and businesses in your own city.",
    icon: Users,
  },
  {
    title: "Convenient",
    text: "Browse, book and pay for everything from one simple marketplace.",
    icon: Heart,
  },
  {
    title: "Trusted",
    text: "Listings are reviewed and payments run through Stripe checkout.",
    icon: ShieldCheck,
  },
];

const facts = [
  ["6", "Equipment categories"],
  ["3", "Simple rental steps"],
  ["24/7", "Booking requests"],
  ["100%", "Reviewed listings"],
];

export default function AboutPage() {
  return (
    <div className="wrap section">
      <div className="eyebrow">About Equiply</div>
      <h1 className="h1" style={{ marginTop: 14, maxWidth: 900 }}>
        Equipment access, made easier.
      </h1>
      <p className="lead" style={{ maxWidth: 760, marginTop: 20 }}>
        Equiply connects people who need equipment with people who have it. Rent the right
        tools for your project without the expense of owning everything — and earn from
        the gear already sitting in your garage.
      </p>

      <div
        className="card"
        style={{
          marginTop: 34,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 0,
        }}
      >
        {facts.map(([value, label], index) => (
          <div
            key={label}
            style={{
              padding: "30px 26px",
              borderRight: index === facts.length - 1 ? "none" : "1px solid var(--line)",
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 850, letterSpacing: "-0.03em" }}>
              {value}
            </div>
            <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid2" style={{ marginTop: 44, alignItems: "start" }}>
        <div>
          <div className="eyebrow">Our story</div>
          <h2 className="h2" style={{ marginTop: 10 }}>
            Built for people who get things done
          </h2>
        </div>
        <div className="stack" style={{ gap: 16 }}>
          <p className="lead" style={{ margin: 0 }}>
            Most projects only need a piece of equipment for a few days. Buying it is
            expensive, storing it is wasteful and borrowing is unreliable. Equiply fixes
            that with a marketplace where owners list their gear and renters request it in
            minutes.
          </p>
          <p className="lead" style={{ margin: 0 }}>
            Every listing goes through a review before it goes live, booking requests
            carry clear dates and totals, and payments are handled by a secure checkout
            flow. Owners stay in control of their calendar and their rates.
          </p>
        </div>
      </div>

      <div className="grid4" style={{ marginTop: 44 }}>
        {values.map(({ title, text, icon: Icon }) => (
          <article className="card card-pad card-hover" key={title}>
            <span className="stat-icon">
              <Icon size={20} />
            </span>
            <h3 className="h3" style={{ marginTop: 14, fontSize: 18 }}>
              {title}
            </h3>
            <p className="muted" style={{ margin: "8px 0 0", fontSize: 14.5 }}>
              {text}
            </p>
          </article>
        ))}
      </div>

      <div className="cta-panel" style={{ marginTop: 46 }}>
        <div>
          <h2 className="h2" style={{ color: "#fff" }}>
            Ready to start?
          </h2>
          <p style={{ margin: "10px 0 0" }}>
            Create a free account to save favorites, request rentals and list your own
            equipment.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/register" className="btn btn-accent">
            Join Equiply <ArrowUpRight size={17} />
          </Link>
          <Link
            href="/equipment"
            className="btn btn-outline"
            style={{ color: "white", borderColor: "rgba(255,255,255,.45)" }}
          >
            Browse equipment
          </Link>
        </div>
      </div>
    </div>
  );
}
