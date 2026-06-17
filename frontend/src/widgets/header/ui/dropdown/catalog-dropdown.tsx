import Link from "next/link";

export default function CatalogDropdown() {
  return (
    <div className="relative group">
      <button className="text-sm text-[#666666] uppercase tracking-wider hover:text-[#E30613] transition-colors cursor-pointer">
        Каталог продукции
      </button>
      <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#E5E5E5] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <ul className="py-2">
          <li>
            <Link
              href="/catalog?category=keramogranit"
              className="block px-4 py-2 text-sm text-[#666666] hover:text-[#E30613] hover:bg-gray-50 transition-colors"
            >
              Керамогранит
            </Link>
          </li>
          <li>
            <Link
              href="/catalog?category=large-formats"
              className="block px-4 py-2 text-sm text-[#666666] hover:text-[#E30613] hover:bg-gray-50 transition-colors"
            >
              Крупные форматы
            </Link>
          </li>
          <li>
            <Link
              href="/catalog?category=ceramic-tile"
              className="block px-4 py-2 text-sm text-[#666666] hover:text-[#E30613] hover:bg-gray-50 transition-colors"
            >
              Керамическая плитка
            </Link>
          </li>
          <li>
            <Link
              href="/catalog?category=wallpaper"
              className="block px-4 py-2 text-sm text-[#666666] hover:text-[#E30613] hover:bg-gray-50 transition-colors"
            >
              Обои
            </Link>
          </li>
          <li>
            <Link
              href="/catalog?category=baguette"
              className="block px-4 py-2 text-sm text-[#666666] hover:text-[#E30613] hover:bg-gray-50 transition-colors"
            >
              Багет
            </Link>
          </li>
          <li>
            <Link
              href="/catalog?category=dry-mixes"
              className="block px-4 py-2 text-sm text-[#666666] hover:text-[#E30613] hover:bg-gray-50 transition-colors"
            >
              Сухие смеси
            </Link>
          </li>
          <li>
            <Link
              href="/catalog?category=paint"
              className="block px-4 py-2 text-sm text-[#666666] hover:text-[#E30613] hover:bg-gray-50 transition-colors"
            >
              Лакокрасочные изделия
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
