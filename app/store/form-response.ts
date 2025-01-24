import { FormBlock } from '@/app/types/form';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isValidPhoneNumber } from 'libphonenumber-js'
import type { CountryCode } from 'libphonenumber-js'

interface FormResponse {
  [blockId: string]: string | string[] | File | null
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
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
  setResponse: (blockId: string, value: string | string[] | File) => void
  goToNextBlock: () => void
  goToPreviousBlock: () => void
  validateCurrentBlock: () => ValidationResult
  submitForm: () => Promise<void>
  
  // Computed
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
      isLastBlock: false,

      // Define as a selector instead of a getter
      getCurrentBlock: () => {
        const state = get()
        return state.blocks[state.currentBlockIndex] || null
      },

      // Actions
      initializeForm: (formId: string, blocks: FormBlock[]) => {
        set({ 
          formId, 
          blocks, 
          currentBlockIndex: 0, 
          responses: {}, 
          isCurrentBlockValid: true,
          isLastBlock: blocks.length === 1
        })
        console.log('Store state after init:', get())
      },

      setResponse: (blockId: string, value: string | string[] | File) => {
        set((state) => ({
          responses: { ...state.responses, [blockId]: value },
        }))
        get().validateCurrentBlock()
      },

      goToNextBlock: () => {
        const state = get()
        if (state.isCurrentBlockValid && state.currentBlockIndex < state.blocks.length - 1) {
          const newIndex = state.currentBlockIndex + 1
          const currentBlock = state.blocks[state.currentBlockIndex]
          const currentResponse = state.responses[currentBlock.id]
          
          // Clear file response if it exceeds size limit
          if (currentBlock.type === 'fileUpload' && 
              currentResponse && 
              (currentResponse as File).size > (currentBlock.maxFileSize || 0)) {
            set({ 
              currentBlockIndex: newIndex,
              isCurrentBlockValid: true,
              isLastBlock: newIndex === state.blocks.length - 2,
              responses: {
                ...state.responses,
                [currentBlock.id]: null
              }
            })
          } else {
            set({ 
              currentBlockIndex: newIndex,
              isCurrentBlockValid: true,
              isLastBlock: newIndex === state.blocks.length - 2
            })
          }
        }
      },

      goToPreviousBlock: () => {
        const state = get()
        if (state.currentBlockIndex > 0) {
          const newIndex = state.currentBlockIndex - 1
          const currentBlock = state.blocks[state.currentBlockIndex]
          const currentResponse = state.responses[currentBlock.id]
          
          // Clear file response if it exceeds size limit
          if (currentBlock.type === 'fileUpload' && 
              currentResponse && 
              (currentResponse as File).size > (currentBlock.maxFileSize || 0)) {
            set({ 
              currentBlockIndex: newIndex,
              isCurrentBlockValid: true,
              isLastBlock: newIndex === state.blocks.length - 2,
              responses: {
                ...state.responses,
                [currentBlock.id]: null
              }
            })
          } else {
            set({ 
              currentBlockIndex: newIndex,
              isCurrentBlockValid: true,
              isLastBlock: newIndex === state.blocks.length - 2
            })
          }
        }
      },

      validateCurrentBlock: (): ValidationResult => {
        const currentBlock = get().getCurrentBlock()
        const responses = get().responses
        console.log('Validating block:', {
          currentBlock,
          response: currentBlock ? responses[currentBlock.id] : null,
          required: currentBlock?.required
        })
        
        if (!currentBlock) return { isValid: false, message: 'Invalid block' }
        
        // Statement blocks are always valid
        if (currentBlock.type === 'statement') {
          set({ isCurrentBlockValid: true })
          return { isValid: true }
        }

        const response = responses[currentBlock.id]

        // Required field validation
        if (currentBlock.required) {
          // For multiSelect, check if at least one option is selected
          if (currentBlock.type === 'multiSelect') {
            const selections = response as string[] || []
            if (selections.length === 0) {
              set({ isCurrentBlockValid: false })
              return { isValid: false, message: 'This field is required.' }
            }
          }
          // For singleSelect and text inputs, check if response exists
          else if (!response || (typeof response === 'string' && response.trim() === '')) {
            set({ isCurrentBlockValid: false })
            return { isValid: false, message: 'This field is required.' }
          }
        }

        // Type-specific validation
        if (response) {
          switch (currentBlock.type) {
            case 'shortText':
            case 'longText':
              if (currentBlock.maxLength && 
                  typeof response === 'string' && 
                  response.length > currentBlock.maxLength) {
                set({ isCurrentBlockValid: false })
                return { 
                  isValid: false, 
                  message: `Text cannot exceed ${currentBlock.maxLength} characters.`
                }
              }
              break

            case 'email':
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              if (!emailRegex.test(response as string)) {
                set({ isCurrentBlockValid: false })
                return { 
                  isValid: false, 
                  message: 'Please enter a valid email address.'
                }
              }
              break

            case 'phone':
              const [country, number] = (response as string)?.split('-') || []
              if (number) {
                try {
                  const isValid = isValidPhoneNumber(number, country as CountryCode)
                  if (!isValid) {
                    set({ isCurrentBlockValid: false })
                    return { 
                      isValid: false, 
                      message: 'Please enter a valid phone number'
                    }
                  }
                } catch {
                  set({ isCurrentBlockValid: false })
                  return { 
                    isValid: false, 
                    message: 'Please enter a valid phone number'
                  }
                }
              }
              break

            case 'url':
              const urlString = (response as string).trim().toLowerCase()
              
              // Basic URL pattern
              const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/
              
              let isValidUrl = false
              try {
                // First check pattern
                if (urlPattern.test(urlString)) {
                  // Then try constructing URL
                  new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`)
                  isValidUrl = true
                }
              } catch {
                isValidUrl = false
              }
              
              if (!isValidUrl) {
                set({ isCurrentBlockValid: false })
                return { 
                  isValid: false, 
                  message: 'Please enter a valid URL'
                }
              }
              break

            case 'number':
              const numValue = Number(response)
              if (isNaN(numValue)) {
                set({ isCurrentBlockValid: false })
                return { 
                  isValid: false, 
                  message: 'Please enter a valid number.'
                }
              }
              if (currentBlock.minValue && numValue < currentBlock.minValue) {
                set({ isCurrentBlockValid: false })
                return { 
                  isValid: false, 
                  message: `Value must be greater than or equal to ${currentBlock.minValue}.`
                }
              }
              if (currentBlock.maxValue && numValue > currentBlock.maxValue) {
                set({ isCurrentBlockValid: false })
                return { 
                  isValid: false, 
                  message: `Value must be less than or equal to ${currentBlock.maxValue}.`
                }
              }
              break

            case 'fileUpload':
              const file = response as File
              if (!file) {
                set({ isCurrentBlockValid: false })
                return { 
                  isValid: false, 
                  message: 'Please upload a file.'
                }
              }
              if (currentBlock.maxFileSize && file.size > currentBlock.maxFileSize) {
                set({ isCurrentBlockValid: false })
                return { 
                  isValid: false, 
                  message: `File size exceeds maximum limit of ${currentBlock.maxFileSize / (1024 * 1024)}MB.`
                }
              }
              break

            case 'date':
              const dateValue = new Date(response as string)
              if (isNaN(dateValue.getTime())) {
                set({ isCurrentBlockValid: false })
                return { 
                  isValid: false, 
                  message: 'Please enter a valid date.'
                }
              }
              break
          }
        }

        // If we get here, the block is valid
        set({ isCurrentBlockValid: true })
        return { isValid: true }
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