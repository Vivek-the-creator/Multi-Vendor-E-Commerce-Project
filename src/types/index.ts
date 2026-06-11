export type Role = 'STUDENT' | 'FACULTY' | 'ADMIN';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: Role;
  passwordHash: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  category: string;
  expectedAudience: number;
  budget: number;
  startDate: string;
  endDate: string;
  venue: string;
  coverImage?: string;
  attachments: string[];
  status: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  voteCount: number;
}

export interface CommentRecord {
  id: string;
  content: string;
  proposalId: string;
  userId: string;
  authorName: string;
  authorRole: Role;
  createdAt: string;
  parentId?: string;
}

export interface FundingContributionRecord {
  id: string;
  amount: number;
  proposalId: string;
  contributor: string;
  date: string;
}

export interface BookingRecord {
  id: string;
  ticketId: string;
  proposalId: string;
  userId: string;
  userEmail: string;
  status: string;
  bookingDate: string;
  ticketCode: string;
}
