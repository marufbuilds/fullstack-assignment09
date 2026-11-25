 
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  CircleHelp,
  Mail,
  MessageSquare,
  PackageSearch,
  ArrowRight,
  Headphones,
  Clock3,
  ShieldCheck,
} from "lucide-react";

const faqs: { question: string; answer: string }[] = [
  {
    question: "How do I rent equipment?",
    answer:
      "Browse the marketplace, open a listing, choose your start and end dates and send a booking request. The estimated total is shown before you confirm. Complete payment from My rentals to lock in your dates, and the owner approves the rental.",
  },
  {
    question: "Can I list my own equipment?",
    answer:
      "Yes. Accounts start with the customer role, and an administrator enables the owner role for you. Once you are an owner, use Add equipment to submit a listing — it appears on the marketplace after an admin approves it.",
  },
  {
    question: "When is my booking confirmed?",
    answer:
      "A booking is created as pending. Pay through Stripe checkout within the 30 minute hold window, then the owner confirms it. You can follow every step from the My rentals page.",
  },
  {
    question: "Can I cancel a rental?",
    answer:
      "Contact the owner or our support team to cancel. Confirmed bookings that have already been paid are handled case by case so owners are fairly compensated.",
  },
  {
    question: "How do payments work?",
    answer:
      "Payments are processed by Stripe in test mode for this assignment. Your card details never touch the Equiply servers, and each booking shows whether it is paid or unpaid.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Email support@equiply.example and we will get back to you within one business day. Include your booking reference when you have one.",
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-[#FFFCFA] text-[#292723]">
      <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-8 md:py-14">

        {/* Page heading */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-[#9A7656]">
            <CircleHelp size={15} />
            Help center
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How can we help?
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#82776D] sm:text-base">
            Find answers to common questions about using Equiply, booking
            equipment, payments and listing your own equipment.
          </p>
        </div>

        {/* FAQ section */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Frequently asked questions</h2>
              <p className="mt-1 text-xs text-[#82776D]">
                Everything you need to know to get started.
              </p>
            </div>

            <span className="hidden rounded-full bg-[#F5EEE8] px-3 py-1.5 text-xs font-semibold text-[#79563E] sm:inline-flex">
              {faqs.length} questions
            </span>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = open === index;

              return (
                <article
                  key={faq.question}
                  className={`overflow-hidden rounded-2xl border bg-white transition ${
                    isOpen
                      ? "border-[#D9C5B2] shadow-[0_5px_20px_rgba(60,40,20,0.045)]"
                      : "border-[#E8DFD6]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F3EE] text-xs font-semibold text-[#79563E]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="text-sm font-semibold text-[#292723] sm:text-base">
                        {faq.question}
                      </span>
                    </span>

                    <ChevronDown
                      size={19}
                      className={`shrink-0 text-[#9A7656] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#F0EAE4] px-5 pb-5 pt-4 sm:px-6 sm:pl-[76px]">
                      <p className="text-sm leading-7 text-[#82776D]">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Support information */}
        <section className="mt-12">
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#9A7656]">
              Need more help?
            </p>
            <h2 className="mt-2 text-xl font-semibold">
              We're here to help
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#E8DFD6] bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F3EE] text-[#79563E]">
                <Mail size={19} />
              </span>
              <h3 className="mt-4 text-sm font-semibold">Email support</h3>
              <a
                href="mailto:support@equiply.example"
                className="mt-2 block break-all text-xs text-[#79563E] hover:underline"
              >
                support@equiply.example
              </a>
            </div>

            <div className="rounded-2xl border border-[#E8DFD6] bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F3EE] text-[#79563E]">
                <Clock3 size={19} />
              </span>
              <h3 className="mt-4 text-sm font-semibold">Response time</h3>
              <p className="mt-2 text-xs leading-5 text-[#82776D]">
                Within one business day
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8DFD6] bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F3EE] text-[#79563E]">
                <MessageSquare size={19} />
              </span>
              <h3 className="mt-4 text-sm font-semibold">Booking help</h3>
              <p className="mt-2 text-xs leading-5 text-[#82776D]">
                Keep your booking reference handy
              </p>
            </div>
          </div>
        </section>

        {/* Getting started CTA */}
        <section className="relative mt-12 overflow-hidden rounded-2xl bg-[#6C665C] px-6 py-9 sm:px-9 sm:py-11">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-[#E5CDB3]">
                <ShieldCheck size={15} />
                Welcome to Equiply
              </div>

              <h2 className="text-2xl font-semibold text-white">
                Ready to get started?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
                Create an account to save favorites, request rentals and
                follow every booking from your dashboard.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-[#F5F0E9] px-6 text-sm font-semibold text-[#46372C] transition hover:bg-white"
            >
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Back to marketplace */}
        <div className="mt-8">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#79563E] transition hover:text-[#62432F]"
          >
            <PackageSearch size={17} />
            Back to marketplace
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}
