import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { proposalId } = await request.json();
  if (!proposalId) {
    return NextResponse.json({ message: 'proposalId is required' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Vote recorded' });
}
