import { NextResponse } from 'next/server';

import { createClient, createAdminClient } from '@/utils/supabase/server';

// ユーザ情報取得処理
export async function GET(req: Request) {
  // Supabase にクッキーから取得したトークンを渡してユーザーを取得
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { error: 'User not authenticated' },
      { status: 401 },
    );
  }

  return NextResponse.json(user, { status: 200 });
}

// ユーザ新規登録処理
export async function POST(req: Request, res: Response) {
  try {
    const supabase = createClient();
    const { email, password, userName } = await req.json();
    console.log(email);
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
    const supabase = createClient();
    const { email } = await req.json();
    const { error } = await supabase.auth.updateUser({
      email: email,
    });

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
    const adminSupabase = createAdminClient();
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
