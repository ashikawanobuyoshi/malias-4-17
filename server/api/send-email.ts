import sgMail from '@sendgrid/mail';
import { defineEventHandler, readBody, createError } from 'h3';
import { useRuntimeConfig } from '#imports';

interface RequestBody {
  customerName: string;
  address: string;
  comment: string;
  items: any[];
  total: number;
}

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Only POST requests allowed',
    });
  }

  const config = useRuntimeConfig();
  const sendgridApiKey = config.sendgridApiKey;

  if (!sendgridApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'SendGrid API key is not configured',
    });
  }

  sgMail.setApiKey(sendgridApiKey);

  try {
    const body = await readBody<RequestBody>(event);
    const { customerName, address, comment, items, total } = body;

    const msg = {
      to: 'info@syashin8.com',
      from: 'test@example.com',
      subject: 'ご注文ありがとうございます',
      text: `ご注文者: ${customerName}\nメール: ${address}\n備考: ${comment}\n合計金額: ${total}\n注文内容:\n${JSON.stringify(items, null, 2)}`,
      html: `<h2>ご注文者: ${customerName}</h2><p>メール: ${address}</p><p>備考: ${comment}</p><p>合計金額: ${total}円</p><pre>${JSON.stringify(items, null, 2)}</pre>`,
    };

    await sgMail.send(msg);

    return { message: 'Email sent successfully' };
  } catch (error: any) {
    console.error('SendGrid Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send email',
    });
  }
});
