'use client'

import { useFormResponse } from '@/app/store/form-response'
import { FormBlock } from '@/app/types/form'
import { Progress } from '@/components/ui/progress'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { ResponseBlock } from './ResponseBlock'

interface FormResponseProps {
  formId: string
  initialBlocks: FormBlock[]
  title: string
}

export function FormResponse({ formId, initialBlocks }: FormResponseProps) {
  const { 
    initializeForm, 
    getCurrentBlock,
    formId: currentFormId,
    goToNextBlock,
    goToPreviousBlock,
    progress,
    currentBlockIndex,
    validateCurrentBlock,
    isCurrentBlockValid,
    setResponse,
    isLastBlock,
    responses,
  } = useFormResponse()

  const currentBlock = getCurrentBlock()

  // Only initialize if formId changes or not initialized
  useEffect(() => {
    if (formId !== currentFormId) {
      console.log('Initializing new form:', formId)
      initializeForm(formId, initialBlocks)
    }
  }, [formId, currentFormId, initialBlocks, initializeForm])

  useEffect(() => {
    console.log('Current block updated:', currentBlock)
  }, [currentBlock])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't allow navigation on thankYou blocks
    if (currentBlock?.isSpecial === 'thankYou') return

    if (e.key === 'Enter' && !e.shiftKey) {
      if (document.activeElement?.tagName === 'TEXTAREA') return
      if (validateCurrentBlock()) {
        goToNextBlock()
      }
    } else if (e.key === 'ArrowUp') {
      goToPreviousBlock()
    } else if (e.key === 'ArrowDown' && !isLastBlock) {
      if (validateCurrentBlock()) {
        goToNextBlock()
      }
    }
  }, [goToNextBlock, goToPreviousBlock, validateCurrentBlock, currentBlock, isLastBlock])

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Add client-side only rendering
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle navigation to next block
  const handleNext = () => {
    console.log('Attempting to go to next block:', {
      isValid: isCurrentBlockValid,
      currentBlock,
      currentResponse: currentBlock ? responses[currentBlock.id] : null
    })
    
    if (validateCurrentBlock()) {
      goToNextBlock()
    }
  }

  const [validationMessage, setValidationMessage] = useState<string>()

  const handleValidation = () => {
    const result = validateCurrentBlock()
    setValidationMessage(result.message)
    return result.isValid
  }

  if (!isClient) {
    return null // Return null on server-side
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Progress value={progress * 100} className="rounded-none" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl">
          {currentBlock && (
            <ResponseBlock 
              block={currentBlock}
              onNext={handleNext}
              response={responses[currentBlock.id]}
              onResponseChange={(value) => {
                setResponse(currentBlock.id, value)
                handleValidation()
              }}
              isValid={isCurrentBlockValid}
              validationMessage={validationMessage}
              isLastBlock={isLastBlock}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-8 left-8 right-8 flex justify-between items-center">
        {/* Powered by banner */}
        <a href="https://formsunlimited.com" target="_blank" rel="noopener noreferrer">
          <div className="bg-slate-800 text-white text-xs py-2 px-4 rounded-md hover:bg-slate-700">
            Powered by Forms Unlimited
          </div>
        </a>

        {/* Navigation arrows in dark container */}
        <div className="rounded-md p-1 flex gap-1">
          {currentBlockIndex > 0 && !currentBlock?.isSpecial && (
            <button
              onClick={goToPreviousBlock}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors text-white"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
          
          {!isLastBlock && !currentBlock?.isSpecial && (
            <button
              onClick={handleNext}
              className="p-2 bg-slate-800 rounded-md transition-colors text-white hover:bg-slate-700"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}