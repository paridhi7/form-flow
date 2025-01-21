'use client'

import { FormBlock } from '@/app/types/form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  Select as SelectPrimitive,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { CountryCode } from 'libphonenumber-js'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'
import { AlertTriangle, ArrowRight, Calendar, Check, X } from 'lucide-react'
import Select, { SingleValue } from 'react-select'

interface ResponseBlockProps {
  block: FormBlock
  onNext: () => void
  response?: string | string[] | File | null
  onResponseChange?: (value: string | string[] | File) => void
  isValid: boolean
  validationMessage?: string
  isLastBlock: boolean
}

export function ResponseBlock({ 
  block, 
  onNext, 
  response = '', 
  onResponseChange,
  isValid,
  validationMessage,
  isLastBlock
}: ResponseBlockProps) {

  const showCmdEnterHint = ['longText', 'dropdown', 'phone', 'fileUpload'].includes(block.type)

  // Validation message component
  const ValidationMessage = () => (
    !isValid && validationMessage ? (
      <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-md">
        <AlertTriangle className="h-4 w-4" />
        <span>{validationMessage}</span>
      </div>
    ) : null
  )

  // Common button component
  const NextButton = () => {
    const handleClick = () => {
      if (block.isSpecial === 'thankYou' && block.buttonUrl) {
        const url = block.buttonUrl.startsWith('http') 
          ? block.buttonUrl 
          : `https://${block.buttonUrl}`
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        onNext()
      }
    }
  
    return (
      <div className={cn(
        "flex items-center gap-2",
        block.type === 'statement' ? "justify-center" : "" // Center align for statement blocks
      )}>
        <Button 
          onClick={handleClick}
          className="mt-8 px-8"
          size="lg"
        >
          <span>{isLastBlock ? 'Submit' : block.buttonText || 'Continue'}</span>
          {isLastBlock ? <Check className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
        {/* Hide enter span on thankYou blocks */}
        {block.isSpecial !== 'thankYou' && (
          <span className="text-sm text-slate-500 mt-8">
            press {showCmdEnterHint ? "⌘ + Enter" : "Enter"} ↵
          </span>
        )}
      </div>
    )
  }

  const QuestionTitle = ({ question, required }: { question: string, required?: boolean }) => (
    <h2 className="text-2xl font-semibold">
      {question}
      {required && <span className="text-red-500 ml-1">*</span>}
    </h2>
  )

  // Add this helper function at the top of the component
  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  // Add this helper to get full country names
  const getCountryName = (countryCode: string) => {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
    try {
      return regionNames.of(countryCode)
    } catch {
      return countryCode
    }
  }

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
        <QuestionTitle question={block.question} required={block.required} />
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <Input
          autoFocus
          value={typeof response === 'string' ? response : ''}
          onChange={(e) => onResponseChange?.(e.target.value)}
          placeholder={block.placeholder}
          maxLength={block.maxLength}
          required={block.required}
          className="mt-4"
        />
        <ValidationMessage />
        <NextButton />
      </div>
    )
  }

  // Long text input
  if (block.type === 'longText') {
    return (
      <div className="space-y-6">
        <QuestionTitle question={block.question} required={block.required} />
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <Textarea
          autoFocus
          value={typeof response === 'string' ? response : ''}
          onChange={(e) => onResponseChange?.(e.target.value)}
          placeholder={block.placeholder}
          maxLength={block.maxLength}
          required={block.required}
          className="mt-4 min-h-[150px]"
        />
        <ValidationMessage />
        <NextButton />
      </div>
    )
  }

  // Single select (radio)
  if (block.type === 'singleSelect') {
    return (
      <div className="space-y-6">
        <QuestionTitle question={block.question} required={block.required} />
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
        <ValidationMessage />
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
        <QuestionTitle question={block.question} required={block.required} />
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
        <ValidationMessage />
        <NextButton />
      </div>
    )
  }

  // Email input
  if (block.type === 'email') {
    return (
      <div className="space-y-6">
        <QuestionTitle question={block.question} required={block.required} />
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <Input
          autoFocus
          type="email"
          value={response as string}
          onChange={(e) => onResponseChange?.(e.target.value)}
          placeholder={block.placeholder || 'Enter your email'}
          required={block.required}
          className="mt-4"
        />
        <ValidationMessage />
        <NextButton />
      </div>
    )
  }

  // Number input
  if (block.type === 'number') {
    return (
      <div className="space-y-6">
        <QuestionTitle question={block.question} required={block.required} />
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <Input
          autoFocus
          type="number"
          value={response as string}
          onChange={(e) => onResponseChange?.(e.target.value)}
          placeholder={block.placeholder}
          required={block.required}
          min={block.minValue}
          max={block.maxValue}
          className="mt-4"
        />
        <ValidationMessage />
        <NextButton />
      </div>
    )
  }

  // Phone input
  if (block.type === 'phone') {
    const countries = getCountries()
    const options = countries.map(country => ({
      value: country,
      label: `${getCountryFlag(country)} ${getCountryName(country)} +${getCountryCallingCode(country as CountryCode)}`
    }))
    
    return (
      <div className="space-y-6">
        <QuestionTitle question={block.question} required={block.required} />
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <div className="flex gap-2 items-center">
          <Select
            className="w-[200px]"
            options={options}
            value={options.find(opt => opt.value === ((response as string)?.split('-')[0] || 'IN'))}
            onChange={(selected: SingleValue<{ value: string, label: string }>) => {
              const number = (response as string)?.split('-')[1] || ''
              onResponseChange?.(`${selected?.value}-${number}`)
            }}
            isSearchable={true}
          />
          <Input
            autoFocus
            type="tel"
            value={(response as string)?.split('-')[1] || ''}
            onChange={(e) => {
              const country = (response as string)?.split('-')[0] || 'IN'
              onResponseChange?.(`${country}-${e.target.value}`)
            }}
            placeholder={block.placeholder || "Phone number"}
            required={block.required}
            className="flex-1"
          />
        </div>
        <ValidationMessage />
        <NextButton />
      </div>
    
    )
  }

  // URL input
  if (block.type === 'url') {
    return (
      <div className="space-y-6">
        <QuestionTitle question={block.question} required={block.required} />
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <Input
          autoFocus
          type="url"
          value={response as string}
          onChange={(e) => onResponseChange?.(e.target.value)}
          placeholder={block.placeholder || "https://example.com"}
          required={block.required}
          className="mt-4"
        />
        <ValidationMessage />
        <NextButton />
      </div>
    )
  }

  // Dropdown
  if (block.type === 'dropdown') {
    return (
      <div className="space-y-6">
        <QuestionTitle question={block.question} required={block.required} />
        {block.description && (
          <p className="text-gray-600">{block.description}</p>
        )}
        <SelectPrimitive 
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
        </SelectPrimitive>
        <ValidationMessage />
        <NextButton />
      </div>
    )
  }

  // Date
  if (block.type === 'date') {
    return (
      <div className="space-y-6">
        <QuestionTitle question={block.question} required={block.required} />
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
        <ValidationMessage />
        <NextButton />
      </div>
    )
  }

  // File Upload
  if (block.type === 'fileUpload') {
    const maxSizeMB = ((block.maxFileSize || 0) / (1024 * 1024)).toFixed(0)
    return (
      <div className="space-y-6">
        <QuestionTitle question={block.question} required={block.required} />
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
            <div className="flex items-center justify-center gap-2">
              <p className="text-gray-500">
                {response && (response as File).size <= (block.maxFileSize || 0)
                  ? (
                    <span className="flex items-center gap-2">
                      Selected: {(response as File).name}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const fileInput = document.getElementById('file-upload') as HTMLInputElement
                          if (fileInput) fileInput.value = ''
                          onResponseChange?.(null as unknown as File)
                        }}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </span>
                  )
                  : 'Drag and drop a file here, or click to select'
                }
              </p>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Maximum file size: {maxSizeMB} MB
            </p>
          </label>
        </div>
        <ValidationMessage />
        <NextButton />
      </div>
    )
  }

  // Default block layout
  return (
    <div className="space-y-6">
      <QuestionTitle question={block.question} required={block.required} />
      {block.description && (
        <p className="text-gray-600">{block.description}</p>
      )}
      <ValidationMessage />
      <NextButton />
    </div>
  )
}