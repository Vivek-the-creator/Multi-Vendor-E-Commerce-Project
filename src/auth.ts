import { cookies } from 'next/headers';
import { compare } from 'bcryptjs';
import { findUserByEmail } from '@/lib/mock-store';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Session {
  user: SessionUser;
}

const SESSION_COOKIE = 'campus_session';

export interface VerificationNeeded {
  needsVerification: true;
  email: string;
}

export async function signIn(credentials: { email: string; password: string }): Promise<Session | VerificationNeeded | null> {
  const user = await findUserByEmail(credentials.email);
  if (!user) {
    return null;
  }

  const valid = await compare(credentials.password, user.passwordHash || '');
  if (!valid) {
    return null;
  }

  if (!user.emailVerified) {
    return { needsVerification: true, email: user.email };
  }

  const session = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return session;
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function auth() {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as Session;
  } catch {
    return null;
  }
}
