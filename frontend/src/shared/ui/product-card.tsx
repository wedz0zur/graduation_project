"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/shared/ui/button";
import { useCartStore } from "@/src/stores/cart";
import { useFavoritesStore } from "@/src/stores/favorites";

export interface Product {
  id: number;
  name: string;
  collection: string;
  category: string;
  size: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  description?: string;
  characteristics?: Record<string, string>;
  brand?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const cartItems = useCartStore((s) => s.items);
  const favoritesIds = useFavoritesStore((s) => s.ids);
  const toggleFav = useFavoritesStore((s) => s.toggle);

  const inCart = cartItems.some((i) => i.productId === product.id);
  const inFav = favoritesIds.includes(product.id);

  return (
    <div className="group bg-white border border-[#E5E5E5] rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/catalog/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-[#F5F5F5]">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.oldPrice && (
          <span className="absolute top-3 left-3 bg-[#E30613] text-white text-xs font-bold px-2 py-1 rounded">
            СКИДКА
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggleFav(product.id); }}
          className="absolute top-3 right-3 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={inFav ? "#E30613" : "none"} stroke={inFav ? "#E30613" : "#666"} strokeWidth="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </Link>
      <div className="p-4">
        <p className="text-xs text-[#999999] uppercase tracking-wider mb-1">
          {product.collection}
        </p>
        <h3 className="font-semibold text-[#333333] mb-1">{product.name}</h3>
        <p className="text-sm text-[#666666] mb-3">{product.size}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-bold text-[#E30613]">
              {product.price.toLocaleString()} ₽
            </span>
            {product.oldPrice && (
              <span className="text-[11px] text-[#999999] line-through">
                {product.oldPrice.toLocaleString()} ₽
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant={inCart ? "primary" : "outline"}
            onClick={() => inCart ? removeItem(product.id) : addItem({ id: product.id, productId: product.id, name: product.name, price: product.price, image: product.image, size: product.size, collection: product.collection })}
            className="w-[140px]"
          >
            {inCart ? "В корзине" : "В корзину"}
          </Button>
        </div>
      </div>
    </div>
  );
}
