import Link from 'next/link';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  'Submit and review event proposals',
  'Vote, comment, pledge resources and fund ideas',
  'Book tickets and follow the campus calendar',
];

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid gap-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-8 text-white lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-sm">CampusConnect • Event planning and collaboration</span>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold sm:text-5xl">Bring campus ideas to life with one connected hub.</h1>
            <p className="max-w-2xl text-lg text-slate-200">
              Students propose events, faculty review ideas, and admins coordinate approvals, funding, and bookings in a single platform.
            </p>
          </div>
<div className="flex flex-wrap gap-3">
            {session ? (
              <Link href="/dashboard">
                <Button variant="secondary">Open dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="secondary">Sign in</Button>
                </Link>
                <Link href="/auth">
                  <Button variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
                    Create account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        <Card className="border-white/10 bg-white/10 text-white">
          <CardHeader>
            <CardTitle>What you can do</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-slate-200">
              {features.map((feature) => (
                <li key={feature} className="rounded-lg border border-white/10 bg-white/10 p-3">
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
