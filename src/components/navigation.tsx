'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/proposals', label: 'Proposals' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/analytics', label: 'Analytics' },
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          CampusConnect
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn('text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300', pathname === item.href && 'text-slate-950 dark:text-white')}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:block dark:text-slate-300">
                {session.user?.name} · {session.user?.role}
              </span>
              <Button variant="outline" size="sm" onClick={() => signOut().then(() => window.location.assign('/login'))}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
