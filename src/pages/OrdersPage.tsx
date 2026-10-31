import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Truck, ArrowRight, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { OrderStatus } from '../types';

export const OrdersPage: React.FC = () => {
  const { orders, reorderAll } = useOrders();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'All' && o.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = o.id.toLowerCase().includes(q);
        const matchesPo = o.poNumber.toLowerCase().includes(q);
        const matchesTrack = o.trackingNumber.toLowerCase().includes(q);
        const matchesItem = o.items.some((i) => i.productName.toLowerCase().includes(q));
        if (!matchesId && !matchesPo && !matchesTrack && !matchesItem) {
          return false;
        }
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#12304A]">Wholesale Orders & Dispatch Tracking</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time cold-chain tracking, PO fulfillment, and delivery confirmation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#0E9AA7] bg-[#E6F4FA] px-3 py-1.5 rounded-xl">
            {orders.length} Total Orders Recorded
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status segmented controls */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium">
          {['All', 'Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === status
                  ? 'bg-white text-[#12304A] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, PO#, or item..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0E9AA7] bg-slate-50/50"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Truck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#12304A]">No orders match your filter</h3>
            <p className="text-xs text-slate-500">Try changing the status filter or clearing your search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">PO Number</th>
                  <th className="py-3 px-4 font-semibold">Date Placed</th>
                  <th className="py-3 px-4 font-semibold">Delivery Target</th>
                  <th className="py-3 px-4 font-semibold">Carrier / Track</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Total Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#0E9AA7]">
                      {order.id}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 font-semibold">
                      {order.poNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">
                      {order.deliveryEstimatedDate}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] text-slate-600 block">
                        {order.carrier.split(' ')[0]}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {order.trackingNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {order.items.length} lines ({order.items.reduce((s, i) => s + i.quantity, 0)} units)
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#12304A] tabular-nums">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                            : order.status === 'Shipped'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200/60'
                            : order.status === 'Packed'
                            ? 'bg-indigo-50 text-indigo-800 border border-indigo-200/60'
                            : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => reorderAll(order.id)}
                          className="p-1.5 text-slate-400 hover:text-[#0E9AA7] transition-colors"
                          title="Reorder all items from this PO"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#0E9AA7] bg-[#E6F4FA] hover:bg-[#0E9AA7] hover:text-white rounded-lg transition-colors flex items-center gap-1"
                        >
                          Details <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
