import { signOut } from '@/lib/auth'

export function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut({ redirectTo: '/auth/signin' })
      }}
    >
      <button
        type="submit"
        className="bg-neutral-0 text-brand-black px-4 py-2 font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        Sign out
      </button>
    </form>
  )
}

