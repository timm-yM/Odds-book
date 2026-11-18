import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShieldCheck, TrendingUp, Wallet, Search } from 'lucide-react';
import { picksApi } from '@/lib/api/picks';
import { Button } from '@/components/ui/button';
import { PickCard } from '@/features/marketplace/components/PickCard';
import { PicksTicker } from '@/components/common/PicksTicker';

const STEPS = [
  {
    icon: Search,
    title: 'Browse the board',
    body: 'Filter by sport or price. See the odds and bookmaker before you spend a shilling, then unlock the slip or booking code.',
  },
  {
    icon: Wallet,
    title: 'Buy what you trust',
    body: 'Free picks unlock instantly. Paid picks cost a few shillings and you pay with M-Pesa in seconds. No subscriptions.',
  },
  {
    icon: TrendingUp,
    title: 'Track the record',
    body: 'Every pick is graded won, lost or void in public, so a seller\'s track record is never just a claim.',
  },
];

export function HomePage() {
  const { data } = useQuery({
    queryKey: ['picks', 'featured'],
    queryFn: () => picksApi.list({ limit: 6, status: 'upcoming' }),
  });

  const picks = data?.data ?? [];

  return (
    <div>
      <section className="border-b border-border">
        <div className="container grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="official-badge mb-4 w-fit">
              <ShieldCheck size={13} /> Verified track records
            </span>
            <h1 className="text-4xl font-bold leading-[1.1] md:text-5xl">
              Buy picks from proven tipsters. <span className="text-primary">Sell your own edge.</span>
            </h1>
            <p className="mt-5 max-w-lg text-muted-foreground">
              ODDSBOOK is a marketplace, not a subscription. Browse odds and analysis from independent sellers,
              unlock the ones worth paying for, and list your own picks free or priced — your call.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/marketplace">
                  Browse the marketplace <ArrowRight size={16} className="ml-1.5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/sell">Start selling picks</Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3">
            {picks.slice(0, 3).map((p) => (
              <PickCard key={p._id} pick={p} />
            ))}
            {picks.length === 0 && (
              <div className="surface-card flex h-full min-h-[220px] items-center justify-center p-6 text-center text-sm text-muted-foreground">
                New picks will show up here as soon as sellers post them.
              </div>
            )}
          </div>
        </div>
      </section>

      <PicksTicker picks={picks} />

      <section className="container py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Trending picks</h2>
            <p className="text-sm text-muted-foreground">Fresh listings from the board, updated as sellers post.</p>
          </div>
          <Link to="/marketplace" className="hidden text-sm font-medium text-primary hover:underline md:block">
            View all →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((p) => (
            <PickCard key={p._id} pick={p} />
          ))}
          {picks.length === 0 && (
            <p className="col-span-full py-12 text-center text-muted-foreground">No picks listed yet — check back soon.</p>
          )}
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16">
        <div className="container">
          <h2 className="mb-10 text-center text-2xl font-bold">How ODDSBOOK works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="surface-card p-6">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary">
                  <step.icon size={18} />
                </div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Step {i + 1}</p>
                <h3 className="mb-2 font-display text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="surface-card flex flex-col items-center gap-4 p-10 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="text-2xl font-bold">Got an edge worth sharing?</h2>
            <p className="mt-1 text-muted-foreground">List your first pick in minutes — free or priced, your call.</p>
          </div>
          <Button size="lg" asChild>
            <Link to="/sell">
              Sell a pick <ArrowRight size={16} className="ml-1.5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
