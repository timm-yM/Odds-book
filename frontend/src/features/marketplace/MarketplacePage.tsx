import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { picksApi } from '@/lib/api/picks';
import { PickCard } from './components/PickCard';
import { PickFilters, MarketplaceFilterState } from './components/PickFilters';
import { Button } from '@/components/ui/button';

export function MarketplacePage() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<MarketplaceFilterState>({
    sport: 'all',
    status: 'all',
    freeOnly: searchParams.get('freeOnly') === 'true',
    search: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['picks', 'list', filters, page],
    queryFn: () =>
      picksApi.list({
        page,
        limit: 12,
        sport: filters.sport === 'all' ? undefined : filters.sport,
        status: filters.status === 'all' ? undefined : filters.status,
        freeOnly: filters.freeOnly || undefined,
        search: filters.search || undefined,
      }),
  });

  const picks = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="text-sm text-muted-foreground">Browse odds and analysis listed by independent sellers.</p>
      </div>

      <PickFilters
        filters={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : picks.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No picks match those filters yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((p) => (
            <PickCard key={p._id} pick={p} />
          ))}
        </div>
      )}

      {meta && meta.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft size={15} /> Prev
          </Button>
          <span className="text-sm text-muted-foreground tabular">
            Page {meta.page} of {meta.pages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= meta.pages} onClick={() => setPage((p) => p + 1)}>
            Next <ChevronRight size={15} />
          </Button>
        </div>
      )}
    </div>
  );
}
