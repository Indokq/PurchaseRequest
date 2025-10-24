import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/utils/queryClient';
import { AuthProvider, LoginPage, RegisterPage, ProtectedRoute } from './features/auth';
import { Layout } from './shared/components';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { PurchaseRequestListPage } from './features/purchase-requests/components/PurchaseRequestListPage';
import { PurchaseRequestDetailPage } from './features/purchase-requests/components/PurchaseRequestDetailPage';
import { ProductListPage } from './features/products/pages/ProductListPage';
import { DepartmentListPage } from './features/departments/pages/DepartmentListPage';
import { UserListPage } from './features/users/pages/UserListPage';

function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes with Layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/purchase-requests" element={
              <ProtectedRoute>
                <Layout>
                  <PurchaseRequestListPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/purchase-requests/:id" element={
              <ProtectedRoute>
                <Layout>
                  <PurchaseRequestDetailPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/products" element={
              <ProtectedRoute>
                <Layout>
                  <ProductListPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/departments" element={
              <ProtectedRoute>
                <Layout>
                  <DepartmentListPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/users" element={
              <ProtectedRoute>
                <Layout>
                  <UserListPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={
              <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-slate-400">Page not found</p>
                  <a href="/" className="mt-4 inline-block text-primary hover:underline">Return to Dashboard</a>
                </div>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default AppRouter;
