import Link from "next/link";
import { XCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Payment cancelled",
};

export default function PaymentCancelPage() {
  return (
    <div className="wrap section" style={{ maxWidth: 640 }}>
      <div className="card empty">
        <span className="empty-icon" style={{ background: "#fff6e6", color: "#9a6700" }}>
          <XCircle size={30} />
        </span>
        <div className="eyebrow">Checkout cancelled</div>
        <h1 className="h2">No payment was taken</h1>
        <p className="muted" style={{ maxWidth: 460, margin: 0 }}>
          Your booking is still waiting for payment. Open your rentals page and choose{" "}
          <b>Pay now</b> whenever you are ready to confirm the dates.
        </p>
        <div
          style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link className="btn" href="/my-rentals">
            Back to my rentals <ArrowRight size={17} />
          </Link>
          <Link className="btn btn-outline" href="/equipment">
            Browse equipment
          </Link>
        </div>
      </div>
    </div>
  );
}
