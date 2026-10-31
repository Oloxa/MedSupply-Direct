import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  X,
  CreditCard,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Invoice } from '../types';

export const InvoicesPage: React.FC = () => {
  const { invoices } = useOrders();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  // Calculations
  const totalInvoiced = invoices.reduce((s, i) => s + i.amount, 0);
  const totalPaid = invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const totalOutstanding = totalInvoiced - totalPaid;

  const handlePrint = () => {
    window.print();
  };

  const handleSettleDemo = (invId: string) => {
    showToast('Payment Settled', `BACS Wire for ${invId} reconciled successfully.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#12304A]">Billing & Net-30 Invoices</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Commercial tax invoices, remittance notices, and NHS VAT exemption records
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            showToast('Statement Download', 'Downloading Q4 consolidated statements CSV...', 'info');
          }}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#0E9AA7]" /> Download Statements (CSV)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Billed YTD</span>
          <p className="text-2xl font-bold text-[#12304A] font-mono tabular-nums mt-2">
            ${totalInvoiced.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{invoices.length} invoices issued</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">Paid & Reconciled</span>
          <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-2">
            ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Zero penalties incurred</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">Outstanding Balance</span>
          <p className="text-2xl font-bold text-[#0E9AA7] font-mono tabular-nums mt-2">
            ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Net-30 credit facility active</span>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                <th className="py-3 px-4 font-semibold">Invoice #</th>
                <th className="py-3 px-4 font-semibold">PO Number</th>
                <th className="py-3 px-4 font-semibold">Issue Date</th>
                <th className="py-3 px-4 font-semibold">Due Date</th>
                <th className="py-3 px-4 font-semibold">Payment Terms</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Amount</th>
                <th className="py-3 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => setActiveInvoice(inv)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0E9AA7]">
                    {inv.id}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">
                    {inv.poNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{inv.issueDate}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">{inv.dueDate}</td>
                  <td className="py-3.5 px-4 text-slate-500">{inv.paymentTerms}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                          : inv.status === 'Pending'
                          ? 'bg-sky-50 text-sky-800 border border-sky-200/60'
                          : 'bg-rose-50 text-rose-800 border border-rose-200/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {inv.status === 'Pending' ? 'Due in 28 Days' : inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#12304A] tabular-nums">
                    ${inv.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setActiveInvoice(inv)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#0E9AA7] bg-[#E6F4FA] hover:bg-[#0E9AA7] hover:text-white rounded-lg transition-colors"
                    >
                      View Tax Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Document Modal / Print View */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0E9AA7] text-white flex items-center justify-center font-bold">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <rect x="9.5" y="4" width="5" height="16" rx="1.5" />
                    <rect x="4" y="9.5" width="16" height="5" rx="1.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#12304A]">MedSupply Direct Ltd.</h3>
                  <p className="text-[11px] text-slate-500">
                    National Distribution Hub · VAT: GB 942 0184 22 · ISO 9001:2015
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#0E9AA7] block">
                  {activeInvoice.id}
                </span>
                <span className="text-[11px] text-slate-400 block">TAX INVOICE</span>
              </div>
            </div>

            {/* Bill To & Details Grid */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Billed To</span>
                <p className="font-bold text-[#12304A]">{user?.organization.name}</p>
                <p className="text-slate-600">Procurement & Accounts Payable</p>
                <p className="text-slate-500">{user?.organization.taxId}</p>
                <p className="text-slate-500">Reg: {user?.organization.registrationNumber}</p>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Invoice Terms
                </span>
                <p className="text-slate-700">
                  PO Number: <span className="font-mono font-bold">{activeInvoice.poNumber}</span>
                </p>
                <p className="text-slate-700">
                  Issue Date: <span className="font-mono">{activeInvoice.issueDate}</span>
                </p>
                <p className="text-slate-700">
                  Due Date: <span className="font-mono">{activeInvoice.dueDate}</span>
                </p>
                <p className="font-semibold text-emerald-700">{activeInvoice.paymentTerms}</p>
              </div>
            </div>

            {/* Summary Line */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#12304A] block">
                  Medical Consumables Requisition ({activeInvoice.itemsCount} lines)
                </span>
                <span className="text-slate-500">Linked Order: #{activeInvoice.orderId}</span>
              </div>
              <span className="text-base font-bold text-[#12304A] font-mono tabular-nums">
                ${activeInvoice.amount.toFixed(2)}
              </span>
            </div>

            {/* Payment Remittance instructions */}
            <div className="p-4 rounded-xl border border-slate-100 bg-white text-xs space-y-1">
              <span className="font-bold text-slate-700 block">BACS Remittance Advice</span>
              <p className="text-slate-500">Bank: Barclays Corporate Health UK</p>
              <p className="text-slate-500 font-mono">Account: 88401928 · Sort Code: 20-04-12</p>
              <p className="text-slate-500">Quote invoice reference {activeInvoice.id} on wire memo.</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveInvoice(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close Slip
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Tax Receipt
                </button>
                <button
                  type="button"
                  onClick={() => handleSettleDemo(activeInvoice.id)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl transition-colors"
                >
                  Mark Reconciled (BACS)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
