import { Link } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { OddsPick } from '@/types';
import { InitialsAvatar } from '@/components/common/InitialsAvatar';
import { StarRating } from '@/components/common/StarRating';
import { StatusChip } from '@/components/common/StatusChip';
import { PriceTag } from '@/components/common/PriceTag';
import { SportTag } from '@/components/common/SportTag';

export function PickCard({ pick }: { pick: OddsPick }) {
  const seller = typeof pick.seller === 'string' ? null : pick.seller;

  return (
    <Link to={`/picks/${pick._id}`} className="surface-card-hover group flex flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <SportTag sport={pick.sport} />
        <StatusChip status={pick.status} />
      </div>

      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="truncate font-display text-base font-semibold">
          {pick.homeTeam} <span className="text-muted-foreground">vs</span> {pick.awayTeam}
        </p>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        {pick.league} · {format(new Date(pick.matchDate), 'MMM d, HH:mm')}
      </p>

      <div className="mb-4 flex items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-2">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{pick.market}</p>
          <p className="flex items-center gap-1.5 text-sm font-medium">
            {pick.locked ? (
              <>
                <Lock size={12} className="text-muted-foreground" /> Locked pick
              </>
            ) : (
              pick.selection
            )}
          </p>
        </div>
        <span className="odds-figure text-lg text-primary">{pick.odds.toFixed(2)}</span>
      </div>

      <div className="mt-auto flex items-center justify-between">
        {seller && (
          <div className="flex items-center gap-2">
            <InitialsAvatar name={seller.name} color={seller.avatarColor} size="sm" />
            <div>
              <p className="flex items-center gap-1 text-xs font-medium">
                {seller.name}
                {pick.isOfficial && <ShieldCheck size={12} className="text-gold" />}
              </p>
              <StarRating rating={seller.ratingAvg} count={seller.ratingCount} size={11} />
            </div>
          </div>
        )}
        <PriceTag price={pick.price} currency={pick.currency} />
      </div>
    </Link>
  );
}
