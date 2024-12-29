import { prisma } from '@/lib/prisma'
import { formSchema } from '@/app/lib/validations/form'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/options'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
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
        blocks: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error creating form:', error)
    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
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