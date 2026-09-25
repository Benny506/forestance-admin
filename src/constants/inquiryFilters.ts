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
