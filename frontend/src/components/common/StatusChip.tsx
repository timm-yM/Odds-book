import { PickStatus } from '@/types';
import { cn } from '@/lib/utils';

const LABEL: Record<PickStatus, string> = {
  upcoming: 'Upcoming',
  won: 'Won',
  lost: 'Lost',
  void: 'Void',
  postponed: 'Postponed',
};

const CLASS: Record<PickStatus, string> = {
  upcoming: 'status-chip-upcoming',
  won: 'status-chip-won',
  lost: 'status-chip-lost',
  void: 'status-chip-void',
  postponed: 'status-chip-postponed',
};

export function StatusChip({ status, className }: { status: PickStatus; className?: string }) {
  return (
    <span className={cn(CLASS[status], className)}>
      {status === 'upcoming' && <span className="live-dot" />}
      {LABEL[status]}
    </span>
  );
}
