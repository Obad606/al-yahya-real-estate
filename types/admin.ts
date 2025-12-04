export type Admin = {
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: "super_admin" | "admin";
  is_active: boolean;
  created_at?: string;
};
