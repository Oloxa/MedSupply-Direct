import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  FileCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Logistics & Cutoffs',
    q: 'What is the daily order cutoff time for guaranteed next-day hospital dispatch?',
    a: 'Orders submitted before 16:30 GMT Monday through Friday are picked, verified by barcode scan, and dispatched on overnight temperature-validated freight for delivery before 12:00 PM the following business day.',
  },
  {
    category: 'Cold Chain',
    q: 'How does MedSupply Direct maintain the 2°C - 8°C cold chain for diagnostic assays and troponin tests?',
    a: 'Cold-chain items are packaged in validated EPS thermal shippers with calibrated phase-change refrigerant packs. Shipments are transported exclusively via dual-compressor refrigerated vehicles with continuous GPS and NIST-traceable temperature data-loggers.',
  },
  {
    category: 'Certifications',
    q: 'How do we obtain batch-specific Certificates of Analysis (CoA) and CE declarations?',
    a: 'Every product detail page offers direct downloads for Technical Data Sheets (TDS) and Safety Data Sheets (SDS). For batch-specific lot release certificates, quote the 8-digit lot number stamped on your packing slip in the form below.',
  },
  {
    category: 'Credit & Net-30',
    q: 'How do NHS Trusts and private clinics apply for higher Net-30 credit limits?',
    a: 'Registered healthcare institutions with verified CQC/GPhC/NHS accreditation can request credit limit increases directly through their designated Account Manager or via the Billing tab.',
  },
  {
    category: 'Returns & Recalls',
    q: 'What is the return protocol for damaged or temperature-compromised consumables?',
    a: 'Due to sterility assurance regulations, opened medical consumables cannot be re-entered into inventory. In the event of transit damage or cold-chain excursion alarms upon dock arrival, refuse the parcel at receiving and report via this portal within 24 hours for immediate same-day re-shipment.',
  },
];

export const SupportPage: React.FC = () => {
  const { showToast } = useToast();

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDept, setTicketDept] = useState('Procurement & Order Status');
  const [ticketPo, setTicketPo] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMsg.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ticketId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
      setIsSubmitting(false);
      setSubmittedTicketId(ticketId);
      showToast('Support Ticket Filed', `Ticket #${ticketId} dispatched to clinical response team.`, 'success');
      setTicketSubject('');
      setTicketPo('');
      setTicketMsg('');
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#12304A]">Clinical Helpdesk & Regulatory Support</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct assistance for hospital procurement officers, clinical engineers, and pharmacy directors
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="p-2 px-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#0E9AA7]" />
            <span className="font-semibold text-slate-700">Priority Desk: +44 20 7946 0912</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: FAQs Accordions (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <HelpCircle className="w-4 h-4 text-[#0E9AA7]" />
            <h3 className="text-sm font-bold text-[#12304A]">
              Frequently Asked Procurement & Logistics Questions
            </h3>
          </div>

          <div className="space-y-2.5">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-bold text-[#12304A] leading-snug">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 pt-2 text-xs text-slate-600 bg-white leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-[#E6F4FA]/50 border border-[#0E9AA7]/20 flex items-start gap-3 text-xs text-slate-700">
            <Clock className="w-4 h-4 text-[#0E9AA7] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#12304A] block">24/7 Clinical Emergency Hotline</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                For urgent intra-theatre shortages, emergency blood administration kits, or critical airway equipment dispatch outside regular dock receiving hours, contact emergency dispatch on speed-dial 904.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Validated Contact Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#12304A]">Contact Dedicated Support</h3>
            <p className="text-xs text-slate-500">
              Submit an order inquiry, technical specification query, or Lot Certificate request
            </p>
          </div>

          {submittedTicketId ? (
            <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <span className="font-bold text-emerald-900 text-sm block">
                Inquiry Logged: #{submittedTicketId}
              </span>
              <p className="text-emerald-700 leading-relaxed">
                Your request has been routed to your designated distributor account team. Average response time is under 45 minutes during business hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedTicketId(null)}
                className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors mt-2"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Inquiry Department *</label>
                <select
                  value={ticketDept}
                  onChange={(e) => setTicketDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#0E9AA7]"
                >
                  <option value="Procurement & Order Status">Order Status & Tracking</option>
                  <option value="Lot Release & Certificate of Analysis">Certificate of Analysis / Lot Release</option>
                  <option value="Temperature Excursion Report">Cold-Chain Temperature Alert</option>
                  <option value="Billing & Net-30 Settlement">Billing & Net-30 Invoices</option>
                  <option value="Product Sourcing & Bulk Tiers">Custom Bulk Volume Quote</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject / Summary *</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Requesting CoA for Vacutainer batch #88219"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0E9AA7]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Related PO or Order ID (Optional)</label>
                <input
                  type="text"
                  value={ticketPo}
                  onChange={(e) => setTicketPo(e.target.value)}
                  placeholder="e.g. PO-8841-ICU or MSD-2026-9042"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-[#0E9AA7]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Message *</label>
                <textarea
                  required
                  rows={4}
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  placeholder="Provide clinical details, receiving dock number, or specific batch inquiries..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0E9AA7]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] disabled:opacity-50 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Transmitting Request...' : 'Submit Support Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
