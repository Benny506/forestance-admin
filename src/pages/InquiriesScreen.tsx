import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setSubmissions } from '../store/slices/inquiriesSlice';
import type { ContactSubmission } from '../store/slices/inquiriesSlice';
import { supabase } from '../lib/supabase';
import { useUI } from '../context/UIContext';
import { useDashboardHeader } from '../context/DashboardContext';
import { InquiryCard } from '../components/inquiries/InquiryCard';
import { InquiryTableView } from '../components/inquiries/InquiryTableView';
import { InquiriesStats } from '../components/inquiries/InquiriesStats';
import { InquiriesFilters } from '../components/inquiries/InquiriesFilters';
import type { FilterState } from '../constants/inquiryFilters';
import { Pagination } from '../components/ui/Pagination';
import { RefreshCw, Inbox, SearchX } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  search: '',
  timeline: '',
  brandState: '',
  solve: '',
  source: '',
  sortBy: 'newest',
};

export const InquiriesScreen: React.FC = () => {
  useDashboardHeader('Site Inquiries', 'Manage incoming project requests and contacts.');

  const dispatch = useDispatch();
  const { submissions, lastFetched } = useSelector((state: RootState) => state.inquiries);
  const { showLoader, hideLoader, addToast } = useUI();

  // Local View, Filter & Pagination State
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchInquiries = useCallback(
    async (force: boolean = false) => {
      const CACHE_TIME = 5 * 60 * 1000;
      if (!force && lastFetched && Date.now() - lastFetched < CACHE_TIME && submissions.length > 0) {
        return;
      }

      try {
        if (force) {
          setIsRefreshing(true);
        } else {
          showLoader('Fetching inquiries...');
        }

        const { data, error } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        dispatch(setSubmissions(data as ContactSubmission[]));
        if (force) addToast('Data refreshed successfully.', 'success');
      } catch (error: unknown) {
        console.error('Error fetching inquiries:', error);
        addToast((error as Error).message || 'Failed to fetch inquiries.', 'error');
      } finally {
        if (force) {
          setIsRefreshing(false);
        } else {
          hideLoader();
        }
      }
    },
    [lastFetched, submissions.length, dispatch, showLoader, hideLoader, addToast]
  );

  useEffect(() => {
    let isCancelled = false;
    const loadData = async () => {
      const CACHE_TIME = 5 * 60 * 1000;
      if (lastFetched && Date.now() - lastFetched < CACHE_TIME && submissions.length > 0) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (!isCancelled && data) {
          dispatch(setSubmissions(data as ContactSubmission[]));
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          console.error('Initial inquiries fetch failed:', err);
        }
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [dispatch, lastFetched, submissions.length]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  // Count active filters (excluding defaults)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.timeline) count++;
    if (filters.brandState) count++;
    if (filters.solve) count++;
    if (filters.source) count++;
    return count;
  }, [filters]);

  // Filter & Sort Logic
  const filteredSubmissions = useMemo(() => {
    const searchLower = filters.search.trim().toLowerCase();

    const result = submissions.filter((sub) => {
      // 1. Search Query Match
      if (searchLower) {
        const matchesCompany = sub.company?.toLowerCase().includes(searchLower);
        const matchesName = `${sub.first_name || ''} ${sub.last_name || ''}`.toLowerCase().includes(searchLower);
        const matchesEmail = sub.email?.toLowerCase().includes(searchLower);
        const matchesWebsite = sub.website?.toLowerCase().includes(searchLower);
        const matchesDetails = sub.project_details?.toLowerCase().includes(searchLower);
        const matchesSolve = (sub.solve || []).some((g) => g.toLowerCase().includes(searchLower));
        const matchesBrandState = (sub.brand_state || []).some((s) => s.toLowerCase().includes(searchLower));

        if (!matchesCompany && !matchesName && !matchesEmail && !matchesWebsite && !matchesDetails && !matchesSolve && !matchesBrandState) {
          return false;
        }
      }

      // 2. Timeline Filter
      if (filters.timeline) {
        const hasTimeline = (sub.timeline || []).some((t) => t.toLowerCase() === filters.timeline.toLowerCase());
        if (!hasTimeline) return false;
      }

      // 3. Brand State Filter
      if (filters.brandState) {
        const hasState = (sub.brand_state || []).some((s) => s.toLowerCase() === filters.brandState.toLowerCase());
        if (!hasState) return false;
      }

      // 4. Solve / Goal Filter
      if (filters.solve) {
        const hasGoal = (sub.solve || []).some((g) => g.toLowerCase() === filters.solve.toLowerCase());
        if (!hasGoal) return false;
      }

      // 5. Source Filter
      if (filters.source) {
        if ((sub.source || '').toLowerCase() !== filters.source.toLowerCase()) {
          return false;
        }
      }

      return true;
    });

    // 6. Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (filters.sortBy === 'company-asc') {
        return (a.company || '').localeCompare(b.company || '');
      }
      if (filters.sortBy === 'company-desc') {
        return (b.company || '').localeCompare(a.company || '');
      }
      // default: newest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [submissions, filters]);

  // Pagination Math
  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize));
  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSubmissions.slice(startIndex, startIndex + pageSize);
  }, [filteredSubmissions, currentPage, pageSize]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 min-h-full pb-10">
      {/* Top Stats Overview */}
      <InquiriesStats
        allSubmissions={submissions}
        filteredSubmissions={filteredSubmissions}
        isFiltered={activeFilterCount > 0}
      />

      {/* Action Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl uppercase text-[#111111]">
            Inquiries Feed
          </h2>
          <p className="font-outfit text-xs sm:text-sm text-zinc-500 mt-0.5">
            Real-time project leads and discovery requests
          </p>
        </div>

        <button
          onClick={() => fetchInquiries(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-white border border-[#111111]/20 rounded-xl font-outfit text-xs sm:text-sm font-medium hover:bg-zinc-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Filters & Controls */}
      <InquiriesFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        submissionsToExport={filteredSubmissions}
      />

      {/* Content Area */}
      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[360px] border border-dashed border-[#111111]/20 rounded-2xl bg-white/50 p-8 text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-[#111111]/40">
            <Inbox size={32} />
          </div>
          <h3 className="font-heading text-2xl uppercase text-[#111111] mb-2">
            No Inquiries Found
          </h3>
          <p className="font-outfit text-[#111111]/60 max-w-sm">
            There are no contact submissions in the database yet.
          </p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[360px] border border-dashed border-[#111111]/20 rounded-2xl bg-white p-8 text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
            <SearchX size={32} />
          </div>
          <h3 className="font-heading text-xl sm:text-2xl uppercase text-zinc-900 mb-2">
            No Matching Results
          </h3>
          <p className="font-outfit text-sm text-zinc-500 max-w-md mb-6">
            No inquiries matched your current filter criteria or search query. Try adjusting your keywords or resetting filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-black text-white rounded-full font-outfit text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          {/* Grid vs Table View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {paginatedSubmissions.map((inquiry) => (
                <InquiryCard key={inquiry.id} inquiry={inquiry} />
              ))}
            </div>
          ) : (
            <InquiryTableView submissions={paginatedSubmissions} />
          )}

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredSubmissions.length}
            pageSize={pageSize}
            pageSizeOptions={[6, 12, 24, 48]}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </>
      )}
    </div>
  );
};
