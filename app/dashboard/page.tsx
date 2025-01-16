'use client'

import { FormsList } from "@/app/components/FormsList"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/app/components/UserNav"
import { api } from "@/lib/api"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  const handleNewForm = async () => {
    try {
      const newForm = await api.createForm({
        title: "My Form",
        blocks: []
      })
      router.push(`/form/${newForm.id}`)
    } catch (error) {
      console.error("Failed to create form:", error)
    }
  }

  return (
    <div className="px-28">
      <div className="border-b">
        <div className="container flex h-14 mt-4 items-center justify-between">
          <Image 
            src="/logo.png" 
            alt="FormFlow" 
            width={130} 
            height={32}
          />
          <UserNav />
        </div>
      </div>

      <div className="container py-8 items-center mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Forms</h1>
          <Button onClick={handleNewForm} variant="default">+ New Form</Button>
        </div>
        
        <FormsList />
      </div>
    </div>
  )
}
