import { Article } from "@/types";
import Link from "next/link";
import React from "react";

type ManagedArticleCardProps = {
  article: Article;
  handleArticleSelection: (id: string) => void;
};

export default function ManagedArticleCard({
  article,
  handleArticleSelection,
}: ManagedArticleCardProps) {
  return (
    <div>
      <input
        type="checkbox"
        onChange={() => handleArticleSelection(article.id)}
      />
      <Link href={`articles/${article.id}`} className="text-base text-white">
        {article.title}
      </Link>
    </div>
  );
}
