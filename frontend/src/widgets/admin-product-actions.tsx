"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/stores/auth";

export function AdminProductActions({ productId }: { productId: number }) {
  const { token, user } = useAuthStore();
  const router = useRouter();

  if (!user || user.role !== "admin" || !token) return null;

  const handleDelete = async () => {
    if (!confirm("Удалить товар?")) return;
    await fetch(`http://localhost:3001/api/products/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/catalog");
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-[#E30613] hover:underline cursor-pointer flex items-center gap-1"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
      Удалить товар
    </button>
  );
}
