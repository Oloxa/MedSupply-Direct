import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookmarkCheck,
  Plus,
  Trash2,
  ShoppingCart,
  Calendar,
  Building2,
  Clock,
  ArrowRight,
  Package,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export const SavedListsPage: React.FC = () => {
  const { savedLists, createSavedList, deleteSavedList, addListToCart, removeItemFromSavedList } =
    useOrders();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newDept, setNewDept] = useState('Critical Care & ICU');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    createSavedList(newListName.trim(), newDept, newDesc.trim());
    setNewListName('');
    setNewDesc('');
    setCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#12304A]">Standing Orders & Saved Lists</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pre-approved department requisition lists for fast one-click replenishment
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Standing Order List
        </button>
      </div>

      {/* Lists Grid */}
      <div className="space-y-6">
        {savedLists.map((list) => {
          const totalEstimatedListCost = list.items.reduce(
            (sum, item) => sum + item.product.basePrice * item.quantity,
            0
          );
          const totalUnits = list.items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <div
              key={list.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
            >
              {/* List Header */}
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E9AA7] bg-[#E6F4FA] px-2 py-0.5 rounded">
                      {list.recurrence || 'Monthly'} Restock
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-slate-600">{list.department}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#12304A] mt-1">{list.name}</h3>
                  {list.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{list.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right mr-2 hidden sm:block">
                    <span className="text-xs font-mono font-bold text-[#12304A] block tabular-nums">
                      Est. ${totalEstimatedListCost.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {list.items.length} lines ({totalUnits} units)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => addListToCart(list.id)}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add All to Wholesale Cart
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteSavedList(list.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items in list */}
              {list.items.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No items in this standing list yet. Add items from any product page using "Save to list".
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {list.items.map((entry) => (
                    <div
                      key={entry.productId}
                      className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0E9AA7] flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-700">{entry.product.sku}</span>
                            <span className="font-bold text-[#12304A]">{entry.product.name}</span>
                          </div>
                          <span className="text-slate-400 text-[11px]">{entry.product.packSize}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="font-mono font-bold text-[#12304A] block">
                            Qty: {entry.quantity}
                          </span>
                          <span className="font-mono text-slate-500 text-[11px]">
                            ${(entry.product.basePrice * entry.quantity).toFixed(2)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItemFromSavedList(list.id, entry.productId)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                          title="Remove from list"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create List Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-[#12304A]">New Standing Reorder Template</h3>
            <p className="text-xs text-slate-500">
              Establish a named supply requisition for automated department fulfillment.
            </p>

            <form onSubmit={handleCreateList} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">List Name *</label>
                <input
                  type="text"
                  required
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g. Neonatal Unit Weekly Consumables"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0E9AA7]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department / Clinical Ward</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0E9AA7]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Special instructions or restocking schedule notes"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0E9AA7]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl shadow-xs"
                >
                  Create Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
