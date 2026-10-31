/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ClinicalLoadingScreen } from './components/common/ClinicalLoadingScreen';

// Lazy loaded page components
const AuthPage = lazy(() =>
  import('./pages/AuthPage').then((m) => ({ default: m.AuthPage }))
);
const AppLayout = lazy(() =>
  import('./components/layout/AppLayout').then((m) => ({ default: m.AppLayout }))
);
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const CatalogPage = lazy(() =>
  import('./pages/CatalogPage').then((m) => ({ default: m.CatalogPage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const CartPage = lazy(() =>
  import('./pages/CartPage').then((m) => ({ default: m.CartPage }))
);
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const OrdersPage = lazy(() =>
  import('./pages/OrdersPage').then((m) => ({ default: m.OrdersPage }))
);
const OrderDetailPage = lazy(() =>
  import('./pages/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage }))
);
const SavedListsPage = lazy(() =>
  import('./pages/SavedListsPage').then((m) => ({ default: m.SavedListsPage }))
);
const InvoicesPage = lazy(() =>
  import('./pages/InvoicesPage').then((m) => ({ default: m.InvoicesPage }))
);
const AccountPage = lazy(() =>
  import('./pages/AccountPage').then((m) => ({ default: m.AccountPage }))
);
const SupportPage = lazy(() =>
  import('./pages/SupportPage').then((m) => ({ default: m.SupportPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

// Protected Route Guard with Lazy Suspense
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Suspense fallback={<ClinicalLoadingScreen message="Initializing Medical Portal..." />}>
      {children}
    </Suspense>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <BrowserRouter>
              <Suspense fallback={<ClinicalLoadingScreen message="Loading MedSupply Direct..." />}>
                <Routes>
                  {/* Public Auth Route */}
                  <Route
                    path="/login"
                    element={
                      <Suspense fallback={<ClinicalLoadingScreen message="Loading Authentication..." />}>
                        <AuthPage />
                      </Suspense>
                    }
                  />

                  {/* Protected Portal Routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={
                        <Suspense fallback={<ClinicalLoadingScreen message="Loading Dashboard..." />}>
                          <DashboardPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="catalog"
                      element={
                        <Suspense fallback={<ClinicalLoadingScreen message="Loading Medical Catalog..." />}>
                          <CatalogPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="catalog/:id"
                      element={
                        <Suspense fallback={<ClinicalLoadingScreen message="Loading Product Specifications..." />}>
                          <ProductDetailPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="cart"
                      element={
                        <Suspense fallback={<ClinicalLoadingScreen message="Loading Wholesale Cart..." />}>
                          <CartPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="checkout"
                      element={
                        <Suspense fallback={<ClinicalLoadingScreen message="Preparing Secure Checkout..." />}>
                          <CheckoutPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="orders"
                      element={
                        <Suspense fallback={<ClinicalLoadingScreen message="Loading Orders & Dispatch Telemetry..." />}>
                          <OrdersPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="orders/:id"
                      element={
                        <Suspense fallback={<ClinicalLoadingScreen message="Loading Shipment Waybill & Stepper..." />}>
                          <OrderDetailPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="saved-lists"
                      element={
                        <Suspense fallback={<ClinicalLoadingScreen message="Loading Standing Orders..." />}>
                          <SavedListsPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="invoices"
                      element={
                        <Suspense fallback={<ClinicalLoadingScreen message="Loading Net-30 Invoices..." />}>
                          <InvoicesPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="account"
                      element={
                        <Suspense fallback={<ClinicalLoadingScreen message="Loading Organization Profile..." />}>
                          <AccountPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="support"
                      element={
                        <Suspense fallback={<ClinicalLoadingScreen message="Loading Clinical Helpdesk..." />}>
                          <SupportPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="*"
                      element={
                        <Suspense fallback={<ClinicalLoadingScreen />}>
                          <NotFoundPage />
                        </Suspense>
                      }
                    />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
