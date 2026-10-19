import React from 'react';
import { Flame, Truck, Coffee, Calendar, Info } from 'lucide-react';

export function FreshnessCycle() {
  const steps = [
    {
      day: 'Четверг',
      tag: 'День обжарки',
      icon: Flame,
      title: 'Обжариваем партиями по 5 кг',
      description:
        'Жарим кофе в мастерской. Каждая пачка получает дату обжарки. Зерно начинает процесс естественной дегазации.',
      accent: 'border-[#C45D3C]',
      iconBg: 'bg-[#C45D3C] text-white',
    },
    {
      day: 'Пятница',
      tag: 'День логистики',
      icon: Truck,
      title: 'Доставка по Минску и самовывоз',
      description:
        'Фасуем в пачки с дегазационным клапаном. Курьер развозит заказы по городу, либо заказ ждет вас на ул. Короля, 9.',
      accent: 'border-[#2C221E]',
      iconBg: 'bg-[#2C221E] text-white',
    },
    {
      day: '1–3-й день',
      tag: 'Пик вкуса',
      icon: Coffee,
      title: 'Кофе готов в вашей чашке',
      description:
        'Кофе как раз успевает отдохнуть после ростера. В этот период эфирные масла и ароматы раскрываются максимально сбалансированно.',
      accent: 'border-[#B85D36]',
      iconBg: 'bg-[#B85D36] text-white',
    },
  ];

  return (
    <section id="cycle" className="py-16 md:py-24 bg-[#FBF9F5] border-b border-[#E7DFD5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE5DC] text-[#2C221E] text-xs font-semibold tracking-wide uppercase mb-3">
            <Calendar className="w-3.5 h-3.5 text-[#C45D3C]" />
            <span>Производственный цикл</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B1614] mb-4">
            Почему дата обжарки имеет значение
          </h2>
          <p className="text-base text-[#5A5049] leading-relaxed">
            Кофе — живой натуральный продукт. После обжарки зерно отдаёт лишний углекислый газ и
            раскрывает свой истинный букет. Через несколько месяцев на полке в супермаркете аромат угасает.
            Мы доставляем зерно именно тогда, когда оно готово питься.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#F4EFEA] rounded-2xl p-6 sm:p-7 border border-[#E7DFD5] relative flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6C625A] bg-[#EAE2D8] px-2.5 py-1 rounded-md">
                      {step.tag}
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#C45D3C]">0{idx + 1}</span>
                  </div>

                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform" style={{ backgroundColor: idx === 0 ? '#C45D3C' : idx === 1 ? '#2C221E' : '#A8482A', color: '#FFF' }}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="font-serif text-xl font-bold text-[#1B1614] mb-1">
                    {step.day}
                  </div>
                  <h3 className="text-sm font-semibold text-[#2C221E] mb-3">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5A5049] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#DFD5C8]/70 text-[11px] text-[#6C625A] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C45D3C]" />
                  <span>Минск · ул. Короля, 9</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informative note */}
        <div className="mt-10 p-4 sm:p-5 rounded-xl bg-[#EDE5DC]/60 border border-[#E7DFD5] flex items-start gap-3.5 max-w-2xl mx-auto">
          <Info className="w-5 h-5 text-[#C45D3C] shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-[#5A5049] leading-relaxed">
            Мы не делаем недоказанных утверждений о магии вкуса: мы просто соблюдаем технологию.
            Свежее зерно дает чистую чашку без затхлости и прогорклости, свойственной старому магазинному кофе.
          </p>
        </div>
      </div>
    </section>
  );
}
