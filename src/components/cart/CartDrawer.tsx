import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, UploadCloud, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { QuickSkuAddModal } from './QuickSkuAddModal';
import { CsvUploadModal } from './CsvUploadModal';
import { ProductImageIllustration } from '../common/ProductImageIllustration';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountSavings,
    shipping,
    total,
    itemCount,
  } = useCart();

  const navigate = useNavigate();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [csvUploadOpen, setCsvUploadOpen] = useState(false);

  if (!isCartDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Drawer */}
      <aside
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200"
        aria-label="Procurement Order Cart"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E6F4FA] text-[#0E9AA7] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#12304A]">Wholesale Cart</h2>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                {itemCount} units · {items.length} product lines
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Batch Actions Strip */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">Bulk Tools:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuickAddOpen(true)}
              className="text-[#0E9AA7] hover:underline font-medium flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" /> Paste SKUs
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setCsvUploadOpen(true)}
              className="text-[#0E9AA7] hover:underline font-medium flex items-center gap-1"
            >
              <UploadCloud className="w-3.5 h-3.5" /> CSV Upload
            </button>
          </div>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#12304A]">Your bulk cart is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Browse the medical catalog or use the quick SKU paste tool to populate your hospital order.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/catalog');
                }}
                className="px-4 py-2 text-xs font-semibold text-[#0E9AA7] bg-[#E6F4FA] hover:bg-[#BDE4ED]/50 rounded-lg transition-colors"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white space-y-3 transition-colors"
              >
                <div className="flex gap-3">
                  <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-slate-100">
                    <ProductImageIllustration
                      category={item.product.category}
                      className="w-full h-full p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#12304A] leading-snug line-clamp-2">
                      {item.product.name}
                    </h4>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span className="font-mono text-slate-600">{item.product.sku}</span>
                      <span>·</span>
                      <span>{item.product.packSize}</span>
                    </div>

                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs font-bold text-[#12304A] font-mono tabular-nums">
                        ${item.effectiveUnitPrice.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-slate-500">/{item.product.unitOfMeasure}</span>
                      {item.effectiveUnitPrice < item.product.basePrice && (
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                          Tier applied (${item.product.basePrice.toFixed(2)} list)
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1 self-start"
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Stepper & Line Total */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) updateQuantity(item.product.id, val);
                      }}
                      className="w-12 text-center text-xs font-mono font-semibold bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#12304A] font-mono tabular-nums">
                      ${item.lineTotal.toFixed(2)}
                    </span>
                    {item.tierDiscount > 0 && (
                      <span className="block text-[10px] text-emerald-700 font-medium">
                        Saved ${item.tierDiscount.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Calculations */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-slate-50/70 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (List Price)</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {discountSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Volume Tier Savings</span>
                  <span className="font-mono tabular-nums">-${discountSavings.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Freight Shipping</span>
                <span className="font-mono tabular-nums">
                  {shipping === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE (Order &gt; $500)</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT / Tax</span>
                <span className="font-mono tabular-nums">Exempt (Healthcare ID on file)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-[#12304A]">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/cart');
                }}
                className="py-2.5 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors text-center"
              >
                Full Cart Review
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/checkout');
                }}
                className="py-2.5 px-3 text-xs font-semibold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                Checkout <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Quick Add Modal */}
      <QuickSkuAddModal isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
      {/* CSV Upload Modal */}
      <CsvUploadModal isOpen={csvUploadOpen} onClose={() => setCsvUploadOpen(false)} />
    </>
  );
};
