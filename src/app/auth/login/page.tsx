'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { ButtonFrame, Button, Input, FormFrame } from '@/components/form';
import Loading from '@/components/Loading';
import { useMessage } from '@/context/MessageContext';
import { API_URL } from '@/utils/constants';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showErrorMessage, showSnackbarMessage } = useMessage();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/blog/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error(`Status Code is ${response.status}`);
      }
      showSnackbarMessage('ログインに成功しました！');
      router.push('/');
    } catch (error) {
      console.error(error);
      showErrorMessage('ログインに失敗しました');
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
      <FormFrame onSubmit={handleLogin}>
        <Input
          label="メールアドレス"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="パスワード"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <ButtonFrame>
          <Button type="submit" crudType="update" text="ログイン" />
        </ButtonFrame>
      </FormFrame>
    </>
  );
};

export default Login;
