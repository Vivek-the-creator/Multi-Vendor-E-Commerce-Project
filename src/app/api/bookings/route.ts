import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createBooking, getBookingsForUser } from '@/lib/mock-store';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ bookings: getBookingsForUser(session.user.id) });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { proposalId, ticketId } = await request.json();
  if (!proposalId || !ticketId) {
    return NextResponse.json({ message: 'proposalId and ticketId are required' }, { status: 400 });
  }

  const booking = createBooking({
    ticketId,
    proposalId,
    userId: session.user.id,
    userEmail: session.user.email || '',
    status: 'CONFIRMED',
    bookingDate: new Date().toISOString(),
    ticketCode: `TKT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  });

  return NextResponse.json({ booking });
}
