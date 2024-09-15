import { Article } from "@/types";
import React from "react";
import Link from "next/link";

type ArticleCardProps = {
  article: Article;
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <div
      className="overflow-hidden transition-shadow duration-300 rounded-lg shadow-md bg-slate-600 hover:shadow-lg"
      key={article.id}
    >
      <img
        src={`/sample/articleImage.jpg`}
        alt={"no image"}
        className="object-cover w-full h-48"
      />
      <div className="p-4">
        <Link href={`articles/${article.id}`}>
          <h3 className="mb-1 text-lg font-semibold ">{article.title}</h3>
          <p className="text-xs text-slate-300">{article.content}</p>
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
