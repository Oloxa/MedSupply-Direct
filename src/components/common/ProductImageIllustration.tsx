import React from 'react';
import { ProductCategory } from '../../types';

interface ProductImageIllustrationProps {
  category: ProductCategory;
  subCategory?: string;
  className?: string;
}

export const ProductImageIllustration: React.FC<ProductImageIllustrationProps> = ({
  category,
  className = 'w-full h-40',
}) => {
  // Medical SVG illustrations customized by category with clinical colors
  const renderIcon = () => {
    switch (category) {
      case 'Gloves and PPE':
        return (
          <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none">
            {/* Medical Glove & Mask illustration */}
            <rect x="25" y="45" width="70" height="45" rx="10" fill="#E6F4FA" stroke="#0E9AA7" strokeWidth="2.5" />
            <path d="M25 55C15 55 10 65 25 75M95 55C105 55 110 65 95 75" stroke="#0E9AA7" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M40 60H80M40 70H80M40 80H80" stroke="#0B8591" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="60" cy="30" r="14" fill="#0E9AA7" opacity="0.15" />
            <path d="M60 22V38M52 30H68" stroke="#0E9AA7" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'Syringes and Needles':
        return (
          <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none">
            {/* Luer Lock Syringe */}
            <rect x="42" y="35" width="36" height="55" rx="3" fill="#F0F9FA" stroke="#0E9AA7" strokeWidth="2.5" />
            {/* Graduations */}
            <line x1="42" y1="45" x2="52" y2="45" stroke="#0E9AA7" strokeWidth="2" />
            <line x1="42" y1="53" x2="48" y2="53" stroke="#0E9AA7" strokeWidth="1.5" />
            <line x1="42" y1="61" x2="52" y2="61" stroke="#0E9AA7" strokeWidth="2" />
            <line x1="42" y1="69" x2="48" y2="69" stroke="#0E9AA7" strokeWidth="1.5" />
            <line x1="42" y1="77" x2="52" y2="77" stroke="#0E9AA7" strokeWidth="2" />
            {/* Plunger */}
            <rect x="54" y="60" width="12" height="40" fill="#BDE4ED" />
            <rect x="46" y="98" width="28" height="6" rx="2" fill="#0E9AA7" />
            {/* Cannula Hub */}
            <path d="M54 35V24H66V35" fill="#0E9AA7" />
            <line x1="60" y1="24" x2="60" y2="8" stroke="#12304A" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'Wound Care':
        return (
          <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none">
            {/* Sterile Dressing & Cross */}
            <rect x="25" y="25" width="70" height="70" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="36" y="36" width="48" height="48" rx="4" fill="#E6F4FA" stroke="#0E9AA7" strokeWidth="2" strokeDasharray="4 2" />
            <path d="M60 48V72M48 60H72" stroke="#0E9AA7" strokeWidth="4" strokeLinecap="round" />
            <circle cx="82" cy="82" r="3" fill="#10B981" />
          </svg>
        );

      case 'Diagnostics and Test Kits':
        return (
          <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none">
            {/* Rapid Test Cassette */}
            <rect x="32" y="20" width="56" height="80" rx="8" fill="#FFFFFF" stroke="#0E9AA7" strokeWidth="2.5" />
            {/* Sample Well */}
            <circle cx="60" cy="38" r="8" fill="#F0F9FA" stroke="#0E9AA7" strokeWidth="2" />
            {/* Result Window */}
            <rect x="44" y="54" width="32" height="34" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Control & Test Lines */}
            <line x1="50" y1="64" x2="70" y2="64" stroke="#F26B5B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="50" y1="74" x2="70" y2="74" stroke="#0E9AA7" strokeWidth="2.5" strokeLinecap="round" />
            <text x="76" y="66" fontSize="7" fill="#64748B" fontWeight="600">C</text>
            <text x="76" y="76" fontSize="7" fill="#64748B" fontWeight="600">T</text>
          </svg>
        );

      case 'Surgical Instruments':
        return (
          <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none">
            {/* Scalpel / Forceps */}
            <path d="M30 90L75 45L78 35L85 32L88 38L80 48L35 95L30 90Z" fill="#CBD5E1" stroke="#12304A" strokeWidth="2" />
            <path d="M78 35L88 20C92 24 88 32 85 32" fill="#E2E8F0" stroke="#0E9AA7" strokeWidth="2" />
            <line x1="45" y1="75" x2="48" y2="78" stroke="#64748B" strokeWidth="1.5" />
            <line x1="53" y1="67" x2="56" y2="70" stroke="#64748B" strokeWidth="1.5" />
            <line x1="61" y1="59" x2="64" y2="62" stroke="#64748B" strokeWidth="1.5" />
          </svg>
        );

      case 'Lab Consumables':
        return (
          <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none">
            {/* Blood Collection Vacutainer Tube */}
            <rect x="44" y="32" width="32" height="66" rx="6" fill="#F8FAFC" stroke="#0E9AA7" strokeWidth="2.5" />
            {/* Safety Cap (Lavender/Gold) */}
            <rect x="40" y="18" width="40" height="16" rx="4" fill="#8B5CF6" stroke="#12304A" strokeWidth="2" />
            {/* Liquid Level */}
            <path d="M45 65C45 65 52 68 60 65C68 62 75 65 75 65V92C75 95 72 97 68 97H52C48 97 45 95 45 92V65Z" fill="#F43F5E" opacity="0.8" />
            <line x1="50" y1="46" x2="70" y2="46" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        );

      case 'Monitoring Equipment':
        return (
          <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none">
            {/* Patient Monitor Screen & ECG Wave */}
            <rect x="22" y="25" width="76" height="60" rx="8" fill="#12304A" />
            <rect x="26" y="29" width="68" height="52" rx="5" fill="#0A1926" />
            {/* ECG Pulse Trace */}
            <path
              d="M30 55H44L48 42L52 68L56 50L60 55H70L74 46L78 55H90"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Vital Digit */}
            <text x="70" y="42" fontSize="9" fill="#0E9AA7" fontWeight="bold">SpO2 99%</text>
            <rect x="46" y="85" width="28" height="10" rx="2" fill="#64748B" />
          </svg>
        );

      case 'Hygiene and Sanitisers':
      default:
        return (
          <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none">
            {/* Sanitiser Bottle with Pump */}
            <rect x="40" y="40" width="40" height="60" rx="6" fill="#E6F4FA" stroke="#0E9AA7" strokeWidth="2.5" />
            <path d="M52 40V28H68V40" fill="#0B8591" />
            <path d="M60 28V18H78" stroke="#12304A" strokeWidth="3" strokeLinecap="round" />
            <path d="M78 18V24" stroke="#12304A" strokeWidth="2.5" strokeLinecap="round" />
            {/* Shield emblem */}
            <path d="M50 56C50 56 60 52 60 52C60 52 70 56 70 56V68C70 76 60 82 60 82C60 82 50 76 50 68V56Z" fill="#0E9AA7" opacity="0.2" stroke="#0E9AA7" strokeWidth="1.5" />
            <path d="M60 60V72M54 66H66" stroke="#0E9AA7" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center bg-gradient-to-b from-slate-50 to-[#E6F4FA]/30 rounded-xl p-4 overflow-hidden border border-slate-100 ${className}`}>
      {renderIcon()}
      <span className="absolute bottom-2 right-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
        Clinical Grade
      </span>
    </div>
  );
};
