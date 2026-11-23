 
import Link from "next/link";
import {
  X,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

export const metadata = {
  title: "Payment Cancelled | Equiply",
  description: "Your rental payment was not completed. You can try again anytime.",
};

export default function PaymentCancelPage() {
  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#f6f7f2] px-4 py-16 sm:px-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#e9e5d5]/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#dcebdc]/60 blur-3xl" />

      <div className="relative mx-auto w-full max-w-3xl">
        {/* Brand */}
        <div className="mb-8 flex justify-center">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-[#183d2b]"
          >
            equiply<span className="text-[#83a879]">.</span>
          </Link>
        </div>

        {/* Main card */}
        <section className="overflow-hidden rounded-[2rem] border border-[#e5e9df] bg-white shadow-[0_24px_80px_rgba(32,60,39,0.08)]">
          {/* Header */}
          <div className="relative overflow-hidden bg-[#204d35] px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full border border-white/10" />

            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-xl backdrop-blur-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0dc] text-[#a56a2c] shadow-lg">
                <X size={34} strokeWidth={2.5} />
              </div>
            </div>

            <p className="relative mt-8 text-xs font-bold uppercase tracking-[0.25em] text-[#c4d9c4]">
              Checkout cancelled
            </p>

            <h1 className="relative mx-auto mt-4 max-w-lg text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              No worries. Your rental is still waiting.
            </h1>

            <p className="relative mx-auto mt-4 max-w-md text-sm leading-7 text-[#d9e6da] sm:text-base">
              You left checkout before completing your payment. No payment
              confirmation has been received.
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-9 sm:px-12 sm:py-12">
            <div className="mx-auto max-w-lg">
              <div className="flex items-start gap-4 rounded-2xl border border-[#eee5d7] bg-[#fcf9f3] p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f5ead9] text-[#986a35]">
                  <CalendarDays size={22} />
                </div>

                <div>
                  <h2 className="font-semibold text-[#493b2b]">
                    Your booking may still be pending
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#847665]">
                    Visit your rentals page to check its current status. If
                    the booking is still active and awaiting payment, you can
                    try checkout again.
                  </p>
                </div>
              </div>

              <div className="mt-7 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf3e9] text-[#3d7048]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#294431]">
                    Secure payment with Stripe
                  </p>
                  <p className="text-xs text-[#849083]">
                    You can safely return to checkout when ready.
                  </p>
                </div>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/my-rentals"
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#245c3b] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-[#245c3b]/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#19482d]"
                >
                  <RotateCcw
                    size={17}
                    className="transition-transform group-hover:-rotate-45"
                  />
                  Return to my rentals
                </Link>

                <Link
                  href="/equipment"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#dce4d9] bg-white px-6 py-4 text-sm font-semibold text-[#294b35] transition hover:border-[#a9bea8] hover:bg-[#f5f8f2]"
                >
                  Browse equipment
                  <ArrowRight size={17} />
                </Link>
              </div>

              <p className="mt-7 text-center text-xs leading-5 text-[#98a092]">
                Need help? Contact our support team if you believe a payment
                was taken.
              </p>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-[#9aa394]">
          © {new Date().getFullYear()} Equiply. Rent smarter, work better.
        </p>
      </div>
    </main>
  );
}
