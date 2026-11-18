import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { ImagePlus, X, Ticket, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { picksApi, PickInput } from '@/lib/api/picks';
import { getErrorMessage } from '@/lib/api/client';
import { fileToCompressedDataUrl } from '@/lib/image';
import { BOOKMAKERS, SPORTS } from '@/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EMPTY: PickInput = {
  pickType: 'slip',
  title: '',
  sport: 'Football',
  league: '',
  homeTeam: '',
  awayTeam: '',
  matchDate: '',
  market: '',
  selection: '',
  odds: 2,
  bookmaker: '',
  bookingCode: '',
  confidence: 3,
  analysis: '',
  price: 0,
  currency: 'KES',
};

const PRICE_CHIPS = [0, 20, 50, 100, 200, 500];
const MAX_IMAGES = 3;

export function CreatePickForm({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState<PickInput>(EMPTY);
  const [images, setImages] = useState<string[]>([]);
  const [bookmakerChoice, setBookmakerChoice] = useState('');
  const [customBookmaker, setCustomBookmaker] = useState('');
  const [processing, setProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isSlip = form.pickType === 'slip';
  const update = <K extends keyof PickInput>(key: K, value: PickInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const bookmaker = bookmakerChoice === 'Other' ? customBookmaker.trim() : bookmakerChoice;

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_IMAGES - images.length);
    e.target.value = '';
    if (!files.length) return;
    setProcessing(true);
    try {
      const urls = await Promise.all(files.map(fileToCompressedDataUrl));
      setImages((prev) => [...prev, ...urls].slice(0, MAX_IMAGES));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSlip && !form.bookingCode?.trim() && images.length === 0) {
      toast.error('Add a booking code or upload at least one slip image');
      return;
    }
    setSubmitting(true);
    try {
      await picksApi.create({
        ...form,
        // datetime-local has no timezone; convert to a real instant so Kenyan kick-off times are not shifted by the server's timezone
        matchDate: new Date(form.matchDate).toISOString(),
        bookmaker: bookmaker || undefined,
        bookingCode: form.bookingCode?.trim() || undefined,
        images: images.length ? images : undefined,
      });
      toast.success(form.price === 0 ? 'Free pick published' : 'Pick published — it is now on sale');
      setForm({ ...EMPTY, pickType: form.pickType });
      setImages([]);
      setBookmakerChoice('');
      setCustomBookmaker('');
      onCreated?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      {/* 1. Type */}
      <section>
        <p className="mb-2 text-sm font-semibold">1 · What are you posting?</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'slip', label: 'Betslip / Accumulator', hint: 'Slip screenshots and/or a booking code', icon: Ticket },
            { value: 'single', label: 'Single match pick', hint: 'One match, one market', icon: Trophy },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update('pickType', opt.value as 'slip' | 'single')}
              className={cn(
                'rounded-md border p-3 text-left transition-colors',
                form.pickType === opt.value ? 'border-primary bg-primary/10' : 'border-border bg-surface-2 hover:border-muted-foreground'
              )}
            >
              <opt.icon size={16} className={form.pickType === opt.value ? 'text-primary' : 'text-muted-foreground'} />
              <p className="mt-1.5 text-sm font-semibold">{opt.label}</p>
              <p className="text-xs text-muted-foreground">{opt.hint}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Details */}
      <section className="flex flex-col gap-4">
        <p className="text-sm font-semibold">2 · The details</p>
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
          {isSlip ? (
            <div>
              <Label htmlFor="title">Slip name</Label>
              <Input id="title" required value={form.title} onChange={(e) => update('title', e.target.value)} className="mt-1.5" placeholder="Saturday 10-odds mix" />
            </div>
          ) : (
            <div>
              <Label htmlFor="league">League / Competition</Label>
              <Input id="league" required value={form.league} onChange={(e) => update('league', e.target.value)} className="mt-1.5" placeholder="Premier League" />
            </div>
          )}
        </div>

        {!isSlip && (
          <>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="market">Market</Label>
                <Input id="market" required value={form.market} onChange={(e) => update('market', e.target.value)} className="mt-1.5" placeholder="Match Winner" />
              </div>
              <div>
                <Label htmlFor="selection">Your pick (hidden until unlocked)</Label>
                <Input id="selection" required value={form.selection} onChange={(e) => update('selection', e.target.value)} className="mt-1.5" placeholder="Arsenal -1.5" />
              </div>
            </div>
          </>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <Label htmlFor="matchDate">{isSlip ? 'First kick-off' : 'Kick-off'}</Label>
            <Input id="matchDate" type="datetime-local" required value={form.matchDate} onChange={(e) => update('matchDate', e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="odds">{isSlip ? 'Total odds' : 'Odds'}</Label>
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
            <Input id="confidence" type="number" min={1} max={5} value={form.confidence} onChange={(e) => update('confidence', parseInt(e.target.value, 10))} className="mt-1.5" />
          </div>
        </div>
      </section>

      {/* 3. Slip */}
      <section className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold">3 · Betslip {isSlip ? '' : '(optional)'}</p>
          <p className="text-xs text-muted-foreground">Buyers only see these after they unlock the pick.</p>
        </div>

        <div>
          <Label>Bookmaker</Label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {[...BOOKMAKERS, 'Other'].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBookmakerChoice(bookmakerChoice === b ? '' : b)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  bookmakerChoice === b ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                {b}
              </button>
            ))}
          </div>
          {bookmakerChoice === 'Other' && (
            <Input className="mt-2" placeholder="Bookmaker name" value={customBookmaker} onChange={(e) => setCustomBookmaker(e.target.value)} maxLength={40} />
          )}
        </div>

        <div>
          <Label htmlFor="bookingCode">Booking / share code</Label>
          <Input
            id="bookingCode"
            value={form.bookingCode}
            onChange={(e) => update('bookingCode', e.target.value)}
            className="mt-1.5 font-mono tracking-wider"
            placeholder="e.g. A1B2C3"
            maxLength={80}
            autoCapitalize="characters"
          />
        </div>

        <div>
          <Label>Slip images (JPG or PNG, up to {MAX_IMAGES})</Label>
          <div className="mt-1.5 flex flex-wrap gap-3">
            {images.map((src, i) => (
              <div key={i} className="relative h-28 w-20 overflow-hidden rounded-md border border-border bg-surface-2">
                <img src={src} alt={`Slip ${i + 1}`} className="h-full w-full object-cover object-top" />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 rounded-full bg-background/80 p-0.5 text-foreground hover:text-danger"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={processing}
                className="flex h-28 w-20 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary"
              >
                <ImagePlus size={18} />
                {processing ? 'Working…' : 'Add'}
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg" multiple className="hidden" onChange={handleFiles} />
        </div>
      </section>

      {/* 4. Price */}
      <section className="flex flex-col gap-4">
        <p className="text-sm font-semibold">4 · Price</p>
        <div>
          <Label htmlFor="analysis">Notes for buyers (optional, hidden until unlocked)</Label>
          <Textarea id="analysis" value={form.analysis} onChange={(e) => update('analysis', e.target.value)} className="mt-1.5" rows={3} placeholder="Why do you like this slip? Any stake advice?" />
        </div>
        <div>
          <Label htmlFor="price">Price in KES (0 = free)</Label>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {PRICE_CHIPS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => update('price', p)}
                className={cn(
                  'rounded-md border px-3 py-1.5 text-xs font-semibold tabular transition-colors',
                  form.price === p ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                {p === 0 ? 'Free' : `KES ${p}`}
              </button>
            ))}
            <Input id="price" type="number" min={0} step="1" required value={form.price} onChange={(e) => update('price', parseInt(e.target.value, 10) || 0)} className="w-28" />
          </div>
        </div>
      </section>

      <Button type="submit" size="lg" disabled={submitting || processing} className="self-start">
        {submitting ? 'Publishing…' : form.price === 0 ? 'Publish free pick' : `Publish for KES ${form.price}`}
      </Button>
    </form>
  );
}
