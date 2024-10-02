'use client';
import React, { useState } from 'react';

import { ButtonFrame, Button, Input, FormFrame } from '@/components/form';
import Loading from '@/components/Loading';
import { useMessage } from '@/context/MessageContext';
import { API_URL } from '@/utils/constants';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { showErrorMessage } = useMessage();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/blog/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userName,
        }),
      });
      if (!response.ok) {
        throw new Error(`Status Code is ${response.status}`);
      }
      setMessage('登録したメールアドレス宛に本人確認のリンクを送信しました。');
    } catch (error) {
      console.error(error);
      showErrorMessage('ユーザ登録に失敗しました');
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
      <FormFrame onSubmit={handleSignUp}>
        <Input
          label="メールアドレス"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="ユーザ名"
          value={userName}
          type="text"
          onChange={(e) => setUserName(e.target.value)}
        />
        <Input
          label="パスワード"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <ButtonFrame>
          <Button type="submit" crudType="create" text="新規登録" />
        </ButtonFrame>
      </FormFrame>
    </>
  );
};

export default SignUp;
