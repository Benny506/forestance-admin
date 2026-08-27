import React from 'react';
import { useDashboardHeader } from '../context/DashboardContext';
import { ArrowUpRight, Users, Eye, Mail } from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  // Dynamically set the top bar header for this specific screen
  useDashboardHeader('Overview', 'A quick glance at your platform performance.');

  const stats = [
    { label: 'Total Inquiries', value: '142', trend: '+12%', icon: Mail },
    { label: 'Site Visitors', value: '8.4k', trend: '+5.2%', icon: Eye },
    { label: 'Active Projects', value: '12', trend: 'Stable', icon: Users },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-[#111111]/10 rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-zinc-100 rounded-lg text-[#111111]">
                <stat.icon size={20} />
              </div>
              <span className={`text-sm font-medium flex items-center gap-1 ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-zinc-500'}`}>
                {stat.trend}
                {stat.trend.startsWith('+') && <ArrowUpRight size={16} />}
              </span>
            </div>
            <div>
              <h3 className="font-heading text-4xl text-[#111111]">{stat.value}</h3>
              <p className="font-outfit text-[#111111]/60 font-medium mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dummy Chart Area */}
      <div className="bg-white border border-[#111111]/10 rounded-xl p-6 shadow-sm min-h-[400px] flex items-center justify-center">
        <p className="font-outfit text-[#111111]/40 text-lg border border-dashed border-[#111111]/20 p-10 rounded-xl">
          Chart Area Placeholder
        </p>
      </div>
    </div>
  );
};
