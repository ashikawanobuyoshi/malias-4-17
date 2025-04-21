import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    async login(email, password) {
      // ログイン処理（API呼び出しなど）を実装
      // 例：
      // const response = await api.post('/login', { email, password });
      // if (response.data.success) {
      //   this.isAuthenticated = true;
      //   this.user = response.data.user;
      //   localStorage.setItem('token', response.data.token);
      // } else {
      //   throw new Error('ログインに失敗しました');
      // }
      // 上記はあくまで例です。実際の実装に合わせて変更してください。
      this.isAuthenticated = true; // 仮のログイン
      this.user = { name: 'Test User' }; // 仮のユーザー情報
      localStorage.setItem('token', 'test_token'); // 仮のトークン
    },
    async logout() {
      // ログアウト処理（API呼び出し、localStorageの削除など）を実装
      this.isAuthenticated = false;
      this.user = null;
      localStorage.removeItem('token');
    },
    checkAuth() {
      // localStorageにトークンが存在するか確認し、認証状態を復元
      const token = localStorage.getItem('token');
      if (token) {
        this.isAuthenticated = true;
        // 必要に応じてユーザー情報をAPIから取得
        // 例：
        // const response = await api.get('/user', { headers: { Authorization: `Bearer ${token}` } });
        // this.user = response.data.user;
        this.user = { name: 'Test User' }; // 仮のユーザー情報
      }
    },
  },
});