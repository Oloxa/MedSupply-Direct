import React from 'react';
import { PriceTier } from '../../types';
import { ArrowUpRight, Check } from 'lucide-react';

interface TierPriceTableProps {
  tiers: PriceTier[];
  currentQuantity: number;
  onSelectTierMin?: (minQty: number) => void;
  unitOfMeasure?: string;
}

export const TierPriceTable: React.FC<TierPriceTableProps> = ({
  tiers,
  currentQuantity,
  onSelectTierMin,
  unitOfMeasure = 'box',
}) => {
  // Find current active tier
  const activeTier = [...tiers]
    .sort((a, b) => b.minQty - a.minQty)
    .find((tier) => currentQuantity >= tier.minQty) || tiers[0];

  // Find next tier for upsell hint
  const nextTierIndex = tiers.findIndex((t) => t === activeTier) + 1;
  const nextTier = nextTierIndex < tiers.length ? tiers[nextTierIndex] : null;
  const unitsNeeded = nextTier ? nextTier.minQty - currentQuantity : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#12304A] uppercase tracking-wider">
            Volume Wholesale Pricing
          </span>
          <span className="text-xs text-slate-500 ml-2">Tiered discounts applied automatically</span>
        </div>
        {nextTier && unitsNeeded > 0 && (
          <span className="text-xs font-medium text-[#0E9AA7] bg-[#E6F4FA] px-2.5 py-1 rounded-md">
            Order {unitsNeeded} more {unitOfMeasure}s to unlock {nextTier.discountPercent}% off
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {tiers.map((tier, idx) => {
          const isActive = activeTier === tier;
          const label = tier.maxQty ? `${tier.minQty} – ${tier.maxQty}` : `${tier.minQty}+`;

          return (
            <button
              type="button"
              key={idx}
              onClick={() => onSelectTierMin && onSelectTierMin(tier.minQty)}
              className={`p-3.5 text-left transition-all relative ${
                isActive
                  ? 'bg-[#E6F4FA]/60 ring-2 ring-[#0E9AA7] ring-inset'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-700">
                  {label} {unitOfMeasure}s
                </span>
                {isActive && (
                  <span className="w-4 h-4 rounded-full bg-[#0E9AA7] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              <div className="text-base font-bold text-[#12304A] font-mono tabular-nums">
                ${tier.unitPrice.toFixed(2)}
                <span className="text-xs font-normal text-slate-500 ml-1">/{unitOfMeasure}</span>
              </div>

              <div className="mt-1 flex items-center justify-between">
                <span
                  className={`text-[11px] font-medium ${
                    tier.discountPercent > 0 ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {tier.discountPercent > 0 ? `${tier.discountPercent}% bulk savings` : 'Standard Price'}
                </span>

                {onSelectTierMin && !isActive && (
                  <span className="text-[10px] text-[#0E9AA7] flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                    Apply <ArrowUpRight className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
