import { BlockType, SpecialBlockType } from '@prisma/client'
import { z } from 'zod'

export const formSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  settings: z.any().optional(),
  blocks: z.array(z.object({
    type: z.nativeEnum(BlockType),
    isSpecial: z.nativeEnum(SpecialBlockType).optional(),
    question: z.string(),
    description: z.string().optional(),
    buttonText: z.string().optional(),
    buttonUrl: z.string().optional(),
    required: z.boolean().optional(),
    placeholder: z.string().optional(),
    options: z.array(z.string()).optional(),
    maxLength: z.number().optional(),
    minValue: z.number().optional(),
    maxValue: z.number().optional(),
    maxFileSize: z.number().optional(),
    order: z.number()
  }))
})

export type FormData = z.infer<typeof formSchema> 