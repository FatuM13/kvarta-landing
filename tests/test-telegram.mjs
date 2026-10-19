async function testTelegram() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  console.log('Testing Telegram Bot API...');
  console.log('Bot Token present:', !!token);
  console.log('Target Chat ID:', chatId);

  // 1. Check getMe
  const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
  const meJson = await meRes.json();
  console.log('getMe response:', JSON.stringify(meJson, null, 2));

  if (!meJson.ok) {
    console.error('Bot token is invalid!');
    return;
  }

  console.log(`Bot username: @${meJson.result.username}`);

  // 2. Try sendMessage
  console.log('\nTrying to send test message to chat_id:', chatId);
  const sendRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: '☕ *Тестовое сообщение от «Кварта»*\n\nБот успешно подключен к сайту обжарочной мастерской! Уведомления о новых заявках будут поступать сюда.',
      parse_mode: 'Markdown',
    }),
  });

  const sendJson = await sendRes.json();
  console.log('sendMessage response:', JSON.stringify(sendJson, null, 2));

  // 3. If send failed, inspect getUpdates to see recent incoming messages/chats
  if (!sendJson.ok) {
    console.log('\nInspecting getUpdates to discover your actual chat_id...');
    const updatesRes = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const updatesJson = await updatesRes.json();
    console.log('getUpdates response:', JSON.stringify(updatesJson, null, 2));
  }
}

testTelegram().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
