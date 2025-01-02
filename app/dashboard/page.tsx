'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { FormsList } from "@/app/components/FormsList"

export default function DashboardPage() {
  const router = useRouter()

  const handleNewForm = async () => {
    try {
      // Create a new form with minimal data
      const newForm = await api.createForm({
        title: "My Form",
        blocks: []
      })
      
      // Redirect to form builder
      router.push(`/form/${newForm.id}`)
    } catch (error) {
      console.error("Failed to create form:", error)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Forms</h1>
        <Button onClick={handleNewForm}>+ New Form</Button>
      </div>
      
      <FormsList />
    </div>
  )
}
