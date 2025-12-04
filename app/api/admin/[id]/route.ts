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

// PATCH: تحديث (يتضمن is_featured)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const res = NextResponse.json({});
  const supabase = serverClient(req, res);
  const body = await req.json();

  const payload: any = {};
  const assign = (k: string, v: any) => {
    if (v === undefined) return;
    payload[k] = v;
  };

  assign("slug", body.slug ?? undefined);
  assign("title", body.title ?? undefined);
  assign("subtitle", body.subtitle ?? undefined);
  assign("location", body.location ?? undefined);
  assign("status", body.status ?? undefined);
  assign("type", body.type ?? undefined);
  assign("year", body.year !== undefined ? (Number.isFinite(body.year) ? body.year : body.year ? Number(body.year) : null) : undefined);
  assign("area_sqm", body.area_sqm !== undefined ? (Number.isFinite(body.area_sqm) ? body.area_sqm : body.area_sqm ? Number(body.area_sqm) : null) : undefined);
  assign("units", body.units !== undefined ? (Number.isFinite(body.units) ? body.units : body.units ? Number(body.units) : null) : undefined);
  assign("featured_image", body.featured_image ?? undefined);
  assign("gallery_images", Array.isArray(body.gallery_images) ? body.gallery_images : undefined);
  assign("pdf_file", body.pdf_file ?? undefined);
  assign("summary", body.summary ?? undefined);
  assign("description", body.description ?? undefined);
  assign("published", body.published !== undefined ? !!body.published : undefined);
  assign("is_featured", body.is_featured !== undefined ? !!body.is_featured : undefined);

  const { error } = await supabase.from("projects").update(payload).eq("id", params.id);

  if (error) {
    return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 400, headers: res.headers });
  }

  return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: res.headers });
}

// DELETE: حذف
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const res = NextResponse.json({});
  const supabase = serverClient(req, res);

  const { error } = await supabase.from("projects").delete().eq("id", params.id);

  if (error) {
    return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 400, headers: res.headers });
  }

  return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: res.headers });
}
