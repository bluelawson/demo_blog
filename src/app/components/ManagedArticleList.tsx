import React from "react";
import { Article } from "@/types";
import ManagedArticleCard from "./ManagedArticleCard";

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
        <button
          type="button"
          className="px-3 py-2 mr-6 text-xs rounded-lg bg-slate-500"
          onClick={handleDelete}
        >
          <span className="i-tabler-trash mr-2 relative top-[2px] scale-100 "></span>
          選択した記事を削除
        </button>
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
