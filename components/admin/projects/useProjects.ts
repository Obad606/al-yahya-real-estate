// C:\Users\Dell\Downloads\code\components\admin\projects\useProjects.ts
"use client";

import * as React from "react";
import type { Project } from "@/types/project";

export function useProjects() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const fetchProjects = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/projects", { cache: "no-store" });
    const json = await res.json();
    setProjects(Array.isArray(json?.data) ? json.data : []);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const uploadFile = async (file: File, folder: "featured" | "gallery" | "pdfs"): Promise<string | null> => {
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/projects/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok && json?.url) return json.url;
      alert(json?.error || "فشل رفع الملف");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const upsertProject = async (payload: any, editing?: Project) => {
    setSaving(true);
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `/api/admin/${editing.id}` : "/api/admin/projects";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) throw new Error(json?.error || "فشل الحفظ");
    await fetchProjects();
  };

  const deleteProject = async (p: Project) => {
    if (!confirm(`هل أنت متأكد من حذف "${p.title}"؟`)) return;
    const res = await fetch(`/api/admin/${p.id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "فشل حذف المشروع");
    await fetchProjects();
  };

  return { projects, loading, saving, uploading, fetchProjects, uploadFile, upsertProject, deleteProject };
}
