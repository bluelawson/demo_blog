import { type EmailOtpType } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

import { API_URL } from '@/utils/constants';
import { supabase } from '@/utils/supabaseClient';

// ユーザ登録時に送られる認証メールのリンク先
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? `${API_URL}`;

  if (token_hash && type) {
    // OTPを検証してセッション情報を取得
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error && session) {
      // 認証トークンを取得してCookieに保存
      const accessToken = session.access_token;

      // Cookieに保存
      const response = NextResponse.redirect(next); // リダイレクト設定

      response.cookies.set('sb-access-token', accessToken, {
        httpOnly: true, // JavaScriptからアクセスできない
        secure: process.env.NODE_ENV === 'production', // HTTPSの場合のみsecureフラグを設定
        maxAge: 60 * 60 * 24 * 7, // 1週間
        path: '/', // ルート全体で有効
      });

      return response;
    }
  }

  // エラーページにリダイレクト
  return redirect('/error');
}

// ログイン
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

// ログアウト
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
