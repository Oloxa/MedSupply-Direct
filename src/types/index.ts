export type ProductCategory =
  | 'Gloves and PPE'
  | 'Syringes and Needles'
  | 'Wound Care'
  | 'Diagnostics and Test Kits'
  | 'Surgical Instruments'
  | 'Lab Consumables'
  | 'Monitoring Equipment'
  | 'Hygiene and Sanitisers';

export type StockStatus = 'In stock' | 'Low stock' | 'Backorder';

export interface PriceTier {
  minQty: number;
  maxQty?: number; // undefined means "and above"
  unitPrice: number;
  discountPercent: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  subCategory: string;
  brand: string;
  description: string;
  packSize: string; // e.g. "Box of 100", "Case of 24"
  unitOfMeasure: string; // e.g. "Box", "Case", "Pack", "Unit"
  basePrice: number; // Single unit price
  priceTiers: PriceTier[];
  stockQuantity: number;
  stockStatus: StockStatus;
  prescriptionRequired: boolean;
  isSterile: boolean;
  latexFree?: boolean;
  certifications: string[]; // e.g. ["CE 0123", "ISO 13485", "FDA 510(k)"]
  specifications: Record<string, string>;
  storageRequirements?: string;
  countryOfOrigin: string;
  featured?: boolean;
  frequentlyReordered?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  effectiveUnitPrice: number;
  lineTotal: number;
  tierDiscount: number;
}

export type OrderStatus = 'Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered';

export interface OrderItemSummary {
  productId: string;
  productName: string;
  sku: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface TrackingEvent {
  status: OrderStatus;
  timestamp: string;
  location: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string; // e.g. MSD-2026-9042
  poNumber: string; // e.g. PO-8841-ICU
  createdAt: string;
  deliveryEstimatedDate: string;
  status: OrderStatus;
  items: OrderItemSummary[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: DeliveryAddress;
  deliveryWindow: string;
  deliveryInstructions?: string;
  carrier: string;
  trackingNumber: string;
  paymentMethod: PaymentMethod;
  invoiceStatus: 'Paid' | 'Pending' | 'Overdue';
  timeline: TrackingEvent[];
}

export interface DeliveryAddress {
  facilityName: string;
  attention: string;
  dockNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateOrRegion: string;
  postalCode: string;
  country: string;
  phone: string;
  operatingHours?: string;
}

export type PaymentMethodType = 'Invoice Net-30' | 'Bank Transfer (BACS)' | 'Purchasing Card';

export interface PaymentMethod {
  type: PaymentMethodType;
  details: string; // e.g. "Net-30 Terms Approved (Credit limit $75,000)" or "Visa ending in 8842"
  poReference?: string;
}

export interface SavedList {
  id: string;
  name: string;
  department: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  recurrence?: 'Manual' | 'Weekly' | 'Bi-weekly' | 'Monthly';
  items: {
    productId: string;
    product: Product;
    quantity: number;
  }[];
}

export interface Invoice {
  id: string; // e.g. INV-2026-0341
  orderId: string;
  poNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentTerms: string;
  taxAmount: number;
  itemsCount: number;
}

export interface UserOrganization {
  id: string;
  name: string;
  type: 'Hospital' | 'Pharmacy' | 'Clinic';
  registrationNumber: string;
  taxId: string;
  creditLimit: number;
  creditUsed: number;
  accountManager: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Procurement Director' | 'Head of Pharmacy' | 'Clinic Manager' | 'Nurse Lead';
  organization: UserOrganization;
  savedAddresses: DeliveryAddress[];
  notificationSettings: {
    orderStatusUpdates: boolean;
    dispatchAlerts: boolean;
    invoiceReminders: boolean;
    priceDropAlerts: boolean;
  };
}
