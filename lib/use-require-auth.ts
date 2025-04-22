import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useRequireAuth = () => {
  const router = useRouter();
  const isAuthenticated = false; // 仮の認証状態（実際にはトークンなどで判定）

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
};

export default useRequireAuth;
