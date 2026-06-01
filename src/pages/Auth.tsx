import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, User, ArrowRight, KeyRound, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

type AuthView = 'login';

const DARK = 'oklch(0.18 0.02 240)';
const ACCENT_DEEP = 'oklch(0.55 0.14 58)';
const ACCENT_BRIGHT = 'oklch(0.82 0.18 58)';

const Auth: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading, role, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && role) {
      navigate(role === 'teacher' ? '/dashboard' : '/student');
    }
  }, [authLoading, user, role, navigate]);

  const handleStudentSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fakeEmail = `${username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '')}@student.circuit.local`;
    const { error } = await signIn(fakeEmail, pin);
    if (error) toast({ title: 'Sign in failed', description: 'Invalid username or PIN', variant: 'destructive' });
    setLoading(false);
  };

  return (
    <div
      className="relative isolate min-h-screen flex items-center justify-center p-4 pb-12 overflow-hidden"
      style={{
        background: `linear-gradient(125deg, ${DARK} 0%, oklch(0.22 0.04 200) 50%, ${ACCENT_DEEP} 100%)`,
      }}
    >
      {/* Decorative background elements */}
      <div
        className="absolute -right-32 -top-24 h-[520px] w-[520px] rounded-full opacity-20 blur-[140px]"
        style={{ background: ACCENT_BRIGHT }}
        aria-hidden
      />
      <div
        className="absolute -left-24 -bottom-24 h-[360px] w-[360px] rounded-full opacity-10 blur-[120px]"
        style={{ background: ACCENT_BRIGHT }}
        aria-hidden
      />

      <motion.div
        key={view}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
            style={{
              background: `color-mix(in oklab, ${ACCENT_BRIGHT} 18%, transparent)`,
              color: ACCENT_BRIGHT,
            }}
          >
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Circuit</h1>
          <p className="text-sm text-white/60 mt-1">Learn spreadsheets, step by step</p>
          <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">by Edufied</p>
        </div>

        {view === 'login' && (
          <Card className="rounded-2xl border-white/10 bg-[oklch(0.16_0.02_240)]/80 text-white shadow-2xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Welcome Back</CardTitle>
              <CardDescription className="text-white/60">Sign in to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="student" className="w-full">
                <TabsList className="w-full mb-4 bg-white/5 border border-white/10">
                  <TabsTrigger value="student" className="flex-1 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70">Student</TabsTrigger>
                  <TabsTrigger value="teacher" className="flex-1 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70">Teacher</TabsTrigger>
                </TabsList>

                <TabsContent value="student">
                  <form onSubmit={handleStudentSignIn} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.82_0.18_130)]"
                      />
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input
                        type="password"
                        placeholder="PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        required
                        inputMode="numeric"
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.82_0.18_130)]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-full font-semibold"
                      disabled={loading}
                      style={{ background: ACCENT_BRIGHT, color: DARK }}
                    >
                      {loading ? 'Please wait...' : 'Sign In'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="teacher">
                  <div className="space-y-4">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
                      Teachers access Circuit through the Edufied hub.
                    </div>
                    <Button
                      className="w-full rounded-full font-semibold"
                      style={{ background: ACCENT_BRIGHT, color: DARK }}
                      onClick={() => window.location.href = 'https://edufied.com.au'}
                    >
                      Sign in with Edufied
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
