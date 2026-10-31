import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Truck, BookmarkCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';

export const MobileNav: React.FC = () => {
  const { lineCount } = useCart();
  const { orders } = useOrders();
  const openCount = orders.filter((o) => o.status !== 'Delivered').length;

  const links = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/catalog', label: 'Catalog', icon: Package },
    { to: '/cart', label: 'Cart', icon: ShoppingCart, badge: lineCount > 0 ? lineCount : undefined },
    { to: '/orders', label: 'Orders', icon: Truck, badge: openCount > 0 ? openCount : undefined },
    { to: '/saved-lists', label: 'Lists', icon: BookmarkCheck },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40 px-2 py-1 flex items-center justify-around safe-area-bottom">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-semibold relative transition-colors ${
                isActive ? 'text-[#0E9AA7]' : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {link.badge !== undefined && (
                <span className="absolute -top-1 -right-2 px-1 text-[9px] font-mono font-bold bg-[#0E9AA7] text-white rounded-full">
                  {link.badge}
                </span>
              )}
            </div>
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};
