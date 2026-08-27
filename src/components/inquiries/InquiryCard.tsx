import React, { useState } from 'react';
import type { ContactSubmission } from '../../store/slices/inquiriesSlice';
import { Modal } from '../ui/Modal';
import { Mail, Briefcase, Calendar, Link as LinkIcon, Info, Reply } from 'lucide-react';
import { EmailComposer } from './EmailComposer';

interface InquiryCardProps {
  inquiry: ContactSubmission;
}

export const InquiryCard: React.FC<InquiryCardProps> = ({ inquiry }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showComposer, setShowComposer] = useState(false);

  const formattedDate = new Date(inquiry.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-white border border-[#111111]/10 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#111111]/30 transition-all cursor-pointer flex flex-col gap-5 group"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-heading text-xl text-[#111111] uppercase group-hover:text-black transition-colors">
              {inquiry.company}
            </h3>
            <p className="font-outfit text-[#111111]/60 text-sm mt-1">
              {inquiry.first_name} {inquiry.last_name}
            </p>
          </div>
          <span className="font-outfit text-xs text-[#111111]/40 bg-[#111111]/5 px-3 py-1 rounded-full">
            {formattedDate}
          </span>
        </div>

        <div className="flex flex-col gap-2 mt-2 border-t border-[#111111]/5 pt-4">
          <div className="flex items-center gap-3 text-sm font-outfit text-[#111111]/80">
            <Mail size={16} className="text-[#111111]/40" />
            <span className="truncate">{inquiry.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-outfit text-[#111111]/80">
            <Briefcase size={16} className="text-[#111111]/40" />
            <span className="truncate">{inquiry.solve.join(', ')}</span>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`${inquiry.company} Inquiry`}
      >
        <div className="flex flex-col gap-8">
          {/* Top Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 p-6 rounded-xl border border-zinc-200">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-zinc-500 uppercase font-bold">Contact Name</span>
              <span className="text-[17px] font-medium">{inquiry.first_name} {inquiry.last_name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-zinc-500 uppercase font-bold">Email Address</span>
              <div className="flex items-center gap-2 text-[17px] font-medium">
                <Mail size={16} className="text-zinc-400" />
                <a href={`mailto:${inquiry.email}`} className="hover:underline">{inquiry.email}</a>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-zinc-500 uppercase font-bold">Website</span>
              <div className="flex items-center gap-2 text-[17px] font-medium">
                <LinkIcon size={16} className="text-zinc-400" />
                <a href={inquiry.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 truncate">
                  {inquiry.website}
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-zinc-500 uppercase font-bold">Submitted On</span>
              <div className="flex items-center gap-2 text-[17px] font-medium">
                <Calendar size={16} className="text-zinc-400" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Goals & State */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h4 className="font-heading text-lg uppercase flex items-center gap-2 border-b border-[#111111]/10 pb-2">
                <Info size={20} className="text-[#111111]/40" />
                Project Context
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div>
                  <span className="block text-sm text-zinc-500 mb-1">Brand State</span>
                  <div className="flex flex-wrap gap-2">
                    {inquiry.brand_state.map((state, i) => (
                      <span key={i} className="px-3 py-1 bg-black text-white text-sm rounded-full">{state}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-sm text-zinc-500 mb-1">Looking to Solve</span>
                  <div className="flex flex-wrap gap-2">
                    {inquiry.solve.map((goal, i) => (
                      <span key={i} className="px-3 py-1 border border-[#111111]/20 text-[#111111] text-sm rounded-full">{goal}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-sm text-zinc-500 mb-1">Timeline</span>
                  <div className="flex flex-wrap gap-2">
                    {inquiry.timeline.map((time, i) => (
                      <span key={i} className="px-3 py-1 bg-zinc-200 text-zinc-800 text-sm rounded-full">{time}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-sm text-zinc-500 mb-1">Source</span>
                  <p className="font-medium capitalize">{inquiry.source}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Project Details */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading text-lg uppercase border-b border-[#111111]/10 pb-2 flex justify-between items-center">
              <span>Project Details</span>
              <button 
                onClick={() => setShowComposer(!showComposer)}
                className="text-sm font-outfit text-zinc-500 hover:text-black flex items-center gap-1 transition-colors"
              >
                <Reply size={16} />
                Reply
              </button>
            </h4>
            <div className="bg-white border border-[#111111]/10 p-6 rounded-xl text-[16px] leading-relaxed whitespace-pre-wrap">
              {inquiry.project_details}
            </div>
          </div>

          {/* Composer */}
          {showComposer && (
            <EmailComposer 
              toEmail={inquiry.email} 
              onSuccess={() => setShowComposer(false)} 
            />
          )}
        </div>
      </Modal>
    </>
  );
};
