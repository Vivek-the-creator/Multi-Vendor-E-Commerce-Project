'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('student@campusconnect.edu');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await signIn({ email, password });
    setLoading(false);

    if (!result) {
      toast.error('Invalid credentials');
      return;
    }

    toast.success('Signed in successfully');
    router.push('/dashboard');
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">Sign in to manage campus events and collaborate.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Demo credentials: student@campusconnect.edu / Password123!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
