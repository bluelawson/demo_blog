"use client";
import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { useParamsContext } from "../../../context/ParamsContext";
import ButtonFrame from "../../../components/form/ButtonFrame";
import Button from "../../../components/form/Button";
import Input from "../../../components/form/Input";
import TextArea from "../../../components/form/TextArea";
import FormFrame from "../../../components/form/FormFrame";

const EditArticle = ({ params }: { params: { id: string } }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { setMessage } = useParamsContext();

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
    const id = params.id;
    const response = await fetch(`${API_URL}/api/blog/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, title, content }),
    });

    if (response.ok) {
      setMessage("更新が完了しました！");
      router.push(`/dashboard/articles`);
    } else {
      console.error("更新に失敗しました");
    }
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
