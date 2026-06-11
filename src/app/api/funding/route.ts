import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createFundingContribution } from '@/lib/mock-store';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { proposalId, amount, contributor } = await request.json();
  if (!proposalId || !amount) {
    return NextResponse.json({ message: 'proposalId and amount are required' }, { status: 400 });
  }

  const contribution = createFundingContribution({
    proposalId,
    amount: Number(amount),
    contributor: contributor || session.user.name || 'Anonymous',
    date: new Date().toISOString(),
  });

  return NextResponse.json({ contribution });
}
