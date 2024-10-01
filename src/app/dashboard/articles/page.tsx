'use client';
import React, { useState, useEffect, useCallback } from 'react';

import Loading from '@/components/Loading';
import ManagedArticleList from '@/components/ManagedArticleList';
import { useMessage } from '@/context/MessageContext';
import { Article } from '@/types';
import { API_URL } from '@/utils/constants';

const ArticleManagement = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { showErrorMessage, showSnackbarMessage } = useMessage();

  const fetchArticles = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/blog/posts?isFilteredByCurrentUser=${true}`,
        { cache: 'no-store' },
      );
      if (!response.ok) {
        throw new Error(`Status Code is ${response.status}`);
      }
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error(error);
      showErrorMessage('記事情報の取得に失敗しました');
    }
  }, [showErrorMessage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchArticles();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchArticles]);

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
    try {
      const response = await fetch(`${API_URL}/api/blog/posts`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedArticles }),
      });

      if (!response.ok) {
        throw new Error(`Status Code is ${response.status}`);
      }
      showSnackbarMessage('削除が完了しました！');

      await fetchArticles();
      setSelectedArticles([]);
      setAreAllArticlesSelected(false);
    } catch (error) {
      console.error(error);
      showErrorMessage('削除に失敗しました');
      return;
    }
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
