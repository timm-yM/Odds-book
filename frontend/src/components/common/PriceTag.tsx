import { cn } from '@/lib/utils';

export function PriceTag({ price, currency = 'USD', className }: { price: number; currency?: string; className?: string }) {
  if (price === 0) {
    return <span className={cn('font-display text-sm font-bold uppercase tracking-wide text-primary', className)}>Free</span>;
  }

  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  return <span className={cn('font-display text-base font-bold tabular', className)}>{formatted}</span>;
}
