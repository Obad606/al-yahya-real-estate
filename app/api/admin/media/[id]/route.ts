import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function assertSuperAdmin() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, msg: "غير مصرح" };

  const { data: me, error } = await supabase
    .from("admin_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !me?.is_active || me.role !== "super_admin") {
    return { ok: false, status: 403, msg: "صلاحية غير كافية" };
  }
  return { ok: true };
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await assertSuperAdmin();
  if (!auth.ok) return NextResponse.json({ success: false, error: auth.msg }, { status: auth.status });

  const id = params.id;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });

  const body = await req.json();
  const patch: any = {};
  for (const k of ["type", "title", "excerpt", "description", "image_url", "video_url", "pdf_url"]) {
    if (k in body) patch[k] = body[k];
  }

  if (patch.title !== undefined && !String(patch.title).trim()) {
    return NextResponse.json({ success: false, error: "العنوان لا يمكن أن يكون فارغًا" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("media")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await assertSuperAdmin();
  if (!auth.ok) return NextResponse.json({ success: false, error: auth.msg }, { status: auth.status });

  const id = params.id;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });

  const { error } = await supabaseAdmin.from("media").delete().eq("id", id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
