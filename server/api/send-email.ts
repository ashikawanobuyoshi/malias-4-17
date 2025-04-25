// server/api/send-email.ts
import sgMail from '@sendgrid/mail';
import { defineEventHandler, readBody } from 'h3'; // Nuxt3/ViteExpress想定

// 環境変数をセット（dotenvは別途使用）
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export default defineEventHandler(async (event) => {
  try {
    const order = await readBody(event);

    const msg = {
      to: 'customer@example.com', // ← ここを顧客のメールアドレスに動的に変えてもOK
      from: 'youremail@yourdomain.com', // ← SendGridで認証済みの送信元アドレス
      subject: '【注文確認】ご注文ありがとうございます',
      text: `以下の内容で注文を受け付けました：\n\n${JSON.stringify(order, null, 2)}`,
      html: `
        <h2>ご注文ありがとうございます</h2>
        <p>以下の内容で注文を受け付けました。</p>
        <pre style="font-size: 14px; background-color: #f4f4f4; padding: 1em;">
${JSON.stringify(order, null, 2)}
        </pre>
      `,
    };

    await sgMail.send(msg);

    return { success: true, message: 'Email sent' };
  } catch (error: any) {
    console.error('SendGrid Error:', error);
    return {
      success: false,
      error: error?.response?.body || error.message || '送信失敗',
    };
  }
});
