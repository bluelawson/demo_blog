"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useParamsContext } from "../../../context/ParamsContext";

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
    } else {
      console.error("投稿に失敗しました");
    }
    setLoading(false);
  };

  return (
    <div className="w-3/4 px-4 py-8">
      <form className="" onSubmit={handleSubmit}>
        <div className="my-5 ">
          <label className="w-1/6 px-3 py-2 bg-slate-600">タイトル</label>
          <input
            type="text"
            className="w-4/6 px-2 py-1 mx-4 border rounded border-slate-400 bg-slate-700"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="my-5 ">
          <textarea
            className="w-full h-64 px-2 py-2 border rounded border-slate-400 bg-slate-700"
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-center pt-4 mt-4 ml-4">
          <button
            type="submit"
            className={`px-3 py-2 mx-5 text-sm rounded-lg ${
              loading
                ? "bg-sky-300 cursor-not-allowed"
                : "bg-sky-500 hover:bg-sky-600"
            } `}
            disabled={loading}
          >
            <span className="i-tabler-edit mr-2 relative top-[2px] scale-100 "></span>
            投稿
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPage;
