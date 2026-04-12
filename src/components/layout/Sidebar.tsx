'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BookOpen, Building2, Dna, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/dashboard/methods', label: 'Malaria Indicators', icon: BookOpen },
  { href: '/dashboard/site-summary', label: 'Site Summary', icon: Building2 },
  { href: '/dashboard', label: 'Epi Dashboard', icon: BarChart3 },
  { href: '/dashboard/genomic-data', label: 'Genomic Dashboard', icon: Dna },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) console.error('Sign out failed:', error.message);
    window.location.assign('/login');
  };

  return (
    <aside className="hidden w-72 shrink-0 flex-col rounded-2xl border border-border/70 bg-white p-3 shadow-sm lg:flex">
      <Link href="/" className="mb-3 flex items-center rounded-xl px-3 py-3">
        <Image
          src="/logo/idrc_logo.png"
          alt="IDRC logo"
          width={120}
          height={40}
          className="h-10 w-auto object-contain"
          priority
        />
      </Link>

      <nav className="flex-1 space-y-1.5 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleSignOut}
        className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
      >
        <LogOut className="h-[18px] w-[18px]" />
        Sign Out
      </button>
    </aside>
  );
}
