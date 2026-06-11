'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Role } from '@/types';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function AuthContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  const token = searchParams.get('token');
  const verified = searchParams.get('verified');
  const [role, setRole] = useState<Role>('STUDENT');
  const [mode, setMode] = useState<'login' | 'signup'>(modeParam === 'signup' ? 'signup' : 'login');
  const [verificationToken, setVerificationToken] = useState<string | null>(token);

  useEffect(() => {
    if (token) {
      setVerificationToken(token);
      setMode('login');
    }
  }, [token]);

  useEffect(() => {
    if (verified === 'true') {
      setMode('login');
    }
  }, [verified]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === 'login' ? 'Welcome back' : 'Create your account'}</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {mode === 'login' ? 'Sign in to manage campus events and collaborate.' : "Join CampusConnect to propose, vote, and attend events."}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleSelector selectedRole={role} onRoleChange={setRole} />
          <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
            {mode === 'login' ? (
              <LoginForm role={role} onSwitchToSignup={() => setMode('signup')} verificationToken={verificationToken} />
            ) : (
              <SignupForm role={role} onSwitchToLogin={() => setMode('login')} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}