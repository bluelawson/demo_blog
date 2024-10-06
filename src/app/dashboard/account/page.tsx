'use client';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { ButtonFrame, Button, Input, FormFrame } from '@/components/form';
import Loading from '@/components/Loading';
import { useMessage } from '@/context/MessageContext';
import { API_URL } from '@/utils/constants';

const Account = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { showErrorMessage, showSnackbarMessage } = useMessage();
  const router = useRouter();

  const getUserData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/blog/user`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`Status Code is ${response.status}`);
      }
      const fetchedData = await response.json();
      setEmail(fetchedData.email);
    } catch (error) {
      console.error(error);
      showErrorMessage('ユーザ情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [showErrorMessage]);

  useEffect(() => {
    const fetchData = async () => {
      await getUserData();
    };
    fetchData();
  }, [getUserData]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    let status = 200;
    try {
      const response = await fetch(`${API_URL}/api/blog/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      if (!response.ok) {
        status = response.status;
        throw new Error(`Status Code is ${response.status}`);
      }
      setMessage(
        '変更前・変更後のメールアドレス宛に本人確認のリンクを送信しました。',
      );
      router.push('/dashboard/account');
    } catch (error) {
      console.error(error);
      if (status === 400) {
        showErrorMessage('入力されたメールアドレスは既に登録されています');
      } else {
        showErrorMessage('更新に失敗しました');
      }
      return;
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
      const response = await fetch(`${API_URL}/api/blog/user`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Status Code is ${response.status}`);
      }
      showSnackbarMessage('削除に成功しました！');
      router.push('/');
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
    <>
      {message && <p className="px-1 text-black bg-amber-400">{message}</p>}
      <FormFrame onSubmit={handleUpdate}>
        <Input
          label="メールアドレス"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <ButtonFrame>
          <Button type="submit" crudType="update" text="更新" />
          <Button
            type="button"
            crudType="delete"
            text="アカウント削除"
            handleClick={handleDelete}
            // disabled
          />
        </ButtonFrame>
      </FormFrame>
    </>
  );
};

export default Account;
