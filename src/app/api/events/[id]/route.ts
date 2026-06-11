import { NextResponse } from 'next/server';
import { getCommentsForProposal, getFundingContributions, getProposalById } from '@/lib/mock-store';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proposal = getProposalById(id);
  if (!proposal) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    proposal,
    comments: getCommentsForProposal(id),
    funding: getFundingContributions(id),
  });
}
