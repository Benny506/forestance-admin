import React from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  Download,
  LayoutGrid,
  List,
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';
import type { ContactSubmission } from '../../store/slices/inquiriesSlice';
import {
  type FilterState,
  TIMELINE_OPTIONS,
  BRAND_STATE_OPTIONS,
  SOLVE_OPTIONS,
  SOURCE_OPTIONS
} from '../../constants/inquiryFilters';

interface InquiriesFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  submissionsToExport: ContactSubmission[];
}

export const InquiriesFilters: React.FC<InquiriesFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
  viewMode,
  onViewModeChange,
  submissionsToExport,
}) => {
  const exportToCSV = () => {
    if (submissionsToExport.length === 0) return;

    const headers = [
      'ID',
      'Submitted Date',
      'Company',
      'First Name',
      'Last Name',
      'Email',
      'Website',
      'Source',
      'Timeline',
      'Brand State',
      'Services / Goals',
      'Project Details',
    ];

    const rows = submissionsToExport.map((sub) => [
      `"${sub.id}"`,
      `"${new Date(sub.created_at).toISOString()}"`,
      `"${(sub.company || '').replace(/"/g, '""')}"`,
      `"${(sub.first_name || '').replace(/"/g, '""')}"`,
      `"${(sub.last_name || '').replace(/"/g, '""')}"`,
      `"${(sub.email || '').replace(/"/g, '""')}"`,
      `"${(sub.website || '').replace(/"/g, '""')}"`,
      `"${(sub.source || '').replace(/"/g, '""')}"`,
      `"${(sub.timeline || []).join('; ').replace(/"/g, '""')}"`,
      `"${(sub.brand_state || []).join('; ').replace(/"/g, '""')}"`,
      `"${(sub.solve || []).join('; ').replace(/"/g, '""')}"`,
      `"${(sub.project_details || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `forestance_inquiries_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-[#111111]/10 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-5">
      {/* Top Controls Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-2xl">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by company, contact name, email, goals, or message content..."
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-11 pr-10 py-3 font-outfit text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1 rounded-full hover:bg-zinc-200/60 transition-colors"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* View Mode & Export Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-outfit font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              <LayoutGrid size={15} />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-outfit font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              <List size={15} />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={exportToCSV}
            disabled={submissionsToExport.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-outfit text-xs sm:text-sm font-medium hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-zinc-800"
            title="Download CSV of current results"
          >
            <Download size={15} />
            <span>Export CSV ({submissionsToExport.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Selects Row */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-100">
        <div className="flex items-center gap-1.5 text-zinc-400 font-outfit text-xs font-semibold uppercase tracking-wider mr-1">
          <SlidersHorizontal size={14} />
          <span>Filters:</span>
        </div>

        {/* Timeline Select */}
        <select
          value={filters.timeline}
          onChange={(e) => onFilterChange({ timeline: e.target.value })}
          className={`px-3.5 py-2 rounded-xl text-xs font-outfit font-medium border focus:outline-none transition-colors cursor-pointer ${
            filters.timeline
              ? 'bg-black text-white border-black'
              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <option value="" className="bg-white text-black">Timeline: All</option>
          {TIMELINE_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-white text-black">
              Timeline: {opt}
            </option>
          ))}
        </select>

        {/* Brand State Select */}
        <select
          value={filters.brandState}
          onChange={(e) => onFilterChange({ brandState: e.target.value })}
          className={`px-3.5 py-2 rounded-xl text-xs font-outfit font-medium border focus:outline-none transition-colors cursor-pointer ${
            filters.brandState
              ? 'bg-black text-white border-black'
              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <option value="" className="bg-white text-black">Brand State: All</option>
          {BRAND_STATE_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-white text-black">
              State: {opt}
            </option>
          ))}
        </select>

        {/* Solve / Goal Select */}
        <select
          value={filters.solve}
          onChange={(e) => onFilterChange({ solve: e.target.value })}
          className={`px-3.5 py-2 rounded-xl text-xs font-outfit font-medium border focus:outline-none transition-colors cursor-pointer ${
            filters.solve
              ? 'bg-black text-white border-black'
              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <option value="" className="bg-white text-black">Goal / Service: All</option>
          {SOLVE_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-white text-black">
              Goal: {opt}
            </option>
          ))}
        </select>

        {/* Source Select */}
        <select
          value={filters.source}
          onChange={(e) => onFilterChange({ source: e.target.value })}
          className={`px-3.5 py-2 rounded-xl text-xs font-outfit font-medium border focus:outline-none transition-colors cursor-pointer ${
            filters.source
              ? 'bg-black text-white border-black'
              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <option value="" className="bg-white text-black">Source: All</option>
          {SOURCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-black">
              Source: {opt.label}
            </option>
          ))}
        </select>

        {/* Sort By Select */}
        <div className="flex items-center gap-1.5 ml-auto">
          <ArrowUpDown size={14} className="text-zinc-400" />
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
            className="px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-outfit font-medium text-zinc-800 hover:border-zinc-300 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="company-asc">Sort: Company (A-Z)</option>
            <option value="company-desc">Sort: Company (Z-A)</option>
          </select>
        </div>

        {/* Reset All Button */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-outfit font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-outfit">
          <span className="text-zinc-400 font-medium">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-800 px-3 py-1 rounded-full border border-zinc-200">
              <span>Query: "{filters.search}"</span>
              <button
                onClick={() => onFilterChange({ search: '' })}
                className="text-zinc-400 hover:text-black"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.timeline && (
            <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-800 px-3 py-1 rounded-full border border-zinc-200">
              <span>Timeline: {filters.timeline}</span>
              <button
                onClick={() => onFilterChange({ timeline: '' })}
                className="text-zinc-400 hover:text-black"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.brandState && (
            <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-800 px-3 py-1 rounded-full border border-zinc-200">
              <span>State: {filters.brandState}</span>
              <button
                onClick={() => onFilterChange({ brandState: '' })}
                className="text-zinc-400 hover:text-black"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.solve && (
            <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-800 px-3 py-1 rounded-full border border-zinc-200">
              <span>Goal: {filters.solve}</span>
              <button
                onClick={() => onFilterChange({ solve: '' })}
                className="text-zinc-400 hover:text-black"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.source && (
            <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-800 px-3 py-1 rounded-full border border-zinc-200">
              <span>Source: {filters.source}</span>
              <button
                onClick={() => onFilterChange({ source: '' })}
                className="text-zinc-400 hover:text-black"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
