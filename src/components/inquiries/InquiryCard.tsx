import React, { useState } from 'react';
import type { ContactSubmission } from '../../store/slices/inquiriesSlice';
import { Modal } from '../ui/Modal';
import { Mail, Briefcase, Calendar, Link as LinkIcon, Info, Reply, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { EmailComposer } from './EmailComposer';
import { useUI } from '../../context/UIContext';

interface InquiryCardProps {
  inquiry: ContactSubmission;
}

export const InquiryCard: React.FC<InquiryCardProps> = ({ inquiry }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { addToast } = useUI();

  const formattedDate = new Date(inquiry.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const websiteUrl = inquiry.website
    ? inquiry.website.startsWith('http://') || inquiry.website.startsWith('https://')
      ? inquiry.website
      : `https://${inquiry.website}`
    : '';

  const isUrgent = inquiry.timeline.some((t) => t.toLowerCase() === 'now');

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(inquiry.email);
    setCopiedEmail(true);
    addToast(`Copied ${inquiry.email} to clipboard`, 'info');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-white border border-[#111111]/10 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-[#111111]/30 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-5 group relative overflow-hidden"
      >
        {isUrgent && (
          <div className="absolute top-0 right-0 w-2.5 h-full bg-[#111111]" title="Urgent Timeline" />
        )}

        <div>
          {/* Header */}
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-xl text-[#111111] uppercase group-hover:text-black transition-colors truncate">
                  {inquiry.company}
                </h3>
                {isUrgent && (
                  <span className="flex items-center gap-1 bg-[#111111] text-white text-[11px] font-outfit font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0">
                    <Sparkles size={10} />
                    Now
                  </span>
                )}
              </div>
              <p className="font-outfit text-[#111111]/70 text-sm mt-0.5 font-medium truncate">
                {inquiry.first_name} {inquiry.last_name}
              </p>
            </div>
            <span className="font-outfit text-xs text-[#111111]/50 bg-[#111111]/5 px-3 py-1 rounded-full whitespace-nowrap">
              {formattedDate}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-2.5 mt-4 border-t border-[#111111]/5 pt-4">
            <div className="flex items-center justify-between text-sm font-outfit text-[#111111]/80">
              <div className="flex items-center gap-2.5 truncate">
                <Mail size={15} className="text-[#111111]/40 flex-shrink-0" />
                <span className="truncate">{inquiry.email}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="text-[#111111]/40 hover:text-[#111111] p-1 rounded hover:bg-zinc-100 transition-colors flex-shrink-0"
                title="Copy Email"
              >
                {copiedEmail ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </div>

            <div className="flex items-center gap-2.5 text-sm font-outfit text-[#111111]/80">
              <Briefcase size={15} className="text-[#111111]/40 flex-shrink-0" />
              <span className="truncate font-medium">{inquiry.solve.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Tags footer */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#111111]/5">
          {inquiry.timeline.map((t, idx) => (
            <span key={idx} className="font-outfit text-[11px] bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-full font-medium">
              {t}
            </span>
          ))}
          {inquiry.brand_state.slice(0, 1).map((s, idx) => (
            <span key={idx} className="font-outfit text-[11px] bg-zinc-50 text-zinc-600 border border-zinc-200 px-2 py-0.5 rounded-full">
              {s}
            </span>
          ))}
          {inquiry.brand_state.length > 1 && (
            <span className="font-outfit text-[11px] text-zinc-400">+{inquiry.brand_state.length - 1}</span>
          )}
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
              <span className="text-[17px] font-medium text-[#111111]">{inquiry.first_name} {inquiry.last_name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-zinc-500 uppercase font-bold">Email Address</span>
              <div className="flex items-center gap-2 text-[17px] font-medium">
                <Mail size={16} className="text-zinc-400" />
                <a href={`mailto:${inquiry.email}`} className="hover:underline text-[#111111]">{inquiry.email}</a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="text-zinc-400 hover:text-black p-1 rounded transition-colors"
                  title="Copy Email"
                >
                  {copiedEmail ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-zinc-500 uppercase font-bold">Website / Social</span>
              <div className="flex items-center gap-2 text-[17px] font-medium">
                <LinkIcon size={16} className="text-zinc-400" />
                {websiteUrl ? (
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 truncate flex items-center gap-1">
                    <span>{inquiry.website}</span>
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <span className="text-zinc-400 text-sm">Not provided</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-zinc-500 uppercase font-bold">Submitted On</span>
              <div className="flex items-center gap-2 text-[17px] font-medium text-[#111111]">
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
                  <span className="block text-sm text-zinc-500 mb-2 font-medium">Brand State</span>
                  <div className="flex flex-wrap gap-2">
                    {inquiry.brand_state.map((state, i) => (
                      <span key={i} className="px-3 py-1 bg-black text-white text-sm rounded-full">{state}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-sm text-zinc-500 mb-2 font-medium">Looking to Solve</span>
                  <div className="flex flex-wrap gap-2">
                    {inquiry.solve.map((goal, i) => (
                      <span key={i} className="px-3 py-1 border border-[#111111]/20 text-[#111111] text-sm rounded-full font-medium">{goal}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-sm text-zinc-500 mb-2 font-medium">Timeline</span>
                  <div className="flex flex-wrap gap-2">
                    {inquiry.timeline.map((time, i) => (
                      <span key={i} className="px-3 py-1 bg-zinc-200 text-zinc-800 text-sm rounded-full font-medium">{time}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-sm text-zinc-500 mb-2 font-medium">How they found us</span>
                  <p className="font-medium capitalize text-[#111111] bg-zinc-100 px-3 py-1 rounded-md inline-block text-sm">{inquiry.source || 'Direct'}</p>
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
                className="text-sm font-outfit bg-black text-white px-4 py-1.5 rounded-full hover:bg-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Reply size={14} />
                {showComposer ? 'Hide Reply Form' : 'Reply to Lead'}
              </button>
            </h4>
            <div className="bg-white border border-[#111111]/10 p-6 rounded-xl text-[16px] leading-relaxed whitespace-pre-wrap font-outfit text-[#111111]/90 shadow-sm">
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
