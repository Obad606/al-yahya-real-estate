"use client"

import * as React from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { useLanguage } from "./language-provider"
import { Loader2, CheckCircle2 } from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function ContactForm() {
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "الاسم مطلوب"
    if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "البريد الإلكتروني غير صحيح"
    if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب"
    if (!formData.subject.trim()) newErrors.subject = "الموضوع مطلوب"
    if (!formData.message.trim()) newErrors.message = "الرسالة مطلوبة"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)

    // إدخال البيانات في جدول contact_messages
    const { error } = await supabase.from("contact_messages").insert([
      {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      },
    ])

    setIsSubmitting(false)

    if (error) {
      console.error("خطأ في الإرسال:", error)
      alert("حدث خطأ أثناء الإرسال، حاول مرة أخرى لاحقًا.")
      return
    }

    // نجاح العملية
    setIsSuccess(true)
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })

    // إخفاء رسالة النجاح بعد 3 ثوانٍ
    setTimeout(() => setIsSuccess(false), 3000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-card-foreground mb-2">
          تم إرسال رسالتك بنجاح!
        </h3>
        <p className="text-card-foreground/70">
          سيتم التواصل معك قريبًا من قبل الفريق المختص.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* الاسم */}
      <div>
        <Label htmlFor="name">الاسم الكامل<span className="text-destructive">*</span></Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="أدخل اسمك الكامل"
          className="mt-2 rounded-2xl"
        />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
      </div>

      {/* البريد الإلكتروني */}
      <div>
        <Label htmlFor="email">البريد الإلكتروني<span className="text-destructive">*</span></Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="example@email.com"
          className="mt-2 rounded-2xl"
        />
        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
      </div>

      {/* رقم الهاتف */}
      <div>
        <Label htmlFor="phone">رقم الهاتف<span className="text-destructive">*</span></Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="+966 XX XXX XXXX"
          className="mt-2 rounded-2xl"
        />
        {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
      </div>

      {/* الموضوع */}
      <div>
        <Label htmlFor="subject">الموضوع<span className="text-destructive">*</span></Label>
        <Input
          id="subject"
          type="text"
          value={formData.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          placeholder="موضوع الرسالة"
          className="mt-2 rounded-2xl"
        />
        {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject}</p>}
      </div>

      {/* الرسالة */}
      <div>
        <Label htmlFor="message">الرسالة<span className="text-destructive">*</span></Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="mt-2 rounded-2xl min-h-[150px]"
        />
        {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
      </div>

      {/* زر الإرسال */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 hover:scale-105 hover:rotate-1"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin ml-2" />
            جاري الإرسال...
          </>
        ) : (
          "إرسال الرسالة"
        )}
      </Button>
    </form>
  )
}
