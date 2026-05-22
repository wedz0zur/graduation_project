"use client";

import { useState, useEffect } from "react";
import { useAuthStore, type UserProfile } from "@/src/stores/auth";
import { SectionTitle } from "@/src/shared/ui/section-title";
import { Button } from "@/src/shared/ui/button";
import Link from "next/link";
import Image from "next/image";

type Tab = "orders" | "settings";

const API = "http://localhost:3001/api";

export default function ProfilePage() {
  const { user, token, logout, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!activeTab || activeTab !== "orders" || !token) return;
    setOrdersLoading(true);
    fetch(`${API}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [activeTab, token]);

  if (!user || !token) {
    return (
      <div className="container py-20 text-center">
        <SectionTitle
          title="Личный кабинет"
          subtitle="Войдите в аккаунт, чтобы управлять заказами"
        />
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center px-8 py-3 bg-[#E30613] text-white font-semibold hover:bg-[#C50510] transition-colors rounded"
        >
          Войти
        </Link>
      </div>
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !token) return;
    setSaving(true);
    setMessage(null);

    const body: Record<string, string> = {};
    if (name !== user.name) body.name = name;
    if (phone !== (user.phone ?? "")) body.phone = phone;
    if (currentPassword && newPassword) {
      body.currentPassword = currentPassword;
      body.password = newPassword;
    }

    if (Object.keys(body).length === 0) {
      setMessage({ type: "error", text: "Нет изменений для сохранения" });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`${API}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Ошибка сохранения");
      }

      const updated: UserProfile = await res.json();
      updateUser({ name: updated.name, phone: updated.phone });
      setCurrentPassword("");
      setNewPassword("");
      setMessage({ type: "success", text: "Профиль успешно обновлён" });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Ошибка сохранения",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-12 flex items-center flex-col">
      <SectionTitle
        title={`Здравствуйте, ${user.name}`}
        subtitle="Управляйте заказами и настройками профиля"
      />

      <div className="min-w-2xl mx-auto ">
        <div className="flex pb-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "orders"
                ? "text-[#E30613] border-b-2 border-[#E30613]"
                : "text-[#666666] hover:text-[#333333]"
            }`}
          >
            Мои заказы
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "settings"
                ? "text-[#E30613] border-b-2 border-[#E30613]"
                : "text-[#666666] hover:text-[#333333]"
            }`}
          >
            Настройки
          </button>
        </div>

        {activeTab === "orders" && (
          <div className="flex flex-col gap-4">
            {ordersLoading ? (
              <div className="bg-[#F5F5F5] rounded-lg p-8 text-center">
                <p className="text-[#666666]">Загрузка заказов...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-[#F5F5F5] rounded-lg p-8 text-center">
                <p className="text-[#666666] mb-2">У вас пока нет заказов</p>
                <p className="text-sm text-[#999999]">
                  Совершите покупку в нашем каталоге
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#E5E5E5] rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-[#999999]">
                        Заказ №{order.id}
                      </p>
                      <p className="text-sm text-[#999999]">
                        {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-[#E30613] bg-red-50 px-3 py-1 rounded">
                      {order.status === "pending"
                        ? "В обработке"
                        : order.status === "completed"
                          ? "Выполнен"
                          : order.status}
                    </span>
                  </div>

                  <div className="border-t border-[#E5E5E5] pt-4 mb-4">
                    {order.items?.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 py-2"
                      >
                        <div className="w-12 h-12 bg-[#F5F5F5] rounded overflow-hidden relative flex-shrink-0">
                          {item.product?.image && (
                            <Image
                              src={item.product.image}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#333333] truncate">
                            {item.product?.name || `Товар #${item.productId}`}
                          </p>
                          <p className="text-xs text-[#999999]">
                            {item.quantity} × {item.price.toLocaleString()} ₽
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-[#333333]">
                          {(item.quantity * item.price).toLocaleString()} ₽
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#E5E5E5] pt-3 flex justify-between items-center">
                    <div className="text-sm text-[#999999]">
                      {order.customerName && (
                        <span>{order.customerName} </span>
                      )}
                      {order.customerPhone && (
                        <span>{order.customerPhone}</span>
                      )}
                    </div>
                    <div className="text-lg font-bold text-[#E30613]">
                      {order.total.toLocaleString()} ₽
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <form onSubmit={handleSave} className="space-y-4 flex flex-col gap-4">
            <div className="bg-white border border-[#E5E5E5] rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm text-[#999999] mb-1">
                  Email
                </label>
                <p className="font-medium text-[#333333]">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm text-[#999999] mb-1">Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#E5E5E5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E30613] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-[#999999] mb-1">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full border border-[#E5E5E5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E30613] transition-colors"
                />
              </div>

              <div className="pt-4 mb-3">
                <h4 className="text-sm font-semibold text-[#333333] mb-3">
                  Смена пароля
                </h4>
                <div className="space-y-3 flex flex-col gap-2">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Текущий пароль"
                    className="w-full border border-[#E5E5E5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E30613] transition-colors"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Новый пароль (минимум 6 символов)"
                    className="w-full border border-[#E5E5E5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E30613] transition-colors"
                  />
                </div>
              </div>
            </div>

            {message && (
              <p
                className={`text-sm ${message.type === "success" ? "text-green-600" : "text-[#E30613]"}`}
              >
                {message.text}
              </p>
            )}
            

            <div className="flex gap-3">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Сохранение..." : "Сохранить изменения"}
              </Button>
              <Button type="button" variant="outline" onClick={logout}>
                Выйти из аккаунта
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
