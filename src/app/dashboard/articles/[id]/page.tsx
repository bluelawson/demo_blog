'use client';
import { notFound, useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';

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

const EditArticle = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const { showErrorMessage, showSnackbarMessage } = useMessage();

  const fetchArticle = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/blog/posts/${params.id}`, {
        next: {
          revalidate: 10,
        },
      });

      if (!response.ok) {
        throw new Error(`Status Code is ${response.status}`);
      }

      const detailArticle = await response.json();
      if (!detailArticle) {
        notFound();
      }
      setTitle(detailArticle.title);
      setContent(detailArticle.content);
      setImageUrl(detailArticle.imageUrl);
    } catch (error) {
      console.error(error);
      showErrorMessage('記事情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [params.id, showErrorMessage]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchArticle();
    };
    fetchData();
  }, [fetchArticle]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const id = params.id;
    try {
      const response = await fetch(`${API_URL}/api/blog/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title,
          content,
          imageUrl: imageUrl,
        }),
      });
      if (!response.ok) {
        throw new Error(`Status Code is ${response.status}`);
      }
      showSnackbarMessage('更新が完了しました！');
      router.push(`/dashboard/articles`);
    } catch (error) {
      console.error(error);
      showErrorMessage('更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('本当にアカウントを削除しますか？');
    if (!confirmed) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/blog/posts/${params.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        showSnackbarMessage('削除が完了しました！');
        router.push(`/dashboard/articles`);
      } else {
        showErrorMessage('削除に失敗しました');
      }
    } catch (error) {
      console.error(error);
      showErrorMessage('削除に失敗しました');
      return;
    } finally {
      setLoading(false);
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
