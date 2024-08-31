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
  const { id, title, content, userId } = await req.json();

  const { data, error } = await supabase
    .from("posts")
    .insert([
      { id, title, content, createdAt: new Date().toISOString(), userId },
    ]);

  if (error) {
    return NextResponse.json(error);
  }

  return NextResponse.json(data, { status: 201 });
}
