import { OddsPick } from '@/types';
import { StatusChip } from '@/components/common/StatusChip';

export function PicksTicker({ picks }: { picks: OddsPick[] }) {
  if (picks.length === 0) return null;
  const items = [...picks, ...picks]; // duplicate for seamless loop

  return (
    <div className="overflow-hidden border-y border-border bg-surface py-2.5">
      <div className="flex w-max animate-marquee gap-8">
        {items.map((p, i) => (
          <div key={`${p._id}-${i}`} className="flex shrink-0 items-center gap-2 text-sm">
            <span className="font-medium text-muted-foreground">
              {p.homeTeam} <span className="text-border">vs</span> {p.awayTeam}
            </span>
            <span className="odds-figure text-primary">{p.odds.toFixed(2)}</span>
            <StatusChip status={p.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
