import React from "react";
import { Article } from "@/types";
import ManagedArticleCard from "./ManagedArticleCard";

type ManagedArticleListProps = {
  articles: Article[];
  handleArticleSelection: (id: string) => void;
};

export default function ManagedArticleList({
  articles,
  handleArticleSelection,
}: ManagedArticleListProps) {
  return (
    <>
      <div className="mt-6 ml-4 border-t">
        {articles.map((article) => (
          <React.Fragment key={article.id}>
            <ManagedArticleCard
              article={article}
              handleArticleSelection={handleArticleSelection}
            />
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
