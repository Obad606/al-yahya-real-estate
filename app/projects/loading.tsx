import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main id="main-content">
        {/* Header Skeleton */}
        <div className="relative w-full h-[40vh] md:h-[50vh] bg-muted animate-pulse" />

        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumbs Skeleton */}
          <div className="flex gap-2 mb-8">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>

          {/* Filters Skeleton */}
          <div className="space-y-4 mb-8">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32 rounded-2xl" />
              <Skeleton className="h-10 w-32 rounded-2xl" />
              <Skeleton className="h-10 w-32 rounded-2xl" />
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[16/10] rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
