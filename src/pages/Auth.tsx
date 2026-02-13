import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, User, ArrowRight, ArrowLeft, GraduationCap, Users, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

type AuthView = 'login' | 'role-select' | 'student-info' | 'teacher-signup';

const Auth: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ExcelPath</h1>
          <p className="text-sm text-muted-foreground mt-1">Learn Excel, step by step</p>
        </div>

        {view === 'login' && (
          <Card>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="student" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="student" className="flex-1">Student</TabsTrigger>
                  <TabsTrigger value="teacher" className="flex-1">Teacher</TabsTrigger>
                </TabsList>
                <TabsContent value="student">
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    const fakeEmail = `${email.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '')}@student.excelpath.local`;
                    const { error } = await signIn(fakeEmail, password);
                    if (error) toast({ title: 'Sign in failed', description: 'Invalid username or PIN', variant: 'destructive' });
                    setLoading(false);
                  }} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="password" placeholder="PIN" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10" inputMode="numeric" />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Please wait...' : 'Sign In'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="teacher">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-10" />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Please wait...' : 'Sign In'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              <div className="mt-6 text-center">
                <button type="button" onClick={() => setView('role-select')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Don't have an account? Sign up
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {view === 'role-select' && (
          <Card>
            <CardHeader>
              <CardTitle>I am a…</CardTitle>
              <CardDescription>Select your role to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full h-auto py-4 justify-start gap-4" onClick={() => setView('student-info')}>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Student</p>
                  <p className="text-xs text-muted-foreground">I want to learn Excel</p>
                </div>
              </Button>
              <Button variant="outline" className="w-full h-auto py-4 justify-start gap-4" onClick={() => setView('teacher-signup')}>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent shrink-0">
                  <Users className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Teacher</p>
                  <p className="text-xs text-muted-foreground">I want to manage my class</p>
                </div>
              </Button>
              <div className="pt-2 text-center">
                <button type="button" onClick={() => setView('login')} className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Back to sign in
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {view === 'student-info' && (
          <Card>
            <CardHeader>
              <CardTitle>Student Access</CardTitle>
              <CardDescription>Ask your teacher for your login details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
                <p>Your teacher will provide you with a <strong className="text-foreground">username</strong> and <strong className="text-foreground">PIN</strong> to sign in.</p>
                <p>If you don't have these yet, please ask your teacher to set up your account.</p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setView('login')}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to sign in
              </Button>
            </CardContent>
          </Card>
        )}

        {view === 'teacher-signup' && (
          <Card>
            <CardHeader>
              <CardTitle>Teacher Sign Up</CardTitle>
              <CardDescription>Create your teacher account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTeacherSignUp} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="pl-10" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-10" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Please wait...' : 'Create Teacher Account'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
              <div className="pt-4 text-center">
                <button type="button" onClick={() => setView('role-select')} className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
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
