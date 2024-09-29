'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { ButtonFrame, Button, Input, FormFrame } from '@/components/form';
import { API_URL } from '@/utils/constants';

const Account = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    getUserData();
  }, []);

  const handleDelete = async () => {
    const res = await fetch(`${API_URL}/api/blog/user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      router.push('/');
    } else {
      console.log('Failed User Delete');
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/blog/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    const fetchedData = await res.json();
    if (res.ok) {
      setMessage(
        '変更前・変更後のメールアドレス宛に本人確認のリンクを送信しました。',
      );
      router.push('/dashboard/account');
    } else {
      console.error('Error updating account:', fetchedData);
    }
  };

  const getUserData = async () => {
    const response = await fetch(`${API_URL}/api/blog/user`, {
      method: 'GET',
    });
    const fetchedData = await response.json();
    if (response.ok) {
      setEmail(fetchedData.email);
    } else {
      setEmail('');
    }
  };

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
