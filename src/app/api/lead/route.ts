import { NextRequest, NextResponse } from 'next/server';
import { validateLeadInput } from '@/lib/validation';
import { saveLead } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    // 1. Content-Type check
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Ожидается JSON в заголовке Content-Type' },
        { status: 400 }
      );
    }

    // 2. Body size check (reject abnormally large payloads > 32KB)
    const rawBody = await req.text();
    if (rawBody.length > 32768) {
      return NextResponse.json(
        { success: false, error: 'Слишком большой объем данных' },
        { status: 413 }
      );
    }

    let jsonBody: unknown;
    try {
      jsonBody = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Некорректный JSON в теле запроса' },
        { status: 400 }
      );
    }

    // 3. Honeypot anti-spam check (if client sends hidden website/bot field)
    if (typeof jsonBody === 'object' && jsonBody !== null && 'website' in jsonBody) {
      const honeypot = (jsonBody as { website?: string }).website;
      if (honeypot && typeof honeypot === 'string' && honeypot.trim().length > 0) {
        // Silently accept bot submission without saving to avoid training bot
        return NextResponse.json(
          { success: true, message: 'Заявка принята' },
          { status: 200 }
        );
      }
    }

    // 4. Validate and sanitize input
    const validation = validateLeadInput(jsonBody);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: Object.values(validation.errors)[0] || 'Ошибка валидации данных',
          errors: validation.errors,
          code: 'INVALID_INPUT',
        },
        { status: 422 }
      );
    }

    // 5. Save to database with 10-minute duplicate prevention
    const saveResult = await saveLead(validation.data);

    if (!saveResult.success) {
      if (saveResult.code === 'DUPLICATE_RECENT') {
        return NextResponse.json(
          {
            success: false,
            error: saveResult.error,
            code: 'DUPLICATE_RECENT',
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: saveResult.error || 'Ошибка при сохранении заявки',
          code: 'DATABASE_ERROR',
        },
        { status: 500 }
      );
    }

    // 6. Telegram notification (awaited to prevent early termination in Vercel serverless)
    if (saveResult.lead) {
      await sendTelegramNotification(saveResult.lead);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Спасибо! Ваша заявка принята. Менеджер свяжется с вами по телефону.',
        leadId: saveResult.lead?.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unhandled API error in /api/lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Произошла непредвиденная ошибка на сервере. Попробуйте еще раз через минуту.',
      },
      { status: 500 }
    );
  }
}
