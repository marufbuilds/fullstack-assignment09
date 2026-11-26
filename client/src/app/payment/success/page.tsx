"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Clock3,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";

import { useToast } from "@/lib/toast";

export default function PaymentSuccessPage() {
  const { showToast } = useToast();

  useEffect(() => {
    showToast("Thank you! Your payment confirmation is being processed.", "success");
  }, [showToast]);

  return (
    <main className="relative min-h-[75vh] bg-background px-4 py-12 text-foreground sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        {/* Page Introduction */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-primary">
            Equiply · Payment update
          </p>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
            Thank you for your order.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            Your checkout is complete. We're confirming your payment before updating your
            rental details.
          </p>
        </div>

        {/* Confirmation Card */}
        <section className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border border-border bg-card shadow-[0_8px_35px_rgba(60,40,20,0.04)]">
          <div className="h-1 w-full bg-primary" />

          <div className="px-6 py-9 sm:px-12 sm:py-12">
            {/* Success Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border bg-secondary text-primary">
              <CheckCircle2 size={38} strokeWidth={1.5} />
            </div>

            {/* Confirmation Message */}
            <div className="mt-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-primary">
                Checkout completed
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Your payment is being confirmed
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                Stripe has returned you to Equiply. Our server will update your rental
                once it receives payment confirmation.
              </p>
            </div>

            {/* Confirmation Information */}
            <div className="mt-9 border-y border-border py-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Clock3 size={20} strokeWidth={1.6} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">Confirmation in progress</h3>

                  <p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">
                    This may take a few moments. Visit your rentals page to check the
                    latest payment and booking status.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Features */}
            <div className="grid gap-6 py-7 sm:grid-cols-2 sm:gap-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <ShieldCheck size={19} strokeWidth={1.6} />
                </div>

                <div>
                  <p className="text-xs font-semibold">Secure payment</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Protected by Stripe
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <PackageCheck size={19} strokeWidth={1.6} />
                </div>

                <div>
                  <p className="text-xs font-semibold">Rental updates</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Track your booking online
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col gap-3 border-t border-border pt-7 sm:flex-row">
              <Link
                href="/my-rentals"
                className="group inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-primary-foreground transition hover:bg-primary-hover"
              >
                View my rentals
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/equipment"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-border px-6 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-primary transition hover:bg-secondary"
              >
                Explore equipment
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Message */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-border" />

          <p className="text-[10px] font-medium uppercase tracking-[2px] text-muted-foreground">
            Rent smarter. Work better.
          </p>

          <span className="h-px w-8 bg-border" />
        </div>
      </div>
    </main>
  );
}
