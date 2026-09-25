export interface FilterState {
  search: string;
  timeline: string;
  brandState: string;
  solve: string;
  source: string;
  sortBy: 'newest' | 'oldest' | 'company-asc' | 'company-desc';
}

export const TIMELINE_OPTIONS = [
  'Now',
  'Within 1 month',
  '1-3 months',
  'Exploring',
];

export const BRAND_STATE_OPTIONS = [
  'Pre-launch',
  'Growing',
  'Scaling',
  'Repositioning / Rebranding',
];

export const SOLVE_OPTIONS = [
  'Brand direction',
  'Positioning',
  'Identity',
  'Rebrand',
  'Campaign / Creative',
  'Digital / Website',
  'Ongoing brand support',
  'Something else',
];

export const SOURCE_OPTIONS = [
  { label: 'Search Engine', value: 'search' },
  { label: 'Social Media', value: 'social' },
  { label: 'Referral', value: 'referral' },
  { label: 'Other', value: 'other' },
];

export const getTimelineBadgeStyle = (timeline: string) => {
  const t = (timeline || '').toLowerCase();
  if (t === 'now') {
    return 'bg-amber-50 text-amber-900 border border-amber-200/80 font-semibold';
  }
  if (t.includes('1 month')) {
    return 'bg-blue-50 text-blue-800 border border-blue-200/80 font-medium';
  }
  if (t.includes('1-3') || t.includes('3 months')) {
    return 'bg-purple-50 text-purple-800 border border-purple-200/80 font-medium';
  }
  if (t.includes('exploring')) {
    return 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-medium';
  }
  return 'bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium';
};
