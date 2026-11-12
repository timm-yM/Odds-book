import { Link } from 'react-router-dom';
import { ShieldCheck, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutPage() {
  return (
    <div className="container max-w-3xl py-16">
      <h1 className="text-3xl font-bold">Built for people who back their picks</h1>
      <p className="mt-4 text-muted-foreground">
        Most tipster sites sell you a subscription and hope you don't check the record. ODDSBOOK works differently: every
        pick is listed individually, priced by the person who made it, and graded in public once the match finishes.
        Buyers pay for calls they actually want, and sellers build a reputation they can point to.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="surface-card p-5">
          <ShieldCheck className="mb-3 text-primary" size={20} />
          <h3 className="mb-1 font-display font-semibold">Transparent records</h3>
          <p className="text-sm text-muted-foreground">Every pick is marked won, lost or void — no cherry-picked screenshots.</p>
        </div>
        <div className="surface-card p-5">
          <Users className="mb-3 text-primary" size={20} />
          <h3 className="mb-1 font-display font-semibold">Open marketplace</h3>
          <p className="text-sm text-muted-foreground">Anyone can list a pick. Anyone can browse and buy the ones they trust.</p>
        </div>
        <div className="surface-card p-5">
          <TrendingUp className="mb-3 text-primary" size={20} />
          <h3 className="mb-1 font-display font-semibold">Pay per pick</h3>
          <p className="text-sm text-muted-foreground">No subscriptions. Free picks are free, priced picks are billed once, per pick.</p>
        </div>
      </div>

      <div className="surface-card mt-12 flex flex-col items-center gap-4 p-8 text-center">
        <h2 className="text-xl font-bold">Ready to have a look?</h2>
        <Button asChild>
          <Link to="/marketplace">Browse the marketplace</Link>
        </Button>
      </div>
    </div>
  );
}
