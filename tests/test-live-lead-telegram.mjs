async function testLiveLead() {
  const leadData = {
    name: 'Иван Сергеевич',
    phone: '+375 (29) 777-55-44',
    interest_type: 'order',
    comment: 'Помол под воронку (V60), удобнее доставка курьером после 18:00',
    product_context: 'Эфиопия Иргачефф (2 шт), Бразилия Серрадо (1 шт)',
    utm_source: 'yandex_direct',
    utm_medium: 'cpc',
    utm_campaign: 'fresh_coffee_minsk',
    landing_page_url: 'http://localhost:3000',
    referrer_url: 'https://yandex.by',
  };

  console.log('Отправка заявки на http://localhost:3000/api/lead...');
  const res = await fetch('http://localhost:3000/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData),
  });

  const resJson = await res.json();
  console.log('Статус ответа:', res.status);
  console.log('Тело ответа:', JSON.stringify(resJson, null, 2));

  if (!resJson.success) {
    throw new Error('Заявка не была принята: ' + JSON.stringify(resJson));
  }

  console.log('\n✓ Заявка успешно принята сервером!');
  console.log('Уведомление в Telegram отправлено асинхронно.');
}

testLiveLead().catch(console.error);
