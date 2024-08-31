"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabaseClient";
import { usePathname, useRouter } from "next/navigation";
import HeaderLoading from "./headerLoading";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getUserData();
    setLoading(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    const result = await getUserData();
    if (!result) {
      router.push("/logout");
    }
  };

  const getUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
    return user;
  };

  return (
    <header className="py-5 px-10 border-b flex justify-between items-center">
      <h1 className="text-2xl font-extrabold">
        <Link href="/">Demo Blog</Link>
      </h1>
      <div>
        {loading && <HeaderLoading />}
        <nav className="text-sm" hidden={loading}>
          <Link href="/" className="text-xs bg-white-300 px-3 py-3 rounded-md">
            {user ? `こんにちは、${user?.user_metadata.user_name} さん` : null}
          </Link>
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-xs px-2 mx-1 py-2 rounded-lg hover:bg-sky-700"
              >
                <span className="i-tabler-key mr-3 relative top-[1px] scale-150"></span>
                ログイン
              </Link>
              <Link
                href="/signUp"
                className="text-xs px-2 mx-1 py-2 rounded-lg hover:bg-sky-700"
              >
                <span className="i-tabler-user-plus mr-3 relative top-[1px] scale-150"></span>
                新規登録
              </Link>
            </>
          ) : null}
          {user ? (
            <>
              <Link
                href="/myPage"
                className="text-xs px-2 mx-1 py-2 rounded-lg hover:bg-sky-700"
              >
                <span className="i-tabler-settings mr-2 relative top-[1px] scale-150"></span>
                アカウント設定
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs px-2 mx-1 py-2 rounded-lg hover:bg-sky-700"
              >
                <span className="i-tabler-lock mr-2 relative top-[1px] scale-150"></span>
                ログアウト
              </button>
              <Link
                href="/management/articles"
                className="bg-sky-500 font-bold px-3 mx-3 py-2 rounded-lg"
              >
                <span className="i-tabler-file-description mr-2 relative top-[1px] scale-150"></span>
                記事管理
              </Link>
              <Link
                href="/management/articles/new"
                className="bg-sky-500 font-bold px-3 mx-3 py-2 rounded-lg"
              >
                <span className="i-tabler-edit mr-2 relative top-[1px] scale-150"></span>
                記事投稿
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Header;
