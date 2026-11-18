import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Lock, ShieldCheck, Loader2, Star } from 'lucide-react';
import { picksApi } from '@/lib/api/picks';
import { ordersApi } from '@/lib/api/orders';
import { getErrorMessage } from '@/lib/api/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { InitialsAvatar } from '@/components/common/InitialsAvatar';
import { StarRating } from '@/components/common/StarRating';
import { StatusChip } from '@/components/common/StatusChip';
import { PriceTag, formatKES } from '@/components/common/PriceTag';
import { MpesaPayModal } from './components/MpesaPayModal';
import { SlipImages } from './components/SlipImages';
import { pickTitle, pickLabel, pickLeague, isSlip } from '@/lib/pick';
import { SportTag } from '@/components/common/SportTag';

export function PickDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [buying, setBuying] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['picks', 'detail', id],
    queryFn: () => picksApi.get(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return <p className="container py-16 text-center text-muted-foreground">Pick not found.</p>;
  }

  const { pick, reviews } = data;
  const seller = typeof pick.seller === 'string' ? null : pick.seller;
  const isOwner = seller?._id === user?._id;

  const refreshPick = () => queryClient.invalidateQueries({ queryKey: ['picks', 'detail', id] });

  const handleBuy = async () => {
    if (!user) {
      navigate('/auth', { state: { from: `/picks/${id}` } });
      return;
    }
    if (pick.price > 0) {
      setPayOpen(true); // paid pick -> M-Pesa STK push flow
      return;
    }
    setBuying(true);
    try {
      await ordersApi.checkout(pick._id);
      toast.success('Pick unlocked!');
      refreshPick();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBuying(false);
    }
  };

  const handleReview = async () => {
    setSubmittingReview(true);
    try {
      await picksApi.review(pick._id, { rating, comment });
      toast.success('Thanks for the feedback!');
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['picks', 'detail', id] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-6 flex items-center gap-2">
        <SportTag sport={pick.sport} />
        <StatusChip status={pick.status} />
        {pick.isOfficial && (
          <span className="official-badge">
            <ShieldCheck size={13} /> Official
          </span>
        )}
      </div>

      <h1 className="text-2xl font-bold md:text-3xl">
        {pickTitle(pick)}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {pickLeague(pick)} · {format(new Date(pick.matchDate), 'EEEE MMM d, yyyy · HH:mm')}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="surface-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{pickLabel(pick)}</p>
              <span className="odds-figure text-2xl text-primary">{pick.odds.toFixed(2)}</span>
            </div>

            {pick.locked ? (
              <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-border bg-surface-2 py-10 text-center">
                <Lock size={28} className="text-muted-foreground" />
                <div>
                  <p className="font-display text-lg font-semibold">This pick is locked</p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Unlock {isSlip(pick) ? 'the booking code, slip images' : 'the selection'} and full analysis for{' '}
                    <PriceTag price={pick.price} currency={pick.currency} />.
                  </p>
                  <ul className="mx-auto mt-3 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                    {pick.bookmaker && <li className="rounded-full border border-border px-2.5 py-1">{pick.bookmaker} code</li>}
                    {(pick.imageCount ?? 0) > 0 && (
                      <li className="rounded-full border border-border px-2.5 py-1">
                        {pick.imageCount} slip image{pick.imageCount === 1 ? '' : 's'}
                      </li>
                    )}
                    <li className="rounded-full border border-border px-2.5 py-1">Pay with M-Pesa</li>
                  </ul>
                </div>
                <Button size="lg" onClick={handleBuy} disabled={buying}>
                  {buying ? 'Processing…' : `Unlock with M-Pesa · ${formatKES(pick.price)}`}
                </Button>
              </div>
            ) : (
              <div>
                {pick.selection && (
                  <p className="mb-4 rounded-md bg-primary/10 px-4 py-3 font-display text-lg font-semibold text-primary">{pick.selection}</p>
                )}
                {pick.bookingCode && (
                  <div className="mb-4 rounded-md border border-primary/40 bg-primary/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {pick.bookmaker ? `${pick.bookmaker} booking code` : 'Booking code'}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <span className="font-mono text-2xl font-bold tracking-widest text-primary">{pick.bookingCode}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard
                            ?.writeText(pick.bookingCode ?? '')
                            .then(() => toast.success('Code copied'))
                            .catch(() => toast.error('Could not copy — select the code and copy it manually'));
                        }}
                      >
                        Copy code
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Open {pick.bookmaker ?? 'your bookmaker'}, tap "Load / Enter booking code" on the betslip, paste this, then set your own stake.
                    </p>
                  </div>
                )}
                {(pick.imageCount ?? 0) > 0 && (
                  <div className="mb-4">
                    <SlipImages pickId={pick._id} count={pick.imageCount ?? 0} />
                  </div>
                )}
                {pick.analysis && <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{pick.analysis}</p>}
                {!pick.analysis && !pick.bookingCode && !(pick.imageCount ?? 0) && (
                  <p className="text-sm text-muted-foreground">No written analysis for this pick.</p>
                )}
                {pick.price === 0 && !isOwner && (
                  <Button className="mt-5" variant="outline" onClick={handleBuy} disabled={buying}>
                    {buying ? 'Saving…' : 'Save to my picks'}
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="surface-card mt-6 p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">Reviews ({reviews.length})</h2>
            {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
            <div className="flex flex-col gap-4">
              {reviews.map((r) => (
                <div key={r._id} className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
                  <InitialsAvatar name={r.buyer.name} color={r.buyer.avatarColor} size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{r.buyer.name}</p>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={i < r.rating ? 'fill-gold text-gold' : 'text-border'} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>}
                  </div>
                </div>
              ))}
            </div>

            {!pick.locked && !isOwner && user && (
              <div className="mt-6 border-t border-border pt-5">
                <p className="mb-2 text-sm font-medium">Leave a review</p>
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} onClick={() => setRating(i + 1)}>
                      <Star size={20} className={i < rating ? 'fill-gold text-gold' : 'text-border'} />
                    </button>
                  ))}
                </div>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How did this pick play out?"
                  className="mb-3"
                />
                <Button size="sm" onClick={handleReview} disabled={submittingReview}>
                  {submittingReview ? 'Posting…' : 'Post review'}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div>
          {seller && (
            <div className="surface-card p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Listed by</p>
              <Link to={`/sellers/${seller._id}`} className="flex items-center gap-3">
                <InitialsAvatar name={seller.name} color={seller.avatarColor} />
                <div>
                  <p className="flex items-center gap-1 font-medium">
                    {seller.name}
                    {pick.isOfficial && <ShieldCheck size={13} className="text-gold" />}
                  </p>
                  <StarRating rating={seller.ratingAvg} count={seller.ratingCount} />
                </div>
              </Link>
              <Link to={`/sellers/${seller._id}`} className="mt-4 block text-center text-sm font-medium text-primary hover:underline">
                View seller profile
              </Link>
            </div>
          )}
        </div>
      </div>

      <MpesaPayModal
        open={payOpen}
        pickId={pick._id}
        amount={pick.price}
        title={`${pickTitle(pick)} · ${pickLabel(pick)}`}
        onClose={() => setPayOpen(false)}
        onPaid={() => {
          setPayOpen(false);
          toast.success('Payment confirmed — pick unlocked!');
          refreshPick();
        }}
      />
    </div>
  );
}
