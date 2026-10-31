import React from 'react';
import { Link } from 'react-router-dom';
import { PackageX, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
        <PackageX className="w-8 h-8 text-[#0E9AA7]" />
      </div>
      <h1 className="text-2xl font-bold text-[#12304A]">Page or Medical Resource Not Found</h1>
      <p className="text-xs text-slate-500 max-w-sm">
        The requested procurement portal URL does not correspond to an active system page or document endpoint.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl transition-colors shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </Link>
    </div>
  );
};
