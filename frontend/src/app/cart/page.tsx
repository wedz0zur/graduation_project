"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/src/stores/cart";
import { useAuthStore } from "@/src/stores/auth";
import { Button } from "@/src/shared/ui/button";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, count, clearCart } =
    useCartStore();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardType, setCardType] = useState("");
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Введите ФИО";
    if (!phone.trim()) errs.phone = "Введите телефон";
    else if (!/^\+?\d{10,15}$/.test(phone.replace(/[\s\-\(\)]/g, "")))
      errs.phone = "Неверный формат телефона";
    if (!email.trim()) errs.email = "Введите email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Неверный формат email";
    if (!paymentMethod) errs.paymentMethod = "Выберите способ оплаты";
    if (paymentMethod === "online" && !cardType)
      errs.cardType = "Выберите платёжную систему";
    return errs;
  };

  const handleOrder = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const body: Record<string, unknown> = {
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };

    if (user?.id) body.userId = user.id;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      const res = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Ошибка оформления заказа");
      }

      clearCart();
      setSubmitted(true);
    } catch (err: unknown) {
      setErrors({
        submit: err instanceof Error ? err.message : "Ошибка оформления заказа",
      });
    }
  };

  if (submitted) {
    return (
      <div className="container text-center max-w-lg mx-auto flex flex-col items-center gap-4 pt-8 min-h-[60vh] justify-center">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#E30613"
          strokeWidth="2"
          className="mx-auto mb-6"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h1 className="text-2xl font-bold text-[#333333] mb-2">
          Заказ оформлен!
        </h1>
        <p className="text-[#666666] mb-6">
          Спасибо за покупку. Мы свяжемся с вами для подтверждения.
        </p>
        <Link
          href="/catalog"
          className="text-[#E30613] hover:underline font-semibold"
        >
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-8">
        Корзина
      </h1>
      <br />

      {items.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center gap-3">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E5E5E5"
            strokeWidth="1"
            className="mx-auto mb-6"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="21" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <p className="text-xl text-[#666666] mb-4">Корзина пуста</p>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#E30613] text-white font-semibold hover:bg-[#C50510] transition-colors rounded"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          <div className="lg:col-span-2 space-y-6 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 bg-white border border-[#E5E5E5] rounded-lg p-4"
              >
                <div className="relative w-24 h-24 flex-shrink-0 bg-[#F5F5F5] rounded overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <Link
                    href={`/catalog/${item.productId}`}
                    className="font-semibold text-[#333333] hover:text-[#E30613] transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-[#999999] mb-2">{item.size}</p>
                  <p className="text-lg font-bold text-[#E30613]">
                    {item.price.toLocaleString()} ₽
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-[#999999] hover:text-[#E30613] transition-colors"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                  <div className="flex items-center border border-[#E5E5E5] rounded">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="px-3 py-1 text-[#666666] hover:text-[#E30613] transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-sm font-medium border-x border-[#E5E5E5]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="px-3 py-1 text-[#666666] hover:text-[#E30613] transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white border border-[#E5E5E5] rounded-lg p-6">
              <h3 className="font-semibold text-[#333333] mb-4">
                Контактные данные
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="ФИО *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full border ${errors.name ? "border-[#E30613]" : "border-[#E5E5E5]"} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E30613]`}
                  />
                  {errors.name && (
                    <p className="text-[#E30613] text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Телефон *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full border ${errors.phone ? "border-[#E30613]" : "border-[#E5E5E5]"} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E30613]`}
                  />
                  {errors.phone && (
                    <p className="text-[#E30613] text-xs mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <input
                    type="email"
                    placeholder="Email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full border ${errors.email ? "border-[#E30613]" : "border-[#E5E5E5]"} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E30613]`}
                  />
                  {errors.email && (
                    <p className="text-[#E30613] text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <textarea
                    placeholder="Комментарий к заказу"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full border border-[#E5E5E5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E30613] resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-lg p-6">
              <h3 className="font-semibold text-[#333333] mb-4">
                Способ оплаты
              </h3>
              <div className="space-y-3 flex flex-col gap-2">
                <label
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "office" ? "border-[#E30613] bg-red-50" : "border-[#E5E5E5] hover:border-gray-300"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="office"
                    checked={paymentMethod === "office"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setCardType("");
                    }}
                    className="text-[#E30613]"
                  />
                  <div>
                    <p className="font-medium text-[#333333] text-sm">
                      Оплата в офисе
                    </p>
                    <p className="text-xs text-[#999999]">
                      Наличными или картой при получении
                    </p>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "online" ? "border-[#E30613] bg-red-50" : "border-[#E5E5E5] hover:border-gray-300"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-[#E30613]"
                  />
                  <div>
                    <p className="font-medium text-[#333333] text-sm">
                      Оплата онлайн
                    </p>
                    <p className="text-xs text-[#999999]">
                      Банковской картой на сайте
                    </p>
                  </div>
                </label>
                {errors.paymentMethod && (
                  <p className="text-[#E30613] text-xs">
                    {errors.paymentMethod}
                  </p>
                )}

                {paymentMethod === "online" && (
                  <div className="ml-8 mt-2 space-y-2 flex flex-col gap-2">
                    <p className="text-sm text-[#666666] mb-2">
                      Платёжная система:
                    </p>
                    <label
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${cardType === "visa" ? "border-[#E30613] bg-red-50" : "border-[#E5E5E5] hover:border-gray-300"}`}
                    >
                      <input
                        type="radio"
                        name="cardType"
                        value="visa"
                        checked={cardType === "visa"}
                        onChange={(e) => setCardType(e.target.value)}
                        className="text-[#E30613]"
                      />
                      <span className="text-sm font-medium text-[#333333]">
                        Visa / Mastercard
                      </span>
                    </label>
                    <label
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${cardType === "mir" ? "border-[#E30613] bg-red-50" : "border-[#E5E5E5] hover:border-gray-300"}`}
                    >
                      <input
                        type="radio"
                        name="cardType"
                        value="mir"
                        checked={cardType === "mir"}
                        onChange={(e) => setCardType(e.target.value)}
                        className="text-[#E30613]"
                      />
                      <span className="text-sm font-medium text-[#333333]">
                        МИР
                      </span>
                    </label>
                    {errors.cardType && (
                      <p className="text-[#E30613] text-xs">
                        {errors.cardType}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#F5F5F5] rounded-lg p-6 sticky top-24">
              <h3 className="font-semibold text-[#333333] mb-4">Итого</h3>
              <div className="space-y-2 text-sm text-[#666666] mb-4">
                <div className="flex justify-between">
                  <span>Товары ({count()})</span>
                  <span>{total().toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка</span>
                  <span className="text-[#E30613]">Бесплатно</span>
                </div>
              </div>
              <div className="border-t border-[#E5E5E5] pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-[#333333]">Общая сумма</span>
                  <span className="text-[#E30613]">
                    {total().toLocaleString()} ₽
                  </span>
                </div>
              </div>
              {errors.submit && (
                <p className="text-[#E30613] text-sm text-center mb-2">{errors.submit}</p>
              )}
              <Button className="w-full" size="lg" onClick={handleOrder}>
                Оформить заказ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
