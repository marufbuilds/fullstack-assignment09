 
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  ArrowRight,
  CalendarDays,
  Camera,
  CarFront,
  HardHat,
  MapPin,
  Search,
  Tent,
  Wrench,
  Zap,
  ShieldCheck,
  Truck,
  RefreshCcw,
  Leaf,
  Heart,
  Star,
  PackageCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EquipmentCard } from "@/components/EquipmentCard";
import { CardSkeleton, Notice } from "@/components/ui";

import {
  ApiError,
  errorMessage,
  fetchEquipment,
  normalizeEquipment,
} from "@/lib/api";

import { demoEquipment } from "@/lib/demo-equipment";
import type { Equipment } from "@/lib/types";

/* ----------------------------------
   CATEGORY DATA
---------------------------------- */

const categories = [
  {
    name: "Construction",
    href: "/equipment?category=Construction",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=85",
    icon: HardHat,
  },
  {
    name: "Tools",
    href: "/equipment?q=tools",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=700&q=85",
    icon: Wrench,
  },
  {
    name: "Vehicles",
    href: "/equipment?category=Vehicles%20%26%20Transportation",
    image:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=700&q=85",
    icon: CarFront,
  },
  {
    name: "Photography",
    href: "/equipment?category=Photography",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85",
    icon: Camera,
  },
  {
    name: "Camping",
    href: "/equipment?q=camping",
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=700&q=85",
    icon: Tent,
  },
  {
    name: "Electronics",
    href: "/equipment?category=Electronics",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=85",
    icon: Zap,
  },
];

/* ----------------------------------
   IMAGE DATA
---------------------------------- */

const heroImage =
  "https://images.unsplash.com/photo-1751054619908-65d27a503ce8?auto=format&fit=crop&w=2000&q=90";

const promoImages = [
  "https://images.unsplash.com/photo-1771122453274-d3270e73cf94?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1746985106190-6c116edec9bc?auto=format&fit=crop&w=1400&q=90",
];

const storyImage =
  "https://images.unsplash.com/photo-1755943807913-5f999c562f45?auto=format&fit=crop&w=1400&q=90";

const inspirationImage =
  "https://images.unsplash.com/photo-1737332439478-4fe9721a2f3e?auto=format&fit=crop&w=1400&q=90";

const inspirationSideImage =
  "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=90";

const communityImage =
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1400&q=90";

/* ----------------------------------
   TESTIMONIAL DATA
---------------------------------- */

const testimonials = [
  {
    name: "Daniel R.",
    role: "Verified Renter",
    text: "Finding the right equipment was easy. The booking process was simple and everything arrived on time.",
  },
  {
    name: "Rahul K.",
    role: "Equipment Owner",
    text: "Equiply has helped me make better use of my equipment and connect with people who need it.",
  },
  {
    name: "Neha M.",
    role: "Verified Renter",
    text: "A great way to find quality equipment without spending a fortune buying it.",
  },
];

/* ----------------------------------
   HOMEPAGE
---------------------------------- */

export default function Home() {
  const router = useRouter();

  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const [featured, setFeatured] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [error, setError] = useState("");

  /* ----------------------------------
     FETCH FEATURED EQUIPMENT
  ---------------------------------- */

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchEquipment({
          sort: "newest",
          limit: 4,
        });

        if (cancelled) return;

        setFeatured(data.items.slice(0, 4));
        setDemoMode(false);
      } catch (e) {
        if (cancelled) return;

        if (e instanceof ApiError && e.status === 0) {
          setFeatured(
            demoEquipment.map(normalizeEquipment).slice(0, 4)
          );

          setDemoMode(true);
        } else {
          setError(errorMessage(e));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ----------------------------------
     SEARCH
  ---------------------------------- */

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (q.trim()) params.set("q", q.trim());
    if (location.trim()) params.set("location", location.trim());
    if (date) params.set("date", date);

    router.push(
      `/equipment${params.size ? `?${params.toString()}` : ""}`
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFFCFA] text-[#292723] transition-colors duration-300 dark:bg-[#211B17] dark:text-[#F3E6DA]">

      {/* ANNOUNCEMENT BAR */}

      <div className="flex items-center justify-between border-b border-[#E8DFD6] bg-[#F7F1EB] px-5 py-2 text-[10px] text-[#766E65] dark:border-[#514033] dark:bg-[#29221D] dark:text-[#C0A993] sm:px-8 md:px-12">
        <p>Find the equipment your project needs</p>

        <p className="hidden sm:block">
          Reliable rentals. Better projects.
        </p>
      </div>

      {/* HERO SECTION */}

      <section className="relative flex min-h-[490px] items-center overflow-hidden bg-[#29221D] md:min-h-[570px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#17152b]/90 via-[#17152b]/60 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-20 sm:px-10 md:px-16 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="mb-5 block text-[10px] font-semibold tracking-[3px] text-[#e6c7a9]">
              EQUIPMENT FOR EVERY PROJECT
            </span>

            <h1 className="max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl">
              Get the job done.
              <br />
              <span className="text-[#e6c7a9]">
                Rent smarter.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/80 sm:text-base">
              Find quality equipment, trusted owners and flexible
              rentals for everything you need to get moving.
            </p>

            <div className="mt-8">
              <Link
                href="/equipment"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#79563E] px-7 text-xs font-semibold text-white transition hover:bg-[#5D402E] dark:bg-[#A77A55] dark:hover:bg-[#916747]"
              >
                Explore Equipment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-5">
              <div>
                <p className="text-lg font-semibold text-white">
                  Trusted
                </p>
                <p className="mt-1 text-[10px] text-white/70">
                  Equipment owners
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold text-white">
                  Flexible
                </p>
                <p className="mt-1 text-[10px] text-white/70">
                  Rental periods
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold text-white">
                  Simple
                </p>
                <p className="mt-1 text-[10px] text-white/70">
                  Booking experience
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEARCH SECTION */}

      <section className="relative z-20 mx-auto -mt-8 max-w-6xl px-4 sm:px-6">
        <form
          onSubmit={handleSearch}
          className="grid gap-3 rounded-xl border border-[#E8DFD6] bg-white p-4 text-[#292723] shadow-xl shadow-black/5 dark:border-[#514033] dark:bg-[#29221D] dark:text-[#F3E6DA] md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:gap-0 lg:p-5"
        >
          <label className="flex min-w-0 items-center gap-3 border-b border-[#E8DFD6] px-3 py-3 dark:border-[#514033] lg:border-b-0 lg:border-r">
            <Search className="h-5 w-5 shrink-0 text-[#79563E] dark:text-[#C49A73]" />

            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#82776D] dark:text-[#C0A993]">
                Equipment
              </span>

              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What do you need?"
                className="h-8 border-0 bg-transparent px-0 text-xs text-[#292723] shadow-none placeholder:text-[#94877B] focus-visible:ring-0 dark:text-[#F3E6DA] dark:placeholder:text-[#A89581]"
              />
            </span>
          </label>

          <label className="flex min-w-0 items-center gap-3 border-b border-[#E8DFD6] px-3 py-3 dark:border-[#514033] lg:border-b-0 lg:border-r">
            <MapPin className="h-5 w-5 shrink-0 text-[#79563E] dark:text-[#C49A73]" />

            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#82776D] dark:text-[#C0A993]">
                Location
              </span>

              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or area"
                className="h-8 border-0 bg-transparent px-0 text-xs text-[#292723] shadow-none placeholder:text-[#94877B] focus-visible:ring-0 dark:text-[#F3E6DA] dark:placeholder:text-[#A89581]"
              />
            </span>
          </label>

          <label className="flex min-w-0 items-center gap-3 border-b border-[#E8DFD6] px-3 py-3 dark:border-[#514033] lg:border-b-0 lg:border-r">
            <CalendarDays className="h-5 w-5 shrink-0 text-[#79563E] dark:text-[#C49A73]" />

            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#82776D] dark:text-[#C0A993]">
                Rental date
              </span>

              <Input
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-8 border-0 bg-transparent px-0 text-xs text-[#292723] shadow-none focus-visible:ring-0 dark:text-[#F3E6DA]"
              />
            </span>
          </label>

          <Button
            type="submit"
            className="h-12 rounded-md bg-[#79563E] px-8 text-xs font-semibold text-white hover:bg-[#5D402E] dark:bg-[#A77A55] dark:text-white dark:hover:bg-[#916747] lg:ml-4"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>
      </section>

      {/* BENEFITS STRIP */}

      <section className="grid grid-cols-2 border-b border-[#E8DFD6] bg-[#FFFCFA] px-5 py-10 dark:border-[#514033] dark:bg-[#211B17] sm:px-10 lg:grid-cols-4 lg:px-16">
        {[
          {
            icon: Leaf,
            title: "Better resource use",
            subtitle: "Rent instead of buying",
          },
          {
            icon: Truck,
            title: "Convenient rentals",
            subtitle: "Find equipment nearby",
          },
          {
            icon: RefreshCcw,
            title: "Flexible booking",
            subtitle: "Choose your rental period",
          },
          {
            icon: ShieldCheck,
            title: "Trusted marketplace",
            subtitle: "Book with confidence",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center justify-center gap-3 px-2 py-4"
            >
              <Icon className="h-6 w-6 shrink-0 text-[#79563E] dark:text-[#C49A73]" />

              <div>
                <p className="text-[11px] font-semibold text-[#302A24] dark:text-[#F3E6DA]">
                  {item.title}
                </p>

                <p className="mt-1 text-[10px] text-[#82776D] dark:text-[#C0A993]">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* CATEGORIES */}

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:px-12 lg:px-16">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="mb-3 block text-[10px] font-bold tracking-[2px] text-[#79563E] dark:text-[#C49A73]">
              EXPLORE BY CATEGORY
            </span>

            <h2 className="text-2xl font-medium tracking-tight text-[#292723] dark:text-[#F3E6DA] sm:text-3xl">
              Find equipment for every job
            </h2>
          </div>

          <Link
            href="/equipment"
            className="flex shrink-0 items-center gap-2 text-xs font-medium text-[#766E65] transition hover:text-[#79563E] dark:text-[#C0A993] dark:hover:text-[#E6C7A9]"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-6 md:gap-7">
          {categories.map((cat, i) => {
            const Icon = cat.icon;

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={cat.href}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="relative mb-4 aspect-square w-full max-w-[150px] overflow-hidden rounded-full bg-[#F0EAE4] dark:bg-[#382D25]">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/10">
                      <Icon className="h-6 w-6 text-white opacity-0 drop-shadow group-hover:opacity-100" />
                    </div>
                  </div>

                  <h3 className="text-xs font-semibold text-[#302A24] dark:text-[#F3E6DA]">
                    {cat.name}
                  </h3>

                  <p className="mt-1 text-[10px] text-[#82776D] dark:text-[#C0A993]">
                    Browse rentals
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* PROMOTIONAL COLLECTIONS */}

      <section className="mx-auto grid max-w-[1400px] gap-5 px-5 pb-12 sm:px-8 md:grid-cols-2 md:px-12 lg:px-16">
        {[
          {
            image: promoImages[0],
            eyebrow: "FOR YOUR NEXT PROJECT",
            title: <>Build more.<br />Buy less.</>,
            description:
              "Discover reliable construction tools and machinery.",
            button: "Explore construction",
            href: "/equipment?category=Construction",
          },
          {
            image: promoImages[1],
            eyebrow: "VEHICLES & TRANSPORT",
            title: <>Move things.<br />Move forward.</>,
            description:
              "Find vehicles and transport equipment for your needs.",
            button: "Explore vehicles",
            href: "/equipment?category=Vehicles%20%26%20Transportation",
          },
        ].map((item) => (
          <div
            key={item.eyebrow}
            className="group relative flex min-h-[280px] items-center overflow-hidden rounded-xl bg-cover bg-center"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-black/10" />

            <div className="relative max-w-sm p-8 sm:p-10">
              <span className="text-[10px] font-bold tracking-[2px] text-[#E6C7A9]">
                {item.eyebrow}
              </span>

              <h2 className="mt-4 text-3xl font-medium leading-tight text-white">
                {item.title}
              </h2>

              <p className="mt-3 text-xs leading-6 text-white/80">
                {item.description}
              </p>

              <Link
                href={item.href}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-[#FFFCFA] px-5 text-xs font-medium text-[#79563E] transition hover:bg-[#F0EAE4]"
              >
                {item.button}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* FEATURED EQUIPMENT */}

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:px-12 lg:px-16">
        <div className="mb-9 flex items-end justify-between gap-4">
          <div>
            <span className="mb-3 block text-[10px] font-bold tracking-[2px] text-[#79563E] dark:text-[#C49A73]">
              POPULAR RENTALS
            </span>

            <h2 className="text-2xl font-medium tracking-tight text-[#292723] dark:text-[#F3E6DA] sm:text-3xl">
              Equipment worth discovering
            </h2>

            <p className="mt-2 text-xs text-[#82776D] dark:text-[#C0A993]">
              Find quality equipment for your next project.
            </p>
          </div>

          <Link
            href="/equipment"
            className="flex shrink-0 items-center gap-2 text-xs font-medium text-[#302A24] transition hover:text-[#79563E] dark:text-[#E5D4C5] dark:hover:text-[#E6C7A9]"
          >
            View marketplace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {error && <Notice kind="error">{error}</Notice>}

        {demoMode && (
          <Notice kind="info">
            Showing sample listings while the server is offline.
          </Notice>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <CardSkeleton count={4} />
          ) : (
            featured.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))
          )}
        </div>
      </section>

      {/* BRAND STORY */}

      <section className="grid border-y border-[#E8DFD6] bg-[#F7F1EB] dark:border-[#514033] dark:bg-[#29221D] md:grid-cols-[1.15fr_1fr_0.8fr]">
        <div className="min-h-[300px] overflow-hidden md:min-h-[390px]">
          <img
            src={storyImage}
            alt="Equipment and machinery at work"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center px-7 py-12 sm:px-12">
          <span className="mb-4 text-[10px] font-bold tracking-[2px] text-[#79563E] dark:text-[#C49A73]">
            A BETTER WAY TO GET THINGS DONE
          </span>

          <h2 className="text-3xl font-medium leading-tight tracking-tight text-[#292723] dark:text-[#F3E6DA]">
            Smart rentals.
            <br />
            Real possibilities.
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#766E65] dark:text-[#C0A993]">
            We believe useful equipment should be accessible when you
            need it. Equiply connects people who have equipment with
            people who need it, making projects easier and resources
            more useful.
          </p>

          <Link
            href="/equipment"
            className="mt-7 inline-flex h-11 w-fit items-center justify-center rounded-md bg-[#79563E] px-6 text-xs font-medium text-white transition hover:bg-[#5D402E] dark:bg-[#A77A55] dark:hover:bg-[#916747]"
          >
            Discover Equiply
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col justify-center gap-6 bg-[#79563E] px-8 py-12 text-white dark:bg-[#514033] sm:px-10">
          <h3 className="text-2xl font-medium">
            Better projects.
            <br />
            Better choices.
          </h3>

          {[
            { icon: Leaf, text: "More efficient equipment use" },
            { icon: PackageCheck, text: "Equipment for every project" },
            { icon: ShieldCheck, text: "Convenient rental experience" },
            { icon: Heart, text: "A community of owners and renters" },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.text}
                className="flex items-center gap-3 text-xs opacity-90"
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.text}
              </div>
            );
          })}
        </div>
      </section>

      {/* BENEFIT CARDS */}

      <section className="mx-auto grid max-w-[1400px] grid-cols-2 gap-5 px-5 py-12 sm:px-8 md:grid-cols-4 md:px-12 lg:px-16">
        {[
          {
            icon: Leaf,
            title: "Resource conscious",
            desc: "Make better use of equipment through renting.",
          },
          {
            icon: ShieldCheck,
            title: "Quality equipment",
            desc: "Discover equipment for your work and projects.",
          },
          {
            icon: PackageCheck,
            title: "Simple process",
            desc: "Find, request and manage your rentals.",
          },
          {
            icon: Heart,
            title: "Community driven",
            desc: "Connect renters with equipment owners.",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border border-[#E8DFD6] bg-white px-3 py-6 text-center dark:border-[#514033] dark:bg-[#29221D]"
            >
              <Icon className="mx-auto h-7 w-7 text-[#79563E] dark:text-[#C49A73]" />

              <h3 className="mt-4 text-sm font-semibold text-[#302A24] dark:text-[#F3E6DA]">
                {item.title}
              </h3>

              <p className="mt-2 text-xs leading-6 text-[#82776D] dark:text-[#C0A993]">
                {item.desc}
              </p>
            </div>
          );
        })}
      </section>

      {/* INSPIRATION SECTION */}

      <section className="grid border-y border-[#E8DFD6] bg-[#F7F1EB] dark:border-[#514033] dark:bg-[#29221D] md:grid-cols-[1.1fr_1fr_0.7fr]">
        <div className="min-h-[280px] overflow-hidden">
          <img
            src={inspirationImage}
            alt="Workshop and equipment"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center px-7 py-12 sm:px-12">
          <span className="mb-4 text-[10px] font-bold tracking-[2px] text-[#79563E] dark:text-[#C49A73]">
            MAKE YOUR NEXT PROJECT HAPPEN
          </span>

          <h2 className="text-3xl font-medium leading-tight text-[#292723] dark:text-[#F3E6DA]">
            Everything you need.
            <br />
            Nothing you don't.
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#766E65] dark:text-[#C0A993]">
            Explore equipment, discover new possibilities and find
            practical solutions for the work ahead.
          </p>

          <Link
            href="/equipment"
            className="mt-7 inline-flex h-11 w-fit items-center justify-center rounded-md bg-[#79563E] px-6 text-xs font-medium text-white transition hover:bg-[#5D402E] dark:bg-[#A77A55] dark:hover:bg-[#916747]"
          >
            Find your equipment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="relative min-h-[250px] overflow-hidden">
          <img
            src={inspirationSideImage}
            alt="Equipment inspiration"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-8 left-7 text-white">
            <h3 className="text-2xl font-medium">
              Make it happen.
            </h3>

            <p className="mt-2 text-xs text-white/80">
              Find what your project needs.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:px-12 lg:px-16">
        <div className="mb-10">
          <span className="mb-3 block text-[10px] font-bold tracking-[2px] text-[#79563E] dark:text-[#C49A73]">
            WHAT OUR COMMUNITY SAYS
          </span>

          <h2 className="text-2xl font-medium text-[#292723] dark:text-[#F3E6DA] sm:text-3xl">
            Trusted by renters and owners
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="rounded-xl border border-[#E8DFD6] bg-white p-7 text-[#292723] dark:border-[#514033] dark:bg-[#29221D] dark:text-[#F3E6DA]"
            >
              <div className="flex gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-current"
                  />
                ))}
              </div>

              <p className="my-6 text-sm leading-7 text-[#766E65] dark:text-[#C0A993]">
                &ldquo;{item.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0EAE4] text-sm font-semibold text-[#79563E] dark:bg-[#514033] dark:text-[#E6C7A9]">
                  {item.name.charAt(0)}
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-[#302A24] dark:text-[#F3E6DA]">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-[10px] text-[#82776D] dark:text-[#C0A993]">
                    {item.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* COMMUNITY CTA */}

      <section className="grid overflow-hidden border-t border-[#E8DFD6] bg-[#F7F1EB] dark:border-[#514033] dark:bg-[#29221D] md:grid-cols-[1fr_0.65fr]">
        <div className="flex flex-col justify-center px-7 py-14 sm:px-12 lg:px-20">
          <span className="mb-4 text-[10px] font-bold tracking-[2px] text-[#79563E] dark:text-[#C49A73]">
            JOIN THE EQUIPLY COMMUNITY
          </span>

          <h2 className="max-w-lg text-3xl font-medium leading-tight text-[#292723] dark:text-[#F3E6DA] sm:text-4xl">
            Projects start with the right equipment.
          </h2>

          <p className="mt-5 max-w-md text-sm leading-7 text-[#766E65] dark:text-[#C0A993]">
            Discover equipment, connect with owners and make your
            next project easier.
          </p>

          <Link
            href="/equipment"
            className="mt-7 inline-flex h-12 w-fit items-center justify-center rounded-md bg-[#79563E] px-7 text-xs font-semibold text-white transition hover:bg-[#5D402E] dark:bg-[#A77A55] dark:hover:bg-[#916747]"
          >
            Explore the marketplace
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="min-h-[250px] overflow-hidden">
          <img
            src={communityImage}
            alt="Industrial equipment ready for a project"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* EXISTING SHARED FOOTER REMAINS IN LAYOUT */}

    </main>
  );
}
