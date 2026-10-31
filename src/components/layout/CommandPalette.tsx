import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Clock, ArrowRight, X, ListOrdered, FileText } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { useOrders } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { addToCart, setIsCartDrawerOpen } = useCart();

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled outside or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return MOCK_PRODUCTS.slice(0, 6);
    const q = query.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const filteredOrders = useMemo(() => {
    if (!query.trim()) return orders.slice(0, 2);
    const q = query.toLowerCase();
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.poNumber.toLowerCase().includes(q) ||
        o.trackingNumber.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [query, orders]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a product name, SKU, PO number, or category..."
            className="flex-1 bg-transparent text-sm text-[#12304A] placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {/* Products */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Medical Supplies & Products ({filteredProducts.length})
            </span>
            <div className="space-y-1">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    navigate(`/catalog/${p.id}`);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-[#E6F4FA]/50 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0E9AA7] flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#12304A] truncate">{p.name}</p>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span className="font-mono text-slate-600">{p.sku}</span>
                        <span>·</span>
                        <span>{p.category}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-700 font-semibold">${p.basePrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p, 1);
                        setIsCartDrawerOpen(true);
                        onClose();
                      }}
                      className="opacity-0 group-hover:opacity-100 px-2.5 py-1 text-[11px] font-semibold text-[#0E9AA7] bg-white border border-[#0E9AA7]/40 rounded hover:bg-[#E6F4FA] transition-all"
                    >
                      + Quick Add
                    </button>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0E9AA7] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders */}
          {filteredOrders.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
                Orders & Shipments
              </span>
              <div className="space-y-1">
                {filteredOrders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      navigate(`/orders/${o.id}`);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#12304A] font-mono">{o.id}</span>
                          <span className="text-[11px] font-mono text-slate-500">({o.poNumber})</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Status: <span className="font-semibold text-slate-700">{o.status}</span> · Total ${o.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick shortcuts */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                navigate('/saved-lists');
                onClose();
              }}
              className="p-2 text-left rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-600"
            >
              <ListOrdered className="w-4 h-4 text-slate-400" />
              <span>Standing Orders / Saved Lists</span>
            </button>
            <button
              onClick={() => {
                navigate('/invoices');
                onClose();
              }}
              className="p-2 text-left rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-600"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Invoices & Statements</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigation: Use mouse or Escape to close</span>
          <span className="font-mono">Cmd + K / Ctrl + K</span>
        </div>
      </div>
    </div>
  );
};
