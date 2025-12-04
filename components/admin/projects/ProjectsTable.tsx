// C:\Users\Dell\Downloads\code\components\admin\projects\ProjectsTable.tsx
"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

const statusColors = {
  ongoing: "bg-blue-500/10 text-blue-700",
  completed: "bg-green-500/10 text-green-700",
  planned: "bg-amber-500/10 text-amber-700",
} as const;

const statusLabels = { ongoing: "تحت الإنشاء", completed: "مكتمل", planned: "مخطط" } as const;

export default function ProjectsTable({
  projects,
  onEdit,
  onDelete,
}: {
  projects: Project[];
  onEdit: (p: Project) => void;
  onDelete: (p: Project) => void;
}) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden hidden sm:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px]">
          <thead className="bg-muted">
            <tr>
              <th className="text-right px-6 py-4 text-sm font-medium text-foreground">العنوان</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-foreground">Slug</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-foreground">النوع</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-foreground">الحالة</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-foreground">منشور</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-foreground">مميز</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-foreground">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-muted/50">
                <td className="px-6 py-4 text-card-foreground">{p.title}</td>
                <td className="px-6 py-4 text-card-foreground/70">{p.slug}</td>
                <td className="px-6 py-4">{p.type ? <Badge variant="outline">{p.type}</Badge> : "-"}</td>
                <td className="px-6 py-4">
                  <Badge className={cn(statusColors[p.status])}>{statusLabels[p.status]}</Badge>
                </td>
                <td className="px-6 py-4">{p.published ? "✓" : "—"}</td>
                <td className="px-6 py-4">{p.is_featured ? "★" : "—"}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onEdit(p)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:text-destructive" onClick={() => onDelete(p)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td className="px-6 py-10 text-center text-muted-foreground" colSpan={7}>
                  لا توجد مشاريع حتى الآن.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
