import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">الصفحة غير موجودة</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>
        <Button asChild size="lg" className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/">
            <Home className="h-5 w-5 mr-2" />
            العودة للرئيسية
          </Link>
        </Button>
      </div>
    </div>
  )
}
