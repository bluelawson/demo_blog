import { cookies } from 'next/headers'; // クッキーを取得するためのNext.jsのヘルパー
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabaseClient';

export async function GET(req: Request) {
  const cookieStore = cookies();
  const access_token = cookieStore.get('sb-access-token')?.value;

  // トークンがなければエラーを返す
  if (!access_token) {
    return NextResponse.json(
      { error: 'No access token found' },
      { status: 401 },
    );
  }

  // Supabase にクッキーから取得したトークンを渡してユーザーを取得
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(access_token);

  if (error || !user) {
    return NextResponse.json(
      { error: 'User not authenticated' },
      { status: 401 },
    );
  }

  return NextResponse.json(user, { status: 200 });
}
