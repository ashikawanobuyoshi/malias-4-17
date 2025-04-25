// server/api/send-email.ts

import sgMail from '@sendgrid/mail';
import { readBody } from 'h3';
import { defineEventHandler } from '#imports'; // Nuxt 3 でおすすめのインポート方法

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(); // ← これインポート不要です
  const body = await readBody(event);

  sgMail.setApiKey(config.sendgridApiKey);

  const msg = {
    to: body.to,
    from: 'your-email@example.com',
    subject: 'お問い合わせありがとうございます',
    text: body.message,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
});
