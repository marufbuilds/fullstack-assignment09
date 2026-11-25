 
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  X,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

export default function PaymentCancelPage() {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#FFFCFA] px-4 py-12 text-[#292723] sm:px-6 sm:py-20">

      {/* Payment cancelled toast */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-5 z-[100] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-[0_12px_40px_rgba(60,40,20,0.12)] animate-in slide-in-from-top-3 fade-in duration-300"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F3EE] text-[#79563E]">
            <AlertCircle size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#292723]">
              Payment cancelled
            </p>
            <p className="mt-1 text-xs leading-5 text-[#82776D]">
              Your payment wasn't completed. You can try again from your rentals.
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

      <div className="mx-auto w-full max-w-3xl">

        {/* Brand */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-[#79563E]"
          >
            equiply<span className="text-[#9A7656]">.</span>
          </Link>
        </div>

        {/* Main card */}
        <section className="overflow-hidden rounded-3xl border border-[#E8DFD6] bg-white shadow-[0_10px_40px_rgba(60,40,20,0.05)]">

          {/* Header */}
          <div className="relative overflow-hidden bg-[#79563E] px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full border border-white/10" />

            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F3EE] text-[#79563E]">
                <X size={34} strokeWidth={2} />
              </div>
            </div>

            <p className="relative mt-8 text-[10px] font-bold uppercase tracking-[2.5px] text-[#E8D9CA]">
              Checkout cancelled
            </p>

            <h1 className="relative mx-auto mt-4 max-w-lg text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              No worries. Your rental is still waiting.
            </h1>

            <p className="relative mx-auto mt-4 max-w-md text-sm leading-7 text-[#F0E7DE] sm:text-base">
              You left checkout before completing your payment. No payment
              confirmation has been received.
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-9 sm:px-12 sm:py-12">
            <div className="mx-auto max-w-lg">

              {/* Booking information */}
              <div className="flex items-start gap-4 rounded-2xl border border-[#E8DFD6] bg-[#F8F3EE] p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#79563E]">
                  <CalendarDays size={22} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[#292723]">
                    Your booking may still be pending
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#82776D]">
                    Visit your rentals page to check its current status. If
                    the booking is still active and awaiting payment, you can
                    try checkout again.
                  </p>
                </div>
              </div>

              {/* Security information */}
              <div className="mt-7 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F3EE] text-[#79563E]">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#393128]">
                    Secure payment with Stripe
                  </p>
                  <p className="mt-1 text-xs text-[#A0968D]">
                    You can safely return to checkout when ready.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/my-rentals"
                  className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#79563E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#62432F]"
                >
                  <RotateCcw
                    size={17}
                    className="transition-transform group-hover:-rotate-45"
                  />
                  Return to my rentals
                </Link>

                <Link
                  href="/equipment"
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#E8DFD6] bg-white px-6 py-4 text-sm font-semibold text-[#79563E] transition hover:bg-[#F8F3EE]"
                >
                  Browse equipment
                  <ArrowRight size={17} />
                </Link>
              </div>

              {/* Support */}
              <p className="mt-7 text-center text-xs leading-6 text-[#A0968D]">
                Need help? Contact our support team if you believe a payment
                was taken.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#A0968D]">
          © {new Date().getFullYear()} Equiply. Rent smarter, work better.
        </p>
      </div>
    </main>
  );
}
