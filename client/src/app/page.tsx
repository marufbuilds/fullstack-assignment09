"use client";

// Equiply landing page: hero search, categories, featured listings and
// the "how it works" story.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  CalendarDays,
  Car,
  HardHat,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
  Tent,
  Truck,
  Wallet,
  Zap,
} from "lucide-react";

import { ApiError, errorMessage, fetchEquipment, normalizeEquipment } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { demoEquipment } from "@/lib/demo-equipment";
import type { Equipment } from "@/lib/types";
import { EquipmentCard } from "@/components/EquipmentCard";
import { CardSkeleton, Notice } from "@/components/ui";

const categoryIcons: Record<string, typeof HardHat> = {
  Construction: HardHat,
  Photography: Camera,
  "Vehicles & Transportation": Truck,
  Agriculture: Sprout,
  Electronics: Zap,
  "Event Equipment": Tent,
};

const steps = [
  {
    title: "Find the right gear",
    text: "Search thousands of listings by category, location and daily price.",
    icon: Search,
  },
  {
    title: "Request your dates",
    text: "Pick a start and end date, then send the owner a booking request.",
    icon: CalendarDays,
  },
  {
    title: "Pay and get going",
    text: "Complete secure checkout, get approval and collect your equipment.",
    icon: Wallet,
  },
];

const benefits = [
  {
    title: "Verified listings",
    text: "Every item is reviewed by our team before it appears on the marketplace.",
    icon: ShieldCheck,
  },
  {
    title: "Flexible rentals",
    text: "Rent by the hour, day or week with pricing that fits your project.",
    icon: CalendarDays,
  },
  {
    title: "Local owners",
    text: "Discover gear shared by people and businesses in your own city.",
    icon: Car,
  },
  {
    title: "Protected payments",
    text: "Checkout is handled by Stripe, so your payment details stay secure.",
    icon: Wallet,
  },
];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [featured, setFeatured] = useState<Equipment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchEquipment({ sort: "newest", limit: 6 });
        if (cancelled) return;
        setFeatured(data.items);
        setTotal(data.total);
        setDemoMode(false);
      } catch (caught) {
        if (cancelled) return;
        if (caught instanceof ApiError && caught.status === 0) {
          setFeatured(demoEquipment.map(normalizeEquipment).slice(0, 6));
          setTotal(demoEquipment.length);
          setDemoMode(true);
        } else {
          setError(errorMessage(caught));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/equipment?q=${encodeURIComponent(value)}` : "/equipment");
  }

  return (
    <>
      {/* Hero ------------------------------------------------ */}
      <section className="wrap" style={{ padding: "44px 0 20px" }}>
        <motion.div
          className="hero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={
            {
              "--hero-image":
                "url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=85)",
            } as React.CSSProperties
          }
        >
          <div className="hero-inner">
            <div className="eyebrow" style={{ color: "#9fe3c6" }}>
              The equipment marketplace
            </div>
            <h1 className="h1" style={{ margin: "18px 0" }}>
              Get the right tools. <span style={{ color: "#f5c184" }}>Get it done.</span>
            </h1>
            <p className="lead" style={{ color: "rgba(255,255,255,.82)" }}>
              Access dependable equipment for your next project without the cost and
              commitment of owning it — from power tools to excavators.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <Search size={19} color="#68766f" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="What do you need? e.g. excavator, camera, tent"
                aria-label="Search equipment"
              />
              <button className="btn btn-accent" type="submit">
                Search
              </button>
            </form>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
              <Link className="btn" href="/equipment">
                Explore equipment <ArrowUpRight size={17} />
              </Link>
              <Link
                className="btn btn-outline"
                href="/register"
                style={{ color: "white", borderColor: "rgba(255,255,255,.45)" }}
              >
                List your equipment
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <b>{total || "—"}</b>
                <span>Live listings</span>
              </div>
              <div>
                <b>{CATEGORIES.length}</b>
                <span>Categories</span>
              </div>
              <div>
                <b>24/7</b>
                <span>Booking requests</span>
              </div>
              <div>
                <b>100%</b>
                <span>Reviewed listings</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Categories ------------------------------------------ */}
      <section className="wrap section-tight">
        <div className="section-head">
          <div>
            <div className="eyebrow">Browse by need</div>
            <h2 className="h2" style={{ marginTop: 8 }}>
              Find your category
            </h2>
          </div>
          <Link href="/equipment" className="btn btn-outline">
            View all equipment
          </Link>
        </div>

        <div className="grid3">
          {CATEGORIES.map((category, index) => {
            const Icon = categoryIcons[category] || Sparkles;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={`/equipment?category=${encodeURIComponent(category)}`}
                  className="card card-pad card-hover"
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <span className="stat-icon" style={{ width: 50, height: 50 }}>
                    <Icon size={24} />
                  </span>
                  <span>
                    <strong style={{ display: "block", fontSize: 16.5 }}>
                      {category}
                    </strong>
                    <span className="muted" style={{ fontSize: 13.5 }}>
                      Browse listings →
                    </span>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured -------------------------------------------- */}
      <section className="wrap section-tight">
        <div className="section-head">
          <div>
            <div className="eyebrow">Featured equipment</div>
            <h2 className="h2" style={{ marginTop: 8 }}>
              Ready when you are
            </h2>
            <p className="muted" style={{ margin: "8px 0 0" }}>
              Fresh listings from owners across the country.
            </p>
          </div>
          <Link href="/equipment" className="btn btn-outline">
            See everything <ArrowRight size={16} />
          </Link>
        </div>

        {demoMode && (
          <div style={{ marginBottom: 20 }}>
            <Notice kind="warning">
              The API is offline, so demo listings are shown instead.
            </Notice>
          </div>
        )}

        {error && (
          <div style={{ marginBottom: 20 }}>
            <Notice kind="error">{error}</Notice>
          </div>
        )}

        <div className="grid3">
          {loading ? (
            <CardSkeleton count={6} />
          ) : (
            featured.map((item) => <EquipmentCard key={item._id} item={item} />)
          )}
        </div>
      </section>

      {/* How it works ---------------------------------------- */}
      <section className="wrap section-tight">
        <div className="section-head">
          <div>
            <div className="eyebrow">How it works</div>
            <h2 className="h2" style={{ marginTop: 8 }}>
              Three steps to your next project
            </h2>
          </div>
        </div>

        <div className="grid3">
          {steps.map((step, index) => (
            <div className="step-card" key={step.title}>
              <span className="step-number">{index + 1}</span>
              <h3 className="h3">{step.title}</h3>
              <p className="muted" style={{ margin: 0 }}>
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits -------------------------------------------- */}
      <section className="wrap section-tight">
        <div className="card card-pad" style={{ padding: "clamp(26px,4vw,46px)" }}>
          <div className="section-head">
            <div>
              <div className="eyebrow">Why Equiply</div>
              <h2 className="h2" style={{ marginTop: 8 }}>
                Built for real projects
              </h2>
            </div>
          </div>

          <div className="grid4">
            {benefits.map((benefit) => (
              <div key={benefit.title} style={{ display: "grid", gap: 10 }}>
                <span className="stat-icon">
                  <benefit.icon size={20} />
                </span>
                <h3 className="h3" style={{ fontSize: 17 }}>
                  {benefit.title}
                </h3>
                <p className="muted" style={{ margin: 0, fontSize: 14.5 }}>
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner CTA ------------------------------------------- */}
      <section className="wrap section-tight">
        <div className="cta-panel">
          <div>
            <div className="eyebrow" style={{ color: "#f5c184" }}>
              For owners
            </div>
            <h2 className="h2" style={{ color: "#fff", marginTop: 10 }}>
              Your gear should work for you
            </h2>
            <p>
              List the equipment sitting in your garage, set your own rates and earn from
              every approved rental. It only takes a few minutes.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/register" className="btn btn-accent">
              Create free account
            </Link>
            <Link
              href="/about"
              className="btn btn-outline"
              style={{ color: "white", borderColor: "rgba(255,255,255,.45)" }}
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
