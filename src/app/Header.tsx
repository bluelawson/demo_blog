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
      router.push("/auth/logout");
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
    <header className="flex items-center justify-between px-10 py-5 border-b">
      <h1 className="text-2xl font-extrabold">
        <Link href="/">Demo Blog</Link>
      </h1>
      <div>
        {loading && <HeaderLoading />}
        <nav className="text-sm" hidden={loading}>
          {!user ? (
            <>
              <Link
                href="/auth/login"
                className="px-2 py-2 mx-1 text-xs rounded-lg hover:bg-sky-700"
              >
                <span className="i-tabler-key mr-3 relative top-[1px] scale-150"></span>
                ログイン
              </Link>
              <Link
                href="/auth/signUp"
                className="px-2 py-2 mx-1 text-xs rounded-lg hover:bg-sky-700"
              >
                <span className="i-tabler-user-plus mr-3 relative top-[1px] scale-150"></span>
                新規登録
              </Link>
            </>
          ) : null}
          {user ? (
            <>
              <span className="px-3 py-3 text-xs rounded-md bg-white-300">
                {user
                  ? `こんにちは、${user?.user_metadata.user_name} さん`
                  : null}
              </span>
              <Link
                href="/dashboard/articles"
                className="px-2 py-2 mx-1 text-xs rounded-lg hover:bg-sky-700"
              >
                <span className="i-tabler-user-circle mr-2 relative top-[1px] scale-150"></span>
                ダッシュボード
              </Link>
              <button
                onClick={handleLogout}
                className="px-2 py-2 mx-1 text-xs rounded-lg hover:bg-sky-700"
              >
                <span className="i-tabler-lock mr-2 relative top-[1px] scale-150"></span>
                ログアウト
              </button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Header;
