import { Banner } from "@/src/widgets/banner";
import { CategoryGrid } from "@/src/widgets/categories";
import { Advantages } from "@/src/widgets/advantages";
import { Brands } from "@/src/widgets/brands";
import { PromoBlocks } from "@/src/widgets/promo";
import { PopularProducts } from "@/src/widgets/popular-products";

export default function Home() {
  return (
    <>
      <Banner />
      <CategoryGrid />
      <PopularProducts />
      <Advantages />
      <Brands />
      <PromoBlocks />
    </>
  );
}
