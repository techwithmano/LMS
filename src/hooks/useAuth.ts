import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const signInUser = async (userId: string, password: string) => {
    setLoading(true);
    const result = await signIn('credentials', { redirect: false, userId, password });
    setLoading(false);
    return result?.error;
  };

  const signOutUser = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    setLoading(false);
  };

  return { user: session?.user ?? null, loading: status === 'loading' || loading, signIn: signInUser, signOut: signOutUser };
}
