import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { formSchema } from '../route'

// GET /api/forms/[formId] - Get a single form
export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const form = await prisma.form.findFirst({
      where: {
        id: params.formId,
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

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 }
    )
  }
}

// PUT /api/forms/[formId] - Update a form
export async function PUT(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const validatedData = formSchema.parse(json)

    // First verify ownership
    const existingForm = await prisma.form.findFirst({
      where: {
        id: params.formId,
        user: {
          email: session.user.email
        }
      }
    })

    if (!existingForm) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Update form using transaction to handle blocks update
    const updatedForm = await prisma.$transaction(async (tx) => {
      // Delete existing blocks
      await tx.formBlock.deleteMany({
        where: { formId: params.formId }
      })

      // Update form and create new blocks
      return tx.form.update({
        where: { id: params.formId },
        data: {
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
    })

    return NextResponse.json(updatedForm)
  } catch (error) {
    console.error('Error updating form:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 }
    )
  }
}

// DELETE /api/forms/[formId] - Delete a form
export async function DELETE(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership before deletion
    const form = await prisma.form.findFirst({
      where: {
        id: params.formId,
        user: {
          email: session.user.email
        }
      }
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Delete the form (cascade will handle related records)
    await prisma.form.delete({
      where: { id: params.formId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting form:', error)
    return NextResponse.json(
      { error: 'Failed to delete form' },
      { status: 500 }
    )
  }
}
