import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index: React.FC = () => {
  const { user, loading: authLoading, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth', { replace: true });
    } else if (role === 'teacher') {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/student', { replace: true });
    }
  }, [authLoading, user, role, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
};

export default Index;
