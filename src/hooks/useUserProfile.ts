import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        setProfile(null);
      } else {
        setProfile(data as UserProfile);
      }
      setLoading(false);
    };
    getProfile();
  }, []);

  return { profile, loading };
}
