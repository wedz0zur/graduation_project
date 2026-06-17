import React from "react";
import { SectionTitle } from "@/src/shared/ui/section-title";
import { advantages } from "@/src/shared/lib/data";

const iconMap: Record<string, React.ReactNode> = {
  shield: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  stars: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  truck: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  cube: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="21 16 8 22 3 14 16 8 21 16" />
      <line x1="3" y1="14" x2="3" y2="21" />
      <line x1="21" y1="16" x2="21" y2="23" />
      <line x1="8" y1="22" x2="8" y2="15" />
      <line x1="16" y1="8" x2="16" y2="1" />
      <line x1="3" y1="21" x2="8" y2="15" />
      <line x1="21" y1="23" x2="16" y2="15" />
      <line x1="4" y1="7" x2="9" y2="2" />
    </svg>
  ),
};

export function Advantages() {
  return (
    <section className="py-20 bg-[#F5F5F5]">
      <div className="container">
        <SectionTitle
          title="Почему выбирают Geometrica"
          subtitle="Мы предлагаем не просто плитку — мы создаём пространство для жизни"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((adv) => (
            <div key={adv.title} className="flex flex-col items-center text-center group">
  <div className="w-16 h-16 mb-4 rounded-full bg-white group-hover:bg-[#E30613] transition-colors flex items-center justify-center">
    <div className="group-hover:brightness-0 group-hover:invert transition-all w-8 h-8 flex items-center justify-center">
      {iconMap[adv.icon]}
    </div>
  </div>
  <h3 className="text-lg font-semibold text-[#333333] mb-2">{adv.title}</h3>
  <p className="text-sm text-[#666666] leading-relaxed">{adv.description}</p>
</div>
          ))}
        </div>
      </div>
    </section>
  );
}
