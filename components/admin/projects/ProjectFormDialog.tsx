// C:\Users\Dell\Downloads\code\components\admin\projects\ProjectFormDialog.tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Project, Status } from "@/types/project";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  initial?: Project | null;
  saving: boolean;
  uploading: boolean;
  onSubmit: (payload: any, editing?: Project | null) => Promise<void>;
  onUpload: (
    file: File,
    folder: "featured" | "gallery" | "pdfs"
  ) => Promise<string | null>;
};

export default function ProjectFormDialog({
  open,
  setOpen,
  initial,
  saving,
  uploading,
  onSubmit,
  onUpload,
}: Props) {
  const [form, setForm] = React.useState({
    slug: "",
    title: "",
    subtitle: "",
    location: "",
    status: "planned" as Status,
    type: "",
    year: "",
    area_sqm: "",
    units: "",
    featured_image: "",
    gallery_images: [] as string[],
    pdf_file: "",
    summary: "",
    description: "",
    published: true,
    is_featured: false,
  });

  React.useEffect(() => {
    if (!initial) {
      setForm((p) => ({
        ...p,
        slug: "",
        title: "",
        subtitle: "",
        location: "",
        status: "planned",
        type: "",
        year: "",
        area_sqm: "",
        units: "",
        featured_image: "",
        gallery_images: [],
        pdf_file: "",
        summary: "",
        description: "",
        published: true,
        is_featured: false,
      }));
      return;
    }
    setForm({
      slug: initial.slug || "",
      title: initial.title || "",
      subtitle: initial.subtitle || "",
      location: initial.location || "",
      status: initial.status || "planned",
      type: initial.type || "",
      year: initial.year ? String(initial.year) : "",
      area_sqm: initial.area_sqm ? String(initial.area_sqm) : "",
      units: initial.units ? String(initial.units) : "",
      featured_image: initial.featured_image || "",
      gallery_images: initial.gallery_images || [],
      pdf_file: initial.pdf_file || "",
      summary: initial.summary || "",
      description: initial.description || "",
      published: !!initial.published,
      is_featured: !!initial.is_featured,
    });
  }, [initial]);

const toAsciiSlug = (v: string) =>
  v
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");


  const safeNumber = (val: string) =>
    val && !isNaN(Number(val)) ? Number(val) : null;

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert("العنوان مطلوب");
      return;
    }
    const payload = {
      slug: form.slug?.trim() || undefined,
      title: form.title,
      subtitle: form.subtitle || null,
      location: form.location || null,
      status: form.status,
      type: form.type || null,
      year: safeNumber(form.year),
      area_sqm: safeNumber(form.area_sqm),
      units: safeNumber(form.units),
      featured_image: form.featured_image || null,
      gallery_images: form.gallery_images || [],
      pdf_file: form.pdf_file || null,
      summary: form.summary || null,
      description: form.description || null,
      published: !!form.published,
      is_featured: !!form.is_featured,
    };
    await onSubmit(payload, initial || null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl bg-[#1c1c1e] text-[#f5e9d7]">
        <DialogHeader>
          <DialogTitle>{initial ? "تعديل مشروع" : "مشروع جديد"}</DialogTitle>
          <DialogDescription className="text-[#b3a999]">
            املأ الحقول التالية ثم اضغط حفظ.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>العنوان *</Label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="مثال: أبراج الرياض السكنية"
              className="bg-[#2a2a2d] border-[#3a3a3e] text-[#f5e9d7] placeholder:text-[#9b9b9b] focus:border-[#0b86f1] focus:ring-[#0b86f1]/40"
            />
          </div>

          <div>
        <Label>لسهولة البحث (اختياري)</Label>
        <Input
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} // ✨ فقط تخزين النص أثناء الكتابة
          onBlur={(e) =>
            setForm((p) => ({ ...p, slug: toAsciiSlug(e.target.value) })) // ✨ عند مغادرة الحقل يتم التحويل
          }
          placeholder="مثال: riyadh-towers"
          className="bg-[#2a2a2d] border-[#3a3a3e] text-[#f5e9d7] placeholder:text-[#9b9b9b] focus:border-[#0b86f1] focus:ring-[#0b86f1]/40"
      />
      </div>

          <div>
            <Label>الموقع</Label>
            <Input
              value={form.location}
              onChange={(e) =>
                setForm((p) => ({ ...p, location: e.target.value }))
              }
              placeholder="الرياض، حي الملقا"
              className="bg-[#2a2a2d] border-[#3a3a3e] text-[#f5e9d7] placeholder:text-[#9b9b9b] focus:border-[#0b86f1] focus:ring-[#0b86f1]/40"
            />
          </div>

          <div>
            <Label>الحالة</Label>
            <select
              className="h-10 w-full rounded-md border border-[#3a3a3e] bg-[#2a2a2d] px-3 text-sm text-[#f5e9d7] focus:border-[#0b86f1] focus:ring-[#0b86f1]/40 transition-colors"
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({ ...p, status: e.target.value as Status }))
              }
            >
              <option value="ongoing">تحت الإنشاء</option>
              <option value="completed">مكتمل</option>
              <option value="planned">مخطط</option>
            </select>
          </div>

          <div>
            <Label>النوع</Label>
            <Input
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              placeholder="سكني / تجاري / مكاتب ..."
              className="bg-[#2a2a2d] border-[#3a3a3e] text-[#f5e9d7] placeholder:text-[#9b9b9b] focus:border-[#0b86f1] focus:ring-[#0b86f1]/40"
            />
          </div>

          <div>
            <Label>السنة</Label>
            <Input
              type="number"
              value={form.year}
              onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
              placeholder="2024"
              className="bg-[#2a2a2d] border-[#3a3a3e] text-[#f5e9d7] focus:border-[#0b86f1] focus:ring-[#0b86f1]/40"
            />
          </div>

          <div>
            <Label>المساحة (م²)</Label>
            <Input
              type="number"
              value={form.area_sqm}
              onChange={(e) =>
                setForm((p) => ({ ...p, area_sqm: e.target.value }))
              }
              placeholder="50000"
              className="bg-[#2a2a2d] border-[#3a3a3e] text-[#f5e9d7] focus:border-[#0b86f1] focus:ring-[#0b86f1]/40"
            />
          </div>

          <div>
            <Label>عدد الوحدات</Label>
            <Input
              type="number"
              value={form.units}
              onChange={(e) =>
                setForm((p) => ({ ...p, units: e.target.value }))
              }
              placeholder="200"
              className="bg-[#2a2a2d] border-[#3a3a3e] text-[#f5e9d7] focus:border-[#0b86f1] focus:ring-[#0b86f1]/40"
            />
          </div>

          <div className="sm:col-span-2">
            <Label>عنوان فرعي (اختياري)</Label>
            <Input
              value={form.subtitle}
              onChange={(e) =>
                setForm((p) => ({ ...p, subtitle: e.target.value }))
              }
              placeholder="سطر وصفي قصير"
              className="bg-[#2a2a2d] border-[#3a3a3e] text-[#f5e9d7] placeholder:text-[#9b9b9b] focus:border-[#0b86f1] focus:ring-[#0b86f1]/40"
            />
          </div>

          <div className="sm:col-span-2">
            <Label>ملخص قصير (Summary)</Label>
            <Textarea
              value={form.summary}
              onChange={(e) =>
                setForm((p) => ({ ...p, summary: e.target.value }))
              }
              placeholder="سطرين مختصرين يظهران في الكارد"
              className="bg-[#2a2a2d] border-[#3a3a3e] text-[#f5e9d7] placeholder:text-[#9b9b9b] focus:border-[#0b86f1] focus:ring-[#0b86f1]/40"
            />
          </div>

          <div className="sm:col-span-2">
            <Label>الوصف التفصيلي</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="وصف كامل يظهر في صفحة المشروع"
              className="min-h-[120px] bg-[#2a2a2d] border-[#3a3a3e] text-[#f5e9d7] placeholder:text-[#9b9b9b] focus:border-[#0b86f1] focus:ring-[#0b86f1]/40"
            />
          </div>

          {/* الصورة المميّزة */}
          <div className="sm:col-span-2">
            <Label>الصورة المميّزة</Label>
            <div className="flex items-center gap-3">
              <Input
                value={form.featured_image}
                onChange={(e) =>
                  setForm((p) => ({ ...p, featured_image: e.target.value }))
                }
                placeholder="رابط مباشر للصورة"
                className="bg-[#2a2a2d] border-[#3a3a3e] text-[#f5e9d7] focus:border-[#0b86f1] focus:ring-[#0b86f1]/40"
              />
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-[#3a3a3e] rounded-md cursor-pointer hover:bg-[#2f2f31]">
                <Upload className="h-4 w-4" />
                <span>رفع</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const url = await onUpload(f, "featured");
                      if (url)
                        setForm((p) => ({ ...p, featured_image: url }));
                    }
                  }}
                />
              </label>
            </div>
            {uploading && (
              <div className="text-xs text-[#b3a999] mt-1 flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" /> جاري رفع الصورة...
              </div>
            )}
          </div>

          {/* صور إضافية */}
          <div className="sm:col-span-2">
            <Label>صور إضافية (حتى 5)</Label>
            <div className="flex flex-wrap gap-3">
              {form.gallery_images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    alt={`Gallery ${i}`}
                    className="w-24 h-24 object-cover rounded-md border border-[#3a3a3e]"
                  />
                  <button
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        gallery_images: p.gallery_images.filter(
                          (_, idx) => idx !== i
                        ),
                      }))
                    }
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {form.gallery_images.length < 5 && (
                <label className="inline-flex items-center gap-2 px-3 py-2 border border-[#3a3a3e] rounded-md cursor-pointer hover:bg-[#2f2f31]">
                  <Upload className="h-4 w-4" />
                  <span>رفع صورة</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const url = await onUpload(f, "gallery");
                        if (url)
                          setForm((p) => ({
                            ...p,
                            gallery_images: [...p.gallery_images, url],
                          }));
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          {/* PDF */}
          <div className="sm:col-span-2">
            <Label>ملف PDF (اختياري)</Label>
            <div className="flex items-center gap-3">
              <Input
                value={form.pdf_file}
                onChange={(e) =>
                  setForm((p) => ({ ...p, pdf_file: e.target.value }))
                }
                placeholder="رابط ملف PDF"
                className="bg-[#2a2a2d] border-[#3a3a3e] text-[#f5e9d7] focus:border-[#0b86f1] focus:ring-[#0b86f1]/40"
              />
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-[#3a3a3e] rounded-md cursor-pointer hover:bg-[#2f2f31]">
                <Upload className="h-4 w-4" />
                <span>رفع</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const url = await onUpload(f, "pdfs");
                      if (url)
                        setForm((p) => ({ ...p, pdf_file: url }));
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* النشر + التمييز */}
          <div className="sm:col-span-2 flex items-center justify-between rounded-md border border-[#3a3a3e] bg-[#232325] p-3">
            <div className="space-y-0.5">
              <Label>منشور</Label>
              <div className="text-xs text-[#b3a999]">إظهار المشروع للعامة</div>
            </div>
            <Switch
              checked={form.published}
              onCheckedChange={(v) =>
                setForm((p) => ({ ...p, published: v }))
              }
            />
          </div>

          <div className="sm:col-span-2 flex items-center justify-between rounded-md border border-[#3a3a3e] bg-[#232325] p-3">
            <div className="space-y-0.5">
              <Label>مشروع مميز</Label>
              <div className="text-xs text-[#b3a999]">
                عرض هذا المشروع في <strong>مشاريعنا المميزة</strong> بالصفحة
                الرئيسية
              </div>
            </div>
            <Switch
              checked={!!form.is_featured}
              onCheckedChange={(v) =>
                setForm((p) => ({ ...p, is_featured: v }))
              }
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="bg-transparent border border-[#3a3a3e] text-[#f5e9d7] hover:bg-[#2f2f31]"
          >
            إلغاء
          </Button>
                    <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-[#0b86f1] hover:bg-[#0a74d8] text-white"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الحفظ...
              </span>
            ) : (
              "حفظ"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

