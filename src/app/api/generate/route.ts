import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { generateBlog, generateThread } from '@/lib/ai/engine'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { brandId, type, brief, blogContent } = await req.json()

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    })

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    let output = ''

    if (type === 'BLOG') {
      if (!brief) return NextResponse.json({ error: 'Brief is required' }, { status: 400 })
      output = await generateBlog({
        brandName: brand.name,
        systemPrompt: brand.systemPrompt,
        brief,
      })
    } else if (type === 'THREAD') {
      if (!blogContent) return NextResponse.json({ error: 'Blog content is required' }, { status: 400 })
      output = await generateThread({
        brandName: brand.name,
        systemPrompt: brand.systemPrompt,
        blogContent,
      })
    } else {
      return NextResponse.json({ error: 'Invalid generation type' }, { status: 400 })
    }

    // Persist the generation
    await prisma.generation.create({
      data: {
        brandId,
        type,
        brief: brief || '',
        output,
      },
    })

    return NextResponse.json({ output })
  } catch (error) {
    console.error('Generation Error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 })
  }
}
