import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, User, ArrowRight, ArrowLeft, GraduationCap, Users, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

type AuthView = 'login' | 'role-select' | 'student-info' | 'teacher-signup';

const DARK = 'oklch(0.18 0.02 240)';
const ACCENT_DEEP = 'oklch(0.42 0.13 155)';
const ACCENT_BRIGHT = 'oklch(0.82 0.18 130)';

const Auth: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading, role, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && role) {
      navigate(role === 'teacher' ? '/dashboard' : '/student');
    }
  }, [authLoading, user, role, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleTeacherSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, displayName);
    if (error) {
      toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Check your email', description: 'We sent you a confirmation link to verify your account.' });
    }
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
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    const fakeEmail = `${email.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '')}@student.circuit.local`;
                    const { error } = await signIn(fakeEmail, password);
                    if (error) toast({ title: 'Sign in failed', description: 'Invalid username or PIN', variant: 'destructive' });
                    setLoading(false);
                  }} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.82_0.18_130)]" />
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input type="password" placeholder="PIN" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.82_0.18_130)]" inputMode="numeric" />
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-full font-semibold"
                      disabled={loading}
                      style={{
                        background: ACCENT_BRIGHT,
                        color: DARK,
                      }}
                    >
                      {loading ? 'Please wait...' : 'Sign In'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="teacher">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.82_0.18_130)]" />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.82_0.18_130)]" />
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-full font-semibold"
                      disabled={loading}
                      style={{
                        background: ACCENT_BRIGHT,
                        color: DARK,
                      }}
                    >
                      {loading ? 'Please wait...' : 'Sign In'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={async () => {
                          if (!email) {
                            toast({ title: 'Enter your email first', variant: 'destructive' });
                            return;
                          }
                          const { error } = await supabase.auth.resetPasswordForEmail(email, {
                            redirectTo: `${window.location.origin}/reset-password`,
                          });
                          if (error) {
                            toast({ title: 'Error', description: error.message, variant: 'destructive' });
                          } else {
                            toast({ title: 'Check your email', description: 'We sent you a password reset link.' });
                          }
                        }}
                        className="text-xs text-white/50 hover:text-[oklch(0.82_0.18_130)] transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
              <div className="mt-6 text-center">
                <button type="button" onClick={() => setView('role-select')} className="text-sm text-white/50 hover:text-white transition-colors">
                  Don't have an account? Sign up
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {view === 'role-select' && (
          <Card className="rounded-2xl border-white/10 bg-[oklch(0.16_0.02_240)]/80 text-white shadow-2xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">I am a…</CardTitle>
              <CardDescription className="text-white/60">Select your role to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-auto py-4 justify-start gap-4 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white"
                onClick={() => setView('student-info')}
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
                  style={{
                    background: `color-mix(in oklab, ${ACCENT_BRIGHT} 18%, transparent)`,
                    color: ACCENT_BRIGHT,
                  }}
                >
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Student</p>
                  <p className="text-xs text-white/50">I want to learn spreadsheets</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full h-auto py-4 justify-start gap-4 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white"
                onClick={() => setView('teacher-signup')}
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
                  style={{
                    background: `color-mix(in oklab, ${ACCENT_BRIGHT} 18%, transparent)`,
                    color: ACCENT_BRIGHT,
                  }}
                >
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Teacher</p>
                  <p className="text-xs text-white/50">I want to manage my class</p>
                </div>
              </Button>
              <div className="pt-2 text-center">
                <button type="button" onClick={() => setView('login')} className="text-sm text-white/50 hover:text-white transition-colors inline-flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Back to sign in
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {view === 'student-info' && (
          <Card className="rounded-2xl border-white/10 bg-[oklch(0.16_0.02_240)]/80 text-white shadow-2xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Student Access</CardTitle>
              <CardDescription className="text-white/60">Ask your teacher for your login details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60 space-y-2">
                <p>Your teacher will provide you with a <strong className="text-white">username</strong> and <strong className="text-white">PIN</strong> to sign in.</p>
                <p>If you don't have these yet, please ask your teacher to set up your account.</p>
              </div>
              <Button
                variant="outline"
                className="w-full border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white"
                onClick={() => setView('login')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to sign in
              </Button>
            </CardContent>
          </Card>
        )}

        {view === 'teacher-signup' && (
          <Card className="rounded-2xl border-white/10 bg-[oklch(0.16_0.02_240)]/80 text-white shadow-2xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Teacher Sign Up</CardTitle>
              <CardDescription className="text-white/60">Create your teacher account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTeacherSignUp} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.82_0.18_130)]" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.82_0.18_130)]" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.82_0.18_130)]" />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full font-semibold"
                  disabled={loading}
                  style={{
                    background: ACCENT_BRIGHT,
                    color: DARK,
                  }}
                >
                  {loading ? 'Please wait...' : 'Create Teacher Account'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
              <div className="pt-4 text-center">
                <button type="button" onClick={() => setView('role-select')} className="text-sm text-white/50 hover:text-white transition-colors inline-flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
