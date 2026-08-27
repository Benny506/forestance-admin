import { Routes, Route, Navigate } from 'react-router-dom';
import { UIProvider } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { GlobalLoader } from './components/ui/GlobalLoader';
import { ToastContainer } from './components/ui/ToastContainer';
import { AdminLayout } from './components/layout/AdminLayout';
import { LoginScreen } from './pages/LoginScreen';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { InquiriesScreen } from './pages/InquiriesScreen';
import { NewsletterScreen } from './pages/NewsletterScreen';

function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <DashboardProvider>
          <Routes>
            <Route path="/login" element={<LoginScreen />} />

            <Route path="/" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                {/* Default route is now Inquiries */}
                <Route index element={<Navigate to="/inquiries" replace />} />
                <Route path="inquiries" element={<InquiriesScreen />} />
                <Route path="newsletter" element={<NewsletterScreen />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <GlobalLoader />
          <ToastContainer />
        </DashboardProvider>
      </AuthProvider>
    </UIProvider>
  );
}

export default App;
