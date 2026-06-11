import { NextResponse } from 'next/server';
import { verifyUser } from '@/lib/mock-store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ message: 'Invalid verification link' }, { status: 400 });
  }

  const user = await verifyUser(token);
  if (!user) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 404 });
  }

  const redirectUrl = new URL('/auth?verified=true', request.url);
  return NextResponse.redirect(redirectUrl);
}