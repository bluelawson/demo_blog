"use client";
import React, { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import ManagedArticleList from "../../components/ManagedArticleList";

const ArticleManagement = async () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  const res = await fetch(`${API_URL}/api/blog?userId=${userId}`, {
    cache: "no-store",
  });
  const articles = await res.json();

  return (
    <div className="md:flex">
      <section className="w-full md:w-2/3 flex flex-col items-center">
        <ManagedArticleList articles={articles} />
      </section>
    </div>
  );
};

export default ArticleManagement;
