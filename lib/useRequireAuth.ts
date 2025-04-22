// lib/useRequireAuth.ts
const useRequireAuth = () => {
  // 仮の処理：常に認証済みとする
  return { user: { email: 'test@example.com' }, isLoading: false };
};

export default useRequireAuth;
