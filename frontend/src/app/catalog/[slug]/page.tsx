import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchProduct, fetchProducts } from "@/src/shared/lib/data";
import { Button } from "@/src/shared/ui/button";
import { ProductCard } from "@/src/shared/ui/product-card";
import { AddToCartButton } from "@/src/widgets/add-to-cart-button";
import { AdminProductActions } from "@/src/widgets/admin-product-actions";
import { FavoriteButton } from "@/src/widgets/favorite-button";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProduct(Number(slug));
  if (!product) return { title: "Товар не найден" };
  return {
    title: `${product.name} — Geometrica`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProduct(Number(slug));

  if (!product) {
    notFound();
  }

  const allProducts = await fetchProducts();
  const relatedProducts = allProducts
    .filter((p: any) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container py-12 flex flex-col gap-4">
      <nav className="flex items-center gap-2 text-sm text-[#999999] mb-8">
        <Link href="/" className="hover:text-[#E30613] transition-colors">Главная</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-[#E30613] transition-colors">Каталог</Link>
        <span>/</span>
        <span className="text-[#333333]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="relative aspect-[0/1] bg-[#F5F5F5] rounded-lg overflow-hidden">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-[#E30613] font-semibold uppercase tracking-wider mb-2">
                {product.brand}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-[#999999] uppercase tracking-wider mb-6">
                {product.collection}
              </p>
            </div>
            <AdminProductActions productId={product.id} />
          </div>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl font-bold text-[#E30613]">
              {product.price.toLocaleString()} ₽
            </span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-[#999999] line-through">
                  {product.oldPrice.toLocaleString()} ₽
                </span>
                <span className="bg-[#E30613] text-white text-xs font-bold px-2 py-1 rounded">
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="text-[#666666] leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="flex gap-4 mb-8">
            <AddToCartButton product={product} />
            <FavoriteButton productId={product.id} />
          </div>

          <div className="border-t border-[#E5E5E5] pt-6 flex flex-col gap-2">
            <h3 className="font-semibold text-[#333333] mb-4">Характеристики</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between py-1">
                <span className="text-sm text-[#999999]">Производитель</span>
                <span className="text-sm text-[#333333] font-medium">{product.brand}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sm text-[#999999]">Коллекция</span>
                <span className="text-sm text-[#333333] font-medium">{product.collection}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sm text-[#999999]">Размер</span>
                <span className="text-sm text-[#333333] font-medium">{product.size}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sm text-[#999999]">Категория</span>
                <span className="text-sm text-[#333333] font-medium">{product.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-[#333333] mb-8">С этим покупают</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
