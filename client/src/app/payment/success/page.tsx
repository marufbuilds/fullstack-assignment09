import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Payment successful",
};

export default function PaymentSuccessPage() {
  return (
    <div className="wrap section" style={{ maxWidth: 640 }}>
      <div className="card empty">
        <span className="empty-icon">
          <CheckCircle2 size={30} />
        </span>
        <div className="eyebrow">Payment received</div>
        <h1 className="h2">Your booking is paid</h1>
        <p className="muted" style={{ maxWidth: 460, margin: 0 }}>
          Thanks! Your payment was recorded and the owner has been notified to confirm the
          rental. You can follow the status from your rentals page.
        </p>
        <div
          style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link className="btn" href="/my-rentals">
            View my rentals <ArrowRight size={17} />
          </Link>
          <Link className="btn btn-outline" href="/equipment">
            Keep browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
