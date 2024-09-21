'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

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

const CreateBlogPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { setMessage } = useParamsContext();
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
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

    const res = await fetch(`${API_URL}/api/blog/user`, {
      method: 'GET',
    });
    const fetchedData = await res.json();
    const userId = fetchedData?.id;
    const response = await fetch(`${API_URL}/api/blog/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        userId,
        imageUrl: imageUrl,
      }),
    });
    if (response.ok) {
      setMessage('投稿が完了しました！');
      router.push(`/dashboard/articles`);
      router.refresh();
    } else {
      console.error('投稿に失敗しました');
    }
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <FormFrame onSubmit={handleSubmit}>
      <Input
        label="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextArea value={content} onChange={(e) => setContent(e.target.value)} />
      <ImageUploader onUploadComplete={setUploadFile} />
      <ButtonFrame>
        <Button type="submit" crudType="create" text="投稿" />
      </ButtonFrame>
    </FormFrame>
  );
};

export default CreateBlogPage;
