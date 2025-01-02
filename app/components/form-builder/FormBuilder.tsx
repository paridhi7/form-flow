'use client'

import { BlockType, FormBlock, useFormBuilder } from "@/app/store/form-builder";
import { api } from "@/lib/api";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import BlockSelectionModal from "./blocks/BlockSelectionModal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const { addBlock, blocks, setInitialFormState } = useFormBuilder();

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
  const { isLoading, data: formData } = useQuery<FormData, Error>({
    queryKey: ['form', formId],
    queryFn: () => api.getForm(formId),
    enabled: !!formId,
    onSuccess: (data: FormData) => {
      setInitialFormState({
        title: data.title,
        blocks: data.blocks
      });
    }
  } as UseQueryOptions<FormData, Error>);

  // Create debounced save function for blocks only
  const debouncedSave = useCallback(
    () => {
      const save = debounce(() => {
        if (formData) {
          saveForm({
            title: formData.title,  // Use existing title
            blocks  // Only blocks trigger auto-save
          });
        }
      }, 2000);
      save();
      return save.cancel;
    },
    [blocks, formData, saveForm]
  );

  // Auto-save when blocks change
  useEffect(() => {
    const cancelSave = debouncedSave();
    return () => cancelSave();
  }, [debouncedSave]);

  const handleAddBlock = (type: BlockType) => {
    addBlock(type);
    setIsModalOpen(false);
  };

  // Immediate save for title changes
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
        <LeftSidebar />
        <PreviewArea />
        <RightSidebar />
      </div>
      <BlockSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectBlock={handleAddBlock}
      />
    </>
  );
}