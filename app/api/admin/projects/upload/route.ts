import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs" // نحتاج بيئة Node لقراءة FormData بشكل موثوق

// سماح بالمجلدات
const ALLOWED_FOLDERS = new Set(["featured", "gallery", "pdfs"] as const)
type AllowedFolder = "featured" | "gallery" | "pdfs"

// حدود أحجام تقريبية (اختياري)
const LIMITS = {
  image: 10 * 1024 * 1024, // 10MB
  pdf: 25 * 1024 * 1024,   // 25MB
}

function pickFolder(folderRaw: string | null, mime: string): AllowedFolder {
  const f = (folderRaw || "").toLowerCase()
  if (ALLOWED_FOLDERS.has(f as AllowedFolder)) return f as AllowedFolder
  if (mime.startsWith("image/")) return "gallery"
  if (mime === "application/pdf") return "pdfs"
  return "featured"
}

function pickExt(name: string, mime: string): string {
  const fromName = (name.split(".").pop() || "").toLowerCase()
  if (fromName) return fromName
  if (mime === "application/pdf") return "pdf"
  if (mime.startsWith("image/")) return "jpg"
  return "bin"
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    const folderRaw = form.get("folder") as string | null

    if (!file) {
      return NextResponse.json({ error: "الملف مفقود" }, { status: 400 })
    }

    const mime = file.type || "application/octet-stream"
    const size = file.size || 0

    // تحقّق نوع/حجم أساسي
    if (mime.startsWith("image/") && size > LIMITS.image) {
      return NextResponse.json({ error: "صورة أكبر من الحد المسموح (10MB)" }, { status: 400 })
    }
    if (mime === "application/pdf" && size > LIMITS.pdf) {
      return NextResponse.json({ error: "ملف PDF أكبر من الحد المسموح (25MB)" }, { status: 400 })
    }

    const folder = pickFolder(folderRaw, mime)
    const ext = pickExt(file.name || "", mime)
    // اسم ملف فريد
    const filename = `${Date.now()}_${(globalThis as any).crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2,10)}.${ext}`
    const path = `${folder}/${filename}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await supabaseAdmin.storage
      .from("projects")
      .upload(path, buffer, {
        contentType: mime,
        upsert: false,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: publicData } = supabaseAdmin.storage.from("projects").getPublicUrl(path)

    return NextResponse.json({
      ok: true,
      path: data?.path,
      url: publicData.publicUrl,
      contentType: mime,
      size,
      folder,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 })
  }
}
