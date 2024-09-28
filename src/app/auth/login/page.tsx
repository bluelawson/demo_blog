'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { ButtonFrame, Button, Input, FormFrame } from '@/components/form';
import { API_URL } from '@/utils/constants';
import { supabase } from '@/utils/supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    if (response.ok) {
      router.push('/');
    }
  };

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
