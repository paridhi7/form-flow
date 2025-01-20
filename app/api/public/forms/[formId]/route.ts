import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const form = await prisma.form.findUnique({
      where: {
        id: (await params).formId,
      },
      include: {
        blocks: true
      }
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // First sort by original order
    const sortedBlocks = [...form.blocks].sort((a, b) => a.order - b.order)
    
    // Find thank you block and move it to the end
    const thankYouIndex = sortedBlocks.findIndex(block => block.isSpecial === 'thankYou')
    if (thankYouIndex !== -1) {
      const thankYouBlock = sortedBlocks.splice(thankYouIndex, 1)[0]
      // Update its order to be after the last block
      thankYouBlock.order = sortedBlocks.length
      sortedBlocks.push(thankYouBlock)
    }

    form.blocks = sortedBlocks
    return NextResponse.json(form)
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 }
    )
  }
} 