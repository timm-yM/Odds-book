import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { picksApi, PickInput } from '@/lib/api/picks';
import { getErrorMessage } from '@/lib/api/client';
import { SPORTS } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EMPTY: PickInput = {
  sport: 'Football',
  league: '',
  homeTeam: '',
  awayTeam: '',
  matchDate: '',
  market: '',
  selection: '',
  odds: 1.9,
  confidence: 3,
  analysis: '',
  price: 0,
  currency: 'KES',
};

export function CreatePickForm({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState<PickInput>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof PickInput>(key: K, value: PickInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await picksApi.create(form);
      toast.success('Pick listed on the marketplace');
      setForm(EMPTY);
      onCreated?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Sport</Label>
          <Select value={form.sport} onValueChange={(v) => update('sport', v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SPORTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="league">League / Competition</Label>
          <Input id="league" required value={form.league} onChange={(e) => update('league', e.target.value)} className="mt-1.5" placeholder="Premier League" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="homeTeam">Home team</Label>
          <Input id="homeTeam" required value={form.homeTeam} onChange={(e) => update('homeTeam', e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="awayTeam">Away team</Label>
          <Input id="awayTeam" required value={form.awayTeam} onChange={(e) => update('awayTeam', e.target.value)} className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="matchDate">Match date & time</Label>
        <Input
          id="matchDate"
          type="datetime-local"
          required
          value={form.matchDate}
          onChange={(e) => update('matchDate', e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="market">Market</Label>
          <Input id="market" required value={form.market} onChange={(e) => update('market', e.target.value)} className="mt-1.5" placeholder="Match Winner" />
        </div>
        <div>
          <Label htmlFor="odds">Odds</Label>
          <Input
            id="odds"
            type="number"
            step="0.01"
            min={1.01}
            required
            value={form.odds}
            onChange={(e) => update('odds', parseFloat(e.target.value))}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="confidence">Confidence (1-5)</Label>
          <Input
            id="confidence"
            type="number"
            min={1}
            max={5}
            value={form.confidence}
            onChange={(e) => update('confidence', parseInt(e.target.value, 10))}
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="selection">Your pick (hidden until unlocked)</Label>
        <Input
          id="selection"
          required
          value={form.selection}
          onChange={(e) => update('selection', e.target.value)}
          className="mt-1.5"
          placeholder="e.g. Arsenal -1.5 Asian Handicap"
        />
      </div>

      <div>
        <Label htmlFor="analysis">Analysis (optional, also hidden until unlocked)</Label>
        <Textarea
          id="analysis"
          value={form.analysis}
          onChange={(e) => update('analysis', e.target.value)}
          className="mt-1.5"
          rows={4}
          placeholder="Why do you like this pick?"
        />
      </div>

      <div>
        <Label htmlFor="price">Price (KES — whole shillings, 0 for a free pick)</Label>
        <Input
          id="price"
          type="number"
          min={0}
          step="1"
          required
          value={form.price}
          onChange={(e) => update('price', parseInt(e.target.value, 10) || 0)}
          className="mt-1.5"
        />
      </div>

      <Button type="submit" disabled={submitting} className="mt-1 self-start">
        {submitting ? 'Publishing…' : 'Publish pick'}
      </Button>
    </form>
  );
}
