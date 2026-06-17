"use client";
import Link from "next/link";
import { useAuthStore } from "@/src/stores/auth";
import { useCartStore } from "@/src/stores/cart";
import { useFavoritesStore } from "@/src/stores/favorites";

export default function HeaderIcons() {
  const user = useAuthStore((s) => s.user);
  const count = useCartStore((s) => s.count());
  const favoritesCount = useFavoritesStore((s) => s.ids.length);

  return (
    <div className="flex items-center gap-4">
      <Link href={user ? "/profile" : "/auth/login"} className="text-[#666666] hover:text-[#E30613] transition-colors">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </Link>
      <Link href="/favorites" className="text-[#666666] hover:text-[#E30613] transition-colors relative">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        {favoritesCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#E30613] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {favoritesCount}
          </span>
        )}
      </Link>
      <Link href="/cart" className="text-[#666666] hover:text-[#E30613] transition-colors relative">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="21" r="1" />
          <circle cx="21" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#E30613] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
      </Link>
    </div>
  );
}
