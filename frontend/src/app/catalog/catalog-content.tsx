"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ProductCard } from "@/src/shared/ui/product-card";
import { SectionTitle } from "@/src/shared/ui/section-title";
import { categories, fetchProducts } from "@/src/shared/lib/data";

const sortOptions = [
  { value: "default", label: "По умолчанию" },
  { value: "price-asc", label: "Цена: по возрастанию" },
  { value: "price-desc", label: "Цена: по убыванию" },
  { value: "name", label: "По названию" },
];

export function CatalogContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category") || "all";
  const saleFilter = searchParams.get("sale") === "true";

  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [saleOnly, setSaleOnly] = useState(saleFilter);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (saleOnly) params.set("sale", "true");
    if (selectedBrand !== "all") params.set("brand", selectedBrand);
    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
    if (priceRange[1] < 20000) params.set("maxPrice", String(priceRange[1]));
    if (sortBy !== "default") params.set("sort", sortBy);

    fetchProducts(params.toString()).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [selectedCategory, saleOnly, sortBy, priceRange, selectedBrand]);

  useEffect(() => {
    fetchProducts().then((data) => {
      const b = [...new Set(data.map((p: any) => p.brand).filter(Boolean))] as string[];
      setAllBrands(b);
    });
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="container py-12">
      <SectionTitle
        title={currentCategory ? currentCategory.name : "Каталог продукции"}
        subtitle={
          currentCategory
            ? `${products.length} товаров в категории`
            : `${products.length} товаров в наличии`
        }
      />

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white border border-[#E5E5E5] rounded-lg p-6 sticky top-24 space-y-6">
            <h3 className="font-semibold text-[#333333] text-lg flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><circle cx="4" cy="12" r="2" /><circle cx="12" cy="10" r="2" /><circle cx="20" cy="14" r="2" />
              </svg>
              Фильтры
            </h3>

            <div>
              <h4 className="text-sm font-semibold text-[#333333] mb-3 uppercase tracking-wider">Категория</h4>
              <div className="space-y-1">
                {[
                  { id: "all", name: "Все категории" },
                  ...categories,
                ].map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#E30613]/10 text-[#E30613] font-medium"
                          : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#333333]"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {allBrands.length > 0 && (
              <div className="pt-5">
                <h4 className="text-sm font-semibold text-[#333333] mb-3 uppercase tracking-wider">Бренд</h4>
                <div className="flex flex-wrap gap-2">
                  {["all", ...allBrands].map((b: any) => {
                    const isActive = selectedBrand === b;
                    return (
                      <button
                        key={b}
                        onClick={() => setSelectedBrand(b)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#333333] text-white"
                            : "bg-[#F5F5F5] text-[#666666] hover:bg-[#E5E5E5]"
                        }`}
                      >
                        {b === "all" ? "Все" : b}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-5">
              <h4 className="text-sm font-semibold text-[#333333] mb-3 uppercase tracking-wider">Цена</h4>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#999999]">от</span>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full border border-[#E5E5E5] rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]/20 transition-all"
                  />
                </div>
                <span className="text-[#999999]">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#999999]">до</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full border border-[#E5E5E5] rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`relative w-10 h-5 rounded-full transition-colors ${saleOnly ? 'bg-[#E30613]' : 'bg-[#E5E5E5]'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${saleOnly ? 'translate-x-5' : ''}`} />
                </div>
                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={(e) => setSaleOnly(e.target.checked)}
                  className="hidden"
                />
                <span className="text-sm text-[#E30613] font-medium group-hover:underline">Товары со скидкой</span>
              </label>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-4 pb-4">
            <p className="text-sm text-[#666666]">
              {loading ? "Загрузка..." : `Найдено: ${products.length} товаров`}
            </p>
            <div className="relative" ref={sortRef}>
              <button
                type="button"
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 border border-[#E5E5E5] rounded-lg pl-3 pr-3 py-2 text-sm text-[#333333] bg-white hover:border-[#E30613] focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]/20 transition-all cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                </svg>
                {sortOptions.find((o) => o.value === sortBy)?.label}
                <svg className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#E5E5E5] rounded-lg shadow-lg z-50 overflow-hidden">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                        sortBy === opt.value
                          ? "bg-[#E30613]/10 text-[#E30613] font-medium"
                          : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#333333]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            {loading ? (
              <div className="text-center py-20 text-[#666666]">Загрузка товаров...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-[#666666]">Товары не найдены</p>
                <p className="text-sm text-[#999999] mt-2">Попробуйте изменить параметры фильтрации</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
