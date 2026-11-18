import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { picksApi } from '@/lib/api/picks';

/** Loads the paywalled slip images with the user's token (a plain <img src> cannot send auth headers). */
export function SlipImages({ pickId, count }: { pickId: string; count: number }) {
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const created: string[] = [];
    setLoading(true);
    Promise.all(Array.from({ length: count }, (_, i) => picksApi.image(pickId, i)))
      .then((list) => {
        created.push(...list);
        if (!cancelled) setUrls(list);
      })
      .catch(() => !cancelled && setFailed(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
      created.forEach(URL.revokeObjectURL);
    };
  }, [pickId, count]);

  if (loading) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
  if (failed) return <p className="text-sm text-danger">Couldn't load the slip images. Refresh and try again.</p>;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {urls.map((src, i) => (
        <a key={src} href={src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-md border border-border bg-surface-2">
          <img src={src} alt={`Betslip ${i + 1}`} className="w-full" loading="lazy" />
        </a>
      ))}
    </div>
  );
}
