import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import JSZip from 'jszip';
import { Paperclip, X, Send } from 'lucide-react';
import axios from 'axios';
import { supabase } from '../../lib/supabase';
import { useUI } from '../../context/UIContext';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../constants/config';

interface EmailComposerProps {
  toEmail: string;
  onSuccess: () => void;
}

const MAX_ZIP_SIZE = 25 * 1024 * 1024; // 25 MB

export const EmailComposer: React.FC<EmailComposerProps> = ({ toEmail, onSuccess }) => {
  const { showLoader, hideLoader, addToast } = useUI();
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll into view when opened
  useEffect(() => {
    if (composerRef.current) {
      composerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove the data URI prefix (e.g., "data:application/zip;base64,")
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const formik = useFormik({
    initialValues: {
      subject: '',
      body: '',
    },
    validationSchema: Yup.object({
      subject: Yup.string().required('Subject is required'),
      body: Yup.string().required('Email body is required'),
    }),
    onSubmit: async (values) => {
      try {
        showLoader('Preparing email...');
        let attachmentBase64 = null;

        // Zip files if any
        if (files.length > 0) {
          showLoader('Compressing attachments...');
          const zip = new JSZip();
          files.forEach(file => {
            zip.file(file.name, file);
          });

          const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });

          if (zipBlob.size > MAX_ZIP_SIZE) {
            addToast(`Attachments exceed the 25MB limit (Current: ${(zipBlob.size / 1024 / 1024).toFixed(2)}MB). Please remove some files.`, 'error');
            hideLoader();
            return;
          }

          attachmentBase64 = await blobToBase64(zipBlob);
        }

        showLoader('Sending reply...');
        const { data: session } = await supabase.auth.getSession();
        
        await axios.post(
          `${SUPABASE_URL}/functions/v1/reply-inquiry`,
          {
            toEmail,
            subject: values.subject,
            htmlBody: values.body.replace(/\n/g, '<br />'),
            attachmentBase64
          },
          {
            headers: {
              Authorization: `Bearer ${session.session?.access_token}`,
              apikey: SUPABASE_ANON_KEY
            }
          }
        );

        addToast('Reply sent successfully!', 'success');
        onSuccess();
      } catch (error: unknown) {
        console.error('Error sending email:', error);
        addToast((error as Error).message || 'Failed to send email.', 'error');
      } finally {
        hideLoader();
      }
    }
  });

  return (
    <div ref={composerRef} className="bg-white border border-[#111111]/10 rounded-xl overflow-hidden mt-6 flex flex-col shadow-sm">
      <div className="bg-zinc-50 border-b border-[#111111]/10 p-4">
        <h4 className="font-heading uppercase text-sm tracking-wide text-zinc-500">Reply to {toEmail}</h4>
      </div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col">
        <div className="border-b border-[#111111]/10">
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.subject}
            className="w-full px-5 py-3 font-outfit text-[#111111] placeholder:text-zinc-400 focus:outline-none"
          />
        </div>

        <div>
          <textarea
            name="body"
            placeholder="Write your message here..."
            rows={6}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.body}
            className="w-full px-5 py-4 font-outfit text-[#111111] placeholder:text-zinc-400 focus:outline-none resize-y min-h-[150px]"
          />
        </div>

        {/* File Attachments List */}
        {files.length > 0 && (
          <div className="px-5 pb-2 flex flex-wrap gap-2">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-md text-sm font-outfit">
                <span className="truncate max-w-[150px]">{file.name}</span>
                <span className="text-zinc-400 text-xs">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="ml-1 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-zinc-50 border-t border-[#111111]/10 px-5 py-3 flex items-center justify-between">
          <div>
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-zinc-600 hover:text-black transition-colors font-outfit text-sm font-medium"
            >
              <Paperclip size={16} />
              Attach Files
            </button>
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
            className="bg-black text-white px-6 py-2 rounded-lg font-outfit font-medium text-sm flex items-center gap-2 hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            Send Reply
          </button>
        </div>
      </form>
    </div>
  );
};
