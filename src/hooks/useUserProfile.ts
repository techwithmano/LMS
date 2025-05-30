import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export type UserProfile = {
  id: string;
  full_name?: string;
  email: string;
  phone?: string;
  parent_email?: string;
  parent_phone?: string;
  student_id?: string;
  grade?: string;
  subjects?: string[];
  role: 'owner' | 'admin' | 'student';
};

export function useUserProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      if (!session?.user?.email) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const res = await fetch('/api/users/me');
      if (res.ok) setProfile(await res.json());
      else setProfile(null);
      setLoading(false);
    };
    getProfile();
  }, [session]);

  return { profile, loading };
}
