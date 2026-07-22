import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const CENTRAL_HUB_URL = import.meta.env.VITE_CENTRAL_HUB_URL || 'https://edufied.com.au';
const APP_SLUG = 'circuit';
const LANDING_ROUTE = '/dashboard';

// Fast-switch entry point for the Edufied toolbar. If this app already has a
// saved session we go straight in; otherwise we bounce through the hub's
// silent SSO flow, which lands on /auth/teacher/sso as usual.
//
// The "already have a session" branch skips teacher-sso entirely, which is
// the only place classes normally sync from the hub — so without an explicit
// resync here, a class assigned/archived on the hub would never propagate to
// an already-logged-in Circuit session. Circuit's dashboard fetches classes
// with plain useState/useEffect (no query cache to invalidate), so we await
// the resync before navigating rather than firing it in the background.
const AuthSwitch = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      if (data.session) {
        const accessToken = data.session.access_token;
        try {
          const { error } = await supabase.functions.invoke('sync-classes', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (error) console.error('fast-switch resync failed (non-fatal)', error);
        } catch (err) {
          console.error('fast-switch resync failed (non-fatal)', err);
        }
        if (cancelled) return;
        navigate(LANDING_ROUTE, { replace: true });
      } else {
        const redirectUri = `${window.location.origin}/auth/teacher/sso`;
        window.location.replace(
          `${CENTRAL_HUB_URL}/auth/sso?app=${APP_SLUG}&redirect_uri=${encodeURIComponent(redirectUri)}`
        );
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Opening…</p>
      </div>
    </div>
  );
};

export default AuthSwitch;
