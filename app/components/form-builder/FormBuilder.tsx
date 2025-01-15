'use client'

import { FormBlock, useFormBuilder } from "@/app/store/form-builder";
import { ApiForm } from "@/app/types/form";
import { api } from "@/lib/api";
import { transformApiFormToFormData } from "@/lib/transforms";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import FormBuilderHeader from "./FormBuilderHeader";
import LeftSidebar from "./LeftSidebar";
import PreviewArea from "./PreviewArea";
import RightSidebar from "./RightSidebar";

interface FormBuilderProps {
  formId: string;
}

interface FormData {
  title: string;
  blocks: FormBlock[];
}

type SaveStatus = 'saved' | 'saving' | 'error' | 'idle';

export default function FormBuilder({ formId }: FormBuilderProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const { setInitialFormState } = useFormBuilder();

  // Setup save mutation
  const { mutateAsync: saveForm } = useMutation({
    mutationFn: (data: FormData) => api.updateForm(formId, {
      ...data,
      blocks: data.blocks.map((block, index) => ({
        ...block,
        order: index
      }))
    }),
    onMutate: () => setSaveStatus('saving'),
    onSuccess: () => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    },
    onError: () => {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    },
  });

  // Setup form data fetch
  const { isLoading, data: formData } = useQuery<ApiForm, Error>({
    queryKey: ['form', formId],
    queryFn: async () => {
      const data = await api.getForm(formId);
      return data;
    },
    staleTime: 0,
  } as UseQueryOptions<ApiForm, Error>);

  useEffect(() => {
    if (formData) {
      const transformedData = transformApiFormToFormData(formData);
      setInitialFormState(transformedData);
      
      // Verify the store was updated
      const currentState = useFormBuilder.getState();
      console.log('Store state after update:', currentState);
    }
  }, [formData, setInitialFormState]);

  const handleSaveBlocks = async (updatedBlocks: FormBlock[]) => {
    if (!formData) return;

    const currentTitle = useFormBuilder.getState().formTitle;
    
    await saveForm({
      title: currentTitle,
      blocks: updatedBlocks
    });
  };

  const handleSave = async (data: FormData) => {
    await saveForm(data);
  };

  if (isLoading || !formData) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <FormBuilderHeader 
        formId={formId} 
        saveStatus={saveStatus} 
        onSave={handleSave}
        initialTitle={formData.title || 'My Form'}
      />
      <div className="flex-1 flex">
        <LeftSidebar 
          onSaveBlocks={handleSaveBlocks}
        />
        <PreviewArea />
        <RightSidebar />
      </div>
    </>
  );
}