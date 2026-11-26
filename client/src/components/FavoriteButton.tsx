"use client";

// Heart toggle used on listing cards and the equipment details page.

import { useState } from "react";
import { Heart } from "lucide-react";

import { useFavorites } from "@/lib/favorites";
import type { Equipment } from "@/lib/types";

export function FavoriteButton({
  item,
  className = "listing-fav",
  withLabel = false,
}: {
  item: Equipment;
  className?: string;
  withLabel?: boolean;
}) {
  const { has, toggle } = useFavorites();
  const [message, setMessage] = useState("");
  const saved = has(item._id);

  async function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const result = await toggle(item);
    setMessage(result.message);
    window.setTimeout(() => setMessage(""), 2200);
  }

  const button = (
    <button
      type="button"
      className={`${className}${saved ? " saved" : ""}`}
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove from favorites" : "Save to favorites"}
      title={saved ? "Remove from favorites" : "Save to favorites"}
    >
      <Heart size={withLabel ? 17 : 18} fill={saved ? "currentColor" : "none"} />
      {withLabel && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );

  if (!withLabel) return button;

  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      {button}
      {message && (
        <span
          role="status"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: 0,
            whiteSpace: "nowrap",
            background: "var(--foreground)",
            color: "var(--background)",
            fontSize: 12.5,
            padding: "6px 10px",
            borderRadius: 8,
            zIndex: 5,
          }}
        >
          {message}
        </span>
      )}
    </span>
  );
}
