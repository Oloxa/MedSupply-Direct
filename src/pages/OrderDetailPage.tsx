import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  RotateCcw,
  Building2,
  Calendar,
  AlertCircle,
  Play,
  FileText,
  MapPin,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { OrderStatus } from '../types';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, advanceOrderStatus, reorderAll } = useOrders();
  const { showToast } = useToast();

  const order = getOrderById(id || '');

  if (!order) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-lg font-bold text-[#12304A]">Order Not Found</h2>
        <p className="text-xs text-slate-500">The order reference #{id} could not be located in records.</p>
        <Link
          to="/orders"
          className="inline-block px-4 py-2 text-xs font-bold text-white bg-[#0E9AA7] rounded-xl"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const stages: OrderStatus[] = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
  const currentStageIndex = stages.indexOf(order.status);

  const handleAdvance = () => {
    advanceOrderStatus(order.id);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0E9AA7] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>

        <div className="flex items-center gap-2">
          {/* Demo simulation button */}
          {order.status !== 'Delivered' && (
            <button
              type="button"
              onClick={handleAdvance}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Simulate Next Stage
            </button>
          )}

          <button
            type="button"
            onClick={() => reorderAll(order.id)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#0E9AA7]" /> Reorder All Items
          </button>

          <button
            type="button"
            onClick={handlePrintInvoice}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print Invoice
          </button>
        </div>
      </div>

      {/* Main Order Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#0E9AA7]">{order.id}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-mono font-bold text-slate-700">PO: {order.poNumber}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">
                Placed {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#12304A] mt-1">
              Dispatch & Delivery Tracking
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                order.status === 'Delivered'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : order.status === 'Shipped'
                  ? 'bg-sky-50 text-sky-800 border border-sky-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* Visual Tracking Stepper */}
        <div className="py-4">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0 hidden sm:block">
              <div
                className="h-full bg-[#0E9AA7] transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStageIndex) / (stages.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
              {stages.map((stage, idx) => {
                const isCompleted = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stage} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-[#0E9AA7] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      } ${isCurrent ? 'ring-4 ring-[#E6F4FA]' : ''}`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <span
                        className={`text-xs font-bold block ${
                          isCompleted ? 'text-[#12304A]' : 'text-slate-400'
                        }`}
                      >
                        {stage}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {order.timeline.find((t) => t.status === stage)?.timestamp || 'Scheduled'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Shipment Metadata 3-col info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Carrier & Waybill
            </span>
            <p className="font-bold text-[#12304A]">{order.carrier}</p>
            <p className="font-mono text-slate-600">Track #{order.trackingNumber}</p>
            <p className="text-[11px] text-slate-500">{order.deliveryWindow}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Receiving Dock Address
            </span>
            <p className="font-bold text-[#12304A]">{order.shippingAddress.facilityName}</p>
            <p className="text-slate-600">{order.shippingAddress.attention}</p>
            <p className="text-slate-500">{order.shippingAddress.addressLine1}</p>
            <p className="text-[11px] text-slate-400">
              Notes: {order.deliveryInstructions || 'Standard dock protocol'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Payment & Settlement
            </span>
            <p className="font-bold text-[#12304A]">{order.paymentMethod.type}</p>
            <p className="text-slate-600">{order.paymentMethod.details}</p>
            <p className="text-emerald-700 font-medium">Invoice Status: {order.invoiceStatus}</p>
            <p className="font-mono font-bold text-[#12304A] pt-1">
              Total: ${order.total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Itemized Order Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#12304A]">
            Itemized Manifest & Batch Verification ({order.items.length} lines)
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Total Units: {order.items.reduce((s, i) => s + i.quantity, 0)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                <th className="py-2.5 px-4 font-semibold">SKU</th>
                <th className="py-2.5 px-4 font-semibold">Product Description</th>
                <th className="py-2.5 px-4 font-semibold">Pack Format</th>
                <th className="py-2.5 px-4 text-center font-semibold">Quantity</th>
                <th className="py-2.5 px-4 text-right font-semibold">Wholesale Unit Price</th>
                <th className="py-2.5 px-4 text-right font-semibold">Line Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#12304A]">{item.sku}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    <Link to={`/catalog/${item.productId}`} className="hover:text-[#0E9AA7]">
                      {item.productName}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{item.packSize}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-[#12304A]">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#12304A] tabular-nums">
                    ${item.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing calculations footer */}
        <div className="p-6 bg-slate-50/70 border-t border-slate-200 flex flex-col items-end gap-1.5 text-xs">
          <div className="w-64 space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>List Subtotal:</span>
              <span className="font-mono tabular-nums">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Volume Tier Savings:</span>
                <span className="font-mono tabular-nums">-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Freight Shipping:</span>
              <span className="font-mono tabular-nums">
                {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>VAT / Tax (NHS Exempt):</span>
              <span className="font-mono tabular-nums">$0.00</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-[#12304A]">
              <span>Settlement Total:</span>
              <span className="font-mono tabular-nums text-base">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Chronological Event Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#12304A]">Carrier Telemetry & Chain of Custody Log</h3>
        <div className="space-y-3">
          {order.timeline.map((evt, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  evt.completed
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {evt.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#12304A]">{evt.status}</span>
                  <span className="font-mono text-slate-400 text-[11px]">{evt.timestamp}</span>
                </div>
                <p className="text-slate-600 mt-0.5">{evt.description}</p>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" /> {evt.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
