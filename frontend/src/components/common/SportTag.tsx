import { cn } from '@/lib/utils';

export function SportTag({ sport, className }: { sport: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border border-border bg-surface-2 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground',
        className
      )}
    >
      {sport}
    </span>
  );
}
