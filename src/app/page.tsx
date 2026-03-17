import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Dna, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { value: '42', label: 'Active Malaria Reference Centers' },
  { value: '80', label: 'Total MRCs in database' },
  { value: '120,000+', label: 'Patient visits added per month' },
  { value: '7,000,000+', label: 'Unique patient visits in database' },
  { value: 'Since 2006', label: 'Year UMSP was established' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071a2e] via-[#0c2e48] to-[#0d3d38] text-white">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Image
            src="/logo/idrc_logo.png"
            alt="IDRC logo"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
          <Button asChild variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-6 pb-16 pt-20 text-center md:pt-28">
        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          Uganda Malaria Surveillance Programme
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-balance text-lg text-white/80 md:text-xl">
          Enhanced health facility-based surveillance across 42 active Malaria Reference Centers,
          generating data to guide evidence-based malaria control.
        </p>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/8 px-4 py-6 text-center backdrop-blur-sm"
            >
              <span className="text-3xl font-bold text-[#f4b63e] md:text-4xl">{stat.value}</span>
              <span className="mt-2 text-xs leading-snug text-white/70 md:text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-28">
        <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
          Dashboards
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-white/65">
          Access requires a UMSP account. Contact your programme coordinator to request access.
        </p>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
          <Link
            href="/login"
            className="group flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/8 p-7 backdrop-blur-sm transition-all hover:border-[#f4b63e]/50 hover:bg-white/12"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4b63e] text-slate-900">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold">Epidemiological Dashboard</p>
              <p className="mt-1 text-sm text-white/65">
                Temporal trends, spatial patterns, test positivity rates, incidence, and surveillance quality indicators across all MRC sites.
              </p>
            </div>
            <div className="mt-auto flex items-center gap-1 text-sm font-medium text-[#f4b63e]">
              Sign in to access <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-7 opacity-70">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">
              <Dna className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">Genomic Dashboard</p>
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/70">
                  Coming Soon
                </span>
              </div>
              <p className="mt-1 text-sm text-white/55">
                Parasite genomics, drug resistance markers, and molecular epidemiology data from UMSP sentinel sites.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/20 py-6 text-center text-sm text-white/55">
        <p>Uganda Malaria Surveillance Programme · Infectious Diseases Research Collaboration · Ministry of Health Uganda</p>
      </footer>
    </div>
  );
}
