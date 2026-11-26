"use client";

import Link from "next/link";
import { MapPin, ShieldCheck, ArrowUpRight, Trash2, Loader2 } from "lucide-react";

import { money, rentalUnit } from "@/lib/format";
import type { Equipment } from "@/lib/types";
import { FavoriteButton } from "./FavoriteButton";

type EquipmentCardProps = {
  item: Equipment;
  onDelete?: (id: string) => void;
  deleting?: boolean;
};

export function EquipmentCard({ item, onDelete, deleting = false }: EquipmentCardProps) {
  const description =
    item.description || "Explore this equipment and its rental details.";

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_12px_35px_rgba(55,40,28,0.09)]">
      {/* Equipment image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Link
          href={`/equipment/${item._id}`}
          tabIndex={-1}
          aria-hidden="true"
          className="block h-full w-full"
        >
          <img
            src={item.image || "/placeholder-equipment.jpg"}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Image overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" />

        {/* Category */}
        <span className="absolute left-3 top-3 bg-background/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[1px] text-primary shadow-sm">
          {item.category}
        </span>

        {/* Favorite heart */}
        <div className="absolute right-3 top-3">
          <FavoriteButton item={item} />
        </div>

        {/* Availability */}
        {item.quantity !== undefined && (
          <span className="absolute bottom-3 left-3 bg-background/95 px-3 py-1.5 text-[10px] font-medium text-foreground">
            {item.quantity > 0 ? `${item.quantity} available` : "Currently unavailable"}
          </span>
        )}
      </div>

      {/* Card content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Location */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate">{item.location}</span>
          </span>

          {item.rating ? (
            <span className="shrink-0 text-[11px] font-medium text-primary">
              <span className="text-[#c18b36]">★</span> {item.rating}
              <span className="ml-1 text-muted-foreground">({item.reviews || 0})</span>
            </span>
          ) : (
            <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-[#65806a]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/equipment/${item._id}`} className="group/title mb-2 block">
          <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-foreground transition-colors group-hover/title:text-primary">
            {item.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mb-5 line-clamp-2 min-h-[40px] text-xs leading-5 text-muted-foreground">
          {description.length > 100 ? `${description.slice(0, 100)}…` : description}
        </p>

        {/* Price and details link */}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
              Rental price
            </p>

            <p className="text-lg font-semibold tracking-tight text-primary">
              {money(item.price)}
              <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                / {rentalUnit(item.rentalType)}
              </span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Delete button: shown only on Favorites */}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(item._id)}
                disabled={deleting}
                aria-label={`Delete ${item.title} from favorites`}
                title="Delete from favorites"
                className="flex h-9 w-9 items-center justify-center border border-border text-primary transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            )}

            <Link
              href={`/equipment/${item._id}`}
              aria-label={`View ${item.title}`}
              className="flex h-9 w-9 items-center justify-center border border-border text-primary transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
