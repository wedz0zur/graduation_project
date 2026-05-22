import Link from "next/link";

export function PromoBlocks() {
  return (
    <section className="py-20 bg-[#333333]">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-[#E30613] to-[#C50510] rounded-lg p-10 text-white flex flex-col gap-4"> 
            <p className="text-sm font-semibold tracking-widest">РАСПРОДАЖА</p>
            <h3 className="text-3xl md:text-4xl font-bold">
              Скидки до 40%
              <br />
              на коллекции 2024
            </h3>
            <p className="text-gray-100 max-w-sm">
              Успейте приобрести плитку из прошлых коллекций по специальным ценам. Количество ограничено. 
              <br />
              <br />
            </p>
            
            <Link
              href="/catalog?sale=true"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#E30613] font-semibold hover:bg-gray-100 transition-colors rounded"
            >
              Смотреть распродажу
            </Link>
          </div>

          <div className="bg-[#F8F6F0] rounded-lg p-10 border border-[#E5E5E5] flex flex-col gap-4"> 
            <p className="text-sm font-semibold tracking-widest text-[#999999]">УСЛУГА</p>
            <h3 className="text-3xl md:text-4xl font-bold text-[#333333]">
              3D-дизайн проект
              <br />
              <span className="text-[#E30613]">бесплатно</span>
            </h3>
            <p className="text-[#666666] max-w-sm">
              При заказе плитки от 50 000 ₽ — визуализация вашего интерьера в подарок. Увидьте результат до начала ремонта.
            </p>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#E30613] text-white font-semibold hover:bg-[#C50510] transition-colors rounded"
            >
              Записаться
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}