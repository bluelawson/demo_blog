import React from 'react';

import { Article } from '@/types';

import Button from './form/Button';
import ManagedArticleCard from './ManagedArticleCard';

type ManagedArticleListProps = {
  articles: Article[];
  handleArticleSelection: (id: string) => void;
  handleAllArticleSelection: () => void;
  handleDelete: () => void;
  selectedArticles: string[];
  areAllArticlesSelected: boolean;
};

export default function ManagedArticleList({
  articles,
  handleArticleSelection,
  handleAllArticleSelection,
  handleDelete,
  selectedArticles,
  areAllArticlesSelected,
}: ManagedArticleListProps) {
  return (
    <>
      <div className="flex items-center justify-between pt-4 mt-4 ml-4">
        <input
          type="checkbox"
          onChange={handleAllArticleSelection}
          checked={areAllArticlesSelected}
          className="ml-4 size-3"
        />
        <Button
          type="button"
          crudType="delete"
          text="選択した記事を削除"
          handleClick={handleDelete}
        />
      </div>
      <div className="mt-3 ml-4 border-t border-slate-500">
        {articles.map((article) => (
          <React.Fragment key={article.id}>
            <ManagedArticleCard
              article={article}
              handleArticleSelection={handleArticleSelection}
              selectedArticles={selectedArticles}
            />
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
