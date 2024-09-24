'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { ButtonFrame, Button, Input, FormFrame } from '@/components/form';
import { API_URL } from '@/utils/constants';
import { supabase } from '@/utils/supabaseClient';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    if (response.ok) {
      router.push('/');
    } else {
      console.log(await response.json());
    }
  };

  return (
    <>
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
