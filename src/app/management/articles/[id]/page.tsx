"use client";
import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

const EditArticle = ({ params }: { params: { id: string } }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

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
      router.push(`/management/articles?message=削除が完了しました！`);
    } else {
      console.error("削除に失敗しました");
    }
  };

  const handleUpdate = async () => {
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
      // 更新が成功したら、新しい画面に遷移し、メッセージをクエリパラメータで渡す
      router.push(`/management/articles?message=更新が完了しました！`);
    } else {
      console.error("更新に失敗しました");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-3/4 px-4 py-8">
      <div className="my-5 ">
        <label className="w-1/6 px-3 py-2 bg-slate-600">タイトル</label>
        <input
          type="text"
          className="w-4/6 px-2 py-1 mx-4 border rounded border-slate-400 bg-slate-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <textarea
          className="w-full h-64 px-2 py-2 border rounded border-slate-400 bg-slate-700"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-center pt-4 mt-4 ml-4">
        <button
          type="button"
          className="px-3 py-2 mx-5 text-sm rounded-lg bg-amber-600"
          onClick={handleUpdate}
        >
          <span className="i-tabler-refresh mr-2 relative top-[2px] scale-100 "></span>
          更新
        </button>
        <button
          type="button"
          className="px-3 py-2 mx-5 text-sm rounded-lg bg-slate-500"
          onClick={handleDelete}
        >
          <span className="i-tabler-trash mr-2 relative top-[2px] scale-100 "></span>
          削除
        </button>
      </div>
    </div>
  );
};

export default EditArticle;
