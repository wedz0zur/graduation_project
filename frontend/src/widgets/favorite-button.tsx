"use client";
import { useFavoritesStore } from "@/src/stores/favorites";
import { Button } from "@/src/shared/ui/button";

export function FavoriteButton({ productId }: { productId: number }) {
  const ids = useFavoritesStore((s) => s.ids);
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFavorite = ids.includes(productId);

  return (
    <Button variant={isFavorite ? "primary" : "outline"} size="lg" onClick={() => toggle(productId)} className="min-w-[160px] flex gap-4">
      <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="mr-2">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      {isFavorite ? "В избранном" : "В избранное"}
    </Button>
  );
}
