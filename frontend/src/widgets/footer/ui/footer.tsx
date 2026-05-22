import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/images/logo.svg";

export function Footer() {
  return (
    <footer className="bg-[#333333] text-white p-3">
      <div className="container py-16 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2 max-w-80">
            <Image src={Logo} alt="Geometrica"  />
            <p className="text-gray-400 text-sm leading-relaxed">
              Премиальный интернет-магазин керамической плитки, керамогранита и
              отделочных материалов.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Каталог</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/catalog?category=keramogranit" className="hover:text-white transition-colors">Керамогранит</Link></li>
              <li><Link href="/catalog?category=ceramic-tile" className="hover:text-white transition-colors">Керамическая плитка</Link></li>
              <li><Link href="/catalog?category=large-formats" className="hover:text-white transition-colors">Крупные форматы</Link></li>
              <li><Link href="/catalog?category=wallpaper" className="hover:text-white transition-colors">Обои</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition-colors">Все товары</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>г. Иркутск, ул. Старо-Кузьмихинская, 41/3</li>
              <li>+7 (3952) 48-28-05</li>
              <li>Пн–Пт: 9:00 – 19:00</li>
              <li>Сб–Вс: 10:00 – 17:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Geometrica. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
