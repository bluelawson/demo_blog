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
                className="bg-orange-300 px-3 mx-3 py-3 rounded-md"
              >
                ログイン
              </Link>
              <Link
                href="/signUp"
                className="bg-orange-300 px-3 mx-3 py-3 rounded-md"
              >
                新規登録
              </Link>
            </>
          ) : null}
          {user ? (
            <>
              <Link
                href="/myPage"
                className="bg-orange-300 px-3 mx-3 py-3 rounded-md"
              >
                マイページ
              </Link>
              <button
                onClick={handleLogout}
                className="bg-orange-300 px-3 mx-3 py-3 rounded-md"
              >
                ログアウト
              </button>
              <Link
                href="/articles/new"
                className="bg-orange-300 px-3 mx-3 py-3 rounded-md"
              >
                記事を書く
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Header;
