"use client";
import React, { useEffect, useState } from "react";
import { supabase, adminSupabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

const MyPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    getUserData();
  }, []);

  const handleDelete = async () => {
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
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          className="text-black"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          className="text-black"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <button
          className="px-3 mx-3 bg-orange-300 rounded-md"
          onClick={handleDelete}
        >
          アカウント削除
        </button>
      </div>
    </>
  );
};

export default MyPage;
