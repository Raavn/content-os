import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const brands = [
    {
      name: 'AI Operator',
      systemPrompt: 'Lens: calm AI usage, non-burnout engineering, grounded systems thinking. Focus on operational efficiency and practical automation.',
    },
    {
      name: 'Music / Innovation',
      systemPrompt: 'Lens: creativity without paralysis, AI sharpening (not replacing) musicianship. Focus on the intersection of human creativity and technical tools.',
    },
  ]

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { name: brand.name },
      update: {},
      create: brand,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
