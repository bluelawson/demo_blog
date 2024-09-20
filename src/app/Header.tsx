'use client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { NavButton } from '@/components/form';
import { API_URL } from '@/utils/constants';

import Loading from '../components/Loading';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      await getUserData();
      setLoading(false);
    };
    fetchData();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/blog/auth`, {
      method: 'DELETE',
    });
    const result = await getUserData();
    if (!result) {
      router.push('/auth/logout');
    }
  };

  const getUserData = async () => {
    const response = await fetch(`${API_URL}/api/blog/user`, {
      method: 'GET',
    });
    const fetchedData = await response.json();
    if (response.ok) {
      setUser(fetchedData);
      return fetchedData;
    } else {
      setUser(null);
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
          {!user ? (
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
          ) : null}
          {user ? (
            <>
              <span className="px-3 py-3 text-xs rounded-md bg-white-300">
                {user
                  ? `こんにちは、${user?.user_metadata.user_name} さん`
                  : null}
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
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Header;
