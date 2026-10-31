import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, Invoice, SavedList, OrderStatus, DeliveryAddress, PaymentMethod } from '../types';
import { INITIAL_ORDERS, INITIAL_INVOICES, INITIAL_SAVED_LISTS } from '../data/mockInitialData';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

interface OrderContextValue {
  orders: Order[];
  invoices: Invoice[];
  savedLists: SavedList[];
  placeOrder: (params: {
    poNumber: string;
    shippingAddress: DeliveryAddress;
    deliveryWindow: string;
    deliveryInstructions?: string;
    paymentMethod: PaymentMethod;
  }) => Order;
  advanceOrderStatus: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  reorderAll: (orderId: string) => void;
  createSavedList: (name: string, department: string, description?: string) => SavedList;
  deleteSavedList: (listId: string) => void;
  addItemToSavedList: (listId: string, productId: string, quantity: number) => void;
  removeItemFromSavedList: (listId: string, productId: string) => void;
  addListToCart: (listId: string) => void;
}

const STORAGE_KEY_ORDERS = 'medsupply_orders_list';
const STORAGE_KEY_INVOICES = 'medsupply_invoices_list';
const STORAGE_KEY_SAVED_LISTS = 'medsupply_saved_lists';

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { items, clearCart, addToCart, subtotal, discountSavings, tax, shipping, total } = useCart();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_ORDERS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INVOICES);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_INVOICES;
  });

  const [savedLists, setSavedLists] = useState<SavedList[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED_LISTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_SAVED_LISTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SAVED_LISTS, JSON.stringify(savedLists));
  }, [savedLists]);

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  const placeOrder = ({
    poNumber,
    shippingAddress,
    deliveryWindow,
    deliveryInstructions,
    paymentMethod,
  }: {
    poNumber: string;
    shippingAddress: DeliveryAddress;
    deliveryWindow: string;
    deliveryInstructions?: string;
    paymentMethod: PaymentMethod;
  }): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `MSD-2026-${randomSuffix}`;
    const invoiceId = `INV-2026-${randomSuffix}`;
    const trackingNum = `MC-UK-${randomSuffix}910`;

    const now = new Date();
    const estArrival = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const orderItems = items.map((ci) => ({
      productId: ci.product.id,
      productName: ci.product.name,
      sku: ci.product.sku,
      packSize: ci.product.packSize,
      quantity: ci.quantity,
      unitPrice: ci.effectiveUnitPrice,
      totalPrice: ci.lineTotal,
    }));

    const newOrder: Order = {
      id: orderId,
      poNumber: poNumber.trim() || `PO-${randomSuffix}-AUTO`,
      createdAt: now.toISOString(),
      deliveryEstimatedDate: estArrival,
      status: 'Placed',
      carrier: 'MedCarrier Express Logistics',
      trackingNumber: trackingNum,
      deliveryWindow,
      deliveryInstructions,
      paymentMethod,
      invoiceStatus: 'Pending',
      items: orderItems,
      subtotal,
      discount: discountSavings,
      tax,
      shipping,
      total,
      shippingAddress,
      timeline: [
        {
          status: 'Placed',
          timestamp: 'Just now',
          location: 'MedSupply Portal',
          description: `Order successfully recorded with PO ${poNumber}.`,
          completed: true,
        },
        {
          status: 'Confirmed',
          timestamp: 'Pending',
          location: 'Distribution Operations Hub',
          description: 'Awaiting automatic warehouse stock reservation.',
          completed: false,
        },
        {
          status: 'Packed',
          timestamp: 'Pending',
          location: 'Milton Keynes Fulfillment Center',
          description: 'Scheduled for batch picking and QA inspection.',
          completed: false,
        },
        {
          status: 'Shipped',
          timestamp: 'Pending',
          location: 'Outbound Cold Chain Dock',
          description: 'Carrier dispatch pending.',
          completed: false,
        },
        {
          status: 'Delivered',
          timestamp: `Estimated ${estArrival}`,
          location: shippingAddress.facilityName,
          description: 'Dock arrival and receiving signature.',
          completed: false,
        },
      ],
    };

    const newInvoice: Invoice = {
      id: invoiceId,
      orderId,
      poNumber: newOrder.poNumber,
      issueDate: now.toISOString().split('T')[0],
      dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: total,
      status: 'Pending',
      paymentTerms: 'Net 30 Days',
      taxAmount: tax,
      itemsCount: items.length,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setInvoices((prev) => [newInvoice, ...prev]);
    clearCart();

    return newOrder;
  };

  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const stages: OrderStatus[] = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
        const currentIndex = stages.indexOf(order.status);
        if (currentIndex === -1 || currentIndex >= stages.length - 1) {
          showToast('Order Status', `${order.id} is already Delivered.`, 'info');
          return order;
        }

        const nextStatus = stages[currentIndex + 1];
        const updatedTimeline = order.timeline.map((step) => {
          if (step.status === nextStatus) {
            return {
              ...step,
              completed: true,
              timestamp: 'Just now',
              description: `Verified and moved to ${nextStatus}.`,
            };
          }
          return step;
        });

        showToast(
          'Simulated Status Progress',
          `Order ${order.id} has advanced to "${nextStatus}".`,
          'success'
        );

        return {
          ...order,
          status: nextStatus,
          timeline: updatedTimeline,
        };
      })
    );
  };

  const reorderAll = (orderId: string) => {
    const order = getOrderById(orderId);
    if (!order) return;

    let addedCount = 0;
    // We map back to mock products
    import('../data/mockProducts').then(({ MOCK_PRODUCTS }) => {
      order.items.forEach((item) => {
        const prod = MOCK_PRODUCTS.find((p) => p.id === item.productId || p.sku === item.sku);
        if (prod) {
          addToCart(prod, item.quantity);
          addedCount++;
        }
      });
      showToast('Reorder Populated', `Added ${addedCount} items from ${order.id} to your cart.`, 'success');
    });
  };

  const createSavedList = (name: string, department: string, description?: string): SavedList => {
    const newList: SavedList = {
      id: `list-${Date.now()}`,
      name,
      department,
      description: description || 'Regular procurement template.',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      recurrence: 'Monthly',
      items: [],
    };
    setSavedLists((prev) => [newList, ...prev]);
    showToast('Saved List Created', `"${name}" is ready for items.`, 'success');
    return newList;
  };

  const deleteSavedList = (listId: string) => {
    setSavedLists((prev) => prev.filter((l) => l.id !== listId));
    showToast('List Deleted', 'Standing order list removed.', 'info');
  };

  const addItemToSavedList = (listId: string, productId: string, quantity: number) => {
    import('../data/mockProducts').then(({ MOCK_PRODUCTS }) => {
      const prod = MOCK_PRODUCTS.find((p) => p.id === productId);
      if (!prod) return;

      setSavedLists((prev) =>
        prev.map((list) => {
          if (list.id !== listId) return list;
          const existingItem = list.items.find((i) => i.productId === productId);
          let updatedItems;
          if (existingItem) {
            updatedItems = list.items.map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
            );
          } else {
            updatedItems = [...list.items, { productId, product: prod, quantity }];
          }
          return {
            ...list,
            updatedAt: new Date().toISOString().split('T')[0],
            items: updatedItems,
          };
        })
      );
      showToast('Saved to List', `Added to template list.`, 'success');
    });
  };

  const removeItemFromSavedList = (listId: string, productId: string) => {
    setSavedLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list;
        return {
          ...list,
          items: list.items.filter((i) => i.productId !== productId),
        };
      })
    );
  };

  const addListToCart = (listId: string) => {
    const list = savedLists.find((l) => l.id === listId);
    if (!list) return;

    list.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });

    showToast('List Added to Cart', `Added ${list.items.length} items from "${list.name}" to cart.`, 'success');
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        invoices,
        savedLists,
        placeOrder,
        advanceOrderStatus,
        getOrderById,
        reorderAll,
        createSavedList,
        deleteSavedList,
        addItemToSavedList,
        removeItemFromSavedList,
        addListToCart,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
