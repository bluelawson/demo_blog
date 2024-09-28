import { type EmailOtpType } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

import { API_URL } from '@/utils/constants';
import { createClient } from '@/utils/supabase/server';

// ユーザ登録時に送られる認証メールのリンク先
export async function GET(request: NextRequest) {
  const supabase = createClient();
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
      const response = NextResponse.redirect(next); // リダイレクト設定
      return response;
    }
  }

  // エラーページにリダイレクト
  return redirect('/error');
}

// ログイン
export async function POST(req: Request) {
  try {
    const supabase = createClient();
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
export async function DELETE() {
  const supabase = createClient();
  // Supabaseでのサインアウト処理
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }

  const response = NextResponse.json({ message: 'Logged out successfully' });
  return response;
}
