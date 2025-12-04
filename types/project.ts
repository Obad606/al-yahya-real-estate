// C:\Users\Dell\Downloads\code\types\project.ts
export type Status = "ongoing" | "completed" | "planned";

export type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  location: string | null;
  status: Status;
  type: string | null;
  year: number | null;
  area_sqm: number | null;
  units: number | null;
  featured_image: string | null;
  summary: string | null;
  description: string | null;
  published: boolean;
  is_featured?: boolean | null;
  created_at: string;
  gallery_images?: string[];
  pdf_file?: string | null;
};
