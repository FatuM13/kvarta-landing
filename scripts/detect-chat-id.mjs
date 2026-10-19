import fs from 'fs';
import path from 'path';

async function main() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local not found');
    process.exit(1);
  }

  let envContent = fs.readFileSync(envPath, 'utf-8');
  const tokenMatch = envContent.match(/TELEGRAM_BOT_TOKEN=([^\r\n]+)/);
  if (!tokenMatch) {
    console.error('TELEGRAM_BOT_TOKEN not found in .env.local');
    process.exit(1);
  }
  const token = tokenMatch[1].trim();

  console.log('1. Checking bot status...');
  const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
  const me = await meRes.json();
  if (!me.ok) {
    console.error('Invalid token:', me);
    process.exit(1);
  }

  const botUsername = me.result.username;
  console.log(`Bot: @${botUsername} (${me.result.first_name})`);
  console.log(`\n>>> Пожалуйста, откройте Telegram и отправьте сообщение /start боту: https://t.me/${botUsername} <<<`);
  console.log('Ожидание сообщения от вас (до 45 секунд)...');

  const startTime = Date.now();
  let foundChat = null;

  while (Date.now() - startTime < 45000) {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?timeout=5`);
    const data = await res.json();
    if (data.ok && data.result.length > 0) {
      const lastUpdate = data.result[data.result.length - 1];
      const msg = lastUpdate.message || lastUpdate.channel_post || lastUpdate.my_chat_member;
      if (msg && msg.chat) {
        foundChat = msg.chat;
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 2000));
    process.stdout.write('.');
  }

  if (!foundChat) {
    console.log('\nСообщений пока не поступило. Пожалуйста, отправьте любое сообщение боту в Telegram и повторите запуск.');
    process.exit(1);
  }

  console.log(`\n\n✓ Найдено входящее сообщение!`);
  console.log(`Чат ID: ${foundChat.id}`);
  console.log(`От: ${foundChat.first_name || ''} ${foundChat.last_name || ''} (@${foundChat.username || 'без username'})`);

  // Update .env.local
  if (envContent.includes('TELEGRAM_CHAT_ID=')) {
    envContent = envContent.replace(/TELEGRAM_CHAT_ID=[^\r\n]*/, `TELEGRAM_CHAT_ID=${foundChat.id}`);
  } else {
    envContent += `\nTELEGRAM_CHAT_ID=${foundChat.id}\n`;
  }
  fs.writeFileSync(envPath, envContent, 'utf-8');
  console.log(`✓ Файл .env.local автоматически обновлен: TELEGRAM_CHAT_ID=${foundChat.id}`);

  // Send greeting test message
  console.log('\n2. Отправка тестового уведомления в Telegram...');
  const sendRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: foundChat.id,
      text: '☕ *Мастерская «Кварта»*\n\nСвязь с Telegram-ботом успешно настроена! Теперь все заявки с сайта будут приходить в этот диалог в реальном времени.',
      parse_mode: 'Markdown',
    }),
  });

  const sendData = await sendRes.json();
  if (sendData.ok) {
    console.log('✓ Тестовое сообщение успешно доставлено в Telegram!');
  } else {
    console.error('Ошибка отправки:', sendData);
  }
}

main().catch(console.error);
