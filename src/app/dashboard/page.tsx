import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllProposals } from '@/lib/mock-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const proposals = getAllProposals();
  const role = session.user.role;

  const stats = {
    student: [
      { title: 'Proposals submitted', value: proposals.length },
      { title: 'Votes cast', value: 12 },
      { title: 'Tickets booked', value: 3 },
      { title: 'Campus points', value: 120 },
    ],
    faculty: [
      { title: 'Pending reviews', value: 2 },
      { title: 'Reviewed proposals', value: 5 },
      { title: 'Feedback provided', value: 8 },
    ],
    admin: [
      { title: 'Total users', value: 42 },
      { title: 'Pending approvals', value: 1 },
      { title: 'Funding tracked', value: formatCurrency(12000) },
      { title: 'Tickets sold', value: 19 },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">{role === 'STUDENT' ? 'Student dashboard' : role === 'FACULTY' ? 'Faculty dashboard' : 'Admin dashboard'}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Monitor proposals, contributions, and event momentum from one place.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats[role.toLowerCase() as keyof typeof stats]?.map((stat) => (
          <Card key={stat.title}>
            <CardHeader>
              <CardTitle>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
