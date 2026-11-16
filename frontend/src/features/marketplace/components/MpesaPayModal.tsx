import { useEffect, useRef, useState } from 'react';
import { Loader2, CheckCircle2, XCircle, Smartphone } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ordersApi } from '@/lib/api/orders';
import { getErrorMessage } from '@/lib/api/client';
import { formatKES } from '@/components/common/PriceTag';

type Step = 'phone' | 'waiting' | 'success' | 'failed';

interface Props {
  open: boolean;
  pickId: string;
  amount: number;
  title: string;
  onClose: () => void;
  /** Called once the payment is confirmed (or the pick was already unlocked) */
  onPaid: () => void;
}

const POLL_MS = 3000;
const MAX_POLLS = 30; // ~90s, comfortably longer than the STK prompt lifetime

export function MpesaPayModal({ open, pickId, amount, title, onClose, onPaid }: Props) {
  const [phone, setPhone] = useState(() => localStorage.getItem('ob_mpesa_phone') ?? '');
  const [step, setStep] = useState<Step>('phone');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const timer = useRef<number>();
  const polls = useRef(0);

  const stopPolling = () => window.clearTimeout(timer.current);

  useEffect(() => {
    if (!open) {
      stopPolling();
      setStep('phone');
      setError('');
    }
    return stopPolling;
  }, [open]);

  const poll = (orderId: string) => {
    timer.current = window.setTimeout(async () => {
      polls.current += 1;
      try {
        const res = await ordersApi.status(orderId);
        if (res.status === 'completed') {
          setStep('success');
          window.setTimeout(onPaid, 1200);
          return;
        }
        if (res.status === 'failed') {
          setError(res.failureReason ?? 'The payment was cancelled or failed.');
          setStep('failed');
          return;
        }
      } catch {
        /* transient network error - keep polling */
      }
      if (polls.current >= MAX_POLLS) {
        setError("We didn't get a confirmation yet. If M-Pesa charged you, your pick will unlock shortly - refresh in a minute.");
        setStep('failed');
        return;
      }
      poll(orderId);
    }, POLL_MS);
  };

  const pay = async () => {
    setError('');
    setSending(true);
    try {
      const result = await ordersApi.checkout(pickId, phone);
      localStorage.setItem('ob_mpesa_phone', phone);
      if (result.alreadyUnlocked || (!result.pending && result.order)) {
        setStep('success');
        window.setTimeout(onPaid, 800);
        return;
      }
      if (result.pending && result.orderId) {
        setStep('waiting');
        polls.current = 0;
        poll(result.orderId);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="rounded-sm bg-mpesa px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">M-PESA</span>
            Unlock this pick
          </DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>

        {step === 'phone' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-md bg-surface-2 px-4 py-3">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="font-display text-lg font-bold tabular">{formatKES(amount)}</span>
            </div>
            <div>
              <Label htmlFor="mpesa-phone">M-Pesa phone number</Label>
              <Input
                id="mpesa-phone"
                inputMode="tel"
                placeholder="0712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5"
                autoFocus
              />
              <p className="mt-1.5 text-xs text-muted-foreground">You'll get a prompt on this phone to enter your M-Pesa PIN.</p>
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button size="lg" onClick={pay} disabled={sending || phone.trim().length < 9} className="bg-mpesa text-white hover:bg-mpesa/90">
              {sending ? 'Sending prompt…' : `Pay ${formatKES(amount)}`}
            </Button>
          </div>
        )}

        {step === 'waiting' && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Smartphone className="text-primary" size={30} />
            <p className="font-display text-lg font-semibold">Check your phone</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Enter your M-Pesa PIN on the prompt sent to {phone}. This page updates automatically.
            </p>
            <Loader2 className="animate-spin text-muted-foreground" size={20} />
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="text-success" size={34} />
            <p className="font-display text-lg font-semibold">Payment received</p>
            <p className="text-sm text-muted-foreground">Unlocking your pick…</p>
          </div>
        )}

        {step === 'failed' && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <XCircle className="text-danger" size={34} />
            <p className="max-w-xs text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => setStep('phone')}>
              Try again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
