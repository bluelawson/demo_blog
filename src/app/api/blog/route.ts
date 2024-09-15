import { supabase } from "@/utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const userId = req.nextUrl.searchParams.get("userId");
  let query = supabase.from("posts").select("*");
  console.log(userId);
  if (userId !== null) {
    query = query.eq("userId", userId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(error);
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: Request, res: Response) {
  const { title, content, userId } = await req.json();

  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, content, createdAt: new Date().toISOString(), userId }]);

  if (error) {
    return NextResponse.json(error);
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: Request, res: Response) {
  const { selectedArticles: ids } = await req.json();

  const { error: deleteError } = await supabase
    .from("posts")
    .delete()
    .in("id", ids);

  if (deleteError) {
    return NextResponse.json(deleteError);
  }

  return NextResponse.json({ status: 200 });
}
