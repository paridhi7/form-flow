'use client'

import { BlockType, FormBlock, useFormBuilder } from "@/app/store/form-builder";
import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useState } from "react";
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

export default function FormBuilder({ formId }: FormBuilderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addBlock, setInitialFormState } = useFormBuilder();

  // Add React Query to fetch form data
  const { isLoading } = useQuery<FormData, Error>({
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

  const handleAddBlock = (type: BlockType) => {
    addBlock(type);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <FormBuilderHeader formId={formId} />
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