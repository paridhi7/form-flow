import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

export type BlockType = 
  | 'statement'
  | 'shortText'
  | 'longText'
  | 'email'
  | 'phone'
  | 'number'
  | 'url'
  | 'singleSelect'
  | 'multiSelect'
  | 'dropdown'
  | 'date'
  | 'fileUpload';

export type SpecialBlockType = 'welcome' | 'thankYou';

export interface FormBlock {
  id: string;
  type: BlockType;
  isSpecial?: SpecialBlockType;
  question: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  required: boolean;
  placeholder?: string;
  options?: string[];      // for singleSelect, multiSelect, dropdown
  maxLength?: number;      // for text inputs
  minValue?: number;      // for number input
  maxValue?: number;      // for number input
  allowedFileTypes?: string[]; // for fileUpload
  maxFileSize?: number;   // for fileUpload (in bytes)
}

interface FormBuilderStore {
  blocks: FormBlock[];
  selectedBlockId: string | null;
  formTitle: string;
  setFormTitle: (title: string) => void;
  addBlock: (type: BlockType) => string;
  updateBlock: (id: string, block: Partial<FormBlock>) => void;
  deleteBlock: (id: string) => void;
  setSelectedBlock: (id: string | null) => void;
  duplicateBlock: (id: string) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  setInitialFormState: (data: { title: string; blocks: FormBlock[] }) => void;
  onSave?: (blocks: FormBlock[]) => Promise<void>;
  setOnSave: (callback: (blocks: FormBlock[]) => Promise<void>) => void;
}

export const useFormBuilder = create<FormBuilderStore>((set) => ({
  blocks: [],
  selectedBlockId: null,
  formTitle: 'My Form',
  setFormTitle: (title) => set({ formTitle: title }),
  
  addBlock: (type) => {
    const newBlockId = uuidv4();

    const getDefaultQuestion = (type: BlockType) => {
      switch (type) {
        case 'shortText':
        case 'longText':
          return '';
        case 'statement':
          return '';
        case 'email':
          return 'Please enter your email';
        case 'phone':
          return 'Please enter your phone number';
        case 'number':
          return 'Please enter a number';
        case 'url':
          return 'Please enter a URL';
        case 'singleSelect':
        case 'multiSelect':
        case 'dropdown':
          return 'Please choose 👇🏻';
        case 'date':
          return 'Please select a date';
        case 'fileUpload':
          return 'Please upload a file';
        default:
          return '';
      }
    };

    set((state) => ({
      blocks: [...state.blocks, {
        id: newBlockId,
        type,
        question: getDefaultQuestion(type),
        buttonText: 'Next',
        required: false,
        ...((['singleSelect', 'multiSelect', 'dropdown'].includes(type)) 
          ? { options: ['Option 1'] } 
          : {}),
        ...(type === 'fileUpload' 
          ? { 
              allowedFileTypes: ['image/*', 'application/pdf'],
              maxFileSize: 5 * 1024 * 1024  // 5MB default
            } 
          : {})
      }],
      selectedBlockId: newBlockId
    }));
    return newBlockId;
  },

  updateBlock: (id: string, updates: Partial<FormBlock>) => set((state) => {
    const newBlocks = state.blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    );
    
    // Trigger save after update
    state.onSave?.(newBlocks);
    
    return { blocks: newBlocks };
  }),

  deleteBlock: (id) =>
    set((state) => {
      const blockToDelete = state.blocks.find(b => b.id === id);
      if (blockToDelete?.isSpecial === 'thankYou') return state;

      return {
        blocks: state.blocks.filter((b) => b.id !== id),
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId
      };
    }),

  setSelectedBlock: (id) =>
    set({ selectedBlockId: id }),

  duplicateBlock: (id: string) => {
    set((state) => {
      const blockToDuplicate = state.blocks.find(b => b.id === id);
      if (!blockToDuplicate) return state;

      const newBlock = {
        ...blockToDuplicate,
        id: uuidv4(),
        question: `${blockToDuplicate.question} (Copy)`
      };

      const index = state.blocks.findIndex(b => b.id === id);
      const newBlocks = [...state.blocks];
      newBlocks.splice(index + 1, 0, newBlock);

      return {
        blocks: newBlocks,
        selectedBlockId: newBlock.id
      };
    });
  },

  reorderBlocks: (activeId: string, overId: string) => {
    set((state) => {
      const oldIndex = state.blocks.findIndex((block) => block.id === activeId);
      const newIndex = state.blocks.findIndex((block) => block.id === overId);

      const newBlocks = [...state.blocks];
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      return {
        blocks: newBlocks
      };
    });
  },

  setInitialFormState: (data) => {
    const blocks = [...data.blocks];

    // Only add default special blocks if they don't exist
    const hasWelcome = blocks.some(b => b.isSpecial === 'welcome');
    const hasThankYou = blocks.some(b => b.isSpecial === 'thankYou');

    const finalBlocks = [
      // Keep existing blocks in their order
      ...blocks,

      // Add thank you block at the end if it doesn't exist
      ...(!hasThankYou ? [{
        id: uuidv4(),
        type: 'statement' as const,
        isSpecial: 'thankYou' as const,
        question: 'Thank you! 🙌🏻',
        description: 'You may now close this window.',
        buttonText: 'Create your own Forms (Unlimited)',
        buttonUrl: 'formsunlimited.com',
        required: false
      }] : [])
    ];

    // If no welcome block exists, add it at the beginning
    if (!hasWelcome) {
      finalBlocks.unshift({
        id: uuidv4(),
        type: 'statement' as const,
        isSpecial: 'welcome' as const,
        question: 'Hey there 😊',
        description: 'Mind filling out this form?',
        buttonText: "Let's start",
        required: false
      });
    }

    set({
      formTitle: data.title,
      blocks: finalBlocks
    });
  },

  onSave: undefined,
  setOnSave: (callback) => set({ onSave: callback }),
}));