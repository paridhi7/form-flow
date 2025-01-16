'use client'

import { FormBlock } from '@/app/types/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight } from 'lucide-react'

interface ResponseBlockProps {
  block: FormBlock
  onNext: () => void
  response?: string
  onResponseChange?: (value: string) => void
}

export function ResponseBlock({ 
  block, 
  onNext, 
  response = '', 
  onResponseChange 
}: ResponseBlockProps) {
  // Common button component
  const NextButton = () => (
    <Button 
      onClick={onNext}
      className="mt-8 px-8"
      size="lg"
    >
      <span>{block.buttonText || 'Continue'}</span>
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  )

  // Statement block
  if (block.type === 'statement') {
    return (
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">{block.question}</h1>
        {block.description && (
          <p className="text-xl text-gray-600">{block.description}</p>
        )}
        <NextButton />
      </div>
    )
  }

  // Short text input
  if (block.type === 'shortText') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{block.question}</h2>
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <Input
          value={response}
          onChange={(e) => onResponseChange?.(e.target.value)}
          placeholder={block.placeholder}
          maxLength={block.maxLength}
          required={block.required}
          className="mt-4"
        />
        <NextButton />
      </div>
    )
  }

  // Long text input
  if (block.type === 'longText') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{block.question}</h2>
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <Textarea
          value={response}
          onChange={(e) => onResponseChange?.(e.target.value)}
          placeholder={block.placeholder}
          maxLength={block.maxLength}
          required={block.required}
          className="mt-4 min-h-[150px]"
        />
        <NextButton />
      </div>
    )
  }

  // Default block layout
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{block.question}</h2>
      {block.description && (
        <p className="text-gray-600">{block.description}</p>
      )}
      <NextButton />
    </div>
  )
}