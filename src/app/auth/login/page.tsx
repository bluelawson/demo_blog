"use client";
import React, { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { ButtonFrame, Button, Input, FormFrame } from "@/components/form";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (!error) {
      router.push("/");
    }
  };

  return (
    <>
      <FormFrame onSubmit={handleLogin}>
        <Input
          label="メールアドレス"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="パスワード"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <ButtonFrame>
          <Button type="submit" crudType="update" text="ログイン" />
        </ButtonFrame>
      </FormFrame>
    </>
  );
};

export default Login;
