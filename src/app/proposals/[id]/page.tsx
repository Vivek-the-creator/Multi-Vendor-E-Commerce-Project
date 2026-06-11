'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Proposal, CommentRecord, FundingContributionRecord } from '@/types';

export default function ProposalDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [funding, setFunding] = useState<FundingContributionRecord[]>([]);
  const [commentText, setCommentText] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/events/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProposal(data.proposal || null);
        setComments(data.comments || []);
        setFunding(data.funding || []);
      });
  }, [params.id]);

  async function handleVote() {
    const res = await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalId: proposal?.id }),
    });
    if (!res.ok) {
      toast.error('Vote failed');
      return;
    }
    toast.success('Vote recorded');
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalId: proposal?.id, content: commentText }),
    });
    if (!res.ok) {
      toast.error('Comment failed');
      return;
    }
    const created = await res.json();
    setComments((current) => [created.comment, ...current]);
    setCommentText('');
    toast.success('Comment posted');
  }

  async function handleFunding(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/funding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalId: proposal?.id, amount: Number(fundingAmount), contributor: session?.user?.name || 'Guest' }),
    });
    if (!res.ok) {
      toast.error('Funding failed');
      return;
    }
    const created = await res.json();
    setFunding((current) => [created.contribution, ...current]);
    setFundingAmount('');
    toast.success('Contribution recorded');
  }

  if (!proposal) {
    return <div className="mx-auto max-w-7xl px-4 py-10">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>{proposal.title}</CardTitle>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{proposal.description}</p>
            </div>
            <Button onClick={handleVote}>Vote ({proposal.voteCount})</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm md:grid-cols-3">
            <div>Category: {proposal.category}</div>
            <div>Venue: {proposal.venue}</div>
            <div>Status: {proposal.status}</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleComment} className="space-y-3">
                <Textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment" required />
                <Button type="submit">Post comment</Button>
              </form>
              <div className="mt-6 space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{comment.authorName}</span>
                      <span className="text-slate-500">{comment.authorRole}</span>
                    </div>
                    <p className="mt-2 text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funding progress</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFunding} className="flex gap-3">
                <Input type="number" value={fundingAmount} onChange={(e) => setFundingAmount(e.target.value)} placeholder="Amount" required />
                <Button type="submit">Contribute</Button>
              </form>
              <div className="mt-4 space-y-2">
                {funding.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800">
                    <span>{entry.contributor}</span>
                    <span>${entry.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event details</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li>Expected audience: {proposal.expectedAudience}</li>
              <li>Budget: ${proposal.budget}</li>
              <li>Start date: {proposal.startDate}</li>
              <li>End date: {proposal.endDate}</li>
              <li>Attachments: {proposal.attachments.join(', ') || 'None'}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
