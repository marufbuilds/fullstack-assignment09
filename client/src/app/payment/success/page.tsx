 
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Clock3,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";

export const metadata = {
  title: "Payment Confirmation | Equiply",
  description: "Your Equiply rental checkout confirmation.",
};

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-[75vh] bg-[#f5f1eb] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        {/* Page introduction */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#98795e]">
            Equiply · Payment update
          </p>

          <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-[#29251f] sm:text-5xl">
            Thank you for your order.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#82786c] sm:text-base">
            Your checkout is complete. We're just confirming your payment
            before updating your rental details.
          </p>
        </div>

        {/* Confirmation card */}
        <section className="mx-auto mt-12 max-w-3xl overflow-hidden border border-[#e8e0d6] bg-[#fffdfa] shadow-[0_12px_45px_rgba(73,57,39,0.06)]">
          {/* Top accent */}
          <div className="h-1 w-full bg-[#8a6b50]" />

          <div className="px-6 py-10 sm:px-12 sm:py-14">
            {/* Status icon */}
            <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full border border-[#e8dfd3] bg-[#f4eee6] text-[#806247]">
              <CheckCircle2 size={36} strokeWidth={1.5} />
            </div>

            <div className="mt-6 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9b8065]">
                Checkout completed
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#302a23] sm:text-3xl">
                Your payment is being confirmed
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#82786c]">
                Stripe has returned you to Equiply. Our server will update
                your rental once it receives payment confirmation.
              </p>
            </div>

            {/* Status information */}
            <div className="mt-9 border-y border-[#eae3da] py-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#f2ece4] text-[#856b52]">
                  <Clock3 size={20} strokeWidth={1.6} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#393128]">
                    Confirmation in progress
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-[#8b8175] sm:text-sm">
                    This may take a few moments. Visit your rentals page
                    to check the latest payment and booking status.
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid gap-6 py-7 sm:grid-cols-2 sm:gap-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4eee6] text-[#806247]">
                  <ShieldCheck size={19} strokeWidth={1.6} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#393128]">
                    Secure payment
                  </p>
                  <p className="mt-1 text-[11px] text-[#968b7e]">
                    Protected by Stripe
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4eee6] text-[#806247]">
                  <PackageCheck size={19} strokeWidth={1.6} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#393128]">
                    Rental updates
                  </p>
                  <p className="mt-1 text-[11px] text-[#968b7e]">
                    Track your booking online
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 border-t border-[#eae3da] pt-7 sm:flex-row">
              <Link
                href="/my-rentals"
                className="group inline-flex flex-1 items-center justify-center gap-3 bg-[#806247] px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#684e39]"
              >
                View my rentals
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/equipment"
                className="inline-flex flex-1 items-center justify-center border border-[#dcd2c6] bg-transparent px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#514537] transition-colors hover:bg-[#f5f0e9]"
              >
                Explore equipment
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-center">
          <span className="h-px w-8 bg-[#d8cbbb]" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#9b8d7c]">
            Rent smarter. Work better.
          </p>
          <span className="h-px w-8 bg-[#d8cbbb]" />
        </div>
      </div>
    </main>
  );
}
