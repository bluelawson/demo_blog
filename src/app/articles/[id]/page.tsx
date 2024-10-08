import { notFound } from 'next/navigation';
import React from 'react';

import { API_URL } from '@/utils/constants';

const Article = async ({ params }: { params: { id: string } }) => {
  let detailArticle: {
    title: string;
    content: string;
    imageUrl?: string;
  } | null = null;
  try {
    const response = await fetch(`${API_URL}/api/blog/posts/${params.id}`, {
      next: {
        revalidate: 10,
      },
    });
    if (!response.ok) {
      throw new Error(`Status Code is ${response.status}`);
    }
    detailArticle = await response.json();
    if (!detailArticle) {
      throw new Error(`article not found`);
    }
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <div className="flex flex-col max-w-3xl p-5 mx-auto">
      <img
        src={detailArticle.imageUrl}
        alt={`no image`}
        className="object-cover"
      />
      <h1 className="mt-10 mb-10 text-4xl text-center ">
        {detailArticle.title}
      </h1>
      <p className="mx-10 mb-8 text-lg" style={{ whiteSpace: 'pre-wrap' }}>
        {detailArticle.content}
      </p>
    </div>
  );
};

export default Article;
