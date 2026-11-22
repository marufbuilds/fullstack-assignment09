import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="wrap section" style={{ maxWidth: 640 }}>
      <div className="card empty">
        <span className="empty-icon">
          <Compass size={30} />
        </span>
        <div className="eyebrow">404 · Page not found</div>
        <h1 className="h2">That page does not exist</h1>
        <p className="muted" style={{ maxWidth: 440, margin: 0 }}>
          The link may be outdated, or the listing you were looking for was removed from
          the marketplace.
        </p>
        <div
          style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link className="btn" href="/">
            <Home size={17} /> Back home
          </Link>
          <Link className="btn btn-outline" href="/equipment">
            <Compass size={17} /> Browse equipment
          </Link>
        </div>
      </div>
    </div>
  );
}
