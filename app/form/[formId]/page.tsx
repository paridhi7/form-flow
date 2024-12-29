
import FormBuilder from "@/app/components/form-builder/FormBuilder";
import { useParams } from "next/navigation";

export default function FormBuilderPage() {
  const params = useParams<{ formId: string }>()
  
  return (
    <div className="h-screen flex flex-col">
      <FormBuilder formId={params.formId} />
    </div>
  );
}