import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";

export const metadata: Metadata = {
  title: "Geometrica — Премиальный магазин керамической плитки",
  description:
    "Geometrica — интернет-магазин керамической плитки, керамогранита и отделочных материалов премиум-класса. Широкий выбор коллекций от ведущих мировых брендов.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 pb-7.5">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
