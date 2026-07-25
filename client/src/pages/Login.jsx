import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex selection:bg-[var(--color-rust)] selection:text-white">
      {/* LEFT: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 bg-[var(--color-paper)] relative z-10">
        <div className="absolute top-8 left-8 sm:left-12">
          <Link to="/" className="text-2xl font-serif text-[var(--color-ink)] hover:text-[var(--color-rust)] transition-colors">
            DoubtSnap.
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto mt-12 lg:mt-0">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-ink)] mb-2">Welcome back.</h1>
          <p className="text-[var(--color-graphite)] mb-10">Pick up exactly where you left off.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[var(--color-pencil)] uppercase tracking-widest">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 bg-transparent border-b-2 border-[var(--color-eraser)] focus:outline-none focus:border-[var(--color-rust)] transition-colors text-xl font-serif text-[var(--color-ink)] placeholder-[var(--color-eraser)]"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-[var(--color-pencil)] uppercase tracking-widest">Password</label>
                <Link to="#" className="text-xs text-[var(--color-pencil)] hover:text-[var(--color-rust)] uppercase tracking-widest">Forgot password?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 bg-transparent border-b-2 border-[var(--color-eraser)] focus:outline-none focus:border-[var(--color-rust)] transition-colors text-xl font-serif text-[var(--color-ink)] placeholder-[var(--color-eraser)]"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full !py-4 mt-8"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-graphite)]">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-[var(--color-ink)] hover:text-[var(--color-rust)] underline decoration-[var(--color-eraser)] underline-offset-4 transition-all">
              Create one now
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT: Visual Section */}
      <div className="hidden lg:flex w-1/2 bg-[var(--color-ink)] text-[var(--color-paper)] p-12 relative flex-col justify-between overflow-hidden">
        {/* Soft radial gradient mask over a grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,240,232,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,240,232,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none mask-image-radial" style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }}></div>
        
        <div className="relative z-10 max-w-xl mt-auto mb-12">
          <blockquote className="text-4xl font-serif leading-tight mb-6 text-[var(--color-paper)]">
            "DoubtSnap didn't just give me the answers. It actually taught me how to solve the problems."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-rust)] flex items-center justify-center text-lg font-serif">S</div>
            <div>
              <div className="font-medium">Sarah Jenkins</div>
              <div className="text-sm text-[var(--color-pencil)]">Computer Science Major</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
