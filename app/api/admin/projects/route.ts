import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function serverClient(req: NextRequest, res: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );
}

// GET: قائمة المشاريع للإدارة (تشمل is_featured)
export async function GET(req: NextRequest) {
  const res = NextResponse.json({});
  const supabase = serverClient(req, res);

  // يكتفي بـ RLS لرؤية المشاريع (authenticated)
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id,slug,title,subtitle,location,status,type,year,area_sqm,units,featured_image,summary,description,published,is_featured,created_at,gallery_images,pdf_file"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 400, headers: res.headers });
  }

  return new NextResponse(JSON.stringify({ success: true, data }), { status: 200, headers: res.headers });
}

// POST: إنشاء مشروع (يمرّر is_featured)
export async function POST(req: NextRequest) {
  const res = NextResponse.json({});
  const supabase = serverClient(req, res);

  const {
    slug,
    title,
    subtitle,
    location,
    status,
    type,
    year,
    area_sqm,
    units,
    featured_image,
    gallery_images = [],
    pdf_file,
    summary,
    description,
    published = false,
    is_featured = false,
  } = await req.json();

  if (!title || typeof title !== "string") {
    return new NextResponse(JSON.stringify({ success: false, error: "العنوان مطلوب" }), { status: 400, headers: res.headers });
  }

  const payload: any = {
    slug: slug || null,
    title,
    subtitle: subtitle ?? null,
    location: location ?? null,
    status: status ?? "planned",
    type: type ?? null,
    year: Number.isFinite(year) ? year : (year ? Number(year) : null),
    area_sqm: Number.isFinite(area_sqm) ? area_sqm : (area_sqm ? Number(area_sqm) : null),
    units: Number.isFinite(units) ? units : (units ? Number(units) : null),
    featured_image: featured_image ?? null,
    gallery_images: Array.isArray(gallery_images) ? gallery_images : [],
    pdf_file: pdf_file ?? null,
    summary: summary ?? null,
    description: description ?? null,
    published: !!published,
    is_featured: !!is_featured,
  };

  // إن لم يأتِ slug، توليد بسيط (اختياري)
  if (!payload.slug) {
    const base = String(title)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    payload.slug = base || `project-${Date.now()}`;
  }

  const { data, error } = await supabase.from("projects").insert(payload).select("id").single();

  if (error) {
    return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 400, headers: res.headers });
  }

  return new NextResponse(JSON.stringify({ success: true, data }), { status: 201, headers: res.headers });
}
