import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export function Story() {
  return (
    <section id="story" className="py-16 md:py-24 bg-[#F4EFEA] border-b border-[#E7DFD5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Image column */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] bg-[#2C221E]">
                <Image
                  src="/images/workshop.jpg"
                  alt="Рабочий процесс каппинга и контроля зерна в мастерской Кварта"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>

              {/* Note sticker card */}
              <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-[#FBF9F5] p-4 rounded-xl shadow-lg border border-[#E7DFD5] max-w-xs">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#C45D3C] mb-1">
                  Ручной подход
                </div>
                <div className="text-xs text-[#2C221E] font-medium leading-relaxed">
                  «Мы варили кофе гостям годами. Теперь сами обжариваем зерно так, чтобы его было вкусно пить каждый день дома.»
                </div>
              </div>
            </div>
          </div>

          {/* Text column */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DEC0]/60 text-[#2C221E] text-xs font-semibold tracking-wide uppercase mb-4">
              <span>Основатели мастерской</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B1614] mb-6 leading-tight">
              Аня и Дмитрий. <br className="hidden sm:inline" />
              От работы бариста до собственной обжарки
            </h2>

            <div className="space-y-4 text-base text-[#5A5049] leading-relaxed">
              <p>
                Мастерская «Кварта» появилась в Минске в 2019 году. До этого мы оба долго работали бариста:
                каждый день общались с сотнями гостей, настраивали помол, готовили фильтр и эспрессо. Мы
                видели, что большинство людей просто хотят выпить дома хорошую, сбалансированную чашку кофе —
                без сложных снобистских лекций и пугающих терминов.
              </p>
              <p>
                Главный секрет по-настоящему вкусного кофе — его свежесть. Поэтому мы сознательно не делаем
                промышленный склад с сотнями килограммов, лежащих месяцами. Мы жарим кофе аккуратными партиями
                всего по 5 кг, внимательно контролируя каждую обжарку.
              </p>
            </div>

            {/* Principles checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8 pt-6 border-t border-[#DFD5C8]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#C45D3C] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[#2C221E]">
                  Обжарка партиями по 5 кг
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#C45D3C] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[#2C221E]">
                  Работаем в Минске с 2019 года
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#C45D3C] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[#2C221E]">
                  Свежесть: 1–3 дня после ростера
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#C45D3C] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[#2C221E]">
                  Честный диалог без снобизма
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
