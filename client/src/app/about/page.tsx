 
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Built Around Your Needs",
    description:
      "We make it easier to find the right equipment for your projects, hobbies, and everyday needs.",
  },
  {
    icon: Users,
    title: "A Community You Can Trust",
    description:
      "Equiply brings equipment owners and renters together through a simple and reliable platform.",
  },
  {
    icon: Sparkles,
    title: "Simple and Convenient",
    description:
      "Discover equipment, compare options, and send rental requests without unnecessary complications.",
  },
  {
    icon: ShieldCheck,
    title: "Safety Comes First",
    description:
      "We encourage clear listings, responsible communication, and a better rental experience.",
  },
];

const facts = [
  { number: "6+", label: "Equipment categories" },
  { number: "Easy", label: "Rental process" },
  { number: "24/7", label: "Browse anytime" },
  { number: "One", label: "Connected community" },
];

const storyPoints = [
  "Discover equipment for different needs.",
  "Connect with equipment owners.",
  "Make rental requests with ease.",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FFFCFA] text-[#292723] dark:bg-[#211914] dark:text-[#F8EDE2]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#E8DFD6] dark:border-[#5B4637]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E8DFD6] bg-[#F7F1EB] px-4 py-2 text-sm font-medium text-[#79563E] dark:border-[#66503F] dark:bg-[#30251E] dark:text-[#D2A77E]">
              <Sparkles size={15} />
              About Equiply
            </span>

            <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              The smarter way to{" "}
              <span className="text-[#79563E] dark:text-[#D2A77E]">
                rent equipment.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#766E65] dark:text-[#E0C8B2] sm:text-lg">
              Equiply connects people who need equipment with people who have
              it. Our goal is to make equipment rental simple, accessible, and
              convenient for everyone.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/equipment"
                className="inline-flex items-center gap-2 rounded-full bg-[#79563E] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5D402E] dark:bg-[#A77A55] dark:hover:bg-[#BD9068]"
              >
                Explore Equipment
                <ArrowUpRight size={17} />
              </Link>

              <Link
                href="/add-equipment"
                className="inline-flex items-center gap-2 rounded-full border border-[#E8DFD6] bg-white px-7 py-3.5 text-sm font-semibold text-[#79563E] transition hover:bg-[#F7F1EB] dark:border-[#66503F] dark:bg-[#30251E] dark:text-[#F0D4B8] dark:hover:bg-[#453326]"
              >
                List Your Equipment
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-[#94765B]/10 blur-2xl dark:bg-[#A77A55]/10" />

            <div className="relative rounded-[2rem] border border-[#E8DFD6] bg-white p-6 shadow-sm sm:p-9 dark:border-[#66503F] dark:bg-[#30251E]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#79563E] text-white dark:bg-[#A77A55]">
                <Heart size={27} />
              </div>

              <h2 className="mt-7 text-2xl font-bold">
                Equipment sharing made easier.
              </h2>

              <p className="mt-4 leading-7 text-[#766E65] dark:text-[#E0C8B2]">
                Why buy equipment you only need occasionally? Find what you
                need, connect with owners, and make better use of available
                resources.
              </p>

              <div className="mt-8 space-y-4">
                {storyPoints.map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <CheckCircle2
                      size={19}
                      className="shrink-0 text-[#79563E] dark:text-[#D2A77E]"
                    />
                    <span className="text-sm font-medium">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="border-b border-[#E8DFD6] bg-[#F7F1EB] dark:border-[#5B4637] dark:bg-[#30251E]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-12 sm:px-8 md:grid-cols-4 lg:px-12">
          {facts.map((fact) => (
            <div key={fact.label} className="text-center">
              <p className="text-3xl font-bold text-[#79563E] dark:text-[#D2A77E] sm:text-4xl">
                {fact.number}
              </p>
              <p className="mt-2 text-sm text-[#766E65] dark:text-[#E0C8B2]">
                {fact.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our story */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-24">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#79563E] dark:text-[#D2A77E]">
            Our Story
          </span>

          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            Making equipment accessible to everyone.
          </h2>

          <p className="mt-6 leading-8 text-[#766E65] dark:text-[#E0C8B2]">
            Not everyone needs to own every piece of equipment. Sometimes, you
            only need something for a short project or a particular occasion.
            Buying it can be expensive and inconvenient.
          </p>

          <p className="mt-4 leading-8 text-[#766E65] dark:text-[#E0C8B2]">
            That is why Equiply brings equipment owners and renters together.
            We want to create a convenient place where people can discover
            equipment, connect with others, and make renting easier.
          </p>
        </div>

        <div className="rounded-[2rem] border border-[#E8DFD6] bg-white p-7 sm:p-10 dark:border-[#66503F] dark:bg-[#30251E]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#79563E] text-white dark:bg-[#A77A55]">
            <Users size={23} />
          </div>

          <h3 className="mt-6 text-2xl font-bold">
            More than just renting
          </h3>

          <p className="mt-4 leading-7 text-[#766E65] dark:text-[#E0C8B2]">
            We believe sharing resources can create opportunities, reduce
            unnecessary purchases, and help communities make better use of
            what they already have.
          </p>

          <div className="mt-7 rounded-xl bg-[#F7F1EB] p-5 dark:bg-[#453326]">
            <p className="font-semibold text-[#292723] dark:text-[#F8EDE2]">
              Find what you need. Share what you have.
            </p>
            <p className="mt-2 text-sm text-[#766E65] dark:text-[#E0C8B2]">
              That is the idea behind Equiply.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-[#E8DFD6] bg-[#F7F1EB] dark:border-[#5B4637] dark:bg-[#30251E]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#79563E] dark:text-[#D2A77E]">
              What Matters to Us
            </span>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              The values behind Equiply
            </h2>

            <p className="mt-5 leading-7 text-[#766E65] dark:text-[#E0C8B2]">
              Everything we build is guided by a few simple principles.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-2xl border border-[#E8DFD6] bg-[#FFFCFA] p-6 transition hover:-translate-y-1 hover:shadow-md dark:border-[#66503F] dark:bg-[#211914]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EAE4] text-[#79563E] dark:bg-[#453326] dark:text-[#D2A77E]">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">{value.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-[#766E65] dark:text-[#E0C8B2]">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] bg-[#79563E] px-7 py-14 text-center text-white sm:px-12 sm:py-16 dark:bg-[#A77A55]">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to get started?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/90">
            Discover equipment that fits your needs or share your own
            equipment with the Equiply community.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/equipment"
              className="inline-flex items-center gap-2 rounded-full bg-[#FFFCFA] px-7 py-3.5 text-sm font-semibold text-[#79563E] transition hover:bg-[#F7F1EB] dark:bg-[#211914] dark:text-[#F8EDE2] dark:hover:bg-[#30251E]"
            >
              Browse Equipment
              <ArrowUpRight size={17} />
            </Link>

            <Link
              href="/add-equipment"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              List Equipment
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
