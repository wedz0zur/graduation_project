"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SectionTitle } from "@/src/shared/ui/section-title";
import { categories, fetchCategoryCounts } from "@/src/shared/lib/data";

export function CategoryGrid() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchCategoryCounts().then(setCounts);
  }, []);

  const mainCats = categories.slice(0, 4);
  const secondaryCats = categories.slice(4);

  return (
    <section className="py-20">
      <div className="container">
        <SectionTitle
          title="Категории продукции"
          subtitle="Широкий выбор керамической плитки, керамогранита и отделочных материалов для вашего интерьера"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {mainCats.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="group relative h-64 overflow-hidden rounded-lg bg-[#333333]"
            >
              <Image src={cat.image} alt={cat.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                <h3 className="text-white text-xl font-bold mb-1">{cat.name}</h3>
                <p className="text-gray-300 text-sm">{counts[cat.id] ?? 0} товаров</p>
              </div>
            </Link>
          ))}
        </div>
        <br />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {secondaryCats.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="group relative h-48 overflow-hidden rounded-lg bg-[#333333]"
            >
              <Image src={cat.image} alt={cat.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                <h3 className="text-white text-lg font-semibold mb-1">
                  {cat.name}
                </h3>
                <p className="text-gray-300 text-sm">{counts[cat.id] ?? 0} товаров</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
