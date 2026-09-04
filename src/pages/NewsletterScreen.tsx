import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchNewsletterSubscriptions, type NewsletterSubscription } from '../store/slices/newsletterSlice';
import { useUI } from '../context/UIContext';
import { useDashboard } from '../context/DashboardContext';
import { Mail, Calendar, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export const NewsletterScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((state: RootState) => state.newsletter);
  const { showLoader, hideLoader, addToast } = useUI();
  const { setHeaderTitle, setHeaderDescription } = useDashboard();

  useEffect(() => {
    setHeaderTitle('Newsletter Subscribers');
    setHeaderDescription('Manage and export your newsletter audience.');
  }, [setHeaderTitle, setHeaderDescription]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (status === 'idle') {
          showLoader('Fetching subscribers...');
          await dispatch(fetchNewsletterSubscriptions(false)).unwrap();
        }
      } catch {
        addToast('Failed to load newsletter subscriptions.', 'error');
      } finally {
        hideLoader();
      }
    };
    loadData();
  }, [dispatch, status, showLoader, hideLoader, addToast]);

  const handleRefresh = async () => {
    try {
      showLoader('Refreshing data...');
      await dispatch(fetchNewsletterSubscriptions(true)).unwrap();
      addToast('Data refreshed successfully', 'success');
    } catch {
      addToast('Failed to refresh data', 'error');
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FDFDFD]">
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-heading text-xl uppercase text-[#111111]">
            All Subscribers <span className="text-sm text-zinc-400 normal-case ml-2">({items.length})</span>
          </h2>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-lg font-outfit text-sm font-medium hover:bg-zinc-50 transition-colors shadow-sm"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {items.length === 0 && status === 'succeeded' ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center border-2 border-dashed border-[#111111]/10 rounded-2xl">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-[#111111]/40">
              <Mail size={32} />
            </div>
            <h3 className="font-heading text-2xl uppercase text-[#111111] mb-2">No Subscribers Found</h3>
            <p className="font-outfit text-[#111111]/60">There are no newsletter subscriptions to display yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((sub: NewsletterSubscription) => (
              <div
                key={sub.id}
                className="bg-white border border-[#111111]/10 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4 border-b border-[#111111]/10 pb-4">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-heading text-lg">
                    {sub.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-heading text-lg uppercase truncate">{sub.email.split('@')[0]}</span>
                    <span className="font-outfit text-sm text-zinc-500 truncate">{sub.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-zinc-500 font-outfit text-sm mt-auto">
                  <Calendar size={14} />
                  <span>Subscribed: {format(new Date(sub.created_at), 'MMM d, yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
