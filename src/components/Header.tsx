'use client';

import React, { useState } from 'react';
import { Menu, X, Clock, MapPin } from 'lucide-react';

interface HeaderProps {
  onOrderClick: () => void;
}

export function Header({ onOrderClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E7DFD5]">
      {/* Top micro announcement bar */}
      <div className="bg-[#2C221E] text-[#EDE5DC] text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C45D3C] animate-pulse" />
            <span>Обжарка каждый четверг · Доставка по пятницам</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs opacity-90">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#C45D3C]" />
              Минск, ул. Короля, 9
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C45D3C]" />
              Пн–Пт 8:00–20:00, Сб–Вс 10:00–18:00
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-[#2C221E] text-[#FBF9F5] flex items-center justify-center font-serif text-xl font-bold shadow-sm transition-transform group-hover:scale-105">
            К
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#1B1614] leading-tight">
              Кварта
            </span>
            <span className="text-[11px] uppercase tracking-wider text-[#6C625A] font-medium">
              Мастерская обжарки · Минск
            </span>
          </div>
        </a>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A3E38]">
          <button
            onClick={() => scrollTo('story')}
            className="hover:text-[#C45D3C] transition-colors cursor-pointer"
          >
            О мастерской
          </button>
          <button
            onClick={() => scrollTo('cycle')}
            className="hover:text-[#C45D3C] transition-colors cursor-pointer"
          >
            График свежести
          </button>
          <button
            onClick={() => scrollTo('products')}
            className="hover:text-[#C45D3C] transition-colors cursor-pointer"
          >
            Ассортимент
          </button>
          <button
            onClick={() => scrollTo('subscription')}
            className="hover:text-[#C45D3C] transition-colors cursor-pointer"
          >
            Подписка
          </button>
          <button
            onClick={() => scrollTo('delivery')}
            className="hover:text-[#C45D3C] transition-colors cursor-pointer"
          >
            Доставка
          </button>
        </nav>

        {/* CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOrderClick}
            className="px-5 py-2.5 rounded-lg bg-[#2C221E] text-[#FBF9F5] hover:bg-[#C45D3C] text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Заказать кофе
          </button>
        </div>

        {/* Mobile menu hamburger toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#2C221E] hover:bg-[#EDE5DC] transition-colors"
          aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7DFD5] bg-[#FBF9F5] px-4 py-5 shadow-lg flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => scrollTo('story')}
            className="text-left py-2 text-base font-medium text-[#2C221E] border-b border-[#E7DFD5]/50"
          >
            О мастерской
          </button>
          <button
            onClick={() => scrollTo('cycle')}
            className="text-left py-2 text-base font-medium text-[#2C221E] border-b border-[#E7DFD5]/50"
          >
            График обжарки и свежести
          </button>
          <button
            onClick={() => scrollTo('products')}
            className="text-left py-2 text-base font-medium text-[#2C221E] border-b border-[#E7DFD5]/50"
          >
            Ассортимент сортов
          </button>
          <button
            onClick={() => scrollTo('subscription')}
            className="text-left py-2 text-base font-medium text-[#2C221E] border-b border-[#E7DFD5]/50"
          >
            Кофейная подписка (54 BYN)
          </button>
          <button
            onClick={() => scrollTo('delivery')}
            className="text-left py-2 text-base font-medium text-[#2C221E] border-b border-[#E7DFD5]/50"
          >
            Доставка и самовывоз
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOrderClick();
            }}
            className="w-full mt-2 py-3 rounded-lg bg-[#C45D3C] text-white font-medium text-center shadow active:scale-98"
          >
            Оформить заявку
          </button>
        </div>
      )}
    </header>
  );
}
