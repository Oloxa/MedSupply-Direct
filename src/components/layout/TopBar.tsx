import React, { useState } from 'react';
import { Search, ShoppingBag, Bell, Building2, User, ChevronDown, Check } from 'lucide-react';
import { useAuth, DEMO_ORGANIZATIONS } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface TopBarProps {
  onOpenCommandPalette: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenCommandPalette }) => {
  const { user, updateOrganizationType } = useAuth();
  const { itemCount, lineCount, setIsCartDrawerOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  // Compute clean breadcrumb
  const path = location.pathname;
  let pageName = 'Dashboard Overview';
  if (path.startsWith('/catalog/')) pageName = 'Product Details';
  else if (path.startsWith('/catalog')) pageName = 'Medical Supplies Catalog';
  else if (path.startsWith('/cart')) pageName = 'Wholesale Bulk Cart';
  else if (path.startsWith('/checkout')) pageName = 'Order Checkout';
  else if (path.startsWith('/orders/')) pageName = 'Order Tracking Details';
  else if (path.startsWith('/orders')) pageName = 'Orders & Dispatch Tracking';
  else if (path.startsWith('/saved-lists')) pageName = 'Standing Orders & Saved Lists';
  else if (path.startsWith('/invoices')) pageName = 'Invoices & Billing Statements';
  else if (path.startsWith('/account')) pageName = 'Organization & Team Profile';
  else if (path.startsWith('/support')) pageName = 'Clinical Helpdesk & Regulatory Support';

  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-6 sticky top-0 z-30">
      {/* Zone 1: Breadcrumb and title */}
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-base font-bold text-[#12304A] truncate">
          {pageName}
        </h1>
        <span className="hidden lg:inline text-xs font-mono text-slate-400">
          · Port 3000 Verified
        </span>
      </div>

      {/* Zone 2: Global Search with Cmd+K hint */}
      <div className="flex-1 max-w-md hidden sm:block">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-slate-400 hover:text-slate-600 transition-colors text-xs text-left"
          aria-label="Search catalog and orders"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search 60+ medical products, SKUs, or orders...</span>
          </div>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Organization Type Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-[#0E9AA7]" />
            <span className="max-w-[120px] truncate">{user?.organization.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {orgDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                Switch Organization Mode
              </span>
              {(['Hospital', 'Pharmacy', 'Clinic'] as const).map((type) => {
                const org = DEMO_ORGANIZATIONS[type];
                const isSelected = user?.organization.type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      updateOrganizationType(type);
                      setOrgDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-[#E6F4FA] text-[#0E9AA7] font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{org.name}</p>
                      <span className="text-[10px] text-slate-400">{type} Account · Net-30</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0E9AA7]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Wholesale Cart Drawer Trigger */}
        <button
          type="button"
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative p-2 rounded-xl text-slate-600 hover:text-[#0E9AA7] hover:bg-[#E6F4FA] transition-colors border border-slate-200 hover:border-[#0E9AA7]/30 flex items-center gap-1.5"
          aria-label="Open wholesale cart"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-bold text-[#12304A]">
            Cart
          </span>
          {lineCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#0E9AA7] text-white">
              {lineCount}
            </span>
          )}
        </button>

        {/* Profile Avatar */}
        <button
          type="button"
          onClick={() => navigate('/account')}
          className="flex items-center gap-2 pl-2 border-l border-slate-200 text-left hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-[#12304A] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            {user?.name ? user.name.split(' ').map((n) => n[0]).join('') : 'EV'}
          </div>
          <div className="hidden xl:block">
            <p className="text-xs font-bold text-[#12304A] leading-tight">{user?.name}</p>
            <span className="text-[10px] text-slate-400">{user?.role}</span>
          </div>
        </button>
      </div>
    </header>
  );
};
