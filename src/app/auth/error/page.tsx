const errorCopy: Record<string, { title: string; description: string }> = {
  AccessDenied: {
    title: 'Access denied',
    description: 'Your Google account is not on the allowlist for this app.',
  },
  Configuration: {
    title: 'Configuration error',
    description: 'Authentication is not configured correctly.',
  },
  Verification: {
    title: 'Verification failed',
    description: 'We could not verify your sign-in request. Please try again.',
  },
  Default: {
    title: 'Sign-in error',
    description: 'Something went wrong while signing in. Please try again.',
  },
}

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
  const key = searchParams?.error ?? 'Default'
  const { title, description } = errorCopy[key] ?? errorCopy.Default

  return (
    <main className="min-h-screen p-8 max-w-xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-brand-pink">
          {title}
        </h1>
        <p className="text-neutral-1 font-semibold">{description}</p>
      </header>

      <div className="card-base">
        <a
          href="/auth/signin"
          className="block w-full text-center bg-brand-pink text-brand-black px-8 py-4 font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          Back to sign in
        </a>
      </div>
    </main>
  )
}
