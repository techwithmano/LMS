import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userId: string;
      role: string;
    } & DefaultSession["user"]
  }
  interface User extends NextAuthUser {
    role: string;
    userId: string;
  }
}

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userId: { label: "User ID", type: "text", placeholder: "e.g. AD001" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.userId || !credentials.password) return null;
        
        await dbConnect();
        const user = await User.findOne({ userId: credentials.userId });
        
        if (user && user.password === credentials.password) {
          return {
            id: user._id.toString(),
            name: user.name || null,
            email: user.email || null,
            image: null,
            userId: user.userId,
            role: user.role
          } as any;
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.sub as string;
        session.user.userId = token.userId as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.userId;
      }
      return token;
    }
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  }
});
