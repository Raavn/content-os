import prisma from '@/lib/db'
import { DashboardClient } from '../dashboard-client'

export default async function Page() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <main className="p-8 max-w-5xl mx-auto flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic text-brand-pink">
          Content OS
        </h1>
        <p className="text-neutral-1 font-semibold">
          Operationalizing AI writing systems with precision.
        </p>
      </header>

      <DashboardClient initialBrands={brands} />
    </main>
  )
}

