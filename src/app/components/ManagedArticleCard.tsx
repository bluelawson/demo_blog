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
    <div className=" py-6 border-b">
      <input
        type="checkbox"
        onChange={() => handleArticleSelection(article.id)}
        className="mx-4 size-3"
      />
      <Link
        href={`articles/${article.id}`}
        className="text-base text-white hover:text-slate-300"
      >
        {article.title}
      </Link>
    </div>
  );
}
