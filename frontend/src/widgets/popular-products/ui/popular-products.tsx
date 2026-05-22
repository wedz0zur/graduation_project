"use client";

import { useState, useEffect } from "react";
import { SectionTitle } from "@/src/shared/ui/section-title";
import { ProductCard } from "@/src/shared/ui/product-card";
import { fetchProducts } from "@/src/shared/lib/data";
import Link from "next/link";

export function PopularProducts() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then((all) => setItems(all.slice(0, 4)));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-20 bg-[#F5F5F5]">
      <div className="container">
        <SectionTitle
          title="Популярные товары"
          subtitle="Хиты продаж — лучшие коллекции по мнению наших клиентов"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center pt-4">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#E30613] text-[#E30613] font-semibold hover:bg-[#E30613] hover:text-white transition-colors rounded"
          >
            Смотреть весь каталог
          </Link>
        </div>
      </div>
    </section>
  );
}
