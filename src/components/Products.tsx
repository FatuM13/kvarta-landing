import React from 'react';
import Image from 'next/image';
import { Package, Sparkles, Check, ArrowRight, Truck } from 'lucide-react';
import { InterestType } from '@/lib/types';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  tasteNotes: string[];
  roastLevel?: string;
  purpose?: string;
  packageSize: string;
  price: string;
  image: string;
  badge?: string;
}

interface ProductsProps {
  onSelectProduct: (productName: string, interest: InterestType) => void;
}

export function Products({ onSelectProduct }: ProductsProps) {
  const singleProducts: ProductItem[] = [
    {
      id: 'ethiopia',
      name: 'Эфиопия Иргачеффе',
      category: 'Моносорт свежей обжарки',
      tasteNotes: ['цветочный аромат', 'бергамот'],
      roastLevel: 'светлая',
      packageSize: '250 г',
      price: '32 BYN',
      image: '/images/product_ethiopia.jpg',
      badge: 'Светлая обжарка',
    },
    {
      id: 'colombia',
      name: 'Колумбия Уила',
      category: 'Моносорт свежей обжарки',
      tasteNotes: ['карамель', 'красное яблоко'],
      packageSize: '250 г',
      price: '29 BYN',
      image: '/images/product_colombia.jpg',
      badge: 'Яркий баланс',
    },
    {
      id: 'brazil',
      name: 'Бразилия Серрадо',
      category: 'Моносорт свежей обжарки',
      tasteNotes: ['орех', 'шоколад'],
      purpose: 'под эспрессо',
      packageSize: '250 г',
      price: '26 BYN',
      image: '/images/product_brazil.jpg',
      badge: 'Под эспрессо',
    },
    {
      id: 'drips',
      name: 'Дрип-пакеты, ассорти',
      category: 'Кофе без кофеварки',
      tasteNotes: ['ассорти сортов в индивидуальных фильтр-пакетах'],
      packageSize: '10 штук',
      price: '18 BYN',
      image: '/images/product_drips.jpg',
      badge: 'Удобно в дороге и офисе',
    },
  ];

  return (
    <section id="products" className="py-16 md:py-24 bg-[#F4EFEA] border-b border-[#E7DFD5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE5DC] text-[#2C221E] text-xs font-semibold tracking-wide uppercase mb-3">
            <Package className="w-3.5 h-3.5 text-[#C45D3C]" />
            <span>Ассортимент мастерской</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B1614] mb-4">
            Свежий кофе текущей обжарки
          </h2>
          <p className="text-base text-[#5A5049] leading-relaxed">
            Мы держим компактную линейку сортов, чтобы гарантировать максимальную свежесть каждой партии.
            Обжариваем только по четвергам.
          </p>
        </div>

        {/* 4 Regular products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {singleProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-[#FBF9F5] rounded-2xl border border-[#E7DFD5] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-200 group"
            >
              <div>
                {/* Product image */}
                <div className="relative aspect-[4/3] bg-[#EAE2D8] overflow-hidden">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {prod.badge && (
                    <div className="absolute top-3 left-3 bg-[#1B1614]/80 backdrop-blur-sm text-[#FBF9F5] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {prod.badge}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-[#6C625A] mb-1">
                    {prod.packageSize}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1B1614] mb-2 leading-snug">
                    {prod.name}
                  </h3>

                  {/* Flavor notes */}
                  <div className="space-y-1 mb-4">
                    <div className="text-xs text-[#5A5049]">
                      <span className="font-medium text-[#2C221E]">Вкусовые ноты: </span>
                      {prod.tasteNotes.join(', ')}
                    </div>
                    {prod.roastLevel && (
                      <div className="text-xs text-[#5A5049]">
                        <span className="font-medium text-[#2C221E]">Обжарка: </span>
                        {prod.roastLevel}
                      </div>
                    )}
                    {prod.purpose && (
                      <div className="text-xs text-[#5A5049]">
                        <span className="font-medium text-[#2C221E]">Назначение: </span>
                        {prod.purpose}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price and CTA Button */}
              <div className="p-5 pt-0 border-t border-[#E7DFD5]/70 mt-2">
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <span className="text-xs text-[#6C625A] block">Цена</span>
                    <span className="font-serif text-2xl font-bold text-[#1B1614]">
                      {prod.price}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectProduct(prod.name, 'order')}
                    className="px-4 py-2.5 rounded-lg bg-[#2C221E] hover:bg-[#C45D3C] text-[#FBF9F5] text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    Заказать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 5th Product: Subscription Highlight Banner */}
        <div
          id="subscription"
          className="rounded-3xl bg-[#2C221E] text-[#FBF9F5] p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-xl border border-[#3E322C]"
        >
          {/* Warm background gradient accent */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#C45D3C]/20 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C45D3C] text-white text-xs font-semibold tracking-wide uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Регулярный кофе со скидкой на доставку</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                Кофейная подписка «Кварта»
              </h3>

              <p className="text-sm sm:text-base text-[#D5CBC1] leading-relaxed mb-6">
                Две свежие пачки по 250 г раз в месяц прямо к вам домой или в офис. Мы подбираем лучшие
                лоты текущей обжарки, чтобы вы никогда не оставались без утренней чашки хорошего кофе.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-[#E7DFD5]">
                  <Check className="w-4 h-4 text-[#C45D3C] shrink-0" />
                  <span>Две пачки по 250 г каждый месяц</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#E7DFD5]">
                  <Truck className="w-4 h-4 text-[#C45D3C] shrink-0" />
                  <span className="font-semibold text-white">Доставка по Минску — бесплатно</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#E7DFD5]">
                  <Check className="w-4 h-4 text-[#C45D3C] shrink-0" />
                  <span>Свежая обжарка текущего месяца</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#E7DFD5]">
                  <Check className="w-4 h-4 text-[#C45D3C] shrink-0" />
                  <span>Возможность поставить на паузу</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5">
                <div>
                  <span className="text-xs text-[#A89E94] block uppercase tracking-wider">
                    Стоимость
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-white">
                      54 BYN
                    </span>
                    <span className="text-xs text-[#D5CBC1]">/ в месяц</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectProduct('Кофейная подписка (2 пачки по 250 г/мес)', 'subscription')}
                  className="px-7 py-3.5 rounded-xl bg-[#C45D3C] hover:bg-[#A8482A] text-white font-medium text-sm sm:text-base transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Оформить подписку</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 aspect-[4/3] bg-[#1B1614]">
                <Image
                  src="/images/product_subscription.jpg"
                  alt="Кофейная подписка Кварта"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
