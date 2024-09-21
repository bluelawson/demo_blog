import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/utils/supabaseClient';

export const config = {
  api: {
    bodyParser: false, // formDataを使用するのでbodyParserを無効にします
  },
};

// POST リクエスト処理
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;
    const fileName = formData.get('fileName') as string;

    if (!file || !fileName) {
      return NextResponse.json(
        { error: 'ファイルまたはファイル名が提供されていません。' },
        { status: 400 },
      );
    }

    // Supabaseに画像をアップロード
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('demo')
      .upload(`pictures/${Date.now()}_${fileName}`, buffer, {
        contentType: file.type || 'image/jpeg',
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        path: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/demo/${data.path}`,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('エラー:', err);
    return NextResponse.json(
      { error: 'アップロード中にエラーが発生しました。' },
      { status: 500 },
    );
  }
}
