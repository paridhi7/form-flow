'use client'
import FormBuilder from "@/app/components/form-builder/FormBuilder"

export default function FormBuilderPage({ params }: { params: { formId: string } }) {
  return (
    <div className="h-screen flex flex-col">
      <FormBuilder formId={params.formId} />
    </div>
  );
}