import React, { useState } from 'react';
import type { ContactSubmission } from '../../store/slices/inquiriesSlice';
import { Modal } from '../ui/Modal';
import { Mail, Calendar, Link as LinkIcon, Info, Reply, Copy, Check, ExternalLink, Eye } from 'lucide-react';
import { EmailComposer } from './EmailComposer';
import { useUI } from '../../context/UIContext';

interface InquiryTableViewProps {
  submissions: ContactSubmission[];
}

export const InquiryTableView: React.FC<InquiryTableViewProps> = ({ submissions }) => {
  const [selectedInquiry, setSelectedInquiry] = useState<ContactSubmission | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const { addToast } = useUI();

  const handleCopyEmail = (e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    addToast(`Copied ${email} to clipboard`, 'info');
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const selectedWebsiteUrl = selectedInquiry?.website
    ? selectedInquiry.website.startsWith('http://') || selectedInquiry.website.startsWith('https://')
      ? selectedInquiry.website
      : `https://${selectedInquiry.website}`
    : '';

  return (
    <>
      <div className="w-full overflow-x-auto bg-white border border-[#111111]/10 rounded-2xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#111111]/10 bg-zinc-50/75 text-[12px] font-outfit uppercase font-semibold text-zinc-500 tracking-wider">
              <th className="py-4 px-6">Company</th>
              <th className="py-4 px-6">Contact & Email</th>
              <th className="py-4 px-6">Goals</th>
              <th className="py-4 px-6">Timeline</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111111]/5 font-outfit text-sm">
            {submissions.map((inquiry) => {
              const formattedDate = new Date(inquiry.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const isUrgent = inquiry.timeline.some((t) => t.toLowerCase() === 'now');

              return (
                <tr
                  key={inquiry.id}
                  onClick={() => setSelectedInquiry(inquiry)}
                  className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-semibold uppercase text-zinc-900 group-hover:text-black">
                        {inquiry.company}
                      </span>
                      {isUrgent && (
                        <span className="bg-[#111111] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                          Now
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-800">
                        {inquiry.first_name} {inquiry.last_name}
                      </span>
                      <div className="flex items-center gap-1.5 text-zinc-500 text-xs mt-0.5">
                        <span className="truncate max-w-[180px]">{inquiry.email}</span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyEmail(e, inquiry.email)}
                          className="hover:text-black p-0.5 rounded transition-colors"
                          title="Copy Email"
                        >
                          {copiedEmail === inquiry.email ? (
                            <Check size={12} className="text-emerald-600" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1 max-w-[240px]">
                      {inquiry.solve.slice(0, 2).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md font-medium truncate max-w-[140px]"
                        >
                          {s}
                        </span>
                      ))}
                      {inquiry.solve.length > 2 && (
                        <span className="text-[11px] text-zinc-400">+{inquiry.solve.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`text-[12px] px-2.5 py-1 rounded-full font-medium ${
                        isUrgent
                          ? 'bg-black text-white font-semibold'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {inquiry.timeline.join(', ') || 'Exploring'}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-xs text-zinc-500">
                    {formattedDate}
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInquiry(inquiry);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-black hover:text-white rounded-lg text-xs font-medium transition-all"
                    >
                      <Eye size={13} />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <Modal
          isOpen={Boolean(selectedInquiry)}
          onClose={() => {
            setSelectedInquiry(null);
            setShowComposer(false);
          }}
          title={`${selectedInquiry.company} Inquiry`}
        >
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 p-6 rounded-xl border border-zinc-200">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-500 uppercase font-bold">Contact Name</span>
                <span className="text-[17px] font-medium text-[#111111]">
                  {selectedInquiry.first_name} {selectedInquiry.last_name}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-500 uppercase font-bold">Email Address</span>
                <div className="flex items-center gap-2 text-[17px] font-medium">
                  <Mail size={16} className="text-zinc-400" />
                  <a href={`mailto:${selectedInquiry.email}`} className="hover:underline text-[#111111]">
                    {selectedInquiry.email}
                  </a>
                  <button
                    type="button"
                    onClick={(e) => handleCopyEmail(e, selectedInquiry.email)}
                    className="text-zinc-400 hover:text-black p-1 rounded transition-colors"
                  >
                    {copiedEmail === selectedInquiry.email ? (
                      <Check size={14} className="text-emerald-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-500 uppercase font-bold">Website / Social</span>
                <div className="flex items-center gap-2 text-[17px] font-medium">
                  <LinkIcon size={16} className="text-zinc-400" />
                  {selectedWebsiteUrl ? (
                    <a
                      href={selectedWebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-600 truncate flex items-center gap-1"
                    >
                      <span>{selectedInquiry.website}</span>
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
                  <span>
                    {new Date(selectedInquiry.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

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
                      {selectedInquiry.brand_state.map((state, i) => (
                        <span key={i} className="px-3 py-1 bg-black text-white text-sm rounded-full">
                          {state}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm text-zinc-500 mb-2 font-medium">Looking to Solve</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedInquiry.solve.map((goal, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 border border-[#111111]/20 text-[#111111] text-sm rounded-full font-medium"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm text-zinc-500 mb-2 font-medium">Timeline</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedInquiry.timeline.map((time, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-zinc-200 text-zinc-800 text-sm rounded-full font-medium"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm text-zinc-500 mb-2 font-medium">Source</span>
                    <p className="font-medium capitalize text-[#111111] bg-zinc-100 px-3 py-1 rounded-md inline-block text-sm">
                      {selectedInquiry.source || 'Direct'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
                {selectedInquiry.project_details}
              </div>
            </div>

            {showComposer && (
              <EmailComposer
                toEmail={selectedInquiry.email}
                onSuccess={() => setShowComposer(false)}
              />
            )}
          </div>
        </Modal>
      )}
    </>
  );
};
