import { LeadRecord } from './types';

/**
 * Sends a notification to a Telegram chat via Bot API.
 * Failure here is caught and logged safely; it NEVER throws or cancels the lead creation.
 */
export async function sendTelegramNotification(lead: LeadRecord): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // Telegram is optional and not configured
    return false;
  }

  const interestLabel =
    lead.interest_type === 'subscription'
      ? '📦 Подписка на кофе'
      : lead.interest_type === 'question'
      ? '❓ Вопрос / Консультация'
      : '☕ Разовый заказ';

  const parts = [
    `☕ *Новая заявка в «Кварта»*`,
    ``,
    `👤 *Имя:* ${escapeTelegramMarkdown(lead.name)}`,
    `📞 *Телефон:* \`${lead.phone_normalized}\``,
    `🎯 *Интерес:* ${interestLabel}`,
  ];

  if (lead.product_context) {
    parts.push(`🏷 *Товар:* ${escapeTelegramMarkdown(lead.product_context)}`);
  }

  if (lead.comment) {
    parts.push(`💬 *Комментарий:* ${escapeTelegramMarkdown(lead.comment)}`);
  }

  const utmParts = [];
  if (lead.utm_source) utmParts.push(`source: ${lead.utm_source}`);
  if (lead.utm_medium) utmParts.push(`medium: ${lead.utm_medium}`);
  if (lead.utm_campaign) utmParts.push(`campaign: ${lead.utm_campaign}`);

  if (utmParts.length > 0) {
    parts.push(``, `📊 *Рекламный источник:* ${escapeTelegramMarkdown(utmParts.join(' | '))}`);
  }

  parts.push(``, `🆔 Заявка #${lead.id.slice(0, 8)}`);

  const text = parts.join('\n');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn('Telegram API response not OK:', response.status);
      return false;
    }

    return true;
  } catch (err) {
    // Only log error message, do NOT log secret token or leak sensitive data
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.warn('Failed to send Telegram notification (lead saved successfully):', message);
    return false;
  }
}

function escapeTelegramMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
}
