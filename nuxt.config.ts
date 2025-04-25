import { defineNuxtConfig } from 'nuxt/config';
import { resolve } from 'path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // サーバーサイドレンダリングを無効にする
  modules: [
    ['@pinia/nuxt', {
      autoImports: [
        // 自動インポートする Pinia 関数を定義 (必要に応じて)
        'defineStore',
        'storeToRefs',
      ],
    }],
  ],
  runtimeConfig: {
    // サーバーのみで使用する環境変数（クライアントからは見えない）
    sendgridApiKey: process.env.SENDGRID_API_KEY,
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'), // src ディレクトリへのエイリアス
        '~': resolve(__dirname, '.'), // プロジェクトルートへのエイリアス
        '~~': resolve(__dirname, '.'), // プロジェクトルートへのエイリアス
        '@assets': resolve(__dirname, 'src/assets'), // assets ディレクトリへのエイリアス
      },
    },
  },
  css: [
    '@assets/css/main.css',
    '@assets/css/variables.css',
    '@assets/css/tailwind.css',
    '@assets/css/print.css',
  ],
});
