import React from 'react';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-[#211916] text-[#D5CBC1] border-t border-[#3B302B] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#C45D3C] text-white flex items-center justify-center font-serif text-lg font-bold">
                К
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Кварта
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A89E94] leading-relaxed max-w-sm mb-4">
              Мастерская по обжарке кофе. Обжариваем свежие зерна партиями по 5 кг в Минске с 2019 года.
              Честный кофе без снобизма.
            </p>
            <div className="text-xs text-[#8A7E75]">
              Основатели: Аня и Дмитрий
            </div>
          </div>

          {/* Col 2: Location & Hours */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Самовывоз и мастерская
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-[#D5CBC1]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C45D3C] shrink-0 mt-0.5" />
                <span>Минск, ул. Короля, 9</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#C45D3C] shrink-0 mt-0.5" />
                <div>
                  <div>Пн–Пт: 8:00–20:00</div>
                  <div>Сб–Вс: 10:00–18:00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Legal & Docs */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Информация
            </h4>
            <ul className="space-y-2 text-xs text-[#A89E94]">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors underline underline-offset-2"
                >
                  Политика конфиденциальности
                </Link>
              </li>
              <li>Доставка по пятницам (Минск)</li>
              <li>Бесплатно при заказе от 50 BYN</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#3B302B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A6E65]">
          <div>
            © {currentYear} Мастерская кофе «Кварта». Все права защищены.
          </div>
          <div>
            Локальная независимая обжарка в Минске
          </div>
        </div>
      </div>
    </footer>
  );
}
