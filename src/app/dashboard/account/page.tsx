"use client";
import React, { useEffect, useState } from "react";
import { supabase, adminSupabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

const Account = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    getUserData();
  }, []);

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { error } = await adminSupabase.auth.admin.deleteUser(user?.id);
      if (!error) {
        router.push("/");
      } else {
        console.log(error);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({
      email: email,
    });
    if (error) {
      console.error("Error updating account:", error.message);
    } else {
      router.push("/dashboard/account");
    }
  };

  const getUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email ?? "");
    } else {
      setEmail("");
    }
    return user;
  };

  return (
    <>
      <div className="w-3/4 px-4 py-8">
        <form className="" onSubmit={handleUpdate}>
          <div className="my-5 ">
            <label htmlFor="email" className="w-1/6 px-3 py-2 bg-slate-600">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              className="w-4/6 px-2 py-1 mx-4 border rounded border-slate-400 bg-slate-700"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="my-5 ">
            <label htmlFor="password" className="w-10 px-3 py-2 bg-slate-600">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              className="w-4/6 px-2 py-1 mx-4 border rounded border-slate-400 bg-slate-700 disabled:bg-slate-500"
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled
            />
          </div>
          <div className="flex items-center justify-center pt-4 mt-4 ml-4">
            <button
              type="submit"
              className="px-3 py-2 mx-5 text-sm rounded-lg bg-amber-600"
            >
              <span className="i-tabler-refresh mr-2 relative top-[2px] scale-100 "></span>
              更新
            </button>
            <button
              type="button"
              className="px-3 py-2 mx-5 text-sm rounded-lg bg-slate-500"
              onClick={() => handleDelete}
            >
              <span className="i-tabler-trash mr-2 relative top-[2px] scale-100 "></span>
              アカウント削除
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Account;
