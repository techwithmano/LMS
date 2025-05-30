import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });
        if (user && user.password === credentials?.password) {
          return user;
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.role = user.role;
      session.user.id = user.id;
      return session;
    }
  }
});
