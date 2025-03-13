import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"

export default function PostsLoading() {
  return (
    <div className="space-y-6">
      <PageHeader title="Publicações" description="Gerencie todas as suas publicações em um só lugar" />

      <div className="flex flex-col gap-4 lg:flex-row">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-10 w-[300px]" />

        <div className="space-y-4 mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row gap-4 p-4">
                  <div className="w-full md:w-32 h-32 bg-muted rounded-md" />
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3.5 w-32" />
                      <Skeleton className="h-9 w-24 rounded-md" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

