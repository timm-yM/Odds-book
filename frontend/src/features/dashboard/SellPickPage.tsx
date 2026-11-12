import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import { CreatePickForm } from '@/features/dashboard/components/CreatePickForm';

export function SellPickPage() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-2xl font-bold">Sell a pick</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        List your analysis on the marketplace. Set the price to $0 to give it away free, or price it to sell — ODDSBOOK
        takes a small platform fee only when a paid pick sells.
      </p>

      <div className="surface-card mt-6 flex gap-3 p-4 text-sm text-muted-foreground">
        <Info size={16} className="mt-0.5 shrink-0 text-primary" />
        <p>The selection and analysis stay hidden from buyers until they unlock the pick — free picks unlock instantly for anyone.</p>
      </div>

      <div className="surface-card mt-6 p-6">
        <CreatePickForm onCreated={() => navigate('/dashboard')} />
      </div>
    </div>
  );
}
