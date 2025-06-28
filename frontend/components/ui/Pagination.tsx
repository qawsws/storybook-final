// frontend/components/ui/Pagination.tsx
import React from 'react';
import Button from './Button'; // Button 컴포넌트 재활용

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      <Button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="px-4 py-2 text-sm rounded-lg">
        처음
      </Button>
      <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 text-sm rounded-lg">
        이전
      </Button>

      {pageNumbers.map((p) => (
        <Button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-4 py-2 text-sm rounded-lg ${p === currentPage ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          {p}
        </Button>
      ))}

      <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 text-sm rounded-lg">
        다음
      </Button>
      <Button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="px-4 py-2 text-sm rounded-lg">
        마지막
      </Button>
    </div>
  );
}