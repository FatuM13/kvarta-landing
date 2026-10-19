import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Политика обработки персональных данных — Мастерская кофе «Кварта»',
  description: 'Политика обработки персональных данных посетителей мастерской «Кварта» в Минске.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1614] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6C625A] hover:text-[#C45D3C] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться на главную</span>
        </Link>

        <div className="bg-[#F4EFEA] rounded-2xl p-6 sm:p-10 border border-[#E7DFD5] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#2C221E] text-white flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#C45D3C]" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B1614]">
                Политика обработки персональных данных
              </h1>
              <p className="text-xs text-[#6C625A]">
                Мастерская по обжарке кофе «Кварта» · Минск
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#EDE5DC] border border-[#DFD5C8] text-xs text-[#5A5049] mb-8 leading-relaxed">
            <strong>Обратите внимание владельца бизнеса:</strong> данный текст является типовым шаблоном
            для веб-сайта мастерской. Перед запуском коммерческой деятельности необходимо заполнить
            официальные юридические реквизиты (наименование ИП / юрлица, УНП, адрес регистрации) и
            согласовать финальный текст с юристом в соответствии с Законом Республики Беларусь от 7 мая 2021 г.
            № 99-З «О защите персональных данных».
          </div>

          <div className="space-y-6 text-sm text-[#4A3E38] leading-relaxed">
            <section>
              <h2 className="font-serif text-lg font-bold text-[#1B1614] mb-2">
                1. Общие положения
              </h2>
              <p>
                Настоящая Политика определяет порядок обработки и защиты персональных данных,
                предоставляемых пользователями при заполнении форм на сайте мастерской по обжарке
                кофе «Кварта» (далее — «Оператор»).
              </p>
              <p className="mt-2 text-xs text-[#6C625A] italic">
                [Место для указания официального наименования оператора: ИП / ООО «...», УНП: ...]
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg font-bold text-[#1B1614] mb-2">
                2. Какие данные мы собираем
              </h2>
              <p>
                При отправке заявки на сайте мы обрабатываем только те данные, которые необходимы для связи
                с клиентом и исполнения заказа:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Имя клиента;</li>
                <li>Контактный номер телефона (в формате Республики Беларусь);</li>
                <li>Комментарий и пожелания к заказу (помол, сорт, предпочтения);</li>
                <li>Технические параметры рекламного перехода (UTM-метки, источник перехода, дата и время заявки).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-lg font-bold text-[#1B1614] mb-2">
                3. Цели обработки персональных данных
              </h2>
              <p>Данные используются исключительно в следующих целях:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Телефонный звонок менеджера для подтверждения заявки и согласования деталей заказа/подписки;</li>
                <li>Организация курьерской доставки по Минску или подготовка самовывоза на ул. Короля, 9;</li>
                <li>Оценка эффективности рекламных каналов мастерской.</li>
              </ul>
              <p className="mt-2">
                Мы не передаем ваши данные третьим лицам для спама, перепродажи баз или рекламных рассылок без вашего явного согласия.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg font-bold text-[#1B1614] mb-2">
                4. Безопасность и хранение данных
              </h2>
              <p>
                Оператор принимает необходимые организационные и технические меры для защиты персональных
                данных от неправомерного доступа, утраты или разглашения. Данные передаются по защищенному протоколу HTTPS
                и сохраняются в защищенной базе данных.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg font-bold text-[#1B1614] mb-2">
                5. Контакты и отзыв согласия
              </h2>
              <p>
                Пользователь вправе в любой момент отозвать свое согласие на обработку персональных данных,
                обратившись к нам в мастерскую по адресу: г. Минск, ул. Короля, 9 в рабочие часы
                (Пн–Пт 8:00–20:00, Сб–Вс 10:00–18:00).
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
