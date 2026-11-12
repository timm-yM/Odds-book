import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SPORTS } from '@/types';
import { cn } from '@/lib/utils';

export interface MarketplaceFilterState {
  sport: string;
  status: string;
  freeOnly: boolean;
  search: string;
}

const STATUS_OPTIONS = ['all', 'upcoming', 'won', 'lost'];

export function PickFilters({
  filters,
  onChange,
}: {
  filters: MarketplaceFilterState;
  onChange: (next: MarketplaceFilterState) => void;
}) {
  return (
    <div className="surface-card mb-6 flex flex-col gap-4 p-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search team, league or market…"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sport</span>
        <FilterChip active={filters.sport === 'all'} onClick={() => onChange({ ...filters, sport: 'all' })}>
          All
        </FilterChip>
        {SPORTS.map((s) => (
          <FilterChip key={s} active={filters.sport === s} onClick={() => onChange({ ...filters, sport: s })}>
            {s}
          </FilterChip>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Result</span>
          {STATUS_OPTIONS.map((s) => (
            <FilterChip key={s} active={filters.status === s} onClick={() => onChange({ ...filters, status: s })}>
              {s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)}
            </FilterChip>
          ))}
        </div>

        <Button
          type="button"
          variant={filters.freeOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange({ ...filters, freeOnly: !filters.freeOnly })}
        >
          Free picks only
        </Button>
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-sm border px-2.5 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary/15 text-primary'
          : 'border-border bg-surface-2 text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
    </button>
  );
}
