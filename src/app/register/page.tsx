'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: 'STUDENT' }),
    });
    setLoading(false);

    if (!res.ok) {
      toast.error('Unable to register');
      return;
    }

    toast.success('Account created');
    router.push('/login');
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">Join CampusConnect to propose, vote, and attend events.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
            <Button className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
