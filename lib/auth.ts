import NextAuth from 'next-auth'
import GoogleProvider from '@auth/core/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: 'b4e5a12d37774221842823423423423423423423423423423423423423423423',
})