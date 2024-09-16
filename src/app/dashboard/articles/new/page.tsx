"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useParamsContext } from "../../../context/ParamsContext";
import Button from "../../../components/form/Button";
import ButtonFrame from "../../../components/form/ButtonFrame";
import Input from "../../../components/form/Input";
import TextArea from "../../../components/form/TextArea";
import FormFrame from "../../../components/form/FormFrame";

const CreateBlogPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setMessage } = useParamsContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;
    const response = await fetch(`${API_URL}/api/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, userId }),
    });
    if (response.ok) {
      setMessage("投稿が完了しました！");
      router.push(`/dashboard/articles`);
      router.refresh();
    } else {
      console.error("投稿に失敗しました");
    }
    setLoading(false);
  };

  return (
    <FormFrame onSubmit={handleSubmit}>
      <Input
        label="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextArea value={content} onChange={(e) => setContent(e.target.value)} />
      <ButtonFrame>
        <Button type="submit" crudType="create" text="投稿" />
      </ButtonFrame>
    </FormFrame>
  );
};

export default CreateBlogPage;
