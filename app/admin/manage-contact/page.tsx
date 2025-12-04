"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { AdminLayout } from "@/components/admin-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Eye, Loader2, CheckCircle } from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Message = {
  id: string
  full_name: string
  email: string
  phone: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export default function ManageContactPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)
  const [updating, setUpdating] = useState(false)

  // جلب الرسائل
  async function fetchMessages() {
    setLoading(true)
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) setMessages(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  // تعليم الرسالة كمقروءة
  async function markAsRead(id: string) {
    setUpdating(true)
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id)
    setUpdating(false)
    fetchMessages()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">الرسائل</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            عرض وإدارة رسائل التواصل
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            جاري التحميل...
          </div>
        ) : messages.length === 0 ? (
          <p className="text-muted-foreground">لا توجد رسائل حالياً</p>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="grid gap-4 sm:hidden">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="bg-card rounded-2xl p-4 shadow-sm border border-border"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div
                        className={`font-semibold truncate ${
                          !m.is_read ? "text-foreground" : "text-card-foreground/80"
                        }`}
                      >
                        {m.full_name}
                      </div>
                      <div className="text-xs text-card-foreground/60 truncate">
                        {m.email}
                      </div>
                    </div>
                    <div>
                      {!m.is_read ? (
                        <Badge className="bg-blue-500/10 text-blue-700 flex items-center gap-1">
                          <Mail className="h-3 w-3" /> جديدة
                        </Badge>
                      ) : (
                        <Badge variant="outline">مقروءة</Badge>
                      )}
                    </div>
                  </div>

                  <div
                    className={`mt-2 ${
                      !m.is_read ? "text-foreground" : "text-card-foreground/70"
                    }`}
                  >
                    <div className="text-sm line-clamp-2">{m.subject}</div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-card-foreground/60">
                    <span>
                      {new Date(m.created_at).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-8 w-8"
                      onClick={() => setSelected(m)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block bg-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-right px-6 py-4 text-sm font-medium text-foreground">
                        المرسل
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-foreground">
                        الموضوع
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-foreground">
                        التاريخ
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-foreground">
                        الحالة
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-foreground">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {messages.map((m) => (
                      <tr key={m.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div>
                            <div
                              className={`font-medium ${
                                !m.is_read
                                  ? "text-foreground"
                                  : "text-card-foreground/70"
                              }`}
                            >
                              {m.full_name}
                            </div>
                            <div className="text-sm text-card-foreground/60">
                              {m.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={
                              !m.is_read
                                ? "font-medium text-foreground"
                                : "text-card-foreground/70"
                            }
                          >
                            {m.subject}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-card-foreground/70">
                          {new Date(m.created_at).toLocaleDateString("ar-SA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          {!m.is_read ? (
                            <Badge className="bg-blue-500/10 text-blue-700">
                              <Mail className="h-3 w-3 ml-1" /> جديدة
                            </Badge>
                          ) : (
                            <Badge variant="outline">مقروءة</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => setSelected(m)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Popup Message Viewer */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl max-w-2xl w-full shadow-2xl p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 left-3 p-2 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">{selected.subject}</h2>

            <div className="space-y-2 mb-4 text-sm text-muted-foreground">
              <p>
                <strong>الاسم:</strong> {selected.full_name}
              </p>
              <p>
                <strong>البريد:</strong> {selected.email}
              </p>
              <p>
                <strong>الهاتف:</strong> {selected.phone}
              </p>
              <p>
                <strong>التاريخ:</strong>{" "}
                {new Date(selected.created_at).toLocaleString("ar-SA")}
              </p>
            </div>

            <p className="whitespace-pre-line leading-relaxed text-card-foreground/90 mb-6">
              {selected.message}
            </p>

            <div className="flex justify-end gap-2">
              {!selected.is_read && (
                <Button
                  onClick={() => markAsRead(selected.id)}
                  disabled={updating}
                  className="rounded-2xl gap-2"
                >
                  {updating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  تعليم كمقروءة
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setSelected(null)}
                className="rounded-2xl"
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
