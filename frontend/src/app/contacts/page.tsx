"use client";
import { useState } from "react";
import { SectionTitle } from "@/src/shared/ui/section-title";
import { useAuthStore } from "@/src/stores/auth";

export default function ContactsPage() {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [message, setMessage] = useState("");

  return (
    <div className="container py-12">
      <SectionTitle
        title="Контакты"
        subtitle="Свяжитесь с нами любым удобным способом"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
        <div className="space-y-8 flex flex-col gap-3">
          <div>
            <h3 className="font-semibold text-[#333333] text-lg mb-4">Адрес шоу-рума</h3>
            <p className="text-[#666666]">г. Иркутск, ул. Старо-Кузьмихинская, 41/3</p>
          </div>

          <div>
            <h3 className="font-semibold text-[#333333] text-lg mb-4">Телефон</h3>
            <a
              href="tel:+73952482805"
              className="text-[#E30613] text-xl font-semibold hover:underline"
            >
              +7 (3952) 48-28-05
            </a>
          </div>

          <div>
            <h3 className="font-semibold text-[#333333] text-lg mb-4">Режим работы</h3>
            <div className="space-y-2 text-[#666666]">
              <p>Пн–Пт: 9:00 – 19:00</p>
              <p>Сб–Вс: 10:00 – 17:00</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#333333] text-lg mb-4">Email</h3>
            <a
              href="mailto:info@geometrica.ru"
              className="text-[#E30613] hover:underline"
            >
              info@geometrica.ru
            </a>
          </div>

          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <h3 className="font-semibold text-[#333333] text-lg mb-4">Напишите нам</h3>
            <form className="space-y-4 flex flex-col gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#E5E5E5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E30613] transition-colors"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Телефон"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-[#E5E5E5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E30613] transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#E5E5E5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E30613] transition-colors"
                />
              </div>
              <div>
                <textarea
                  rows={4}
                  placeholder="Ваше сообщение"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-[#E5E5E5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E30613] transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-[#E30613] text-white font-semibold hover:bg-[#C50510] transition-colors rounded"
              >
                Отправить
              </button>
            </form>
          </div>
        </div>

        <div className="h-[500px] bg-[#F5F5F5] rounded-lg overflow-hidden">
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3Ae8a7e1e9e8e9e8e7e1e9e8e7e1e9e8e7&source=constructor"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            title="Geometrica на карте"
          />
        </div>
      </div>
    </div>
  );
}
