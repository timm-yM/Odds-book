import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <img src="/logo-sm.png" alt="" className="h-7 w-7" width={28} height={28} />
            ODDSBOOK
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            The marketplace where sports analysts sell verified picks, and bettors buy only the calls they trust.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Marketplace</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/marketplace" className="hover:text-foreground">Browse picks</Link></li>
            <li><Link to="/marketplace?freeOnly=true" className="hover:text-foreground">Free picks</Link></li>
            <li><Link to="/sell" className="hover:text-foreground">Sell a pick</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Responsible Gambling 18+</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5">
        <p className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ODDSBOOK. All picks are opinion, not guaranteed outcomes. Bet responsibly.
        </p>
      </div>
    </footer>
  );
}
