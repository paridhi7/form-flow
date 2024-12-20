import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for form creation/update
export const formSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  settings: z.object({
    theme: z.object({
      id: z.string().uuid().optional(),
      backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      questionColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      answerColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      buttonColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      buttonTextColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      font: z.enum(['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat']).optional(),
      logo: z.string().url().optional(),
      backgroundImage: z.string().url().optional(),
    }).optional(),
    successMessage: z.string().optional(),
  }).optional(),
  blocks: z.array(z.object({
    type: z.enum([
      'statement', 'shortText', 'longText', 'email', 'phone',
      'number', 'url', 'singleSelect', 'multiSelect', 'dropdown',
      'date', 'fileUpload'
    ]),
    isSpecial: z.enum(['welcome', 'thankYou']).optional(),
    question: z.string(),
    description: z.string().optional(),
    buttonText: z.string().optional(),
    buttonUrl: z.string().optional(),
    required: z.boolean(),
    placeholder: z.string().optional(),
    options: z.array(z.string()).optional(),
    maxLength: z.number().optional(),
    minValue: z.number().optional(),
    maxValue: z.number().optional(),
    maxFileSize: z.number().optional(),
    order: z.number()
  }))
})

// GET /api/forms - List all forms for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const forms = await prisma.form.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        blocks: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(forms)
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    )
  }
}

// POST /api/forms - Create a new form
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const validatedData = formSchema.parse(json)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const form = await prisma.form.create({
      data: {
        userId: user.id,
        title: validatedData.title,
        description: validatedData.description,
        settings: validatedData.settings,
        blocks: {
          create: validatedData.blocks.map(block => ({
            type: block.type,
            isSpecial: block.isSpecial,
            question: block.question,
            description: block.description,
            buttonText: block.buttonText,
            buttonUrl: block.buttonUrl,
            required: block.required,
            placeholder: block.placeholder,
            options: block.options,
            maxLength: block.maxLength,
            minValue: block.minValue,
            maxValue: block.maxValue,
            maxFileSize: block.maxFileSize,
            order: block.order
          }))
        }
      },
      include: {
        blocks: true
      }
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error creating form:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 500 }
    )
  }
} 