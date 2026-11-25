 
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Clock3,
  ShieldCheck,
  PackageCheck,
  X,
} from "lucide-react";

export default function PaymentSuccessPage() {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <main className="relative min-h-[75vh] bg-[#FFFCFA] px-4 py-12 text-[#292723] sm:px-6 sm:py-20">

      {/* Success Toast */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-5 z-[100] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-[0_12px_40px_rgba(60,40,20,0.12)] animate-in slide-in-from-top-3 fade-in duration-300"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F3EE] text-[#79563E]">
            <CheckCircle2 size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#292723]">
              Checkout completed!
            </p>
            <p className="mt-1 text-xs leading-5 text-[#82776D]">
              Thank you! Your payment confirmation is being processed.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowToast(false)}
            aria-label="Close notification"
            className="rounded-lg p-1 text-[#A0968D] transition hover:bg-[#F8F3EE] hover:text-[#79563E]"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-5xl">

        {/* Page Introduction */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#9A7656]">
            Equiply · Payment update
          </p>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
            Thank you for your order.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#82776D] sm:text-base">
            Your checkout is complete. We're confirming your payment before
            updating your rental details.
          </p>
        </div>

        {/* Confirmation Card */}
        <section className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border border-[#E8DFD6] bg-white shadow-[0_8px_35px_rgba(60,40,20,0.04)]">
          <div className="h-1 w-full bg-[#79563E]" />

          <div className="px-6 py-9 sm:px-12 sm:py-12">

            {/* Success Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#E8DFD6] bg-[#F8F3EE] text-[#79563E]">
              <CheckCircle2 size={38} strokeWidth={1.5} />
            </div>

            {/* Confirmation Message */}
            <div className="mt-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#9A7656]">
                Checkout completed
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Your payment is being confirmed
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#82776D]">
                Stripe has returned you to Equiply. Our server will update
                your rental once it receives payment confirmation.
              </p>
            </div>

            {/* Confirmation Information */}
            <div className="mt-9 border-y border-[#F0EAE4] py-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8F3EE] text-[#79563E]">
                  <Clock3 size={20} strokeWidth={1.6} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">
                    Confirmation in progress
                  </h3>

                  <p className="mt-1 text-xs leading-6 text-[#82776D] sm:text-sm">
                    This may take a few moments. Visit your rentals page
                    to check the latest payment and booking status.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Features */}
            <div className="grid gap-6 py-7 sm:grid-cols-2 sm:gap-10">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F3EE] text-[#79563E]">
                  <ShieldCheck size={19} strokeWidth={1.6} />
                </div>

                <div>
                  <p className="text-xs font-semibold">
                    Secure payment
                  </p>
                  <p className="mt-1 text-[11px] text-[#A0968D]">
                    Protected by Stripe
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F3EE] text-[#79563E]">
                  <PackageCheck size={19} strokeWidth={1.6} />
                </div>

                <div>
                  <p className="text-xs font-semibold">
                    Rental updates
                  </p>
                  <p className="mt-1 text-[11px] text-[#A0968D]">
                    Track your booking online
                  </p>
                </div>
              </div>

            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col gap-3 border-t border-[#F0EAE4] pt-7 sm:flex-row">

              <Link
                href="/my-rentals"
                className="group inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-xl bg-[#79563E] px-6 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#62432F]"
              >
                View my rentals

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/equipment"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-[#E8DFD6] px-6 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#79563E] transition hover:bg-[#F8F3EE]"
              >
                Explore equipment
              </Link>

            </div>
          </div>
        </section>

        {/* Footer Message */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#E8DFD6]" />

          <p className="text-[10px] font-medium uppercase tracking-[2px] text-[#A0968D]">
            Rent smarter. Work better.
          </p>

          <span className="h-px w-8 bg-[#E8DFD6]" />
        </div>

      </div>
    </main>
  );
}
