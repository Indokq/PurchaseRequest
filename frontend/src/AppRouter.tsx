import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/utils/queryClient';
import App from './App';
import { PurchaseRequestListPage } from './features/purchase-requests/components/PurchaseRequestListPage';
import { PurchaseRequestDetailPage } from './features/purchase-requests/components/PurchaseRequestDetailPage';

function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<App />} />
          
          {/* Purchase Requests */}
          <Route path="/purchase-requests" element={<PurchaseRequestListPage />} />
          <Route path="/purchase-requests/:id" element={<PurchaseRequestDetailPage />} />
          
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
    </QueryClientProvider>
  );
}

export default AppRouter;
