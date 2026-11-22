// Marketplace listing card used on the home, equipment and favorites pages.

import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";

import { money, rentalUnit } from "@/lib/format";
import type { Equipment } from "@/lib/types";
import { FavoriteButton } from "./FavoriteButton";

export function EquipmentCard({ item }: { item: Equipment }) {
  return (
    <article className="listing">
      <div className="listing-media">
        <Link href={`/equipment/${item._id}`} tabIndex={-1} aria-hidden>
          <img src={item.image} alt={item.title} loading="lazy" />
        </Link>
        <span className="badge">{item.category}</span>
        <FavoriteButton item={item} />
      </div>

      <div className="listing-body">
        <div className="listing-meta">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <MapPin size={14} /> {item.location}
          </span>
          {item.quantity !== undefined && <span>· {item.quantity} available</span>}
        </div>

        <Link href={`/equipment/${item._id}`}>
          <h3>{item.title}</h3>
        </Link>

        <p className="muted" style={{ fontSize: 14, margin: 0 }}>
          {item.description.length > 96
            ? `${item.description.slice(0, 96)}…`
            : item.description}
        </p>

        <div className="listprice">
          <b>
            {money(item.price)}
            <small> / {rentalUnit(item.rentalType)}</small>
          </b>
          {item.rating ? (
            <span className="rating">
              ★ {item.rating} ({item.reviews || 0})
            </span>
          ) : (
            <span className="badge badge-brand">
              <ShieldCheck size={13} /> Verified
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
