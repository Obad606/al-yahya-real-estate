// C:\Users\Dell\Downloads\code\app\admin\manage-projects\page.tsx
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProjectsTable from "@/components/admin/projects/ProjectsTable";
import ProjectFormDialog from "@/components/admin/projects/ProjectFormDialog";
import { useProjects } from "@/components/admin/projects/useProjects";
import type { Project } from "@/types/project";

export default function ManageProjectsPage() {
  const { projects, loading, saving, uploading, upsertProject, deleteProject, uploadFile } = useProjects();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Project | null>(null);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">إدارة المشاريع</h1>
            <p className="text-sm sm:text-base text-muted-foreground">إضافة وتعديل وحذف المشاريع</p>
          </div>
          <Button
            className="rounded-2xl gap-2 self-start sm:self-auto"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            مشروع جديد
          </Button>
        </div>

        {/* Mobile Cards */}
        {!loading && (
          <div className="grid gap-4 sm:hidden">
            {projects.map((p) => (
              <div key={p.id} className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">{p.title}</div>
                    <div className="mt-1 flex items-center gap-2">
                      {p.type ? <Badge variant="outline">{p.type}</Badge> : null}
                      <Badge>{p.published ? "منشور" : "مسودة"}</Badge>
                      {p.is_featured ? <Badge variant="secondary">مميز</Badge> : null}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{p.slug}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(p); setOpen(true); }}>تعديل</Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteProject(p)}>حذف</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop Table */}
        {loading ? <div className="text-muted-foreground">جاري التحميل...</div> : <ProjectsTable projects={projects} onEdit={(p) => { setEditing(p); setOpen(true); }} onDelete={deleteProject} />}

        {/* Dialog (Controlled, بدون DialogTrigger) */}
        <ProjectFormDialog
          open={open}
          setOpen={setOpen}
          initial={editing}
          saving={saving}
          uploading={uploading}
          onUpload={uploadFile}
          onSubmit={async (payload, edit) => {
            await upsertProject(payload, edit ?? undefined);
            setEditing(null);
          }}
        />
      </div>
    </AdminLayout>
  );
}
