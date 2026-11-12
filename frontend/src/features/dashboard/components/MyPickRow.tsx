import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { OddsPick, PickStatus } from '@/types';
import { picksApi } from '@/lib/api/picks';
import { getErrorMessage } from '@/lib/api/client';
import { StatusChip } from '@/components/common/StatusChip';
import { PriceTag } from '@/components/common/PriceTag';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const STATUS_OPTIONS: PickStatus[] = ['upcoming', 'won', 'lost', 'void', 'postponed'];

export function MyPickRow({ pick, onChanged }: { pick: OddsPick; onChanged: () => void }) {
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (status: PickStatus) => {
    setUpdating(true);
    try {
      await picksApi.updateStatus(pick._id, status);
      toast.success('Status updated');
      onChanged();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Remove this pick from the marketplace?')) return;
    try {
      await picksApi.remove(pick._id);
      toast.success('Pick removed');
      onChanged();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link to={`/picks/${pick._id}`} className="font-medium hover:text-primary">
          {pick.homeTeam} vs {pick.awayTeam}
        </Link>
        <p className="text-xs text-muted-foreground">
          {pick.league} · {format(new Date(pick.matchDate), 'MMM d, yyyy')} · {pick.market} · odds {pick.odds.toFixed(2)} ·{' '}
          {pick.purchaseCount} sold
        </p>
      </div>
      <div className="flex items-center gap-3">
        <PriceTag price={pick.price} currency={pick.currency} />
        <Select value={pick.status} onValueChange={(v) => handleStatus(v as PickStatus)} disabled={updating}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <StatusChip status={pick.status} className="hidden sm:inline-flex" />
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-danger" onClick={handleDelete}>
          <Trash2 size={15} />
        </Button>
      </div>
    </div>
  );
}
