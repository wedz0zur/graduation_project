export default function ServicesDropdown() {
  return (
    <div className="relative group">
      <button className="text-sm text-[#666666] uppercase tracking-wider hover:text-[#E30613] transition-colors cursor-pointer">
        Услуги
      </button>
      <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#E5E5E5] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <ul className="py-2">
          {[
            "Выезд на замер",
            "Расчёт материалов",
            "Резка плитки",
            "Изготовление спец. изделий",
            "3D-дизайн проект",
          ].map((service) => (
            <li key={service}>
              <button className="w-full text-left px-4 py-2 text-sm text-[#666666] hover:text-[#E30613] hover:bg-gray-50 transition-colors cursor-pointer">
                {service}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
