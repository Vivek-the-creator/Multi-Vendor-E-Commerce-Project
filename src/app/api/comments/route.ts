import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createComment } from '@/lib/mock-store';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { proposalId, content } = await request.json();
  if (!proposalId || !content) {
    return NextResponse.json({ message: 'proposalId and content are required' }, { status: 400 });
  }

  const comment = createComment({
    proposalId,
    content,
    userId: session.user.id,
    authorName: session.user.name || 'Guest',
    authorRole: (session.user.role as 'STUDENT' | 'FACULTY' | 'ADMIN') || 'STUDENT',
  });

  return NextResponse.json({ comment });
}
