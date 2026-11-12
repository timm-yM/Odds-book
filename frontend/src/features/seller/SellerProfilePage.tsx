import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { usersApi } from '@/lib/api/users';
import { InitialsAvatar } from '@/components/common/InitialsAvatar';
import { StarRating } from '@/components/common/StarRating';
import { PickCard } from '@/features/marketplace/components/PickCard';

export function SellerProfilePage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['sellers', id],
    queryFn: () => usersApi.sellerProfile(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return <p className="container py-16 text-center text-muted-foreground">Seller not found.</p>;

  const { seller, picks } = data;

  return (
    <div className="container py-10">
      <div className="surface-card flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
        <InitialsAvatar name={seller.name} color={seller.avatarColor} size="lg" />
        <div>
          <p className="flex items-center justify-center gap-1.5 font-display text-xl font-bold sm:justify-start">
            {seller.name}
            {seller.role === 'admin' && <ShieldCheck size={16} className="text-gold" />}
          </p>
          <StarRating rating={seller.ratingAvg} count={seller.ratingCount} className="mt-1 justify-center sm:justify-start" />
          {seller.bio && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{seller.bio}</p>}
          <p className="mt-2 text-xs text-muted-foreground">Selling on ODDSBOOK since {format(new Date(seller.createdAt), 'MMM yyyy')}</p>
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-lg font-semibold">Listed picks ({picks.length})</h2>
      {picks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No active listings right now.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((p) => (
            <PickCard key={p._id} pick={{ ...p, seller }} />
          ))}
        </div>
      )}
    </div>
  );
}
