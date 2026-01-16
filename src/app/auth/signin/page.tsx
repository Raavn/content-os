import { auth, signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'

const errorCopy: Record<string, string> = {
  AccessDenied: 'This Google account is not allowed to access Content OS.',
  Configuration: 'Authentication is not configured correctly.',
  Verification: 'Unable to verify sign-in. Please try again.',
  Default: 'Unable to sign in. Please try again.',
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string; error?: string }
}) {
  const session = await auth()
  const callbackUrl = searchParams?.callbackUrl || '/'
  if (session?.user) redirect(callbackUrl)

  const errorKey = searchParams?.error ?? ''
  const message = errorCopy[errorKey] ?? (errorKey ? errorCopy.Default : '')

  return (
    <main className="min-h-screen p-8 max-w-xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-brand-pink">
          Sign in
        </h1>
        <p className="text-neutral-1 font-semibold">Continue with Google to access Content OS.</p>
      </header>

      <div className="card-base">
        {message ? (
          <div className="text-sm font-bold uppercase tracking-widest text-destructive">
            {message}
          </div>
        ) : null}

        <form
          action={async () => {
            'use server'
            await signIn('google', { redirectTo: callbackUrl })
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-brand-pink text-brand-black px-8 py-4 font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </main>
  )
}
