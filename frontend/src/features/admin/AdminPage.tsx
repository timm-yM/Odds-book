import { pickTitle, pickLeague } from '@/lib/pick';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { picksApi } from '@/lib/api/picks';
import { getErrorMessage } from '@/lib/api/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { InitialsAvatar } from '@/components/common/InitialsAvatar';
import { StatusChip } from '@/components/common/StatusChip';
import { PriceTag } from '@/components/common/PriceTag';
import { CreatePickForm } from '@/features/dashboard/components/CreatePickForm';
import { MyPickRow } from '@/features/dashboard/components/MyPickRow';

export function AdminPage() {
  const queryClient = useQueryClient();

  const myPicks = useQuery({ queryKey: ['picks', 'mine'], queryFn: picksApi.mine });
  const allPicks = useQuery({ queryKey: ['picks', 'admin-all'], queryFn: () => picksApi.list({ limit: 50 }) });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['picks', 'mine'] });
    queryClient.invalidateQueries({ queryKey: ['picks', 'admin-all'] });
  };

  const handleDeleteAny = async (id: string) => {
    if (!confirm('Remove this pick from the marketplace?')) return;
    try {
      await picksApi.remove(id);
      toast.success('Pick removed');
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center gap-2">
        <span className="official-badge">
          <ShieldCheck size={13} /> Master Admin
        </span>
      </div>
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p className="mt-1 text-sm text-muted-foreground">Post official slips (images + booking code), set free or paid, and moderate the marketplace.</p>

      <Tabs defaultValue="post" className="mt-6">
        <TabsList>
          <TabsTrigger value="post">Post a pick</TabsTrigger>
          <TabsTrigger value="mine">My official picks</TabsTrigger>
          <TabsTrigger value="moderate">Moderate marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="post" className="pt-6">
          <div className="surface-card max-w-2xl p-6">
            <CreatePickForm onCreated={() => { refresh(); toast.info('Posted! Mark it Won/Lost later from "My official picks".'); }} />
          </div>
        </TabsContent>

        <TabsContent value="mine" className="pt-6">
          {myPicks.isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : myPicks.data?.length === 0 ? (
            <p className="text-sm text-muted-foreground">You haven't posted any official picks yet.</p>
          ) : (
            <div className="surface-card p-4">
              {myPicks.data?.map((p) => (
                <MyPickRow key={p._id} pick={p} onChanged={refresh} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="moderate" className="pt-6">
          {allPicks.isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <div className="surface-card divide-y divide-border p-2">
              {allPicks.data?.data.map((p) => {
                const seller = typeof p.seller === 'string' ? null : p.seller;
                return (
                  <div key={p._id} className="flex flex-wrap items-center justify-between gap-3 p-3">
                    <div>
                      <p className="font-medium">
                        {pickTitle(p)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {seller?.name ?? 'Unknown seller'} · {pickLeague(p)} · {p.purchaseCount} sold
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <PriceTag price={p.price} currency={p.currency} />
                      <StatusChip status={p.status} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-danger"
                        onClick={() => handleDeleteAny(p._id)}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
