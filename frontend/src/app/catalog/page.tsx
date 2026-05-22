import { Suspense } from "react";
import { CatalogContent } from "./catalog-content";

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="container py-12 text-center text-[#666666]">Загрузка каталога...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
