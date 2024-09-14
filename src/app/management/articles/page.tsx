"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import ManagedArticleList from "../../components/ManagedArticleList";
import { Article } from "@/types";

const ArticleManagement = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const userId = user?.id;

        if (userId) {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${API_URL}/api/blog?userId=${userId}`, {
            cache: "no-store",
          });

          if (res.ok) {
            const data = await res.json();
            setArticles(data);
          } else {
            console.error("Failed to fetch articles");
          }
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  const handleArticleSelection = (id: string) => {
    setSelectedArticles((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id]
    );
  };

  const handleAllArticleSelection = () => {
    const allIdList = articles.map((article) => article.id);
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(allIdList);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // ローディングインディケーターを表示
  }

  return (
    <>
      <div>{selectedArticles.join(", ")}</div>
      <ManagedArticleList
        articles={articles}
        handleArticleSelection={handleArticleSelection}
        handleAllArticleSelection={handleAllArticleSelection}
        selectedArticles={selectedArticles}
      />
    </>
  );
};

export default ArticleManagement;
