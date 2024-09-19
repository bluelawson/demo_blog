'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { ButtonFrame, Button, Input, FormFrame } from '@/components/form';
import { supabase, adminSupabase } from '@/utils/supabaseClient';

const Account = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    getUserData();
  }, []);

  const handleDelete = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { error } = await adminSupabase.auth.admin.deleteUser(user?.id);
      if (!error) {
        router.push('/');
      } else {
        console.log(error);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({
      email: email,
    });
    if (error) {
      console.error('Error updating account:', error.message);
    } else {
      setMessage(
        '変更前のメールアドレス宛に本人確認のフォームを送信しました。',
      );
      router.push('/dashboard/account');
    }
  };

  const getUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email ?? '');
    } else {
      setEmail('');
    }
    return user;
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
            disabled
          />
        </ButtonFrame>
      </FormFrame>
    </>
  );
};

export default Account;
