"use client";
import React, { useState } from "react";
import { Article } from "@/types";
import ManagedArticleCard from "./ManagedArticleCard";

type ManagedArticleListProps = {
  articles: Article[];
};

const ManagedArticleList = ({ articles }: ManagedArticleListProps) => {
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  const handleSelectArticle = (id: string) => {
    setSelectedArticles((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id]
    );
  };

  return (
    <>
      <div>{selectedArticles.join(", ")}</div>
      {articles.map((article) => (
        <React.Fragment key={article.id}>
          <div>
            <input
              type="checkbox"
              onChange={() => handleSelectArticle(article.id)}
            />
            <ManagedArticleCard article={article} />
          </div>
        </React.Fragment>
      ))}
    </>
  );
};

export default ManagedArticleList;
