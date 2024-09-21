'use client';
import { notFound, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import {
  ButtonFrame,
  Button,
  Input,
  FormFrame,
  TextArea,
  ImageUploader,
} from '@/components/form';
import Loading from '@/components/Loading';
import { useParamsContext } from '@/context/ParamsContext';

const EditArticle = ({ params }: { params: { id: string } }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const { setMessage } = useParamsContext();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/api/blog/posts/${params.id}`, {
        next: {
          revalidate: 10,
        },
      });

      if (res.ok) {
        const detailArticle = await res.json();
        if (!detailArticle) {
          notFound();
        }
        setTitle(detailArticle.title);
        setContent(detailArticle.content);
        setImageUrl(detailArticle.imageUrl);
      } else {
        console.error('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  const handleDelete = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/blog/posts/${params.id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setMessage('削除が完了しました！');
      router.push(`/dashboard/articles`);
    } else {
      console.error('削除に失敗しました');
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    let imageUrl = null;
    // 画像をSupabase storageにアップロードする
    if (uploadFile) {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('fileName', uploadFile.name);

      const response = await fetch(`${API_URL}/api/blog/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Image upload error:', error.error);
        setLoading(false);
        return;
      }

      const { path } = await response.json();
      imageUrl = path;
    }

    const id = params.id;
    const response = await fetch(`${API_URL}/api/blog/posts/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        title,
        content,
        imageUrl: imageUrl,
      }),
    });

    if (response.ok) {
      setMessage('更新が完了しました！');
      router.push(`/dashboard/articles`);
    } else {
      console.error('更新に失敗しました');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <FormFrame onSubmit={handleUpdate}>
      <Input
        label="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextArea value={content} onChange={(e) => setContent(e.target.value)} />
      <ImageUploader
        onUploadComplete={setUploadFile}
        fetchImageUrl={imageUrl}
      />
      <ButtonFrame>
        <Button type="submit" crudType="update" text="更新" />
        <Button
          type="button"
          crudType="delete"
          text="削除"
          handleClick={handleDelete}
        />
      </ButtonFrame>
    </FormFrame>
  );
};

export default EditArticle;
