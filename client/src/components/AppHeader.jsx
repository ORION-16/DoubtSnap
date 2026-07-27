import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Solve', path: '/dashboard' },
  { label: 'PDF Tools', path: '/pdf' },
  { label: 'History', path: '/history' },
];

export default function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--color-paper)]/80 backdrop-blur-xl border-b border-[var(--color-eraser)]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-16 px-6 lg:px-10">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src="/favicon.svg" alt="DoubtSnap Logo" className="w-8 h-8 rounded-md" />
          <span className="text-[1.4rem] font-serif text-[var(--color-ink)] tracking-tight">
            DoubtSnap.
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  px-4 py-2 text-sm font-medium transition-colors rounded-md
                  ${isActive
                    ? 'text-[var(--color-ink)] bg-[var(--color-paper-dark)]'
                    : 'text-[var(--color-pencil)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-dark)]/60'
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center text-xs font-medium">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <span className="text-sm text-[var(--color-ink)]">{user?.name?.split(' ')[0]}</span>
          </div>
          <button
            onClick={handleLogoutClick}
            className="p-2 rounded-md text-[var(--color-pencil)] hover:text-[var(--color-rust)] hover:bg-[var(--color-paper-dark)] transition-colors"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-[var(--color-ink)] hover:bg-[var(--color-paper-dark)]"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-eraser)] bg-[var(--color-paper)] px-6 pb-4 pt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                className={`block w-full text-left px-4 py-3 text-sm rounded-md mb-1 ${
                  isActive
                    ? 'bg-[var(--color-paper-dark)] text-[var(--color-ink)] font-medium'
                    : 'text-[var(--color-pencil)] hover:bg-[var(--color-paper-dark)]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-ink)]/30 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--color-paper)] border border-[var(--color-eraser)] rounded-[1.5rem] shadow-2xl shadow-[var(--color-ink)]/10 w-full max-w-[340px] p-6 text-center animate-in zoom-in-95 duration-200">
            <h3 className="text-[1.3rem] font-serif font-medium text-[var(--color-ink)] mb-2">Sign out</h3>
            <p className="text-[var(--color-ink-light)] text-sm mb-6 leading-relaxed">Are you sure you want to sign out of DoubtSnap?</p>
            
            <div className="flex gap-3 justify-center">
              <button 
                onClick={cancelLogout}
                className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper-dark)] border border-[var(--color-eraser)] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium bg-[var(--color-rust)] text-white hover:bg-[var(--color-rust-dark)] transition-colors shadow-sm"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
