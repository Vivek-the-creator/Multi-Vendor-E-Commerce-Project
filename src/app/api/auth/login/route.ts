import { NextResponse } from 'next/server';
import { signIn } from '@/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const session = await signIn({ email: body.email, password: body.password });
  if (!session) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({ session });
}
