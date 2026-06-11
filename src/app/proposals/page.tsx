'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Proposal } from '@/types';

export default function ProposalsPage() {
  const { data: session } = useSession();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Technical',
    expectedAudience: '100',
    budget: '1000',
    startDate: '',
    endDate: '',
    venue: '',
    status: 'DRAFT',
  });

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => setProposals(data.proposals || []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        expectedAudience: Number(form.expectedAudience),
        budget: Number(form.budget),
      }),
    });

    if (!response.ok) {
      toast.error('Could not create proposal');
      return;
    }

    const created = await response.json();
    setProposals((current) => [created.proposal, ...current]);
    toast.success('Proposal created');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Event proposals</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Students can submit, review, and track proposals from one space.</p>
        </div>
        {session?.user ? <span className="text-sm text-slate-500">Signed in as {session.user.role}</span> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>New proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Community Service'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input type="number" placeholder="Expected audience" value={form.expectedAudience} onChange={(e) => setForm({ ...form, expectedAudience: e.target.value })} required />
                <Input type="number" placeholder="Budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
              </div>
              <Input placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required />
              <Button className="w-full">Create proposal</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{proposal.title}</CardTitle>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs dark:bg-slate-800">{proposal.status}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">{proposal.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span>{proposal.category}</span>
                  <span>{proposal.voteCount} votes</span>
                </div>
                <Link href={`/proposals/${proposal.id}`} className="mt-4 inline-flex text-sm font-medium text-slate-900 dark:text-slate-100">
                  View details →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
