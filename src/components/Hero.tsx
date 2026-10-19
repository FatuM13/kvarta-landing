import React from 'react';
import Image from 'next/image';
import { ArrowRight, Flame } from 'lucide-react';

interface HeroProps {
  onCatalogClick: () => void;
  onSubscriptionClick: () => void;
}

export function Hero({ onCatalogClick, onSubscriptionClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 border-b border-[#E7DFD5]">
      {/* Decorative warm background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#EBDDD0]/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#EFE8DF]/60 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Text and CTA column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Craft Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE5DC] text-[#2C221E] text-xs font-semibold tracking-wide uppercase mb-6 border border-[#DFD5C8]">
              <Flame className="w-3.5 h-3.5 text-[#C45D3C]" />
              <span>Небольшие партии по 5 кг · Минск</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1B1614] leading-[1.12] tracking-tight mb-6">
              Обжарили в&nbsp;четверг. <br />
              В&nbsp;пятницу уже&nbsp;пьёте.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#5A5049] leading-relaxed max-w-xl mb-8">
              «Кварта» — небольшая независимая мастерская в Минске. Мы обжариваем спешелти кофе
              ручными батчами по 5 кг и привозим его свежим на 1–3-й день. Простой, живой и понятный
              вкус — без кофейного снобизма и заумных терминов.
            </p>

            {/* CTAs */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <button
                onClick={onCatalogClick}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#2C221E] hover:bg-[#C45D3C] text-[#FBF9F5] text-base font-medium transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <span>Выбрать сорт кофе</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onSubscriptionClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#F4EFEA] hover:bg-[#EBE2D7] text-[#2C221E] border border-[#E7DFD5] text-base font-medium transition-all active:scale-98 cursor-pointer"
              >
                <span>Кофейная подписка</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#2C221E] text-white">54 BYN</span>
              </button>
            </div>

            {/* Trust and Key Facts Bar */}
            <div className="w-full grid grid-cols-3 gap-3 pt-6 border-t border-[#E7DFD5]">
              <div>
                <div className="font-serif text-2xl font-bold text-[#1B1614]">5 кг</div>
                <div className="text-xs text-[#6C625A]">Размер одной партии</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-[#C45D3C]">1–3 дня</div>
                <div className="text-xs text-[#6C625A]">От ростера до чашки</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-[#1B1614]">с 2019</div>
                <div className="text-xs text-[#6C625A]">Опыт обжарки в Минске</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Card Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Image Frame with craft border */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[5/4] bg-[#2C221E]">
                <Image
                  src="/images/hero.jpg"
                  alt="Свежая обжарка кофе в мастерской Кварта"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1614]/70 via-transparent to-transparent pointer-events-none" />

                {/* Overlaid craft tag badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#FBF9F5]/95 backdrop-blur-sm p-4 rounded-xl border border-[#E7DFD5] shadow-lg">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#2C221E] mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#C45D3C]" />
                      График недели
                    </span>
                    <span className="text-[#6C625A] font-mono">Минск</span>
                  </div>
                  <p className="text-xs text-[#5A5049] leading-snug">
                    Четверг — обжарка в ростере. Пятница — доставка по Минску и самовывоз на ул. Короля, 9.
                  </p>
                </div>
              </div>

              {/* Decorative stamp on top-right */}
              <div className="hidden sm:flex absolute -top-5 -right-5 w-24 h-24 rounded-full bg-[#C45D3C] text-white p-2 shadow-lg items-center justify-center text-center rotate-12 border-2 border-white">
                <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">
                  100%<br />Свежая<br />Обжарка
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
