"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  useEffect(() => {
    // If user is authenticated, redirect to dashboard/courses
    import("next-auth/react").then(({ useSession }) => {
      const { data: session } = useSession();
      if (session?.user) {
        window.location.href = "/dashboard";
      }
    });
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 p-6">
      <div className="max-w-xl w-full text-center space-y-8 bg-white/80 rounded-xl shadow-xl p-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-2">Welcome to Techwithmano LMS</h1>
        <p className="text-lg text-gray-700 mb-6">
          A modern, secure, and user-friendly platform for online learning, course management, assignments, and more. Join as a student or admin and start your journey!
        </p>
        <Link href="/login">
          <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-lg shadow">
            Login to your account
          </Button>
        </Link>
        <div className="mt-8 text-gray-600 text-sm">
          <div>Need help? Contact us at <a href="mailto:support@techwithmano.com" className="text-blue-600 underline">support@techwithmano.com</a></div>
          <div className="mt-2">&copy; {new Date().getFullYear()} Techwithmano LMS. All rights reserved.</div>
        </div>
      </div>
    </main>
  );
}
