"use client";
import { Button } from "@/src/shared/ui/button";
import { useCartStore } from "@/src/stores/cart";

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    size: string;
    collection: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const items = useCartStore((s) => s.items);
  const inCart = items.some((i) => i.productId === product.id);

  return (
    <Button size="lg" onClick={() => inCart ? removeItem(product.id) : addItem({ ...product, productId: product.id })} className="w-[200px] flex gap-4">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
        <circle cx="8" cy="21" r="1" />
        <circle cx="21" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {inCart ? "В корзине" : "В корзину"}
    </Button>
  );
}
