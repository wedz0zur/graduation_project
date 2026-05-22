"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/src/stores/auth";
import { Button } from "@/src/shared/ui/button";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Введите имя";
    if (!email.trim()) errs.email = "Введите email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Неверный формат email";
    if (!password) errs.password = "Введите пароль";
    else if (password.length < 6) errs.password = "Минимум 6 символов";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const res = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (data.error) {
      setServerError(data.error);
      return;
    }
    setAuth(data.token, data.user);
    router.push("/");
  };

  return (
    <div className="container min-h-120 max-w-md mx-auto flex flex-col items-center justify-center">
      <div className="text-center mb-8 flex flex-col items-center gap-3">
        <h1 className="text-3xl font-bold text-[#333333]">Регистрация</h1>
        <p className="text-[#999999] text-sm mt-2">Создайте новый аккаунт</p>
      </div>
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 shadow-sm w-full max-w-160">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 flex flex-col gap-3 w-full"
        >
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-[#E30613] text-sm text-center">
                {serverError}
              </p>
            </div>
          )}
          <div className="w-full">
            <div className="relative w-full">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#999999"
                strokeWidth="2"
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
              </svg>
              <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#E5E5E5] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#E30613] transition-colors"
              />
            </div>
            {errors.name && (
              <p className="text-[#E30613] text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div className="w-full">
            <div className="relative w-full">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#999999"
                strokeWidth="2"
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#E5E5E5] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#E30613] transition-colors"
              />
            </div>
            {errors.email && (
              <p className="text-[#E30613] text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="w-full">
            <div className="relative w-full">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#999999"
                strokeWidth="2"
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                placeholder="Пароль (минимум 6 символов)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#E5E5E5] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#E30613] transition-colors"
              />
            </div>
            {errors.password && (
              <p className="text-[#E30613] text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Зарегистрироваться
          </Button>
          <p className="text-center text-sm text-[#666666]">
            Уже есть аккаунт?{" "}
            <Link
              href="/auth/login"
              className="text-[#E30613] hover:underline font-medium"
            >
              Войти
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
