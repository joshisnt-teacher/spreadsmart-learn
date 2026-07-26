import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TeacherProfile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

const TeacherSettings: React.FC = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || role === 'student')) {
      navigate(user ? '/' : '/auth');
    }
  }, [authLoading, user, role, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('teacher_profiles')
      .select('first_name, last_name, email')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  if (authLoading) return null;

  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Teacher';

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-bold text-lg">Settings</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">Display name</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">{profile?.email || user?.email}</p>
                  <p className="text-xs text-muted-foreground">Email address</p>
                </div>
              </div>
              <p className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
                Your name and email come from your Edufied account. Update them at{" "}
                <a
                  href="https://edufied.com.au"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  edufied.com.au
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default TeacherSettings;
