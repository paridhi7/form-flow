'use client'

import { FormBlock } from '@/app/types/form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Calendar } from 'lucide-react'

interface ResponseBlockProps {
  block: FormBlock
  onNext: () => void
  response?: string | string[] | File
  onResponseChange?: (value: string | string[] | File) => void
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
          value={typeof response === 'string' ? response : ''}
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
          value={typeof response === 'string' ? response : ''}
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

  // Single select (radio)
  if (block.type === 'singleSelect') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{block.question}</h2>
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <RadioGroup
          value={response as string}
          onValueChange={(value) => onResponseChange?.(value)}
          className="mt-4 space-y-3"
        >
          {block?.options?.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        <NextButton />
      </div>
    )
  }

  // Multi select (checkboxes)
  if (block.type === 'multiSelect') {
    const selectedOptions = Array.isArray(response) ? response : []
    
    const handleCheckboxChange = (option: string, checked: boolean) => {
      if (!onResponseChange) return
      
      const newSelection = checked
        ? [...selectedOptions, option]
        : selectedOptions.filter(item => item !== option)
      
      onResponseChange(newSelection)
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{block.question}</h2>
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <div className="mt-4 space-y-3">
          {block?.options?.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={selectedOptions.includes(option)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange(option, checked as boolean)
                }
              />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </div>
        <NextButton />
      </div>
    )
  }

  // Email input
  if (block.type === 'email') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{block.question}</h2>
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <Input
          type="email"
          value={response as string}
          onChange={(e) => onResponseChange?.(e.target.value)}
          placeholder={block.placeholder || 'Enter your email'}
          required={block.required}
          className="mt-4"
        />
        <NextButton />
      </div>
    )
  }

  // Number input
  if (block.type === 'number') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{block.question}</h2>
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <Input
          type="number"
          value={response as string}
          onChange={(e) => onResponseChange?.(e.target.value)}
          placeholder={block.placeholder}
          required={block.required}
          min={block.minValue}
          max={block.maxValue}
          className="mt-4"
        />
        <NextButton />
      </div>
    )
  }

  // Phone input
  if (block.type === 'phone') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{block.question}</h2>
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <div className="flex gap-2 items-center">
          <select className="p-2 border rounded-md bg-white w-[100px]">
            <option>🇮🇳 +91</option>
          </select>
          <Input
            type="tel"
            value={response as string}
            onChange={(e) => onResponseChange?.(e.target.value)}
            placeholder={block.placeholder || "Phone number"}
            required={block.required}
            className="flex-1"
          />
        </div>
        <NextButton />
      </div>
    )
  }

  // URL input
  if (block.type === 'url') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{block.question}</h2>
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <Input
          type="url"
          value={response as string}
          onChange={(e) => onResponseChange?.(e.target.value)}
          placeholder={block.placeholder || "https://example.com"}
          required={block.required}
          className="mt-4"
        />
        <NextButton />
      </div>
    )
  }

  // Dropdown
  if (block.type === 'dropdown') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{block.question}</h2>
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <Select 
          value={response as string} 
          onValueChange={(value) => onResponseChange?.(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {block.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <NextButton />
      </div>
    )
  }

  // Date
  if (block.type === 'date') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{block.question}</h2>
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <div className="relative">
          <Input
            type="date"
            value={response as string}
            onChange={(e) => onResponseChange?.(e.target.value)}
            className="w-full p-2 pr-8"
          />
          <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
        </div>
        <NextButton />
      </div>
    )
  }

  // File Upload
  if (block.type === 'fileUpload') {
    const maxSizeMB = ((block.maxFileSize || 0) / (1024 * 1024)).toFixed(0)
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{block.question}</h2>
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50">
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onResponseChange?.(file) // Now passing the actual File object
            }}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <p className="text-gray-500">
              {response ? `Selected: ${(response as unknown as File).name}` : 'Drag and drop a file here, or click to select'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Maximum file size: {maxSizeMB} MB
            </p>
          </label>
        </div>
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