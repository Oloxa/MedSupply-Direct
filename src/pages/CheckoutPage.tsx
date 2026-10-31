import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Truck,
  CreditCard,
  Building2,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { DeliveryAddress, PaymentMethodType, Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const { items, total, subtotal, discountSavings, shipping } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Delivery Address & Window
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [deliveryWindow, setDeliveryWindow] = useState('Standard Priority Freight (08:00 - 12:00)');
  const [deliveryInstructions, setDeliveryInstructions] = useState(
    'Deliver to Receiving Dock 4B. Temperature verification required.'
  );

  // Step 2: Payment & PO
  const [paymentType, setPaymentType] = useState<PaymentMethodType>('Invoice Net-30');
  const [poNumber, setPoNumber] = useState(`PO-${Math.floor(1000 + Math.random() * 9000)}-PROC`);
  const [cardHolder, setCardHolder] = useState('Eleanor Vance');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 8842');

  // Step 3: Result
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (items.length === 0 && !completedOrder) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4 max-w-lg mx-auto my-12">
        <h2 className="text-lg font-bold text-[#12304A]">No Items to Checkout</h2>
        <p className="text-xs text-slate-500">Your wholesale cart is currently empty.</p>
        <Link
          to="/catalog"
          className="inline-block px-4 py-2 text-xs font-bold text-white bg-[#0E9AA7] rounded-xl"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const selectedAddress: DeliveryAddress =
    user?.savedAddresses[selectedAddressIndex] || {
      facilityName: 'St. Jude Metropolitan Hospital',
      attention: 'Central Dock 4B',
      addressLine1: "400 King's College Road",
      city: 'London',
      stateOrRegion: 'Greater London',
      postalCode: 'SE1 7PB',
      country: 'United Kingdom',
      phone: '+44 20 7188 7188',
    };

  const handleConfirmOrder = () => {
    let paymentDetails = 'Net-30 Invoice Approval Terms';
    if (paymentType === 'Bank Transfer (BACS)') {
      paymentDetails = 'Direct BACS Wire within 14 days';
    } else if (paymentType === 'Purchasing Card') {
      paymentDetails = `Visa Corporate ending in 8842 (${cardHolder})`;
    }

    const order = placeOrder({
      poNumber,
      shippingAddress: selectedAddress,
      deliveryWindow,
      deliveryInstructions,
      paymentMethod: {
        type: paymentType,
        details: paymentDetails,
        poReference: poNumber,
      },
    });

    setCompletedOrder(order);
    setStep(3);
    showToast('Order Placed Successfully', `Reference ${order.id} with PO ${poNumber}`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 3-Step Wizard Indicator */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        {[
          { num: 1, title: 'Delivery & Window' },
          { num: 2, title: 'Payment & PO Terms' },
          { num: 3, title: 'Order Confirmation' },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                step === s.num
                  ? 'bg-[#0E9AA7] text-white'
                  : step > s.num
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step === s.num ? 'text-[#12304A]' : 'text-slate-400'
              }`}
            >
              {s.title}
            </span>
            {idx < 2 && <div className="w-12 h-0.5 bg-slate-200 mx-2 hidden md:block" />}
          </div>
        ))}
      </div>

      {/* STEP 1: DELIVERY ADDRESS & WINDOW */}
      {step === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-[#12304A]">Select Receiving Dock & Delivery Window</h2>
            <p className="text-xs text-slate-500">
              Verified clinical receiving points for {user?.organization.name}
            </p>
          </div>

          {/* Saved Addresses */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">Delivery Facilities</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(user?.savedAddresses || [selectedAddress]).map((addr, idx) => {
                const isSelected = selectedAddressIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0E9AA7] bg-[#E6F4FA]/50 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-[#12304A]">{addr.facilityName}</span>
                      <Building2 className={`w-4 h-4 ${isSelected ? 'text-[#0E9AA7]' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{addr.attention}</p>
                    <p className="text-xs text-slate-500">{addr.addressLine1}</p>
                    <p className="text-xs text-slate-500">
                      {addr.city}, {addr.postalCode}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                      {addr.operatingHours || 'Mon-Fri: 07:00 - 18:00'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Windows */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-700 block">Logistics Dispatch Window</label>
            <div className="space-y-2">
              {[
                {
                  label: 'Standard Priority Freight (08:00 - 12:00)',
                  desc: 'Scheduled next available freight slot with tail-lift truck.',
                  cost: 'Included in order',
                },
                {
                  label: 'Temperature-Controlled Cold Chain (2°C - 8°C)',
                  desc: 'Validated refrigerated vehicle with continuous datalogger calibration.',
                  cost: 'Included (Preserved items)',
                },
                {
                  label: 'Urgent Morning Dispatch (By 09:00 AM)',
                  desc: 'Dedicated courier for urgent clinical or surgical needs.',
                  cost: 'Priority Routing',
                },
              ].map((win, idx) => (
                <label
                  key={idx}
                  className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                    deliveryWindow === win.label
                      ? 'border-[#0E9AA7] bg-[#E6F4FA]/40'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="deliveryWindow"
                      checked={deliveryWindow === win.label}
                      onChange={() => setDeliveryWindow(win.label)}
                      className="mt-1 text-[#0E9AA7]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#12304A] block">{win.label}</span>
                      <span className="text-xs text-slate-500">{win.desc}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium text-emerald-700 shrink-0">
                    {win.cost}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Dock Notes */}
          <div className="space-y-1 pt-2">
            <label className="text-xs font-bold text-slate-700 block">
              Driver Instructions / Gate Entry PIN
            </label>
            <input
              type="text"
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0E9AA7]"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link to="/cart" className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Cart
            </Link>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              Continue to Payment & PO <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PAYMENT & PO */}
      {step === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-[#12304A]">Payment Method & Purchase Order Reference</h2>
            <p className="text-xs text-slate-500">
              Commercial invoicing and payment processing for wholesale orders
            </p>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">Billing Option</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'Invoice Net-30',
                  title: 'Invoice Net-30',
                  subtitle: 'Approved Commercial Credit',
                  badge: 'Recommended',
                },
                {
                  id: 'Bank Transfer (BACS)',
                  title: 'Direct Bank Wire (BACS)',
                  subtitle: '14-Day Payment Window',
                  badge: 'Standard',
                },
                {
                  id: 'Purchasing Card',
                  title: 'Corporate P-Card',
                  subtitle: 'Visa / Mastercard / Amex',
                  badge: 'Instant Charge',
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setPaymentType(opt.id as PaymentMethodType)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentType === opt.id
                      ? 'border-[#0E9AA7] bg-[#E6F4FA]/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold text-[#0E9AA7] block mb-1">
                    {opt.badge}
                  </span>
                  <span className="text-xs font-bold text-[#12304A] block">{opt.title}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{opt.subtitle}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PO Number input */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4">
            <div>
              <label className="text-xs font-bold text-[#12304A] block mb-1">
                Hospital / Organization Purchase Order (PO) Number *
              </label>
              <input
                type="text"
                required
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                placeholder="e.g. PO-8941-SURG"
                className="w-full p-2.5 text-xs font-mono font-bold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0E9AA7]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                This reference will be cross-indexed on all shipment packing slips, dispatch notes, and Net-30 invoices.
              </span>
            </div>

            {paymentType === 'Purchasing Card' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2 text-xs font-mono rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Snapshot */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Lines ({items.length})</span>
              <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            {discountSavings > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Bulk Savings</span>
                <span className="font-mono tabular-nums">-${discountSavings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Freight Transport</span>
              <span className="font-mono tabular-nums">
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-[#12304A]">
              <span>Order Total</span>
              <span className="font-mono tabular-nums text-base">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Delivery
            </button>
            <button
              type="button"
              onClick={handleConfirmOrder}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              Confirm & Place Order (${total.toFixed(2)}) <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ORDER CONFIRMATION */}
      {step === 3 && completedOrder && (
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-2xs space-y-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                Wholesale Order Confirmed
              </span>
              <h2 className="text-2xl font-bold text-[#12304A]">
                Order {completedOrder.id} has been placed
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                PO: <span className="font-mono font-bold text-slate-700">{completedOrder.poNumber}</span> · Estimated Dispatch: Next Business Day
              </p>
            </div>
          </div>

          {/* Key Confirmation Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                Estimated Delivery
              </span>
              <p className="text-sm font-bold text-[#12304A] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0E9AA7]" />
                {completedOrder.deliveryEstimatedDate}
              </p>
              <span className="text-slate-500 text-[11px] block mt-1">
                {completedOrder.deliveryWindow}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                Carrier & Tracking
              </span>
              <p className="text-sm font-bold text-[#12304A] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#0E9AA7]" />
                {completedOrder.carrier}
              </p>
              <span className="text-slate-500 font-mono text-[11px] block mt-1">
                Track #{completedOrder.trackingNumber}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                Invoice & Settlement
              </span>
              <p className="text-sm font-bold text-[#12304A] font-mono tabular-nums">
                ${completedOrder.total.toFixed(2)}
              </p>
              <span className="text-emerald-700 font-medium text-[11px] block mt-1">
                Net-30 Statement Generated
              </span>
            </div>
          </div>

          {/* Itemized Snapshot */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#12304A] uppercase tracking-wider">
              Allocated Order Items ({completedOrder.items.length})
            </h3>
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs overflow-hidden">
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-700 mr-2">{item.sku}</span>
                    <span className="text-slate-600">{item.productName}</span>
                    <span className="text-slate-400 ml-2">({item.packSize})</span>
                  </div>
                  <div className="font-mono font-semibold text-slate-700">
                    {item.quantity} × ${item.unitPrice.toFixed(2)} = ${item.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                showToast('Invoice Download', `Generating PDF for ${completedOrder.id}...`, 'info');
                window.print();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Tax Invoice PDF
            </button>

            <button
              type="button"
              onClick={() => navigate(`/orders/${completedOrder.id}`)}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              Track Live Shipment Status <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
