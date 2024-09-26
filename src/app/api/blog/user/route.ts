import { cookies } from 'next/headers'; // クッキーを取得するためのNext.jsのヘルパー
import { NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';
import { supabase, adminSupabase } from '@/utils/supabaseClient';

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

export async function POST(req: Request, res: Response) {
  try {
    const { email, password, userName } = await req.json();
    console.log(userName);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: { data: { user_name: userName } },
    });

    // 登録失敗時の処理
    if (error) {
      console.log(error);
      return NextResponse.json(
        { error: `Invalid credentials: ${error.message}` },
        { status: 401 },
      );
    }

    // 成功
    const response = NextResponse.json(
      { message: 'SignUp successful' },
      { status: 200 },
    );

    return response;
  } catch (error) {
    console.error('SignUp error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}

// メールアドレス変更処理
export async function PUT(req: Request, res: Response) {
  try {
    const supabaseServer = createClient();
    const { email } = await req.json();
    const { error } = await supabaseServer.auth.updateUser(email);

    // 登録失敗時の処理
    if (error) {
      console.log(error);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // 成功
    const response = NextResponse.json(
      { message: 'Update User successful' },
      { status: 200 },
    );

    return response;
  } catch (error) {
    console.error('Update User error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, res: Response) {
  try {
    const { userId } = await req.json();
    const { error } = await adminSupabase.auth.admin.deleteUser(userId);

    // 登録失敗時の処理
    if (error) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // 成功
    const response = NextResponse.json(
      { message: 'Delete User successful' },
      { status: 200 },
    );

    return response;
  } catch (error) {
    console.error('Delete User error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
