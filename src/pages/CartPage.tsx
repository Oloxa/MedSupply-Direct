import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  FileText,
  UploadCloud,
  ArrowRight,
  ShieldCheck,
  Building2,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductImageIllustration } from '../components/common/ProductImageIllustration';
import { QuickSkuAddModal } from '../components/cart/QuickSkuAddModal';
import { CsvUploadModal } from '../components/cart/CsvUploadModal';

export const CartPage: React.FC = () => {
  const {
    items,
    itemCount,
    lineCount,
    subtotal,
    discountSavings,
    tax,
    shipping,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [csvUploadOpen, setCsvUploadOpen] = useState(false);
  const [dockNotes, setDockNotes] = useState('');

  if (items.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-4 max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#12304A]">Your Wholesale Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Search products in our 60-item medical catalog, use standing orders, or paste SKU lists from your procurement ERP.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setQuickAddOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Paste SKUs & Quantities
          </button>
          <Link
            to="/catalog"
            className="px-5 py-2 text-xs font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl shadow-xs transition-colors"
          >
            Browse Catalog
          </Link>
        </div>

        {/* Modal */}
        <QuickSkuAddModal isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-[#12304A]">Wholesale Bulk Order Review</h2>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {lineCount} product lines · {itemCount} total units · Account: {user?.organization.name}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setQuickAddOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#0E9AA7]" /> Paste SKUs
          </button>
          <button
            type="button"
            onClick={() => setCsvUploadOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#0E9AA7]" /> CSV Upload
          </button>
          <button
            type="button"
            onClick={clearCart}
            className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Line Items List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Item & Clinical Specification</span>
            <div className="flex items-center gap-16 mr-12">
              <span>Unit Price</span>
              <span>Quantity</span>
              <span>Line Total</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.product.id} className="p-6 flex items-start gap-4 hover:bg-slate-50/40 transition-colors">
                <div className="w-16 h-16 rounded-xl border border-slate-100 shrink-0 overflow-hidden">
                  <ProductImageIllustration
                    category={item.product.category}
                    className="w-full h-full p-1"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {item.product.sku}
                      </span>
                      <h3 className="text-sm font-bold text-[#12304A] leading-snug">
                        <Link to={`/catalog/${item.product.id}`} className="hover:text-[#0E9AA7]">
                          {item.product.name}
                        </Link>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{item.product.packSize}</p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity and Price row */}
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-[#12304A] font-mono tabular-nums">
                        ${item.effectiveUnitPrice.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-slate-400">/{item.product.unitOfMeasure}</span>
                      {item.effectiveUnitPrice < item.product.basePrice && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                          Tier Discount Applied
                        </span>
                      )}
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 text-slate-500 hover:text-slate-900"
                        aria-label="Minus"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (!isNaN(v)) updateQuantity(item.product.id, v);
                        }}
                        className="w-14 text-center text-xs font-mono font-bold bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 text-slate-500 hover:text-slate-900"
                        aria-label="Plus"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#12304A] font-mono tabular-nums">
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
              </div>
            ))}
          </div>

          {/* Delivery Note Input */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-2">
            <label className="text-xs font-bold text-[#12304A] block">
              Special Delivery Dock & Receiving Instructions
            </label>
            <input
              type="text"
              value={dockNotes}
              onChange={(e) => setDockNotes(e.target.value)}
              placeholder="e.g. Deliver to Dock 4B (Heavy Pallets), attention Nurse Lead Rachel Evans"
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0E9AA7]"
            />
          </div>
        </div>

        {/* Right: Order Summary (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 sticky top-20">
          <h3 className="text-sm font-bold text-[#12304A] pb-3 border-b border-slate-100">
            Wholesale Pricing Summary
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Catalog List Subtotal</span>
              <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
            </div>

            {discountSavings > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
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
              <span>VAT / Tax (NHS / Health Exempt)</span>
              <span className="font-mono tabular-nums">$0.00</span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-bold text-[#12304A]">
              <span>Total Payable</span>
              <span className="font-mono tabular-nums text-lg">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#12304A]">
              <Building2 className="w-3.5 h-3.5 text-[#0E9AA7]" />
              <span>{user?.organization.name}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Billed to Net-30 Account. Credit available: ${(
                ((user?.organization.creditLimit || 120000) -
                  (user?.organization.creditUsed || 38450)) /
                1000
              ).toFixed(0)}k.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <Link
              to="/catalog"
              className="text-xs font-semibold text-[#0E9AA7] hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Continue Browsing Catalog
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuickSkuAddModal isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
      <CsvUploadModal isOpen={csvUploadOpen} onClose={() => setCsvUploadOpen(false)} />
    </div>
  );
};
