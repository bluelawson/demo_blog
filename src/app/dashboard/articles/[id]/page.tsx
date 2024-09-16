"use client";
import React, { useState, useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { useParamsContext } from "../../../context/ParamsContext";
import ButtonFrame from "../../../components/form/ButtonFrame";
import Button from "../../../components/form/Button";
import Input from "../../../components/form/Input";
import TextArea from "../../../components/form/TextArea";
import FormFrame from "../../../components/form/FormFrame";
import ImageUpload from "../../../components/form/ImageUpload";
import { supabase } from "@/utils/supabaseClient";

const EditArticle = ({ params }: { params: { id: string } }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const { setMessage } = useParamsContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/api/blog/${params.id}`, {
        next: {
          revalidate: 10,
        },
      });

      if (res.ok) {
        const detailArticle = await res.json();
        if (!detailArticle) {
          notFound();
        }
        setTitle(detailArticle.title);
        setContent(detailArticle.content);
        setImageUrl(detailArticle.imageUrl);
      } else {
        console.error("Failed to fetch articles");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  const handleDelete = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/blog/${params.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setMessage("削除が完了しました！");
      router.push(`/dashboard/articles`);
    } else {
      console.error("削除に失敗しました");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

    const id = params.id;
    const response = await fetch(`${API_URL}/api/blog/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, title, content, imageUrl }),
    });

    if (response.ok) {
      setMessage("更新が完了しました！");
      router.push(`/dashboard/articles`);
    } else {
      console.error("更新に失敗しました");
    }
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
    return <div>Loading...</div>;
  }

  return (
    <FormFrame onSubmit={handleUpdate}>
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
        <Button type="submit" crudType="update" text="更新" />
        <Button
          type="button"
          crudType="delete"
          text="削除"
          handleClick={handleDelete}
        />
      </ButtonFrame>
    </FormFrame>
  );
};

export default EditArticle;
