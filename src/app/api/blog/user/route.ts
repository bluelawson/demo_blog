import { NextResponse } from 'next/server';

import { User } from '@/types';
import { createClient, createAdminClient } from '@/utils/supabase/server';

// ユーザ情報取得処理
export async function GET() {
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
  const response: User = {
    email: user.email ?? '',
    name: user.user_metadata.user_name,
  };
  return NextResponse.json(response, { status: 200 });
}

// ユーザ新規登録処理
export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const adminSupabase = createAdminClient();
    const { email, password, userName } = await req.json();

    // メールアドレスの重複チェック
    const { data: users, error: fetchError } =
      await adminSupabase.auth.admin.listUsers();

    if (fetchError) {
      console.error('Error fetching users:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 },
      );
    }

    // メールアドレスが既に登録されているか確認
    const existingUser = users.users.find((user: any) => user.email === email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered.' },
        { status: 400 },
      );
    }

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
export async function PUT(req: Request) {
  try {
    const supabase = createClient();
    const adminSupabase = createAdminClient();
    const { email } = await req.json();

    // メールアドレスの重複チェック
    const { data: users, error: fetchError } =
      await adminSupabase.auth.admin.listUsers();

    if (fetchError) {
      console.error('Error fetching users:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 },
      );
    }

    // メールアドレスが既に登録されているか確認
    const existingUser = users.users.find((user: any) => user.email === email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered.' },
        { status: 400 },
      );
    }

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

export async function DELETE() {
  try {
    const adminSupabase = createAdminClient();
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    } else {
      const { error } = await adminSupabase.auth.admin.deleteUser(user.id);

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
    }
  } catch (error) {
    console.error('Delete User error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
