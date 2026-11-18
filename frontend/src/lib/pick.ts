import { OddsPick } from '@/types';

export const isSlip = (p: Pick<OddsPick, 'pickType'>) => p.pickType === 'slip';

/** "Arsenal vs Chelsea" for single picks, the slip title for betslips. */
export const pickTitle = (p: OddsPick) => (isSlip(p) ? p.title || 'Betslip' : `${p.homeTeam} vs ${p.awayTeam}`);

/** Small label above the selection: the market, or "SportPesa betslip". */
export const pickLabel = (p: OddsPick) => (isSlip(p) ? (p.bookmaker ? `${p.bookmaker} betslip` : 'Betslip') : p.market);

/** Line under the title: league, or "Betslip". */
export const pickLeague = (p: OddsPick) => (isSlip(p) ? 'Betslip' : p.league);
