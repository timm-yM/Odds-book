import { cn } from '@/lib/utils';

export const formatKES = (amount: number) => `KES ${Math.round(amount).toLocaleString('en-KE')}`;

export function PriceTag({ price, className }: { price: number; currency?: string; className?: string }) {
  if (price === 0) {
    return <span className={cn('font-display text-sm font-bold uppercase tracking-wide text-primary', className)}>Free</span>;
  }
  return <span className={cn('font-display text-base font-bold tabular', className)}>{formatKES(price)}</span>;
}
