import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus } from 'lucide-react';
import { picksApi } from '@/lib/api/picks';
import { ordersApi } from '@/lib/api/orders';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { InitialsAvatar } from '@/components/common/InitialsAvatar';
import { StatusChip } from '@/components/common/StatusChip';
import { PriceTag, formatKES } from '@/components/common/PriceTag';
import { MyPickRow } from './components/MyPickRow';

export function DashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const purchases = useQuery({ queryKey: ['orders', 'mine'], queryFn: ordersApi.myPurchases });
  const myPicks = useQuery({ queryKey: ['picks', 'mine'], queryFn: picksApi.mine });
  const sales = useQuery({ queryKey: ['orders', 'sales'], queryFn: ordersApi.mySales });

  const refreshPicks = () => queryClient.invalidateQueries({ queryKey: ['picks', 'mine'] });

  return (
    <div className="container py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {user && <InitialsAvatar name={user.name} color={user.avatarColor} size="lg" />}
          <div>
            <h1 className="text-xl font-bold">{user?.name}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button asChild>
          <Link to="/sell">
            <Plus size={16} className="mr-1.5" /> List a new pick
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="purchases">
        <TabsList>
          <TabsTrigger value="purchases">My purchases</TabsTrigger>
          <TabsTrigger value="listings">My listings</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases" className="pt-6">
          {purchases.isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : purchases.data?.length === 0 ? (
            <EmptyState text="Nothing unlocked yet — browse the marketplace to grab your first pick." to="/marketplace" cta="Browse picks" />
          ) : (
            <div className="surface-card divide-y divide-border p-2">
              {purchases.data?.map((o) => (
                <Link key={o._id} to={`/picks/${o.pick._id}`} className="flex items-center justify-between gap-4 p-3 hover:bg-surface-2">
                  <div>
                    <p className="font-medium">
                      {o.pick.homeTeam} vs {o.pick.awayTeam}
                    </p>
                    <p className="text-xs text-muted-foreground">{o.pick.market} · odds {o.pick.odds.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusChip status={o.pick.status} />
                    <PriceTag price={o.amount} currency={o.currency} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="listings" className="pt-6">
          {myPicks.isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : myPicks.data?.length === 0 ? (
            <EmptyState text="You haven't listed any picks yet." to="/sell" cta="Sell your first pick" />
          ) : (
            <div className="surface-card p-4">
              {myPicks.data?.map((p) => (
                <MyPickRow key={p._id} pick={p} onChanged={refreshPicks} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sales" className="pt-6">
          {sales.isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <>
              <div className="mb-5 grid gap-4 sm:grid-cols-2">
                <div className="surface-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total earned</p>
                  <p className="mt-1 font-display text-2xl font-bold tabular text-primary">
                    {formatKES(sales.data?.totalRevenue ?? 0)}
                  </p>
                </div>
                <div className="surface-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Picks sold</p>
                  <p className="mt-1 font-display text-2xl font-bold tabular">{sales.data?.salesCount ?? 0}</p>
                </div>
              </div>
              {sales.data?.orders.length === 0 ? (
                <EmptyState text="No sales yet — list a paid pick to start earning." to="/sell" cta="List a pick" />
              ) : (
                <div className="surface-card divide-y divide-border p-2">
                  {sales.data?.orders.map((o) => (
                    <div key={o._id} className="flex items-center justify-between p-3">
                      <div>
                        <p className="font-medium">
                          {o.pick.homeTeam} vs {o.pick.awayTeam}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Bought by {typeof o.buyer === 'string' ? 'a buyer' : o.buyer.name}
                        </p>
                      </div>
                      <PriceTag price={o.sellerPayout} currency={o.currency} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ text, to, cta }: { text: string; to: string; cta: string }) {
  return (
    <div className="surface-card flex flex-col items-center gap-3 p-10 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      <Button asChild size="sm">
        <Link to={to}>{cta}</Link>
      </Button>
    </div>
  );
}
