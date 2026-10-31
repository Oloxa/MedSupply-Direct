import React, { useState } from 'react';
import { X, FileText, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { MOCK_PRODUCTS } from '../../data/mockProducts';

interface QuickSkuAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSkuAddModal: React.FC<QuickSkuAddModalProps> = ({ isOpen, onClose }) => {
  const { quickAddBySkus } = useCart();
  const { showToast } = useToast();

  const [rawText, setRawText] = useState('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoadSample = () => {
    const sample = `GLV-NIT-M-100, 50\nSYR-3ML-LL-100, 100\nNDL-SFT-21G-100, 40\nWND-GAU-10X10-100, 20\nHYG-WIP-DIS-200, 30`;
    setRawText(sample);
    setErrorNotice(null);
  };

  const handleParseAndAdd = () => {
    if (!rawText.trim()) {
      setErrorNotice('Please paste or enter at least one SKU and quantity line.');
      return;
    }

    const lines = rawText.split('\n');
    const parsedEntries: { sku: string; quantity: number }[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      // Match comma or space or tab separated: SKU [delimiter] QTY
      const parts = trimmed.split(/[,;\t\s]+/);
      if (parts.length >= 2) {
        const sku = parts[0].trim();
        const qty = parseInt(parts[1].trim(), 10);
        if (sku && !isNaN(qty) && qty > 0) {
          parsedEntries.push({ sku, quantity: qty });
        }
      }
    });

    if (parsedEntries.length === 0) {
      setErrorNotice('Could not parse any valid lines. Format should be: SKU, Quantity (e.g. GLV-NIT-M-100, 50)');
      return;
    }

    const { added, notFound } = quickAddBySkus(parsedEntries);

    if (added > 0) {
      showToast(
        'Bulk Items Added',
        `Successfully added ${added} product line${added > 1 ? 's' : ''} to your wholesale cart.`,
        'success'
      );
    }

    if (notFound.length > 0) {
      showToast(
        'Some SKUs Not Recognized',
        `Could not find product for SKU(s): ${notFound.join(', ')}`,
        'warning'
      );
    }

    setRawText('');
    setErrorNotice(null);
    onClose();
  };

  // Live preview of parsed lines
  const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
  const previewItems = lines.map((line) => {
    const parts = line.trim().split(/[,;\t\s]+/);
    const sku = parts[0]?.trim();
    const qty = parseInt(parts[1]?.trim(), 10);
    const matchedProduct = MOCK_PRODUCTS.find((p) => p.sku.toUpperCase() === (sku || '').toUpperCase());
    return {
      sku,
      qty: isNaN(qty) ? null : qty,
      product: matchedProduct,
      valid: !!matchedProduct && !isNaN(qty) && qty > 0,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E6F4FA] text-[#0E9AA7] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#12304A]">Paste SKUs & Quantities</h2>
              <p className="text-xs text-slate-500">Fast batch ordering for procurement and ERP reorders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Enter SKU and Quantity per line (e.g. <span className="font-mono text-[#0E9AA7]">GLV-NIT-M-100, 50</span>)
            </label>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-medium text-[#0E9AA7] hover:underline"
            >
              Load Sample Hospital Order
            </button>
          </div>

          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              setErrorNotice(null);
            }}
            placeholder="GLV-NIT-M-100, 50&#10;SYR-3ML-LL-100, 100&#10;NDL-SFT-21G-100, 40"
            className="w-full rounded-xl border border-slate-200 p-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#0E9AA7] focus:border-transparent bg-slate-50/50"
          />

          {errorNotice && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Real-time parse preview */}
          {previewItems.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Preview ({previewItems.filter(p => p.valid).length} valid items recognized)</span>
              <div className="max-h-36 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-100 text-xs">
                {previewItems.map((item, idx) => (
                  <div key={idx} className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.valid ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-[#F26B5B] shrink-0" />
                      )}
                      <span className="font-mono font-medium text-[#12304A]">{item.sku}</span>
                      {item.product ? (
                        <span className="text-slate-500 truncate max-w-xs">{item.product.name}</span>
                      ) : (
                        <span className="text-rose-500 text-[11px]">SKU not found</span>
                      )}
                    </div>
                    <span className="font-mono font-semibold text-slate-700 shrink-0">
                      Qty: {item.qty !== null ? item.qty : 'Invalid'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleParseAndAdd}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add to Wholesale Order
          </button>
        </div>
      </div>
    </div>
  );
};
