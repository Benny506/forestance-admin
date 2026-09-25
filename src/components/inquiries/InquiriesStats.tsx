import React, { useMemo } from 'react';
import type { ContactSubmission } from '../../store/slices/inquiriesSlice';
import { Inbox, Sparkles, Calendar, Filter } from 'lucide-react';

interface InquiriesStatsProps {
  allSubmissions: ContactSubmission[];
  filteredSubmissions: ContactSubmission[];
  isFiltered: boolean;
}

export const InquiriesStats: React.FC<InquiriesStatsProps> = ({
  allSubmissions,
  filteredSubmissions,
  isFiltered,
}) => {
  const totalCount = allSubmissions.length;

  const urgentCount = useMemo(() => {
    return allSubmissions.filter((sub) =>
      sub.timeline.some((t) => t.toLowerCase() === 'now')
    ).length;
  }, [allSubmissions]);

  const recentCount = useMemo(() => {
    if (allSubmissions.length === 0) return 0;
    const latestTimestamp = new Date(allSubmissions[0].created_at).getTime();
    const sevenDaysThreshold = latestTimestamp - 7 * 24 * 60 * 60 * 1000;
    return allSubmissions.filter(
      (sub) => new Date(sub.created_at).getTime() >= sevenDaysThreshold
    ).length;
  }, [allSubmissions]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      {/* Total Inquiries */}
      <div className="bg-white border border-[#111111]/10 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 mb-3">
          <span className="font-outfit text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Total Leads
          </span>
          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700">
            <Inbox size={16} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-2xl sm:text-3xl font-bold text-zinc-900">
            {totalCount}
          </span>
          <span className="font-outfit text-xs text-zinc-400">all time</span>
        </div>
      </div>

      {/* Urgent Leads */}
      <div className="bg-white border border-[#111111]/10 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 mb-3">
          <span className="font-outfit text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Immediate ("Now")
          </span>
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
            <Sparkles size={16} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-2xl sm:text-3xl font-bold text-zinc-900">
            {urgentCount}
          </span>
          <span className="font-outfit text-xs text-zinc-400">high priority</span>
        </div>
      </div>

      {/* Past 7 Days */}
      <div className="bg-white border border-[#111111]/10 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 mb-3">
          <span className="font-outfit text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Recent Activity
          </span>
          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700">
            <Calendar size={16} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-2xl sm:text-3xl font-bold text-zinc-900">
            {recentCount}
          </span>
          <span className="font-outfit text-xs text-zinc-400">recent window</span>
        </div>
      </div>

      {/* Filtered View Results */}
      <div className="bg-white border border-[#111111]/10 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 mb-3">
          <span className="font-outfit text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Current Filter
          </span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isFiltered ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-700'}`}>
            <Filter size={16} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-2xl sm:text-3xl font-bold text-zinc-900">
            {filteredSubmissions.length}
          </span>
          <span className="font-outfit text-xs text-zinc-400">
            {isFiltered ? 'matches found' : 'showing all'}
          </span>
        </div>
      </div>
    </div>
  );
};
