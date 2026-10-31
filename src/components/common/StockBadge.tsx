import React from 'react';
import { StockStatus } from '../../types';

interface StockBadgeProps {
  status: StockStatus;
  quantity?: number;
  showQty?: boolean;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ status, quantity, showQty = false }) => {
  if (status === 'In stock') {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        <span>In stock</span>
        {showQty && quantity !== undefined && (
          <span className="text-slate-400 font-mono text-[11px] tabular-nums">
            ({quantity.toLocaleString()} units)
          </span>
        )}
      </div>
    );
  }

  if (status === 'Low stock') {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F26B5B]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F26B5B]" />
        <span>Low stock</span>
        {showQty && quantity !== undefined && (
          <span className="text-[#F26B5B]/80 font-mono text-[11px] tabular-nums">
            ({quantity} remaining)
          </span>
        )}
      </div>
    );
  }

  // Backorder
  return (
    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      <span>Backorder (3-5 days lead)</span>
    </div>
  );
};
