import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ المفتاح السري الكامل
)

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "uploads"

    if (!file) {
      return NextResponse.json({ error: "لم يتم استلام أي ملف" }, { status: 400 })
    }

    const ext = file.name.split(".").pop()
    const fileName = `${Date.now()}.${ext}`
    const filePath = `${folder}/${fileName}`

    const { error } = await supabaseAdmin.storage.from("media").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data } = supabaseAdmin.storage.from("media").getPublicUrl(filePath)
    return NextResponse.json({ url: data.publicUrl })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
