import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const DARK = 'oklch(0.18 0.02 240)';
const ACCENT_BRIGHT = 'oklch(0.82 0.18 58)';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event from the auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    // Also check the URL hash for recovery token (handles page refresh)
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: 'Reset failed', description: error.message, variant: 'destructive' });
    } else {
      setSuccess(true);
      toast({ title: 'Password updated successfully' });
      setTimeout(() => navigate('/auth'), 2000);
    }
    setLoading(false);
  };

  return (
    <div
      className="relative isolate min-h-screen flex items-center justify-center p-4 pb-12 overflow-hidden"
      style={{
        background: `linear-gradient(125deg, ${DARK} 0%, oklch(0.22 0.04 200) 50%, oklch(0.666 0.157 58.3) 100%)`,
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
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Circuit</h1>
          <p className="text-sm text-white/60 mt-1">Set your new password</p>
          <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">by Edufied</p>
        </div>

        <Card className="rounded-2xl border-white/10 bg-[oklch(0.16_0.02_240)]/80 text-white shadow-2xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">{success ? 'Password Updated' : 'Reset Password'}</CardTitle>
            <CardDescription className="text-white/60">
              {success
                ? 'Redirecting you to sign in...'
                : isRecovery
                  ? 'Enter your new password below'
                  : 'Invalid or expired recovery link. Please request a new one.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex items-center justify-center py-6" style={{ color: ACCENT_BRIGHT }}>
                <CheckCircle className="w-12 h-12" />
              </div>
            ) : isRecovery ? (
              <form onSubmit={handleReset} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.82_0.18_130)]"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.82_0.18_130)]"
                  />
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
                  {loading ? 'Updating...' : 'Update Password'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            ) : (
              <Button
                variant="outline"
                className="w-full border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white"
                onClick={() => navigate('/auth')}
              >
                Back to sign in
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
