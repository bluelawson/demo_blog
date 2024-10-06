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
import { useMessage } from '@/context/MessageContext';
import { API_URL } from '@/utils/constants';

const CreateBlogPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { showErrorMessage, showSnackbarMessage } = useMessage();
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = null;
    // 画像をSupabase storageにアップロードする
    if (uploadFile) {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('fileName', uploadFile.name);

      try {
        const response = await fetch(`${API_URL}/api/blog/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`Status Code is ${response.status}`);
        }

        const { path } = await response.json();
        imageUrl = path;
      } catch (error) {
        console.error(error);
        showErrorMessage('画像のアップロードに失敗しました');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`${API_URL}/api/blog/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          imageUrl: imageUrl,
        }),
      });
      if (!response.ok) {
        throw new Error(`Status Code is ${response.status}`);
      }
      showSnackbarMessage('投稿が完了しました！');
    } catch (error) {
      console.error(error);
      showErrorMessage('投稿に失敗しました');
    } finally {
      setLoading(false);
    }
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
