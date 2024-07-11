import { supabase } from "@/utils/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, title, content } = req.body;

  const { data, error } = await supabase
    .from("posts")
    .insert([{ id, title, content, createdAt: new Date().toISOString() }]);
  console.log("insertedddd");
  console.log({ id, title, content, createdAt: new Date().toISOString() });

  console.log(data);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}
