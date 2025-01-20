'use client'

import { useFormResponse } from '@/app/store/form-response'
import { FormBlock } from '@/app/types/form'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
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
    isLastBlock,
    currentBlockIndex,
    validateCurrentBlock,
    isCurrentBlockValid,
    setResponse,
    responses
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
    if (e.key === 'Enter' && !e.shiftKey) {
      if (document.activeElement?.tagName === 'TEXTAREA') return
      if (validateCurrentBlock()) {
        goToNextBlock()
      }
    } else if (e.key === 'ArrowUp') {
      goToPreviousBlock()
    } else if (e.key === 'ArrowDown' && isCurrentBlockValid) {
      goToNextBlock()
    }
  }, [goToNextBlock, goToPreviousBlock, validateCurrentBlock, isCurrentBlockValid])

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
                validateCurrentBlock()
              }}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-between items-center">
        {/* Powered by banner */}
        <div className="text-sm text-gray-500">
          Powered by Forms Unlimited
        </div>

        {/* Navigation arrows */}
        <div className="flex gap-2">
          {currentBlockIndex > 0 && (
            <button
              onClick={goToPreviousBlock}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          )}
          
          {!isLastBlock && (
            <button
              onClick={handleNext}
              className={cn(
                "p-2 rounded-full transition-colors",
                isCurrentBlockValid 
                  ? "hover:bg-gray-100" 
                  : "opacity-50 cursor-not-allowed"
              )}
              disabled={!isCurrentBlockValid}
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}