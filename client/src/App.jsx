import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import PDFPage from './pages/PDF';
import History from './pages/History';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Custom styled Toaster to match Ink & Paper theme */}
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'var(--color-ink)',
              color: 'var(--color-paper)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: { primary: 'var(--color-rust)', secondary: 'var(--color-ink)' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: 'var(--color-ink)' },
            },
          }} 
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pdf" element={<PDFPage />} />
            <Route path="/history" element={<History />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
