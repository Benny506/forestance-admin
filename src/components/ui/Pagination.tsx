import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [6, 12, 24, 48],
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const delta = 1;
    const range: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift(-1); // ellipsis
    }
    if (currentPage + delta < totalPages - 1) {
      range.push(-2); // ellipsis
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="bg-white border border-[#111111]/10 rounded-2xl px-5 sm:px-6 py-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 font-outfit text-sm">
      {/* Items Summary & Page Size */}
      <div className="flex items-center gap-4 text-zinc-500 text-xs sm:text-sm">
        <span>
          Showing <span className="font-semibold text-zinc-900">{startItem}</span> to{' '}
          <span className="font-semibold text-zinc-900">{endItem}</span> of{' '}
          <span className="font-semibold text-zinc-900">{totalItems}</span> results
        </span>

        <div className="flex items-center gap-2 border-l border-zinc-200 pl-4">
          <span className="hidden md:inline text-zinc-400 text-xs">Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-zinc-800 cursor-pointer focus:outline-none"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          {/* First Page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="First Page"
          >
            <ChevronsLeft size={15} />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Previous Page"
          >
            <ChevronLeft size={15} />
          </button>

          {/* Numbered Pages */}
          <div className="flex items-center gap-1 px-1">
            {getPageNumbers().map((p, idx) => {
              if (p < 0) {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 text-zinc-400">
                    ...
                  </span>
                );
              }
              const isActive = p === currentPage;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`min-w-[34px] h-[34px] rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-black text-white shadow-sm'
                      : 'border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Next Page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Next Page"
          >
            <ChevronRight size={15} />
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Last Page"
          >
            <ChevronsRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
