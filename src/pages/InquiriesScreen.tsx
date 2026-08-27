import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setSubmissions } from '../store/slices/inquiriesSlice';
import type { ContactSubmission } from '../store/slices/inquiriesSlice';
import { supabase } from '../lib/supabase';
import { useUI } from '../context/UIContext';
import { useDashboardHeader } from '../context/DashboardContext';
import { InquiryCard } from '../components/inquiries/InquiryCard';
import { RefreshCw, Inbox } from 'lucide-react';

export const InquiriesScreen: React.FC = () => {
  useDashboardHeader('Site Inquiries', 'Manage incoming project requests and contacts.');
  
  const dispatch = useDispatch();
  const { submissions, lastFetched } = useSelector((state: RootState) => state.inquiries);
  const { showLoader, hideLoader, addToast } = useUI();

  const fetchInquiries = async (force: boolean = false) => {
    // Cache invalidation (e.g. 5 minutes) or if forcefully requested
    const CACHE_TIME = 5 * 60 * 1000;
    if (!force && lastFetched && Date.now() - lastFetched < CACHE_TIME && submissions.length > 0) {
      return; // Use cached data
    }

    try {
      showLoader('Fetching inquiries...');
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      dispatch(setSubmissions(data as ContactSubmission[]));
      if (force) addToast('Data refreshed successfully.', 'success');
    } catch (error: unknown) {
      console.error('Error fetching inquiries:', error);
      addToast((error as Error).message || 'Failed to fetch inquiries.', 'error');
    } finally {
      hideLoader();
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Actions Row */}
      <div className="flex justify-end">
        <button
          onClick={() => fetchInquiries(true)}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-[#111111]/20 rounded-lg font-outfit text-sm font-medium hover:bg-zinc-50 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh Data
        </button>
      </div>

      {/* Grid */}
      {submissions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] border border-dashed border-[#111111]/20 rounded-2xl bg-white/50">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-[#111111]/40">
            <Inbox size={32} />
          </div>
          <h3 className="font-heading text-2xl uppercase text-[#111111] mb-2">No Inquiries Found</h3>
          <p className="font-outfit text-[#111111]/60">There are no contact submissions to display yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {submissions.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      )}
    </div>
  );
};
