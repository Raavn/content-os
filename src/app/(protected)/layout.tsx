import { auth } from '@/lib/auth'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/signin')

  return (
    <div className="min-h-screen">
      <header className="p-6 max-w-5xl mx-auto flex items-center justify-between">
        <div className="text-sm font-bold uppercase tracking-widest text-neutral-1">
          {session.user.email}
        </div>
        <SignOutButton />
      </header>
      {children}
    </div>
  )
}

