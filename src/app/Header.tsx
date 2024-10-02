'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { NavButton } from '@/components/form';
import Loading from '@/components/Loading';
import { useMessage } from '@/context/MessageContext';
import { User } from '@/types';
import { API_URL } from '@/utils/constants';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { showErrorMessage, showSnackbarMessage } = useMessage();

  // 開発環境で、npm run dev直後useEffectが発火しない事象があるが、そのままリロードすれば治る。
  // 本番環境では正常に動作するためこのままとする
  useEffect(() => {
    const fetchData = async () => {
      await getUserData();
    };
    fetchData();
  }, [pathname]);

  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/blog/user`, {
        method: 'GET',
      });
      if (!response.ok) {
        setUser(null);
        return null;
      }
      const fetchedData = await response.json();
      setUser(fetchedData);
      return fetchedData;
    } catch (error) {
      console.error(error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/blog/auth`, {
        method: 'DELETE',
      });
      const response = await getUserData();
      if (!response) {
        router.push('/auth/logout');
      }
    } catch (error) {
      console.error(error);
      showErrorMessage('ログアウトに失敗しました');
      return;
    }
  };

  return (
    <header className="flex items-center justify-between px-10 py-5 border-b">
      <h1 className="text-2xl font-extrabold">
        <Link href="/">Demo Blog</Link>
      </h1>
      <div>
        {loading && <Loading header />}
        <nav className="text-sm" hidden={loading}>
          {user ? (
            <>
              <span className="px-3 py-3 text-xs rounded-md bg-white-300">
                {user ? `こんにちは、${user?.name} さん` : null}
              </span>
              <NavButton
                href="/dashboard/articles"
                iconClass="i-tabler-user-circle"
                text={'ダッシュボード'}
              />
              <NavButton
                onClick={handleLogout}
                iconClass="i-tabler-lock"
                text={'ログアウト'}
              />
            </>
          ) : (
            <>
              <NavButton
                href="/auth/login"
                iconClass="i-tabler-key"
                text={'ログイン'}
              />
              <NavButton
                href="/auth/signUp"
                iconClass="i-tabler-user-plus"
                text={'新規登録'}
              />
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
