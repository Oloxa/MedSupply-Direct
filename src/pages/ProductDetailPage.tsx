import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  Download,
  BookmarkCheck,
  Plus,
  Minus,
  Check,
  ShoppingCart,
  Truck,
  CheckCircle2,
  Share2,
  AlertCircle,
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { useCart, getEffectiveUnitPrice } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { StockBadge } from '../components/common/StockBadge';
import { ProductImageIllustration } from '../components/common/ProductImageIllustration';
import { TierPriceTable } from '../components/common/TierPriceTable';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { savedLists, addItemToSavedList, createSavedList } = useOrders();
  const { showToast } = useToast();

  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  const [quantity, setQuantity] = useState(10);
  const [saveListModalOpen, setSaveListModalOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>(savedLists[0]?.id || '');
  const [newListName, setNewListName] = useState('');

  if (!product) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-lg font-bold text-[#12304A]">Medical Product Not Found</h2>
        <p className="text-xs text-slate-500">The requested medical SKU or product reference does not exist.</p>
        <button
          onClick={() => navigate('/catalog')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#0E9AA7] rounded-xl"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Related products
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  // Price calculations
  const effectiveUnit = getEffectiveUnitPrice(product, quantity);
  const lineTotal = Number((quantity * effectiveUnit).toFixed(2));
  const listPriceTotal = Number((quantity * product.basePrice).toFixed(2));
  const totalSavings = Number((listPriceTotal - lineTotal).toFixed(2));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(
      'Wholesale Order Updated',
      `Added ${quantity} ${product.unitOfMeasure}s of ${product.sku} to cart.`,
      'success'
    );
    setIsCartDrawerOpen(true);
  };

  const handleSaveToList = () => {
    let targetListId = selectedListId;
    if (newListName.trim()) {
      const created = createSavedList(newListName.trim(), 'General Supplies');
      targetListId = created.id;
    }
    if (targetListId) {
      addItemToSavedList(targetListId, product.id, quantity);
      setSaveListModalOpen(false);
      setNewListName('');
    }
  };

  const handleDownloadDoc = (docType: string) => {
    showToast('Document Download', `Downloading ${product.sku}_${docType}.pdf`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0E9AA7] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast('Link Copied', 'Product procurement URL copied to clipboard.', 'info');
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title="Share SKU"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Product Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Left: Illustration & Certifications (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <ProductImageIllustration
            category={product.category}
            className="w-full h-80 rounded-2xl"
          />

          {/* Clinical Regulatory Badges */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Certified Regulatory Standards
            </span>
            <div className="flex flex-wrap gap-2">
              {product.certifications.map((cert, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#0E9AA7] bg-[#E6F4FA] border border-[#0E9AA7]/20"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Technical Documents list */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <span className="text-xs font-bold text-[#12304A] block">
              Regulatory & Technical Downloads
            </span>
            <div className="space-y-1 text-xs">
              <button
                type="button"
                onClick={() => handleDownloadDoc('Technical_Data_Sheet')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0E9AA7]" />
                  <span>Technical Data Sheet (TDS)</span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleDownloadDoc('Safety_Data_Sheet_SDS')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0E9AA7]" />
                  <span>Safety Data Sheet (SDS) / IFU</span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Info, Tier Pricing Table & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-mono text-slate-600 font-semibold">{product.sku}</span>
              <span>·</span>
              <span>{product.brand}</span>
              <span>·</span>
              <span>{product.category}</span>
            </div>

            <h1 className="text-2xl font-bold text-[#12304A] tracking-tight">
              {product.name}
            </h1>

            <div className="mt-2 flex items-center gap-4 text-xs">
              <StockBadge status={product.stockStatus} showQty quantity={product.stockQuantity} />
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium">{product.packSize}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">Origin: {product.countryOfOrigin}</span>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Interactive Tier Pricing Table */}
          <div className="space-y-2">
            <TierPriceTable
              tiers={product.priceTiers}
              currentQuantity={quantity}
              onSelectTierMin={(min) => setQuantity(min)}
              unitOfMeasure={product.unitOfMeasure}
            />
          </div>

          {/* Order Action Box */}
          <div className="p-5 rounded-xl border border-[#0E9AA7]/30 bg-[#E6F4FA]/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-500 block">Current Active Tier Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#12304A] font-mono tabular-nums">
                    ${effectiveUnit.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500">/{product.unitOfMeasure}</span>
                  {effectiveUnit < product.basePrice && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Saving ${(product.basePrice - effectiveUnit).toFixed(2)} per unit
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 5))}
                    className="p-2 text-slate-600 hover:text-slate-900"
                    aria-label="Minus 5"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v) && v > 0) setQuantity(v);
                    }}
                    className="w-16 text-center text-sm font-mono font-bold text-[#12304A] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 5)}
                    className="p-2 text-slate-600 hover:text-slate-900"
                    aria-label="Plus 5"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-600">Calculated Line Total: </span>
                <strong className="text-sm font-bold text-[#12304A] font-mono tabular-nums ml-1">
                  ${lineTotal.toFixed(2)}
                </strong>
                {totalSavings > 0 && (
                  <span className="text-emerald-700 font-semibold ml-2">
                    (You save ${totalSavings.toFixed(2)})
                  </span>
                )}
              </div>

              <span className="text-[11px] text-slate-500">
                {product.stockStatus === 'In stock' ? 'Next-Day Dispatch Ready' : 'Lead time 3-5 days'}
              </span>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add {quantity} to Bulk Order
              </button>

              <button
                type="button"
                onClick={() => setSaveListModalOpen(true)}
                className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <BookmarkCheck className="w-4 h-4 text-[#0E9AA7]" /> Save to Standing List
              </button>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-[#12304A]">Technical Specifications</h3>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                      <td className="py-2.5 px-4 font-semibold text-slate-600 w-1/3">{key}</td>
                      <td className="py-2.5 px-4 text-[#12304A] font-medium">{val}</td>
                    </tr>
                  ))}
                  {product.storageRequirements && (
                    <tr className="bg-slate-50/50">
                      <td className="py-2.5 px-4 font-semibold text-slate-600">Storage & Cold Chain</td>
                      <td className="py-2.5 px-4 text-[#12304A]">{product.storageRequirements}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#12304A]">Related Supplies in {product.category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/catalog/${rel.id}`)}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#0E9AA7] cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <ProductImageIllustration category={rel.category} className="w-full h-32 mb-2" />
                  <span className="font-mono text-[10px] text-slate-400">{rel.sku}</span>
                  <h4 className="text-xs font-bold text-[#12304A] group-hover:text-[#0E9AA7] transition-colors line-clamp-2 mt-0.5">
                    {rel.name}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#12304A] font-mono">
                    ${rel.basePrice.toFixed(2)}
                  </span>
                  <span className="text-[11px] font-semibold text-[#0E9AA7]">View Specs →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save to List Modal */}
      {saveListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-[#12304A]">Save to Standing Order List</h3>
            <p className="text-xs text-slate-500">
              Add {product.name} ({quantity} units) to an automated reordering template.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Existing List</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {savedLists.map((list) => (
                  <button
                    key={list.id}
                    type="button"
                    onClick={() => {
                      setSelectedListId(list.id);
                      setNewListName('');
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                      selectedListId === list.id && !newListName
                        ? 'border-[#0E9AA7] bg-[#E6F4FA] font-semibold text-[#0E9AA7]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{list.name}</span>
                    <span className="text-[10px] text-slate-400">{list.department}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Or Create New List</label>
              <input
                type="text"
                placeholder="e.g. Theatre 4 Laparoscopy Restock"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0E9AA7]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSaveListModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveToList}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl transition-colors"
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
