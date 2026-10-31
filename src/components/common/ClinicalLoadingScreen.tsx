import React from 'react';

interface ClinicalLoadingScreenProps {
  message?: string;
}

export const ClinicalLoadingScreen: React.FC<ClinicalLoadingScreenProps> = ({
  message = 'Loading Medical Procurement Portal...',
}) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
      {/* Animated Medical Cross & Pulse */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0E9AA7] text-white flex items-center justify-center shadow-lg shadow-[#0E9AA7]/20 animate-pulse">
          <svg viewBox="0 0 24 24" className="w-9 h-9 fill-current">
            <rect x="9.5" y="4" width="5" height="16" rx="1.5" />
            <rect x="4" y="9.5" width="16" height="5" rx="1.5" />
          </svg>
        </div>

        {/* Outer glowing ripple */}
        <div className="absolute inset-0 rounded-2xl border-2 border-[#0E9AA7]/40 animate-ping opacity-60" />
      </div>

      {/* Animated Heartbeat / ECG line */}
      <div className="w-48 h-8 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 160 40" className="w-full h-full" fill="none">
          <path
            d="M0 20 H45 L52 10 L60 30 L68 5 L76 35 L84 20 L92 25 L98 20 H160"
            stroke="#0E9AA7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-ecg"
          />
        </svg>
      </div>

      <div className="text-center space-y-1">
        <p className="text-xs font-bold text-[#12304A] tracking-wide uppercase font-mono">
          {message}
        </p>
        <span className="text-[11px] text-slate-400">
          Syncing hospital catalog & Net-30 statements...
        </span>
      </div>
    </div>
  );
};
