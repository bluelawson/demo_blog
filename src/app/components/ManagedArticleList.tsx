import React from "react";
import { Article } from "@/types";
import ManagedArticleCard from "./ManagedArticleCard";

type ManagedArticleListProps = {
  articles: Article[];
  handleArticleSelection: (id: string) => void;
  handleAllArticleSelection: () => void;
  selectedArticles: string[];
};

export default function ManagedArticleList({
  articles,
  handleArticleSelection,
  handleAllArticleSelection,
  selectedArticles,
}: ManagedArticleListProps) {
  return (
    <>
      <div className="mt-4 ml-4 pt-4 border-t border-slate-500 flex justify-between items-center">
        <input
          type="checkbox"
          onChange={() => handleAllArticleSelection()}
          className="ml-4 size-3"
        />
        <button
          type="button"
          className="bg-slate-500 px-3 mr-6 py-2 text-xs rounded-lg"
        >
          <span className="i-tabler-trash mr-2 relative top-[2px] scale-100"></span>
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
