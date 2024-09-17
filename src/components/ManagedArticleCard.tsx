import Link from 'next/link';
import React from 'react';

import { Article } from '@/types';

type ManagedArticleCardProps = {
  article: Article;
  handleArticleSelection: (id: string) => void;
  selectedArticles: string[];
};

export default function ManagedArticleCard({
  article,
  handleArticleSelection,
  selectedArticles,
}: ManagedArticleCardProps) {
  return (
    <div className="py-5 border-b border-slate-500">
      <input
        type="checkbox"
        checked={selectedArticles.includes(article.id)}
        onChange={() => handleArticleSelection(article.id)}
        className="mx-4 size-3"
      />
      <Link
        href={`articles/${article.id}`}
        className="text-base text-white hover:text-slate-300 border-b"
      >
        {article.title}
      </Link>
      <div className="ml-11 text-sm text-slate-400">
        {new Date(article.createdAt).toLocaleString()}
      </div>
    </div>
  );
}
