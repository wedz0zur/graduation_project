"use client";

import { useFavoritesStore } from "@/src/stores/favorites";
import { useState, useEffect } from "react";
import { ProductCard } from "@/src/shared/ui/product-card";
import { SectionTitle } from "@/src/shared/ui/section-title";
import { fetchProducts } from "@/src/shared/lib/data";
import Link from "next/link";

export default function FavoritesPage() {
  const ids = useFavoritesStore((s) => s.ids);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (ids.length === 0) return;
    fetchProducts().then((all) => {
      setProducts(all.filter((p: any) => ids.includes(p.id)));
    });
  }, [ids]);

  return (
    <div className="container py-12">
      <SectionTitle title="Избранное" subtitle="Товары, которые вам понравились" />

      {ids.length === 0 ? (
        <div className="text-center py-20 flex items-center flex-col gap-3">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E5E5E5"
            strokeWidth="1"
            className="mx-auto mb-6"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <p className="text-xl text-[#666666] mb-4">В избранном пока пусто</p>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#E30613] text-white font-semibold hover:bg-[#C50510] transition-colors rounded"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
