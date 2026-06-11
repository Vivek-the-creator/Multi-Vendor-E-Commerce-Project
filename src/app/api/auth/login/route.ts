import { NextResponse } from 'next/server';
import { signIn, VerificationNeeded } from '@/auth';
import { Session } from '@/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, role } = body;
  const result = await signIn({ email, password });
  if (!result) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  if ((result as VerificationNeeded).needsVerification) {
    const verification = result as VerificationNeeded;
    return NextResponse.json({ needsVerification: true, verificationToken: verification.email }, { status: 200 });
  }

  const session = result as Session;
  if (role && session.user.role !== role) {
    return NextResponse.json({ message: 'Invalid role selection for this account' }, { status: 403 });
  }

  return NextResponse.json({ session });
}
