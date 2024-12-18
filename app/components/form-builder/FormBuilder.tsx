import { BlockType, useFormBuilder } from "@/app/store/form-builder";
import { useState } from "react";
import BlockSelectionModal from "./blocks/BlockSelectionModal";
import FormBuilderHeader from "./FormBuilderHeader";
import LeftSidebar from "./LeftSidebar";
import PreviewArea from "./PreviewArea";
import RightSidebar from "./RightSidebar";

interface FormBuilderProps {
  formId: string;
}

export default function FormBuilder({ formId }: FormBuilderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addBlock } = useFormBuilder();

  const handleAddBlock = (type: BlockType) => {
    addBlock(type);
    setIsModalOpen(false);
  };

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