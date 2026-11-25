 
import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const values = [
  {
    title: "Flexible",
    text: "Rent for exactly the time your project needs — an hour, a weekend or a month.",
    icon: Sparkles,
    number: "01",
  },
  {
    title: "Community",
    text: "Discover equipment shared by owners and businesses in your own city.",
    icon: Users,
    number: "02",
  },
  {
    title: "Convenient",
    text: "Browse, book and pay for everything from one simple marketplace.",
    icon: Heart,
    number: "03",
  },
  {
    title: "Trusted",
    text: "Listings are reviewed and payments run through Stripe checkout.",
    icon: ShieldCheck,
    number: "04",
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
    <main className="min-h-screen bg-[#FFFCFA] text-[#292723]">

      {/* Hero */}
      <section className="px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
        <div className="mx-auto max-w-[1120px]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8DFD6] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#79563E]">
              <Sparkles size={14} />
              About Equiply
            </div>

            <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight text-[#292723] sm:text-5xl lg:text-6xl">
              Equipment access,
              <span className="block text-[#9A7656]">
                made easier.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[#82776D] sm:text-lg">
              Equiply connects people who need equipment with people who
              have it. Rent the right tools for your project without the
              expense of owning everything — and earn from the gear
              already sitting in your garage.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/equipment"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#79563E] px-6 text-sm font-semibold text-white transition hover:bg-[#62432F]"
              >
                Explore equipment
                <ArrowUpRight size={17} />
              </Link>

              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#E8DFD6] bg-white px-6 text-sm font-semibold text-[#79563E] transition hover:border-[#79563E] hover:bg-[#F8F3EE]"
              >
                Join our community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1120px] grid-cols-2 overflow-hidden rounded-2xl border border-[#E8DFD6] bg-white shadow-[0_4px_24px_rgba(60,40,20,0.035)] sm:grid-cols-4">
          {facts.map(([value, label], index) => (
            <div
              key={label}
              className={`px-5 py-8 sm:px-7 sm:py-9 ${
                index !== facts.length - 1
                  ? "border-r border-[#E8DFD6]"
                  : ""
              } ${index < 2 ? "border-b border-[#E8DFD6] sm:border-b-0" : ""}`}
            >
              <p className="text-3xl font-semibold tracking-tight text-[#79563E] sm:text-4xl">
                {value}
              </p>

              <p className="mt-2 text-xs leading-5 text-[#82776D] sm:text-sm">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our story */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9A7656]">
              Our story
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[#292723] sm:text-4xl">
              Built for people who get things done.
            </h2>

            <div className="mt-7 h-1 w-16 rounded-full bg-[#9A7656]" />
          </div>

          <div className="space-y-6">
            <p className="text-base leading-8 text-[#82776D]">
              Most projects only need a piece of equipment for a few
              days. Buying it is expensive, storing it is wasteful and
              borrowing is unreliable. Equiply fixes that with a
              marketplace where owners list their gear and renters
              request it in minutes.
            </p>

            <p className="text-base leading-8 text-[#82776D]">
              Every listing goes through a review before it goes live,
              booking requests carry clear dates and totals, and
              payments are handled by a secure checkout flow. Owners
              stay in control of their calendar and their rates.
            </p>

            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-[#E8DFD6] bg-white p-4">
                <CheckCircle2 className="shrink-0 text-[#79563E]" size={19} />
                <span className="text-sm font-medium text-[#62584F]">
                  Reviewed listings
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#E8DFD6] bg-white p-4">
                <CheckCircle2 className="shrink-0 text-[#79563E]" size={19} />
                <span className="text-sm font-medium text-[#62584F]">
                  Secure checkout
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#E8DFD6] bg-white p-4">
                <CheckCircle2 className="shrink-0 text-[#79563E]" size={19} />
                <span className="text-sm font-medium text-[#62584F]">
                  Flexible rental dates
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#E8DFD6] bg-white p-4">
                <CheckCircle2 className="shrink-0 text-[#79563E]" size={19} />
                <span className="text-sm font-medium text-[#62584F]">
                  Owner-managed rates
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-[#E8DFD6] bg-[#F8F3EE] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-[1120px]">

          <div className="mb-10 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9A7656]">
              What makes us different
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#292723] sm:text-4xl">
              A better way to rent and share.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#82776D] sm:text-base">
              We believe useful equipment should be easier to access,
              easier to share and more affordable for everyone.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ title, text, icon: Icon, number }) => (
              <article
                key={title}
                className="group rounded-2xl border border-[#E8DFD6] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#CDB9A7] hover:shadow-[0_12px_30px_rgba(60,40,20,0.06)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5EEE8] text-[#79563E] transition group-hover:bg-[#79563E] group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <span className="text-xs font-medium tracking-widest text-[#C5B5A6]">
                    {number}
                  </span>
                </div>

                <h3 className="mt-7 text-lg font-semibold text-[#292723]">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#82776D]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-[1120px]">
          <div className="relative overflow-hidden rounded-3xl bg-[#79563E] px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
            <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border border-white/10" />

            <div className="relative flex flex-col justify-between gap-9 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E5CDB8]">
                  Get started with Equiply
                </p>

                <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  Ready to start?
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
                  Create a free account to save favorites, request
                  rentals and list your own equipment.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#FFFCFA] px-6 text-sm font-semibold text-[#79563E] transition hover:bg-[#F1E7DE]"
                >
                  Join Equiply
                  <ArrowUpRight size={17} />
                </Link>

                <Link
                  href="/equipment"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/40 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Browse equipment
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
