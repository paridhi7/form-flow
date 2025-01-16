import { FormBlock } from '@/app/types/form'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FormResponse {
  [blockId: string]: string | string[] // string for text inputs, string[] for multi-select
}

interface FormResponseState {
  // Core state
  currentBlockIndex: number
  responses: FormResponse
  blocks: FormBlock[]
  formId: string | null

  // Validation
  isCurrentBlockValid: boolean
  
  // Actions
  initializeForm: (formId: string, blocks: FormBlock[]) => void
  setResponse: (blockId: string, value: string | string[]) => void
  goToNextBlock: () => void
  goToPreviousBlock: () => void
  validateCurrentBlock: () => boolean
  submitForm: () => Promise<void>
  
  // Computed
  currentBlock: FormBlock | null
  isLastBlock: boolean
  progress: number

  // Define as a selector instead of a getter
  getCurrentBlock: () => FormBlock | null
}

export const useFormResponse = create<FormResponseState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentBlockIndex: 0,
      responses: {},
      blocks: [],
      formId: null,
      isCurrentBlockValid: false,

      // Define as a selector instead of a getter
      getCurrentBlock: () => {
        const state = get()
        return state.blocks[state.currentBlockIndex] || null
      },

      // Actions
      initializeForm: (formId: string, blocks: FormBlock[]) => {
        set({ formId, blocks, currentBlockIndex: 0, responses: {} })
      },

      setResponse: (blockId: string, value: string | string[]) => {
        set((state) => ({
          responses: { ...state.responses, [blockId]: value },
          isCurrentBlockValid: true // We'll add proper validation later
        }))
      },

      goToNextBlock: () => {
        const { currentBlockIndex, blocks, isCurrentBlockValid } = get()
        if (isCurrentBlockValid && currentBlockIndex < blocks.length - 1) {
          set({ currentBlockIndex: currentBlockIndex + 1 })
        }
      },

      goToPreviousBlock: () => {
        const { currentBlockIndex } = get()
        if (currentBlockIndex > 0) {
          set({ currentBlockIndex: currentBlockIndex - 1 })
        }
      },

      validateCurrentBlock: () => {
        const { currentBlock, responses } = get()
        if (!currentBlock) return false

        const response = responses[currentBlock.id]
        const isValid = currentBlock.required ? Boolean(response) : true
        set({ isCurrentBlockValid: isValid })
        return isValid
      },

      submitForm: async () => {
        const { formId, responses } = get()
        if (!formId) return

        try {
          await fetch(`/api/forms/${formId}/responses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responses })
          })
          // Handle success (we'll add this later)
        } catch (error) {
          // Handle error (we'll add this later)
          console.error('Failed to submit form:', error)
        }
      },

      // Computed properties
      get currentBlock() {
        const state = get()
        return state.blocks[state.currentBlockIndex] || null
      },

      get isLastBlock() {
        const state = get()
        return state.currentBlockIndex === state.blocks.length - 1
      },

      get progress() {
        const state = get()
        return state.blocks.length ? (state.currentBlockIndex + 1) / state.blocks.length : 0
      }
    }),
    {
      name: 'form-response-storage',
      // Only persist necessary fields
      partialize: (state) => ({
        responses: state.responses,
        formId: state.formId,
        currentBlockIndex: state.currentBlockIndex
      })
    }
  )
) 