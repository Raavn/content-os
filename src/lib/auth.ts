import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

function getAllowedEmails(): Set<string> {
  const raw = process.env.ALLOWED_EMAILS ?? ''
  const emails = raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return new Set(emails)
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = getAllowedEmails()
      if (!user.email) return false
      const normalizedEmail = user.email.toLowerCase()
      if (!allowedEmails.has(normalizedEmail)) {
        return '/auth/error?error=AccessDenied'
      }
      return true
    },
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email
      return token
    },
    async session({ session, token }) {
      if (session.user && typeof token.email === 'string') {
        session.user.email = token.email
      }
      return session
    },
  },
  session: { strategy: 'jwt' },
})

