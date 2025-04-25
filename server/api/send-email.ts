// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from '@sendgrid/mail';
import { defineEventHandler, readBody, createError } from 'h3';
import { useRuntimeConfig } from '#imports';

interface RequestBody {
  customerName: string;
  address: string;
  comment: string;
  items: { name: string; quantity: number; price: number }[];
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

    const itemListHtml = items.map(item =>
      `<li>${item.name} × ${item.quantity}：${item.price * item.quantity}円</li>`
    ).join('');

    const itemListText = items.map(item =>
      `- ${item.name} × ${item.quantity}：${item.price * item.quantity}円`
    ).join('\n');

    const msg = {
      to: 'info@syashin8.com',
      from: 'info@syashin8.com', // SendGridで認証済みのメールに変更してください
      subject: 'ご注文ありがとうございます',
      text: `ご注文者: ${customerName}\nメール: ${address}\n備考: ${comment}\n合計金額: ${total}円\n注文内容:\n${itemListText}`,
      html: `
        <h2>ご注文ありがとうございます</h2>
        <p><strong>ご注文者:</strong> ${customerName}</p>
        <p><strong>メール:</strong> ${address}</p>
        <p><strong>備考:</strong> ${comment}</p>
        <p><strong>合計金額:</strong> ${total}円</p>
        <h3>注文内容:</h3>
        <ul>${itemListHtml}</ul>
      `,
    };

    await sgMail.send(msg);

    return { message: 'Email sent successfully' };
  } catch (error: any) {
    console.error('SendGrid Error:', error);
    if (error.response?.body?.errors) {
      console.error('Details:', error.response.body.errors);
    } else {
      console.error('Error object:', error); // エラーオブジェクト全体をログに出力
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send email',
    });
  }
});
