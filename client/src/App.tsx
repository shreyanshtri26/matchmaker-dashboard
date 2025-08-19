import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import MatchSuggestions from './pages/MatchSuggestions';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <ProtectedRoute redirectIfAuthenticated>
                <Login />
              </ProtectedRoute>
            } />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customers" element={<CustomerList />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="matches" element={<MatchSuggestions />} />
              <Route path="settings" element={<Settings />} />
              
              {/* Admin only routes */}
              <Route path="admin" element={
                <ProtectedRoute requiredRole="admin">
                  <div className="p-6">
                    <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                  </div>
                </ProtectedRoute>
              } />
              
              {/* 404 - Keep as last route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'bg-white border border-gray-200 text-gray-900',
        }}
      />
    </div>
  );
}

export default App;