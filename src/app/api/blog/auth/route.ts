import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/utils/supabaseClient';

export async function POST(req: Request, res: Response) {
  try {
    const { email, password } = await req.json();
    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    // ログイン失敗時の処理
    if (error || !session) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // セッションが成功したら、クッキーを設定して返す
    const response = NextResponse.json(
      { message: 'Login successful', session },
      { status: 200 },
    );

    // クッキーにアクセストークンを設定 (セキュアかつhttpOnlyにする)
    response.cookies.set('sb-access-token', session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 本番環境ではsecureフラグを有効に
      maxAge: 60 * 60 * 24 * 7, // 1週間の有効期限
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  // Supabaseでのサインアウト処理
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }

  // クッキーを削除するためのレスポンス設定
  const response = NextResponse.json({ message: 'Logged out successfully' });

  // クッキーをクリア（アクセストークンを削除）
  response.cookies.set('sb-access-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1, // 即座にクッキーを無効化
    path: '/',
  });

  return response;
}
