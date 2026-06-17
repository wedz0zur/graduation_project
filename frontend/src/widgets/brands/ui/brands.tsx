import { SectionTitle } from "@/src/shared/ui/section-title";
import { brands } from "@/src/shared/lib/data";

export function Brands() {
  return (
    <section className="py-20">
      <div className="container">
        <SectionTitle
          title="Наши бренды"
          subtitle="Работаем только с проверенными производителями мирового уровня"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center justify-center h-24 border border-[#E5E5E5] rounded-lg bg-white hover:border-[#E30613] transition-colors group"
            >
              <span className="text-2xl font-bold text-[#999999] group-hover:text-[#E30613] transition-colors tracking-widest">
                {brand.name.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
