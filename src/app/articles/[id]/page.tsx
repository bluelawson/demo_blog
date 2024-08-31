import Image from "next/image";
import React from "react";
import { notFound } from "next/navigation";

const Article = async ({ params }: { params: { id: string } }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_URL}/api/blog/${params.id}`, {
    next: {
      revalidate: 10,
    },
  });

  const detailArticle = await res.json();
  if (!detailArticle) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-5">
      <Image
        src={`/sample/articleImage.jpg`}
        alt="no image"
        width={1280}
        height={300}
      />
      <h1 className="text-4xl text-center mb-10 mt-10">
        {detailArticle.title}
      </h1>
      <div className="text-lg leading-relaxed text-justify">
        <p>{detailArticle.content}</p>
      </div>
    </div>
  );
};

export default Article;
