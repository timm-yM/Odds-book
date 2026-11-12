import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({
  rating,
  count,
  size = 14,
  className,
}: {
  rating: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  if (!count) {
    return <span className={cn('text-xs text-muted-foreground', className)}>New seller</span>;
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Star size={size} className="fill-gold text-gold" />
      <span className="text-sm font-semibold tabular">{rating.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">({count})</span>
    </div>
  );
}
