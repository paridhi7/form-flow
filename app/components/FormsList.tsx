'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

interface Form {
  id: string
  title: string
  responses?: {
    id: string
  }[]
}

export function FormsList() {
  const { data: forms, isLoading, error } = useQuery<Form[]>({
    queryKey: ['forms'],
    queryFn: () => api.getForms()
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load forms. Please try again later.
      </div>
    )
  }

  if (!forms?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No forms created yet. Click the &quot;New Form&quot; button to get started.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {forms.map((form) => (
        <Link key={form.id} href={`/form/${form.id}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">{form.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {form.responses?.length || 0} responses
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}