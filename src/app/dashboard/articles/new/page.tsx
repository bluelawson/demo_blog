"use client";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useParamsContext } from "../../../context/ParamsContext";
import Button from "../../../components/form/Button";
import ButtonFrame from "../../../components/form/ButtonFrame";
import Input from "../../../components/form/Input";
import TextArea from "../../../components/form/TextArea";
import FormFrame from "../../../components/form/FormFrame";
import ImageUpload from "../../../components/form/ImageUpload";

const CreateBlogPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setMessage } = useParamsContext();
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;
    // 画像をSupabase storageにアップロードする
    if (image) {
      const { data, error } = await supabase.storage
        .from("demo")
        .upload(`pictures/${Date.now()}_${image.name}`, image);

      if (error) {
        console.error("Image upload error:", error.message);
        setLoading(false);
        return;
      }

      imageUrl = data.path;
    }

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
      body: JSON.stringify({
        title,
        content,
        userId,
        imageUrl: imageUrl
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/demo/${imageUrl}`
          : null,
      }),
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileName = file.name;

      // ファイル名に日本語が含まれているかチェック
      const hasJapanese = /[^\x00-\x7F]/.test(fileName); // 非ASCII文字（全角文字）のチェック

      if (hasJapanese) {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        setError(
          "ファイル名に日本語が含まれています。別の名前を使用してください。"
        );
        setImage(null);
        return;
      }
      setError("");
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleClose = async () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setImage(null);
    setImageUrl("");
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <FormFrame onSubmit={handleSubmit}>
      <Input
        label="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextArea value={content} onChange={(e) => setContent(e.target.value)} />
      {/* エラーメッセージ表示 */}
      {error && <p className="mt-2 text-red-500">{error}</p>}
      <ImageUpload
        imageUrl={imageUrl}
        inputRef={inputRef}
        handleClose={handleClose}
        handleUpload={handleUpload}
      />
      <ButtonFrame>
        <Button type="submit" crudType="create" text="投稿" />
      </ButtonFrame>
    </FormFrame>
  );
};

export default CreateBlogPage;
