import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Package,
  Truck,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { MONTHLY_SPEND_DATA, MOCK_ANNOUNCEMENTS } from '../data/mockInitialData';
import { StockBadge } from '../components/common/StockBadge';
import { ProductImageIllustration } from '../components/common/ProductImageIllustration';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Frequent reorder items
  const frequentItems = MOCK_PRODUCTS.filter((p) => p.frequentlyReordered).slice(0, 4);

  // Stats calculation
  const openOrders = orders.filter((o) => o.status !== 'Delivered');
  const lowStockItems = MOCK_PRODUCTS.filter((p) => p.stockStatus === 'Low stock' || p.stockStatus === 'Backorder');
  const currentMonthSpend = 31450;
  const pendingInvoicesTotal = orders
    .filter((o) => o.invoiceStatus === 'Pending')
    .reduce((sum, o) => sum + o.total, 0);

  const handleQuickAdd = (product: typeof MOCK_PRODUCTS[0], e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 10);
    showToast('Item Added', `Added 10 boxes of ${product.name} to wholesale cart.`, 'success');
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#0E9AA7] uppercase tracking-wider">
              Procurement Operations Console
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">{user?.organization.name}</span>
          </div>
          <h2 className="text-xl font-bold text-[#12304A] mt-1">
            Good day, {user?.name || 'Procurement Officer'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Account #{user?.organization.registrationNumber} · Net-30 Facility Approved · Cold-chain dispatch active
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/saved-lists')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Standing Orders
          </button>
          <button
            type="button"
            onClick={() => navigate('/catalog')}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Bulk Requisition
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Open Orders */}
        <div
          onClick={() => navigate('/orders')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#0E9AA7] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active In-Flight Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#E6F4FA] text-[#0E9AA7] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#12304A] font-mono tabular-nums">
              {openOrders.length}
            </span>
            <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-0.5">
              Tracking on schedule
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Latest: {orders[0]?.id || 'None'} ({orders[0]?.status || 'Idle'})
          </p>
        </div>

        {/* Monthly Spend */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Month-to-Date Spend</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#12304A] font-mono tabular-nums">
              ${currentMonthSpend.toLocaleString()}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              Budget ${(user?.organization.creditLimit || 120000).toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Volume tier savings: $3,420 this month
          </p>
        </div>

        {/* Low Stock Items */}
        <div
          onClick={() => navigate('/catalog?filter=low-stock')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#F26B5B] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Distributor Stock Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#F26B5B] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#F26B5B] font-mono tabular-nums">
              {lowStockItems.length} items
            </span>
            <span className="text-[11px] font-semibold text-[#F26B5B]">
              Action required
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Reorder critical items before lead times slip
          </p>
        </div>

        {/* Pending Invoices */}
        <div
          onClick={() => navigate('/invoices')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Net-30 Invoices</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#12304A] font-mono tabular-nums">
              ${pendingInvoicesTotal.toFixed(0)}
            </span>
            <span className="text-[11px] font-medium text-slate-600">
              Net 30 terms
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Next settlement due in 27 days
          </p>
        </div>
      </div>

      {/* Main Split: Spend Chart + Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column (2 spans) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#12304A]">Procurement Spend Over Time</h3>
              <p className="text-xs text-slate-500">
                Consolidated monthly spend trajectory across consumables, diagnostics, and equipment
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0E9AA7]" /> Consumables
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#BDE4ED]" /> Diagnostics
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_SPEND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsumables" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0E9AA7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0E9AA7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorDiag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#BDE4ED" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#BDE4ED" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  stroke="#E2E8F0"
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="consumables"
                  stroke="#0E9AA7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorConsumables)"
                  name="Medical Consumables"
                />
                <Area
                  type="monotone"
                  dataKey="diagnostic"
                  stroke="#0B8591"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorDiag)"
                  name="Diagnostics"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regulatory & Supply Bulletins Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#12304A]">Distributor Bulletins</h3>
              <span className="text-[11px] font-medium text-[#0E9AA7]">Live Feeds</span>
            </div>
            <div className="space-y-3">
              {MOCK_ANNOUNCEMENTS.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-[#0E9AA7] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#12304A] leading-snug">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Need specific batch certificates?</span>
            <button
              onClick={() => navigate('/support')}
              className="text-[#0E9AA7] font-semibold hover:underline flex items-center gap-1"
            >
              Contact Regulatory Desk <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Reorder Strip: Frequently Purchased */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#12304A]">Quick Reorder: Frequently Bought Medical Supplies</h3>
            <p className="text-xs text-slate-500">
              One-click restocking for ward routine consumables with pre-negotiated tier volume pricing
            </p>
          </div>
          <button
            onClick={() => navigate('/catalog')}
            className="text-xs font-semibold text-[#0E9AA7] hover:underline flex items-center gap-1"
          >
            Full 60-Product Catalog <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {frequentItems.map((prod) => (
            <div
              key={prod.id}
              onClick={() => navigate(`/catalog/${prod.id}`)}
              className="p-4 rounded-xl border border-slate-200 hover:border-[#0E9AA7] hover:shadow-xs bg-white cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <ProductImageIllustration category={prod.category} className="w-full h-32 mb-3" />
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono text-slate-500">{prod.sku}</span>
                  <StockBadge status={prod.stockStatus} />
                </div>
                <h4 className="text-xs font-bold text-[#12304A] line-clamp-2 group-hover:text-[#0E9AA7] transition-colors">
                  {prod.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">{prod.packSize}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#12304A] font-mono tabular-nums">
                    ${prod.basePrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400">/{prod.unitOfMeasure}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(prod, e)}
                  className="px-2.5 py-1 text-xs font-semibold text-[#0E9AA7] bg-[#E6F4FA] hover:bg-[#0E9AA7] hover:text-white rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 10 pk
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#12304A]">Recent Orders & Live Dispatch Status</h3>
            <p className="text-xs text-slate-500">
              Track warehouse picking, staging, and courier temperature cold-chain delivery
            </p>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="text-xs font-semibold text-[#0E9AA7] hover:underline"
          >
            View All Order History
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                <th className="py-2.5 px-3 font-semibold">Order ID</th>
                <th className="py-2.5 px-3 font-semibold">PO Number</th>
                <th className="py-2.5 px-3 font-semibold">Date Placed</th>
                <th className="py-2.5 px-3 font-semibold">Lines</th>
                <th className="py-2.5 px-3 font-semibold">Total</th>
                <th className="py-2.5 px-3 font-semibold">Tracking Status</th>
                <th className="py-2.5 px-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 4).map((ord) => (
                <tr
                  key={ord.id}
                  onClick={() => navigate(`/orders/${ord.id}`)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-mono font-bold text-[#12304A]">{ord.id}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{ord.poNumber}</td>
                  <td className="py-3 px-3 text-slate-500">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono">{ord.items.length} items</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#12304A] tabular-nums">
                    ${ord.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ord.status === 'Shipped'
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[#0E9AA7] font-semibold hover:underline flex items-center justify-end gap-1">
                      Track <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
