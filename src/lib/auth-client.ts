'use client';

import { useEffect, useState } from 'react';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Session {
  user: SessionUser;
}

export function useSession() {
  const [data, setData] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((value) => setData(value.session ?? null))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export async function signIn(credentials: { email: string; password: string }) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function signOut() {
  await fetch('/api/auth/logout', { method: 'POST' });
}
