import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, systemPrompt } = await req.json()

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Brand name is required' }, { status: 400 })
    }

    if (!systemPrompt || !systemPrompt.trim()) {
      return NextResponse.json({ error: 'System prompt is required' }, { status: 400 })
    }

    const existing = await prisma.brand.findUnique({
      where: { name: name.trim() },
    })

    if (existing) {
      return NextResponse.json({ error: 'Brand name already exists' }, { status: 409 })
    }

    const brand = await prisma.brand.create({
      data: {
        name: name.trim(),
        systemPrompt: systemPrompt.trim(),
      },
    })

    return NextResponse.json({ brand })
  } catch (error) {
    console.error('Brand Creation Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
