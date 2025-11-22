import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { createClient } from '@supabase/supabase-js';

// pages/api/auth/[...nextauth].js
export default NextAuth({
  providers: [
    Providers.Google({ clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session(session, token) {
      session.user.id = token.sub;
      return session;
    }
  }
});
