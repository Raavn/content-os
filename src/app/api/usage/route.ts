import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { auth } from '@/lib/auth'
import { calculateCost, getPricingTable } from '@/lib/ai/pricing'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const brandId = url.searchParams.get('brandId')

  if (brandId) {
    const brand = await prisma.brand.findUnique({ where: { id: brandId } })
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }
  }

  const where = brandId ? { brandId } : undefined

  const usage = await prisma.llmUsage.aggregate({
    where,
    _sum: {
      inputTokens: true,
      outputTokens: true,
    },
    _count: true,
  })

  const byType = await prisma.llmUsage.groupBy({
    by: ['interactionType'],
    where,
    _sum: {
      inputTokens: true,
      outputTokens: true,
    },
    _count: true,
  })

  const byModel = await prisma.llmUsage.groupBy({
    by: ['model'],
    where,
    _sum: {
      inputTokens: true,
      outputTokens: true,
    },
    _count: true,
  })

  const totalGenerations = await prisma.generation.count({
    where: brandId ? { brandId } : undefined,
  })

  const { table, configured } = getPricingTable()

  const byModelWithCost = byModel.map((item) => {
    const inputTokens = item._sum.inputTokens || 0
    const outputTokens = item._sum.outputTokens || 0
    const cost = calculateCost(item.model, inputTokens, outputTokens, table)
    return {
      model: item.model,
      inputTokens,
      outputTokens,
      calls: item._count,
      cost,
    }
  })

  const totalCost = byModelWithCost.reduce((sum, item) => sum + item.cost, 0)

  return NextResponse.json({
    totalInputTokens: usage._sum.inputTokens || 0,
    totalOutputTokens: usage._sum.outputTokens || 0,
    totalCalls: usage._count,
    totalGenerations,
    pricingConfigured: configured,
    totalCost,
    byType: byType.map((item) => ({
      type: item.interactionType,
      inputTokens: item._sum.inputTokens || 0,
      outputTokens: item._sum.outputTokens || 0,
      calls: item._count,
    })),
    byModel: byModelWithCost,
  })
}
