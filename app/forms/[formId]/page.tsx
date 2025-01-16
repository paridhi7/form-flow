import { notFound } from 'next/navigation'
import { FormResponse } from '../../components/FormResponse'
import { transformApiFormToFormData } from '@/lib/transforms'

export default async function FormPage({ params }: { params: Promise<{ formId: string }> }) {
  console.log('Fetching form:', (await params).formId) 

  try {
    const formId = (await params).formId
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/public/forms/${formId}`)
    console.log('Response status:', res.status)
    const form = await res.json()
    console.log('Form data:', form)
    
    if (!form || form.error) {
      notFound()
    }

    const { blocks } = transformApiFormToFormData(form)

    return (
      <FormResponse 
        formId={formId} 
        initialBlocks={blocks}
        title={form.title}
      />
    )
  } catch (error) {
    console.error('Failed to load form:', error)
    notFound()
  }
} 