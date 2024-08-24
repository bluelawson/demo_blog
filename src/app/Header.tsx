"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabaseClient";
import { usePathname, useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUserData();
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
        <nav className="text-sm font-medium">
          <Link href="/" className="bg-white-300 px-3 py-3 rounded-md">
            {user ? `こんにちは、${user?.user_metadata.user_name} さん` : null}
          </Link>
          {!user ? (
            <>
              <Link
                href="/login"
                className="bg-orange-400 font-bold px-3 mx-3 py-3 rounded-lg"
              >
                <span className="i-tabler-key mr-3 relative top-[1px] scale-150"></span>
                ログイン
              </Link>
              <Link
                href="/signUp"
                className="bg-orange-400 font-bold px-3 mx-3 py-3 rounded-lg"
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
                className="bg-orange-400 font-bold px-3 mx-3 py-3 rounded-lg"
              >
                <span className="i-tabler-settings mr-3 relative top-[1px] scale-150"></span>
                アカウント設定
              </Link>
              <button
                onClick={handleLogout}
                className="bg-orange-400 font-bold px-3 mx-3 py-3 rounded-lg"
              >
                <span className="i-tabler-lock mr-3 relative top-[1px] scale-150"></span>
                ログアウト
              </button>
              <Link
                href="/articles/new"
                className="bg-orange-400 font-bold px-3 mx-3 py-3 rounded-lg"
              >
                <span className="i-tabler-edit mr-3 relative top-[1px] scale-150"></span>
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
