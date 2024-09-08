import { Article } from "@/types";
import Link from "next/link";
import Image from "next/image";
import React from "react";

type ManagedArticleCardProps = {
  article: Article;
};

const ManagedArticleCard = ({ article }: ManagedArticleCardProps) => {
  return (
    <article className="shadow my-4 flex flex-col">
      <div className="bg-white flex flex-col justify-start p-6">
        <Link
          href={`articles/${article.id}`}
          className="text-slate-900 text-3xl font-bold hover:text-gray-700 pb-4"
        >
          {article.title}
        </Link>
        <p className="text-sm pb-3 text-slate-900">
          Published on {new Date(article.createdAt).toLocaleString()}
        </p>
        <Link href={`articles/${article.id}`} className="pb-6 text-slate-900">
          {article.content.length > 70
            ? article.content.substring(0, 70) + "....."
            : article.content}
        </Link>
        <Link
          href={`articles/${article.id}`}
          className="text-pink-800 hover:text-black"
        >
          続きを読む
        </Link>
      </div>
    </article>
  );
};

export default ManagedArticleCard;
