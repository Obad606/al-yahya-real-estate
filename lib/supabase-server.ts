// lib/supabase-server.ts
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

/**
 * makeServerClient:
 * - يستخدم واجهة cookies الحديثة: getAll / setAll
 * - في RSC، setAll قد لا يطبّق فعليًا (واجهة القراءة فقط)، لذلك نحاول النداء الشرطيًا
 * - في Route Handlers (app/api/*)، سيكون setAll قادرًا على التعيين
 */
export function makeServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            // في RSC: cookies().set قد لا تكون متاحة. نحاول بحذر.
            // في Route Handlers ستكون متاحة ويُكتب الكوكيز فعليًا.
            cookiesToSet.forEach(({ name, value, options }) => {
              // @ts-ignore: set قد لا تتوفّر في RSC
              cookieStore.set?.(name, value, options as any)
            })
          } catch {
            // no-op في بيئة RSC. لا نرمي خطأ.
          }
        },
      },
    }
  )
}
