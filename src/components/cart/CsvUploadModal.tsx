import React, { useState, useRef } from 'react';
import { X, UploadCloud, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { MOCK_PRODUCTS } from '../../data/mockProducts';

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CsvUploadModal: React.FC<CsvUploadModalProps> = ({ isOpen, onClose }) => {
  const { quickAddBySkus } = useCart();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<{ sku: string; quantity: number; product?: any }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const csvContent = 'data:text/csv;charset=utf-8,SKU,Quantity,Notes\nGLV-NIT-M-100,50,ICU Ward Consumables\nSYR-3ML-LL-100,100,Pharmacy Reconstitution\nWND-GAU-10X10-100,30,Surgical Prep\nHYG-WIP-DIS-200,25,Surface Cleaning';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'medsupply_bulk_order_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Template Downloaded', 'Sample CSV template saved to downloads.', 'info');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      const rows: { sku: string; quantity: number; product?: any }[] = [];

      lines.forEach((line, index) => {
        // Skip header
        if (index === 0 && line.toLowerCase().includes('sku')) return;
        const parts = line.split(',');
        if (parts.length >= 2) {
          const sku = parts[0].trim().toUpperCase();
          const qty = parseInt(parts[1].trim(), 10);
          if (sku && !isNaN(qty) && qty > 0) {
            const product = MOCK_PRODUCTS.find((p) => p.sku.toUpperCase() === sku);
            rows.push({ sku, quantity: qty, product });
          }
        }
      });

      if (rows.length === 0) {
        setErrorMsg('No valid rows found in file. Ensure format is SKU,Quantity.');
      } else {
        setParsedRows(rows);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;

    const { added, notFound } = quickAddBySkus(parsedRows);
    showToast('CSV Imported', `Successfully added ${added} items to cart.`, 'success');
    if (notFound.length > 0) {
      showToast('Unmatched SKUs', `SKUs not found: ${notFound.join(', ')}`, 'warning');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E6F4FA] text-[#0E9AA7] flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#12304A]">Import CSV Bulk Order</h2>
              <p className="text-xs text-slate-500">Upload your procurement manifest or ERP inventory export</p>
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
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Download sample */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-semibold text-slate-700 block">Need the standard spreadsheet format?</span>
              <span className="text-slate-500">Includes columns: SKU, Quantity, Notes</span>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 text-xs font-semibold text-[#0E9AA7] bg-white border border-[#0E9AA7]/30 hover:bg-[#E6F4FA] rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Template
            </button>
          </div>

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-[#0E9AA7] rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-[#E6F4FA]/20"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.txt"
              className="hidden"
            />
            <UploadCloud className="w-10 h-10 text-[#0E9AA7] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#12304A]">
              {fileName ? fileName : 'Click or drop your CSV file here'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Accepts UTF-8 .csv or comma-delimited .txt</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed list preview */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Recognized Items ({parsedRows.length})</span>
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Cart
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-100 text-xs">
                {parsedRows.map((r, i) => (
                  <div key={i} className="p-2 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-semibold text-[#12304A] mr-2">{r.sku}</span>
                      <span className="text-slate-500">{r.product?.name || 'Unknown item'}</span>
                    </div>
                    <span className="font-mono font-medium text-slate-700">Qty: {r.quantity}</span>
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
            disabled={parsedRows.length === 0}
            onClick={handleConfirmImport}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#0E9AA7] hover:bg-[#0B8591] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors"
          >
            Add {parsedRows.length} Lines to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
