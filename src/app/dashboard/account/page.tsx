"use client";
import React, { useEffect, useState } from "react";
import { supabase, adminSupabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import ButtonFrame from "../../components/form/ButtonFrame";
import Button from "../../components/form/Button";
import Input from "../../components/form/Input";
import FormFrame from "../../components/form/FormFrame";

const Account = () => {
  const [email, setEmail] = useState("");
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
      <FormFrame onSubmit={handleUpdate}>
        <Input
          label="メールアドレス"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <ButtonFrame>
          <Button type="submit" crudType="update" text="更新" />
          <Button
            type="button"
            crudType="delete"
            text="アカウント削除"
            handleClick={handleDelete}
          />
        </ButtonFrame>
      </FormFrame>
    </>
  );
};

export default Account;
