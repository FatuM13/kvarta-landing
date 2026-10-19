'use client';

import React, { useState, useRef } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Phone, User, MessageSquare, Plus, Minus, Check } from 'lucide-react';
import { InterestType } from '@/lib/types';
import { normalizeBelarusianPhone, formatBelarusianPhoneDisplay } from '@/lib/phone';
import { COFFEE_PRODUCTS, calculateOrderSummary } from '@/lib/products';

interface OrderFormProps {
  quantities: Record<string, number>;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onResetQuantities: () => void;
  interestType: InterestType;
  onInterestChange: (interest: InterestType) => void;
}

export function OrderForm({
  quantities,
  onIncrement,
  onDecrement,
  onResetQuantities,
  interestType,
  onInterestChange,
}: OrderFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+375 ');
  const [customComment, setCustomComment] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [agreedPrivacy, setAgreedPrivacy] = useState(true);

  // Form states
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Calculate order items and summary
  const orderCalc = calculateOrderSummary(quantities);

  // Compute comment value: user manual edits take precedence over generated summary
  const defaultComment = orderCalc.summaryText
    ? `Заказ: ${orderCalc.summaryText}`
    : interestType === 'subscription'
    ? 'Подписка на 2 пачки в месяц (54 BYN)'
    : '';

  const currentComment = customComment !== null ? customComment : defaultComment;

  // Read attribution dynamically at submit time without cascading renders
  const getAttribution = () => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = sessionStorage.getItem('kvarta_attribution');
      if (stored) return JSON.parse(stored);

      const searchParams = new URLSearchParams(window.location.search);
      const data = {
        utm_source: searchParams.get('utm_source') || undefined,
        utm_medium: searchParams.get('utm_medium') || undefined,
        utm_campaign: searchParams.get('utm_campaign') || undefined,
        utm_content: searchParams.get('utm_content') || undefined,
        utm_term: searchParams.get('utm_term') || undefined,
        gclid: searchParams.get('gclid') || undefined,
        yclid: searchParams.get('yclid') || undefined,
        fbclid: searchParams.get('fbclid') || undefined,
        landing_page_url: window.location.href,
        referrer_url: document.referrer || undefined,
      };
      sessionStorage.setItem('kvarta_attribution', JSON.stringify(data));
      return data;
    } catch {
      return {};
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    // Keep +375 prefix always present
    if (!raw.startsWith('+375')) {
      const digits = raw.replace(/\D/g, '');
      if (digits.startsWith('375')) {
        raw = '+' + digits;
      } else if (digits.startsWith('80')) {
        raw = '+375' + digits.slice(2);
      } else {
        raw = '+375' + digits;
      }
    }

    const digitsOnly = raw.replace(/\D/g, '');
    if (digitsOnly.length <= 3) {
      setPhone('+375 ');
    } else {
      setPhone(formatBelarusianPhoneDisplay(raw));
    }

    if (fieldErrors.phone) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.phone;
        return next;
      });
    }
  };

  const handlePhoneBlur = () => {
    if (!phone) return;
    const check = normalizeBelarusianPhone(phone);
    if (check.isValid && check.normalized) {
      setPhone(formatBelarusianPhoneDisplay(check.normalized));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === 'submitting') return;

    const errors: Record<string, string> = {};

    // 1. Client-side Name validation
    if (!name.trim()) {
      errors.name = 'Пожалуйста, укажите ваше имя';
    } else if (name.trim().length < 2) {
      errors.name = 'Имя должно содержать хотя бы 2 буквы';
    }

    // 2. Client-side Phone validation
    const phoneCheck = normalizeBelarusianPhone(phone);
    if (!phoneCheck.isValid) {
      errors.phone =
        phoneCheck.error || 'Введите белорусский номер, например +375 29 123-45-67';
    }

    // 3. Privacy policy agreement
    if (!agreedPrivacy) {
      errors.privacy = 'Необходимо подтвердить согласие на обработку персональных данных';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setStatus('submitting');
    setErrorMessage(null);

    const productContext =
      orderCalc.summaryText ||
      (interestType === 'subscription' ? 'Кофейная подписка (54 BYN)' : undefined);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phoneCheck.normalized,
          interest_type: interestType,
          comment: currentComment.trim() || undefined,
          product_context: productContext,
          website: honeypot || undefined, // bot trap
          ...getAttribution(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setErrorMessage(
          data.error ||
            'Не удалось отправить заявку. Пожалуйста, попробуйте еще раз через минуту.'
        );
        return;
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage(
        'Не удалось подключиться к серверу. Проверьте интернет-соединение и попробуйте еще раз через минуту.'
      );
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('+375 ');
    setCustomComment(null);
    setStatus('idle');
    setErrorMessage(null);
    setFieldErrors({});
    onResetQuantities();
  };

  return (
    <section id="order-form" className="py-16 md:py-24 bg-[#FBF9F5] relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-[#F4EFEA] rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E7DFD5] shadow-xl relative overflow-hidden">
          {/* Subtle craft corner highlight */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C45D3C]/10 rounded-bl-full pointer-events-none" />

          {status === 'success' ? (
            /* Success confirmation state */
            <div className="text-center py-8 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#354230] text-white flex items-center justify-center mx-auto mb-6 shadow-md">
                <CheckCircle2 className="w-9 h-9 text-[#85C470]" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE5DC] text-[#2C221E] text-xs font-semibold uppercase tracking-wider mb-3">
                <span>Заявка сохранена</span>
              </div>

              <h3 className="font-serif text-3xl font-bold text-[#1B1614] mb-4">
                Спасибо! Заявка принята.
              </h3>

              <p className="text-base text-[#5A5049] max-w-md mx-auto leading-relaxed mb-8">
                Менеджер мастерской свяжется с вами по указанному телефону, чтобы уточнить адрес,
                желаемый помол (в зернах или под конкретный способ заваривания) и время доставки.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-[#2C221E] hover:bg-[#C45D3C] text-white text-sm font-medium transition-all shadow active:scale-95 cursor-pointer"
              >
                Отправить ещё одну заявку
              </button>
            </div>
          ) : (
            /* Active Form */
            <div>
              <div className="text-center max-w-xl mx-auto mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE5DC] text-[#2C221E] text-xs font-semibold uppercase tracking-wider mb-3">
                  <Send className="w-3.5 h-3.5 text-[#C45D3C]" />
                  <span>Прямая связь с обжарщиком</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B1614] mb-3">
                  Оставить заявку на свежий кофе
                </h2>
                <p className="text-sm sm:text-base text-[#5A5049] leading-relaxed">
                  Заполните форму — мы свяжемся с вами по телефону, подтвердим наличие лота текущей
                  обжарки и согласуем доставку или самовывоз на ул. Короля, 9.
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-[#FEECEB] border border-[#F5C2C0] flex items-start gap-3 text-sm text-[#A82B27] animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#C45D3C]" />
                  <div className="leading-snug">{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Honeypot field for anti-spam bots */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {/* Field 1: Interest Type Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-2.5">
                    Что вас интересует?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => onInterestChange('order')}
                      className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        interestType === 'order'
                          ? 'bg-[#2C221E] text-white border-[#2C221E] shadow-sm'
                          : 'bg-[#FBF9F5] text-[#2C221E] border-[#DFD5C8] hover:border-[#C45D3C]'
                      }`}
                    >
                      <span>Разовый заказ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onInterestChange('subscription');
                        if ((quantities['subscription'] || 0) === 0) {
                          onIncrement('subscription');
                        }
                      }}
                      className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        interestType === 'subscription'
                          ? 'bg-[#C45D3C] text-white border-[#C45D3C] shadow-sm'
                          : 'bg-[#FBF9F5] text-[#2C221E] border-[#DFD5C8] hover:border-[#C45D3C]'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Подписка (54 BYN)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onInterestChange('question')}
                      className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        interestType === 'question'
                          ? 'bg-[#2C221E] text-white border-[#2C221E] shadow-sm'
                          : 'bg-[#FBF9F5] text-[#2C221E] border-[#DFD5C8] hover:border-[#C45D3C]'
                      }`}
                    >
                      <span>Задать вопрос</span>
                    </button>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* Visual mini-blocks for coffee selection with + and - quantity buttons */}
                {/* Placed between 'Что вас интересует' / 'Разовый заказ' and 'Ваше имя' */}
                {/* ========================================================================= */}
                <div className="pt-1 pb-1">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38]">
                      Выберите сорта и количество:
                    </label>
                    <span className="text-[11px] text-[#6C625A]">
                      Используйте кнопки <strong className="text-[#1B1614]">+</strong> и <strong className="text-[#1B1614]">−</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {COFFEE_PRODUCTS.map((prod) => {
                      const qty = quantities[prod.id] || 0;
                      const isSelected = qty > 0;

                      return (
                        <div
                          key={prod.id}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-[#FBF9F5] border-[#C45D3C] shadow-xs ring-1 ring-[#C45D3C]/30'
                              : 'bg-[#FBF9F5]/75 border-[#DFD5C8] hover:border-[#C45D3C]/60'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-[#1B1614] leading-snug">
                                {prod.name}
                              </span>
                              {prod.badge && (
                                <span className="text-[9px] uppercase font-bold text-[#C45D3C] bg-[#EDE5DC] px-1.5 py-0.5 rounded">
                                  {prod.badge}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-serif text-xs sm:text-sm font-bold text-[#C45D3C]">
                                {prod.price} BYN
                              </span>
                              <span className="text-[10px] uppercase font-medium text-[#6C625A] bg-[#EAE2D8] px-1.5 py-0.5 rounded">
                                {prod.packageSize}
                              </span>
                            </div>
                          </div>

                          {/* Visual Stepper: [-] [qty] [+] */}
                          <div className="flex items-center gap-1 shrink-0 bg-[#EDE5DC] p-1 rounded-lg">
                            <button
                              type="button"
                              onClick={() => onDecrement(prod.id)}
                              disabled={qty === 0}
                              aria-label={`Уменьшить количество ${prod.name}`}
                              className="w-7 h-7 rounded-md bg-white text-[#2C221E] hover:bg-[#F4EFEA] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-sm shadow-xs transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <span
                              className={`w-7 text-center font-bold text-xs sm:text-sm select-none ${
                                isSelected ? 'text-[#C45D3C]' : 'text-[#6C625A]'
                              }`}
                            >
                              {qty}
                            </span>

                            <button
                              type="button"
                              onClick={() => onIncrement(prod.id)}
                              aria-label={`Увеличить количество ${prod.name}`}
                              className="w-7 h-7 rounded-md bg-[#2C221E] text-white hover:bg-[#C45D3C] flex items-center justify-center font-bold text-sm shadow-xs transition-colors cursor-pointer active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order summary bar when at least 1 item is selected */}
                  {orderCalc.totalCount > 0 && (
                    <div className="mt-3 p-3.5 rounded-xl bg-[#EDE5DC]/90 border border-[#DFD5C8] flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2 text-xs text-[#2C221E]">
                        <span className="text-[#6C625A]">В заказе:</span>
                        <span className="font-bold text-[#1B1614]">
                          {orderCalc.totalCount} {orderCalc.totalCount === 1 ? 'пачка' : orderCalc.totalCount < 5 ? 'пачки' : 'пачек'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-[#6C625A] block leading-none">Сумма:</span>
                          <span className="font-serif text-lg font-bold text-[#1B1614] leading-tight">
                            {orderCalc.totalPrice} BYN
                          </span>
                        </div>

                        {orderCalc.isFreeDelivery ? (
                          <span className="text-[11px] font-semibold text-[#2E5E26] bg-[#E2F0DC] border border-[#C5E4B9] px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-[#2E5E26]" />
                            Бесплатная доставка
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#6C625A] bg-[#DFD5C8]/70 px-2 py-0.5 rounded">
                            до бесплатной доставки {50 - orderCalc.totalPrice} BYN
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Field 2 & 3: Name & Phone in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="customer-name"
                      className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-1.5"
                    >
                      Ваше имя <span className="text-[#C45D3C]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7E75]">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="customer-name"
                        ref={nameInputRef}
                        type="text"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (fieldErrors.name) {
                            setFieldErrors((prev) => {
                              const next = { ...prev };
                              delete next.name;
                              return next;
                            });
                          }
                        }}
                        placeholder="Например, Анна"
                        className={`w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#FBF9F5] border text-sm text-[#1B1614] placeholder-[#A89E94] focus:outline-none transition-colors ${
                          fieldErrors.name
                            ? 'border-[#D94F4F] focus:border-[#D94F4F] bg-[#FFF8F7]'
                            : 'border-[#DFD5C8] focus:border-[#C45D3C]'
                        }`}
                      />
                    </div>
                    {fieldErrors.name && (
                      <p className="mt-1.5 text-xs text-[#D94F4F] font-medium">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone Input with Belarusian hint */}
                  <div>
                    <label
                      htmlFor="customer-phone"
                      className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-1.5"
                    >
                      Телефон в Беларуси <span className="text-[#C45D3C]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7E75]">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="customer-phone"
                        type="tel"
                        inputMode="tel"
                        required
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={handlePhoneBlur}
                        placeholder="+375 (29) 123-45-67"
                        className={`w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#FBF9F5] border text-sm text-[#1B1614] placeholder-[#A89E94] focus:outline-none transition-colors ${
                          fieldErrors.phone
                            ? 'border-[#D94F4F] focus:border-[#D94F4F] bg-[#FFF8F7]'
                            : 'border-[#DFD5C8] focus:border-[#C45D3C]'
                        }`}
                      />
                    </div>
                    {fieldErrors.phone ? (
                      <p className="mt-1.5 text-xs text-[#D94F4F] font-medium">
                        {fieldErrors.phone}
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] text-[#6C625A]">
                        Формат: +375 XX XXX-XX-XX или 8 (0XX) XXX-XX-XX
                      </p>
                    )}
                  </div>
                </div>

                {/* Field 4: Optional Comment */}
                <div>
                  <label
                    htmlFor="customer-comment"
                    className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-1.5"
                  >
                    Пожелания к заказу <span className="text-[11px] font-normal lowercase text-[#8A7E75]">(необязательно)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-3.5 pointer-events-none text-[#8A7E75]">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <textarea
                      id="customer-comment"
                      rows={3}
                      value={currentComment}
                      onChange={(e) => setCustomComment(e.target.value)}
                      placeholder="Нужен помол для турки/фильтра или в зерне, удобное время для звонка..."
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#FBF9F5] border border-[#DFD5C8] text-sm text-[#1B1614] placeholder-[#A89E94] focus:outline-none focus:border-[#C45D3C] transition-colors"
                    />
                  </div>
                </div>

                {/* Field 5: Privacy policy agreement checkbox */}
                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedPrivacy}
                      onChange={(e) => {
                        setAgreedPrivacy(e.target.checked);
                        if (fieldErrors.privacy) {
                          setFieldErrors((prev) => {
                            const next = { ...prev };
                            delete next.privacy;
                            return next;
                          });
                        }
                      }}
                      className="mt-1 w-4 h-4 rounded text-[#C45D3C] focus:ring-[#C45D3C] border-[#DFD5C8] cursor-pointer"
                    />
                    <span className="text-xs text-[#5A5049] leading-snug">
                      Я согласен на обработку персональных данных в соответствии с{' '}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[#2C221E] hover:text-[#C45D3C]"
                      >
                        Политикой конфиденциальности
                      </a>
                    </span>
                  </label>
                  {fieldErrors.privacy && (
                    <p className="mt-1 text-xs text-[#D94F4F] font-medium">
                      {fieldErrors.privacy}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 px-6 rounded-xl bg-[#2C221E] hover:bg-[#C45D3C] text-white font-semibold text-base transition-all shadow-md active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Отправляем заявку...</span>
                    </>
                  ) : (
                    <>
                      <span>Отправить заявку</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-[#6C625A]">
                  Оплата при получении после подтверждения заказа. Без онлайн-эквайринга и предоплат.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
