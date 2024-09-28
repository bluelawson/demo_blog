'use client';
import React, { useState, useEffect } from 'react';

import Loading from '@/components/Loading';
import ManagedArticleList from '@/components/ManagedArticleList';
import { useParamsContext } from '@/context/ParamsContext';
import { Article } from '@/types';
import { API_URL } from '@/utils/constants';
import { supabase } from '@/utils/supabaseClient';

const ArticleManagement = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { message, setMessage } = useParamsContext();

  useEffect(() => {
    displayMessage();
    fetchArticles();
  }, [message]);

  const fetchArticles = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/blog/posts?isFilteredByCurrentUser=${true}`,
        { cache: 'no-store' },
      );

      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      } else {
        console.error('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayMessage = async () => {
    if (message) {
      // 2秒後にメッセージをリセット
      const timer = setTimeout(() => {
        setMessage('');
      }, 2000);
      return () => clearTimeout(timer); // クリーンアップ
    }
  };

  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [areAllArticlesSelected, setAreAllArticlesSelected] =
    useState<boolean>(false);

  const handleArticleSelection = (id: string) => {
    setSelectedArticles((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id],
    );
  };

  const handleAllArticleSelection = () => {
    const allIdList = articles.map((article) => article.id);
    if (areAllArticlesSelected) {
      setSelectedArticles([]);
      setAreAllArticlesSelected(false);
    } else {
      setSelectedArticles(allIdList);
      setAreAllArticlesSelected(true);
    }
  };

  const handleDelete = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/blog/posts`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedArticles }),
    });
    if (response.ok) {
      setMessage('削除が完了しました！');
    } else {
      console.error('削除に失敗しました');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {message && (
        <div className="fixed top-0 left-0 z-50 w-full py-2 text-center text-white bg-green-500">
          {message}
        </div>
      )}
      <ManagedArticleList
        articles={articles}
        handleArticleSelection={handleArticleSelection}
        handleAllArticleSelection={handleAllArticleSelection}
        handleDelete={handleDelete}
        selectedArticles={selectedArticles}
        areAllArticlesSelected={areAllArticlesSelected}
      />
    </>
  );
};

export default ArticleManagement;
