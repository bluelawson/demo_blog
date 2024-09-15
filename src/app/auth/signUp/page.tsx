"use client";
import React, { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import ButtonFrame from "../../components/form/ButtonFrame";
import Button from "../../components/form/Button";
import Input from "../../components/form/Input";
import FormFrame from "../../components/form/FormFrame";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: { data: { user_name: userName } },
    });
    if (!error) {
      router.push("/");
    } else {
      console.log(error);
    }
  };

  return (
    <>
      <FormFrame onSubmit={handleSignUp}>
        <Input
          label="メールアドレス"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="ユーザ名"
          value={userName}
          type="text"
          onChange={(e) => setUserName(e.target.value)}
        />
        <Input
          label="パスワード"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <ButtonFrame>
          <Button type="submit" crudType="create" text="新規登録" />
        </ButtonFrame>
      </FormFrame>
    </>
  );
};

export default SignUp;
