'use client';
import React, { useState, useEffect } from 'react';

import Loading from '@/components/Loading';
import ManagedArticleList from '@/components/ManagedArticleList';
import { useMessage } from '@/context/MessageContext';
import { Article } from '@/types';
import { API_URL } from '@/utils/constants';

const ArticleManagement = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { showErrorMessage, showSnackbarMessage } = useMessage();

  useEffect(() => {
    fetchArticles();
  }, []);

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
      showSnackbarMessage('削除が完了しました！');
    } else {
      showErrorMessage('削除に失敗しました');
    }
    await fetchArticles();
    setSelectedArticles([]);
    setAreAllArticlesSelected(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
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
