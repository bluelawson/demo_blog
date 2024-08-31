import React from "react";
import { Article } from "@/types";
import ManagedArticleCard from "./ManagedArticleCard";

type ManagedArticleListProps = {
  articles: Article[];
};

const ManagedArticleList = ({ articles }: ManagedArticleListProps) => {
  return (
    <div>
      {articles.map((article) => (
        <ManagedArticleCard article={article} key={article.id} />
      ))}
    </div>
  );
};

export default ManagedArticleList;
