import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = createClient();
  let query = supabase.from('posts').select('*');

  const isFilteredByCurrentUser = req.nextUrl.searchParams.get(
    'isFilteredByCurrentUser',
  );
  if (isFilteredByCurrentUser) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }
    query = query.eq('userId', user.id);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(error);
  }
  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: Request) {
  const supabase = createClient();
  const { title, content, userId, imageUrl } = await req.json();
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

export async function DELETE(req: Request) {
  const supabase = createClient();
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
