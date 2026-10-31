import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  BookmarkCheck,
  FileSpreadsheet,
  Building2,
  HelpCircle,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { itemCount, lineCount } = useCart();
  const { orders } = useOrders();

  const openOrdersCount = orders.filter(
    (o) => o.status === 'Placed' || o.status === 'Confirmed' || o.status === 'Packed' || o.status === 'Shipped'
  ).length;

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/catalog', label: 'Product Catalog', icon: Package },
    {
      to: '/cart',
      label: 'Wholesale Cart',
      icon: ShoppingCart,
      badge: lineCount > 0 ? `${lineCount}` : undefined,
    },
    {
      to: '/orders',
      label: 'Orders & Tracking',
      icon: Truck,
      badge: openOrdersCount > 0 ? `${openOrdersCount}` : undefined,
    },
    { to: '/saved-lists', label: 'Standing Orders', icon: BookmarkCheck },
    { to: '/invoices', label: 'Invoices & Net-30', icon: FileSpreadsheet },
    { to: '/account', label: 'Organization & Team', icon: Building2 },
    { to: '/support', label: 'Clinical Helpdesk', icon: HelpCircle },
  ];

  // Credit calculation
  const creditLimit = user?.organization.creditLimit || 120000;
  const creditUsed = user?.organization.creditUsed || 38450;
  const creditPercent = Math.min(100, Math.round((creditUsed / creditLimit) * 100));

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#0E9AA7] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            {/* Medical Cross SVG */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <rect x="9.5" y="4" width="5" height="16" rx="1.5" />
              <rect x="4" y="9.5" width="16" height="5" rx="1.5" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-[#12304A] block leading-tight">
              MedSupply Direct
            </span>
            <span className="text-[10px] text-slate-400 font-medium block">
              B2B Healthcare Portal
            </span>
          </div>
        </NavLink>
        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
          GSA/NHS Verified
        </span>
      </div>

      {/* Organization Pill / Selector Card */}
      <div className="p-3 border-b border-slate-100">
        <NavLink
          to="/account"
          className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#E6F4FA]/50 border border-slate-200/80 transition-colors block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {user?.organization.type || 'Hospital'} Facility
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0E9AA7] transition-colors" />
          </div>
          <p className="text-xs font-bold text-[#12304A] truncate mt-0.5">
            {user?.organization.name || 'St. Jude Metropolitan Hospital'}
          </p>
          <div className="mt-2 text-[11px] text-slate-500">
            <div className="flex justify-between items-center mb-1">
              <span>Credit Facility</span>
              <span className="font-mono font-medium text-slate-700">
                ${creditUsed.toLocaleString()} / ${(creditLimit / 1000).toFixed(0)}k
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0E9AA7] rounded-full transition-all"
                style={{ width: `${creditPercent}%` }}
              />
            </div>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#E6F4FA] text-[#0E9AA7] font-bold'
                    : 'text-slate-600 hover:text-[#12304A] hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#0E9AA7] text-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Assigned Account Manager Card */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70">
        <div className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#E6F4FA] text-[#0E9AA7] flex items-center justify-center font-bold text-xs shrink-0">
              MH
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-[#12304A] truncate">
                {user?.organization.accountManager.name || 'Marcus Holloway'}
              </p>
              <span className="text-[10px] text-slate-400 block truncate">
                Senior Logistics Rep
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
            <a
              href="tel:+442079460912"
              className="text-[#0E9AA7] hover:underline flex items-center gap-1 font-medium"
            >
              <PhoneCall className="w-3 h-3" /> Call Rep
            </a>
            <span className="text-slate-300">·</span>
            <a
              href="mailto:procurement@medsupplydirect.com"
              className="text-slate-600 hover:text-[#12304A]"
            >
              Email Desk
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
