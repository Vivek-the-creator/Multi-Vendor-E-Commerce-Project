import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { createProposal, getAllProposals } from '@/lib/mock-store';

const proposalSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  expectedAudience: z.number().int().positive(),
  budget: z.number().positive(),
  startDate: z.string(),
  endDate: z.string(),
  venue: z.string().min(3),
  status: z.string().default('DRAFT'),
});

export async function GET() {
  return NextResponse.json({ proposals: getAllProposals() });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = proposalSchema.parse(body);
    const proposal = createProposal({
      ...parsed,
      authorId: session.user.id,
      authorName: session.user.name || 'Guest',
      attachments: [],
    });
    return NextResponse.json({ proposal });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid proposal payload' }, { status: 400 });
  }
}
