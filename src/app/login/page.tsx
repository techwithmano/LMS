"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Map userId to email
      const { data, error: profileError } = await supabase.from('profiles').select('email').eq('student_id', userId).single();
      if (profileError || !data?.email) throw new Error("User ID not found");
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password,
      });
      if (authError) throw new Error(authError.message);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 p-6">
      <form onSubmit={handleLogin} className="bg-white/90 rounded-xl shadow-xl p-10 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 text-center">Sign In</h1>
        <div>
          <Label htmlFor="userId">User ID</Label>
          <Input id="userId" value={userId} onChange={e => setUserId(e.target.value)} placeholder="e.g. ST001" required autoFocus />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
      </form>
    </main>
  );
}
