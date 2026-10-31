import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 animate-pulse flex flex-col gap-3">
      <div className="w-full h-36 bg-slate-100 rounded-lg" />
      <div className="h-4 bg-slate-200 rounded w-2/3" />
      <div className="h-3 bg-slate-100 rounded w-1/3" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-slate-200 rounded w-20" />
        <div className="h-8 bg-slate-100 rounded w-24" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <div className="h-4 bg-slate-100 rounded w-full" />
        </td>
      ))}
    </tr>
  );
};
