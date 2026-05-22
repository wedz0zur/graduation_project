"use client";

import { useState, useEffect } from "react";
import { SectionTitle } from "@/src/shared/ui/section-title";
import { Button } from "@/src/shared/ui/button";
import { useAuthStore } from "@/src/stores/auth";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  collection: string;
  category: string;
  price: number;
  image: string;
}

export default function AdminPage() {
  const { token, user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <div className="container py-20 text-center">
        <SectionTitle title="Админ-панель" subtitle="Доступ только для администраторов" />
        <Link href="/auth/login" className="text-[#E30613] hover:underline">Войти как администратор</Link>
      </div>
    );
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3001/api/products/${id}`, {
      method: "DELETE",
      headers,
    });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(String(product.price));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
  };

  const saveEdit = async (id: number) => {
    const res = await fetch(`http://localhost:3001/api/products/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ name: editName, price: Number(editPrice) }),
    });
    const updated = await res.json();
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    cancelEdit();
  };

  return (
    <div className="container py-12 flex flex-col gap-3">
      <div className="flex items-center justify-between mb-8">
        <SectionTitle title="Админ-панель" subtitle="Управление товарами" />
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Отмена" : "Добавить товар"}
        </Button>
      </div>

          {showForm && (
        <div className="bg-white border border-[#E5E5E5] rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-lg text-[#333333] mb-6">Новый товар</h3>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const data = Object.fromEntries(new FormData(form));
              const body: any = { ...data, price: Number(data.price) };
              if (data.oldPrice) body.oldPrice = Number(data.oldPrice);
              else body.oldPrice = null;
              const res = await fetch("http://localhost:3001/api/products", {
                method: "POST",
                headers,
                body: JSON.stringify(body),
              });
              const product = await res.json();
              setProducts((prev) => [...prev, product]);
              setShowForm(false);
            }}
          >
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1">Название *</label>
              <input name="name" required className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#E30613]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1">Коллекция</label>
              <input name="collection" className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#E30613]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1">Категория</label>
              <select name="category" className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#E30613]">
                <option value="keramogranit">Керамогранит</option>
                <option value="ceramic-tile">Керамическая плитка</option>
                <option value="large-formats">Крупные форматы</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1">Бренд</label>
              <input name="brand" className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#E30613]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1">Размер</label>
              <input name="size" placeholder="например 60×120 см" className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#E30613]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1">Цена (₽) *</label>
              <input name="price" type="number" required className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#E30613]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-1">Старая цена (₽)</label>
              <input name="oldPrice" type="number" className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#E30613]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#666666] mb-1">Изображение (URL)</label>
              <input name="image" defaultValue="/placeholder.svg" className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#E30613]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#666666] mb-1">Описание</label>
              <textarea name="description" rows={3} className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#E30613] resize-none" />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Сохранить товар</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F5F5]">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-[#666666]">Товар</th>
              <th className="text-left px-4 py-3 font-medium text-[#666666]">Категория</th>
              <th className="text-left px-4 py-3 font-medium text-[#666666]">Цена</th>
              <th className="text-right px-4 py-3 font-medium text-[#666666]">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-[#F5F5F5] rounded overflow-hidden flex-shrink-0">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    {editingId === product.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border border-[#E5E5E5] rounded px-2 py-1 text-sm focus:outline-none focus:border-[#E30613]"
                      />
                    ) : (
                      <p className="font-medium text-[#333333]">{product.name}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-[#666666]">{product.category}</td>
                <td className="px-4 py-3">
                  {editingId === product.id ? (
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="border border-[#E5E5E5] rounded px-2 py-1 text-sm w-24 focus:outline-none focus:border-[#E30613]"
                    />
                  ) : (
                    <span className="font-semibold text-[#333333]">{product.price.toLocaleString()} ₽</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {editingId === product.id ? (
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => saveEdit(product.id)} className="text-green-600 hover:underline text-sm cursor-pointer">Сохранить</button>
                      <button onClick={cancelEdit} className="text-[#666666] hover:underline text-sm cursor-pointer">Отмена</button>
                    </div>
                  ) : (
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => startEdit(product)} className="text-[#666666] hover:underline text-sm cursor-pointer">Редактировать</button>
                      <button onClick={() => handleDelete(product.id)} className="text-[#E30613] hover:underline text-sm cursor-pointer">Удалить</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
