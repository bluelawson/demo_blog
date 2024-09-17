import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabaseClient';

export async function GET(req: Request, res: Response) {
  const id = req.url.split('/blog/')[1];

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json(error);
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PUT(req: Request, res: Response) {
  const id = req.url.split('/blog/')[1];

  // リクエストボディから更新するデータを取得
  const { title, content, imageUrl } = await req.json(); // 更新するデータ

  // Supabaseの `update` メソッドを使って更新処理
  const { data, error: updateError } = await supabase
    .from('posts')
    .update({ title, content, imageUrl })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json(updateError, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(req: Request, res: Response) {
  const id = req.url.split('/blog/')[1];

  const { error: deleteError } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return NextResponse.json(deleteError);
  }

  return NextResponse.json({ status: 200 });
}
