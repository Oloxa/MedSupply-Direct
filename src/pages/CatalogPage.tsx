import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  Plus,
  Minus,
  Check,
  X,
  FileText,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { ProductCategory, Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { StockBadge } from '../components/common/StockBadge';
import { ProductImageIllustration } from '../components/common/ProductImageIllustration';
import { ProductCardSkeleton } from '../components/common/SkeletonLoader';
import { QuickSkuAddModal } from '../components/cart/QuickSkuAddModal';
import { CsvUploadModal } from '../components/cart/CsvUploadModal';

const CATEGORIES: ProductCategory[] = [
  'Gloves and PPE',
  'Syringes and Needles',
  'Wound Care',
  'Diagnostics and Test Kits',
  'Surgical Instruments',
  'Lab Consumables',
  'Monitoring Equipment',
  'Hygiene and Sanitisers',
];

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { showToast } = useToast();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'All'
  );
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('filter') === 'low-stock' ? false : false);
  const [sterileOnly, setSterileOnly] = useState(false);
  const [rxOnly, setRxOnly] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(300);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Quick modals
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [csvUploadOpen, setCsvUploadOpen] = useState(false);

  // Per-item stepper quantity state map
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Simulate fast filter transition
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 180);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedBrand, inStockOnly, sterileOnly, rxOnly, priceMax, sortBy]);

  // Extract unique brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    MOCK_PRODUCTS.forEach((p) => set.add(p.brand));
    return Array.from(set).sort();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Brand filter
      if (selectedBrand !== 'All' && product.brand !== selectedBrand) {
        return false;
      }
      // In-stock only
      if (inStockOnly && product.stockStatus !== 'In stock') {
        return false;
      }
      // Sterile only
      if (sterileOnly && !product.isSterile) {
        return false;
      }
      // Prescription only
      if (rxOnly && !product.prescriptionRequired) {
        return false;
      }
      // Price max
      if (product.basePrice > priceMax) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesCat && !matchesBrand) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.basePrice - b.basePrice;
      if (sortBy === 'price-high') return b.basePrice - a.basePrice;
      if (sortBy === 'stock') return b.stockQuantity - a.stockQuantity;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    selectedCategory,
    selectedBrand,
    inStockOnly,
    sterileOnly,
    rxOnly,
    priceMax,
    searchQuery,
    sortBy,
  ]);

  const handleQtyChange = (productId: string, val: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, val),
    }));
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);
    showToast(
      'Added to Order',
      `Added ${qty} ${product.unitOfMeasure}(s) of ${product.sku} to cart.`,
      'success'
    );
    setIsCartDrawerOpen(true);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setInStockOnly(false);
    setSterileOnly(false);
    setRxOnly(false);
    setPriceMax(300);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Tools Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#12304A]">Medical Consumables & Equipment Catalog</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            60 verified CE/ISO certified hospital products with pre-negotiated tiered volume pricing
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setQuickAddOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#0E9AA7]" /> Paste SKUs
          </button>
          <button
            type="button"
            onClick={() => setCsvUploadOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#0E9AA7]" /> CSV Upload
          </button>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-6 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#12304A] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0E9AA7]" /> Filter Catalog
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[#0E9AA7] hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#12304A] block">Categories</label>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-[#E6F4FA] text-[#0E9AA7] font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                <span className="font-mono text-[10px] text-slate-400">{MOCK_PRODUCTS.length}</span>
              </button>
              {CATEGORIES.map((cat) => {
                const count = MOCK_PRODUCTS.filter((p) => p.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#E6F4FA] text-[#0E9AA7] font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate pr-1">{cat}</span>
                    <span className="font-mono text-[10px] text-slate-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-[#12304A] block">Manufacturer / Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0E9AA7]"
            >
              <option value="All">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-[#12304A]">Max Unit Price</label>
              <span className="font-mono font-semibold text-[#0E9AA7]">${priceMax}</span>
            </div>
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#0E9AA7]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$10</span>
              <span>$300</span>
            </div>
          </div>

          {/* Clinical Specifications Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-[#12304A] block">Clinical Specifications</label>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#0E9AA7]"
                />
                <span>In Stock only (ready to dispatch)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sterileOnly}
                  onChange={(e) => setSterileOnly(e.target.checked)}
                  className="rounded text-[#0E9AA7]"
                />
                <span>Sterile Products only (EtO / Gamma)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rxOnly}
                  onChange={(e) => setRxOnly(e.target.checked)}
                  className="rounded text-[#0E9AA7]"
                />
                <span>Prescription / Controlled only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 w-full space-y-4">
          {/* Controls Bar: Search, Sort, View Toggle, Mobile Filter Trigger */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog or SKU..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0E9AA7] bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Controls */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5 text-[#0E9AA7]" /> Filters
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 hidden md:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="py-1.5 px-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0E9AA7]"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="stock">Highest Stock Quantity</option>
                  <option value="name">Product Name (A-Z)</option>
                </select>
              </div>

              {/* View toggle */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-2xs text-[#0E9AA7]' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'table' ? 'bg-white shadow-2xs text-[#0E9AA7]' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  aria-label="Table view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-[#12304A] font-mono">{filteredProducts.length}</strong> items in catalog
            </span>
            {(selectedCategory !== 'All' || selectedBrand !== 'All' || inStockOnly || sterileOnly || rxOnly || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="text-[#0E9AA7] font-semibold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Product Items Display */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#12304A]">No medical products match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, clearing sterile/prescription filters, or resetting category selections.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-xl transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const currentQty = quantities[product.id] || 1;
                const lowestTier = product.priceTiers[product.priceTiers.length - 1];

                return (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/catalog/${product.id}`)}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#0E9AA7] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Product Image / Illustration */}
                      <ProductImageIllustration
                        category={product.category}
                        className="w-full h-36 mb-3"
                      />

                      {/* Header line: SKU and Stock */}
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono text-slate-500">{product.sku}</span>
                        <StockBadge status={product.stockStatus} />
                      </div>

                      {/* Title & Pack size */}
                      <h3 className="text-xs font-bold text-[#12304A] group-hover:text-[#0E9AA7] transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1">{product.packSize}</p>

                      {/* Tags: Sterile, Latex-free */}
                      <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-slate-500">
                        {product.isSterile && (
                          <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                            Sterile
                          </span>
                        )}
                        {product.latexFree && (
                          <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                            Latex-Free
                          </span>
                        )}
                        {product.certifications[0] && (
                          <span className="text-[#0E9AA7] bg-[#E6F4FA] px-1.5 py-0.5 rounded font-mono">
                            {product.certifications[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Pricing & Add Action */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-2">
                        <div>
                          <span className="text-sm font-bold text-[#12304A] font-mono tabular-nums">
                            ${product.basePrice.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">
                            /{product.unitOfMeasure}
                          </span>
                        </div>
                        {lowestTier && lowestTier.discountPercent > 0 && (
                          <span className="text-[10px] text-emerald-700 font-medium font-mono">
                            From ${lowestTier.unitPrice.toFixed(2)} bulk ({lowestTier.discountPercent}% off)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Stepper */}
                        <div
                          className="flex items-center border border-slate-200 rounded-lg bg-slate-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleQtyChange(product.id, currentQty - 1)}
                            className="p-1 text-slate-500 hover:text-slate-900"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={currentQty}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10);
                              if (!isNaN(v)) handleQtyChange(product.id, v);
                            }}
                            className="w-10 text-center text-xs font-mono font-bold bg-transparent focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleQtyChange(product.id, currentQty + 1)}
                            className="p-1 text-slate-500 hover:text-slate-900"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Add to Order Button */}
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(product, e)}
                          className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-[#0E9AA7] hover:bg-[#0B8591] transition-colors shadow-2xs flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add to Order
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="py-3 px-4 font-semibold">SKU / Item</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Pack Size</th>
                    <th className="py-3 px-4 font-semibold">Stock</th>
                    <th className="py-3 px-4 font-semibold">Unit Price</th>
                    <th className="py-3 px-4 font-semibold">Bulk Tier</th>
                    <th className="py-3 px-4 text-right font-semibold">Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => {
                    const currentQty = quantities[product.id] || 1;
                    const lowestTier = product.priceTiers[product.priceTiers.length - 1];

                    return (
                      <tr
                        key={product.id}
                        onClick={() => navigate(`/catalog/${product.id}`)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-[#12304A]">{product.sku}</div>
                          <div className="text-slate-700 font-medium line-clamp-1 max-w-xs">
                            {product.name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{product.category}</td>
                        <td className="py-3 px-4 text-slate-500">{product.packSize}</td>
                        <td className="py-3 px-4">
                          <StockBadge status={product.stockStatus} showQty quantity={product.stockQuantity} />
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#12304A] tabular-nums">
                          ${product.basePrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-700 font-medium tabular-nums">
                          {lowestTier ? `$${lowestTier.unitPrice.toFixed(2)} (-${lowestTier.discountPercent}%)` : '—'}
                        </td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={currentQty}
                              onChange={(e) => {
                                const v = parseInt(e.target.value, 10);
                                if (!isNaN(v)) handleQtyChange(product.id, v);
                              }}
                              className="w-12 py-1 px-1.5 text-center text-xs font-mono font-bold border border-slate-200 rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => handleAddToCart(product, e)}
                              className="px-3 py-1 text-xs font-semibold text-white bg-[#0E9AA7] hover:bg-[#0B8591] rounded-lg transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-up Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#12304A]">Filter Products</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-slate-400 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Category</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs ${
                    selectedCategory === 'All' ? 'bg-[#0E9AA7] text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs ${
                      selectedCategory === cat ? 'bg-[#0E9AA7] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Max Price (${priceMax})</label>
              <input
                type="range"
                min="10"
                max="300"
                step="10"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#0E9AA7]"
              />
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#0E9AA7]"
            >
              Apply Filters ({filteredProducts.length} items)
            </button>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      <QuickSkuAddModal isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
      {/* CSV Upload Modal */}
      <CsvUploadModal isOpen={csvUploadOpen} onClose={() => setCsvUploadOpen(false)} />
    </div>
  );
};
