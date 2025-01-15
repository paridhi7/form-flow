import { ApiForm, ApiFormBlock, FormBlock, FormData } from '@/app/types/form';

export function transformApiBlockToFormBlock(block: ApiFormBlock): FormBlock {
  return {
    id: block.id,
    type: block.type,
    isSpecial: block.isSpecial || undefined,
    question: block.question,
    description: block.description || undefined,
    buttonText: block.buttonText || undefined,
    buttonUrl: block.buttonUrl || undefined,
    required: block.required,
    placeholder: block.placeholder || undefined,
    options: block.options,
    maxLength: block.maxLength || undefined,
    minValue: block.minValue || undefined,
    maxValue: block.maxValue || undefined,
    maxFileSize: block.maxFileSize || undefined,
  };
}

export function transformApiFormToFormData(apiForm: ApiForm): FormData {
  const sortedBlocks = [...apiForm.blocks].sort((a, b) => a.order - b.order);
  return {
    title: apiForm.title,
    blocks: sortedBlocks.map(transformApiBlockToFormBlock)
  };
} 