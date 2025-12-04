import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getAdminContext } from "@/lib/admin-session";
import { AdminsTable } from "@/components/manage-admins/admins-table";
import { AdminCreateForm } from "@/components/manage-admins/admin-create-form";
import type { Admin } from "@/types/admin";

export default async function ManageAdminsPage() {
  const { user, profile } = await getAdminContext();
  if (!user || !profile?.is_active) redirect("/admin/login");
  if (profile.role !== "super_admin") redirect("/admin/dashboard");

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  );

  const { data } = await supabase
    .from("admin_profiles")
    .select("user_id, full_name, email, phone, role, is_active, created_at")
    .order("created_at", { ascending: false });

  const admins: Admin[] = Array.isArray(data)
    ? data.map((a: any) => ({
        user_id: a.user_id,
        full_name: a.full_name,
        email: a.email,
        phone: a.phone ?? null,
        role: a.role,
        is_active: a.is_active,
        created_at: a.created_at,
      }))
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">إدارة الإداريين</h1>
        <p className="text-muted-foreground">إضافة / تعديل / تعطيل / حذف الإداريين</p>
      </div>

      <AdminCreateForm />

      <AdminsTable initialAdmins={admins} currentUserId={user.id} />
    </div>
  );
}
