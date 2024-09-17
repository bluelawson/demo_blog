import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/utils/supabaseClient';

export async function GET(req: NextRequest, res: NextResponse) {
  const userId = req.nextUrl.searchParams.get('userId');
  let query = supabase.from('posts').select('*');
  if (userId !== null) {
    query = query.eq('userId', userId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(error);
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: Request, res: Response) {
  const { title, content, userId, imageUrl } = await req.json();
  console.log(imageUrl);
  const { data, error } = await supabase
    .from('posts')
    .insert([
      { title, content, createdAt: new Date().toISOString(), userId, imageUrl },
    ]);

  if (error) {
    return NextResponse.json(error);
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: Request, res: Response) {
  const { selectedArticles: ids } = await req.json();

  const { error: deleteError } = await supabase
    .from('posts')
    .delete()
    .in('id', ids);

  if (deleteError) {
    return NextResponse.json(deleteError);
  }

  return NextResponse.json({ status: 200 });
}
