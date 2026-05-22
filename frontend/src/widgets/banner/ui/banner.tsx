import Image from "next/image";
import Link from "next/link";
import bannerImage1 from "@/public/images/banner-image/banner-image-1.svg";

export function Banner() {
  return (
    <section className="relative w-full min-h-[500px] overflow-hidden p-5">
      <div className="absolute inset-0 bg-black/30 z-10" />
      <Image
        src={bannerImage1}
        alt="Geometrica — премиальная плитка"
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-20 flex items-center min-h-[500px]">
        <div className="container py-16">
          <div className="max-w-2xl flex flex-col gap-4">
            <p className="text-[#E30613] font-semibold text-lg mb-4 tracking-widest uppercase">
              Коллекция 2025
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Casabella
              <br />
              <span className="text-[#E30613]">Итальянский стиль</span> в вашем доме
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
              Премиальная керамическая плитка от ведущих мировых производителей.
              Создайте интерьер своей мечты с Geometrica.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#E30613] text-white font-semibold text-lg hover:bg-[#C50510] transition-colors rounded"
              >
                Каталог продукции
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-[#333333] transition-colors rounded"
              >
                Наши проекты
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}