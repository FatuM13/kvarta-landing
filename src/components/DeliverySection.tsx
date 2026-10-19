import React from 'react';
import { Truck, MapPin, Clock, Check } from 'lucide-react';

export function DeliverySection() {
  return (
    <section id="delivery" className="py-16 md:py-24 bg-[#FBF9F5] border-b border-[#E7DFD5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE5DC] text-[#2C221E] text-xs font-semibold tracking-wide uppercase mb-3">
            <Truck className="w-3.5 h-3.5 text-[#C45D3C]" />
            <span>Условия получения</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B1614] mb-4">
            Доставка по Минску и самовывоз
          </h2>
          <p className="text-base text-[#5A5049] leading-relaxed">
            Мы делаем всё, чтобы свежеобжаренное зерно попадало к вам без задержек.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Pickup */}
          <div className="bg-[#F4EFEA] rounded-2xl p-7 border border-[#E7DFD5] flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#2C221E] text-white flex items-center justify-center mb-5">
                <MapPin className="w-6 h-6 text-[#C45D3C]" />
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-[#6C625A] mb-1">
                Точка самовывоза
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1B1614] mb-3">
                Минск, ул. Короля, 9
              </h3>

              <p className="text-sm text-[#5A5049] leading-relaxed mb-6">
                Вы можете забрать свой заказ прямо из мастерской. Удобно познакомиться, забрать пачку сразу
                после фасовки или задать любой вопрос по завариванию.
              </p>

              <div className="space-y-3 pt-4 border-t border-[#DFD5C8]">
                <div className="flex items-center gap-2 text-sm text-[#2C221E]">
                  <Clock className="w-4 h-4 text-[#C45D3C] shrink-0" />
                  <span className="font-medium">Понедельник–пятница:</span> 8:00–20:00
                </div>
                <div className="flex items-center gap-2 text-sm text-[#2C221E]">
                  <Clock className="w-4 h-4 text-[#C45D3C] shrink-0" />
                  <span className="font-medium">Суббота–воскресенье:</span> 10:00–18:00
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DFD5C8] flex items-center gap-2 text-xs text-[#6C625A]">
              <Check className="w-4 h-4 text-[#C45D3C]" />
              <span>Самовывоз всегда бесплатный в рабочее время</span>
            </div>
          </div>

          {/* Card 2: Delivery */}
          <div className="bg-[#F4EFEA] rounded-2xl p-7 border border-[#E7DFD5] flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#C45D3C] text-white flex items-center justify-center mb-5">
                <Truck className="w-6 h-6" />
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-[#6C625A] mb-1">
                Курьерская доставка
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1B1614] mb-3">
                Доставка по пятницам
              </h3>

              <p className="text-sm text-[#5A5049] leading-relaxed mb-6">
                После обжарки в четверг мы упаковываем свежий кофе и развозим его по Минску в пятницу.
              </p>

              <div className="space-y-3 pt-4 border-t border-[#DFD5C8]">
                <div className="flex items-start gap-2.5 text-sm text-[#2C221E]">
                  <span className="w-2 h-2 rounded-full bg-[#C45D3C] mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-[#1B1614]">Бесплатная доставка:</strong> при заказе от 50 BYN.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-[#2C221E]">
                  <span className="w-2 h-2 rounded-full bg-[#C45D3C] mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-[#1B1614]">Подписка на кофе:</strong> доставка всегда бесплатна
                    в рамках тарифа подписки.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-[#5A5049]">
                  <span className="w-2 h-2 rounded-full bg-[#A89E94] mt-1.5 shrink-0" />
                  <span>
                    Для заказов меньше 50 BYN условия и точную стоимость доставки менеджер уточнит при
                    согласовании заявки.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DFD5C8] flex items-center gap-2 text-xs text-[#6C625A]">
              <Check className="w-4 h-4 text-[#C45D3C]" />
              <span>Доставка до двери по согласованию времени</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
