import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register');
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
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-ink)] mb-2">Join us.</h1>
          <p className="text-[var(--color-graphite)] mb-10">Stop guessing. Start understanding.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[var(--color-pencil)] uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-3 bg-transparent border-b-2 border-[var(--color-eraser)] focus:outline-none focus:border-[var(--color-rust)] transition-colors text-xl font-serif text-[var(--color-ink)] placeholder-[var(--color-eraser)]"
                placeholder="Jane Doe"
              />
            </div>
            
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
              <label className="block text-sm font-medium text-[var(--color-pencil)] uppercase tracking-widest">Password</label>
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
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-graphite)]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[var(--color-ink)] hover:text-[var(--color-rust)] underline decoration-[var(--color-eraser)] underline-offset-4 transition-all">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT: Visual Section */}
      <div className="hidden lg:flex w-1/2 bg-[var(--color-ink)] text-[var(--color-paper)] p-12 relative flex-col justify-between overflow-hidden">
        {/* Soft radial gradient mask over a grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,240,232,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,240,232,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none mask-image-radial" style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }}></div>
        
        <div className="relative z-10 max-w-xl mt-auto mb-12">
          <div className="mb-8">
             <div className="text-xs uppercase tracking-widest text-[var(--color-pencil)] font-medium mb-3">The Process</div>
             <div className="text-3xl font-serif leading-tight">Upload PDFs. Ask questions. Ace exams.</div>
          </div>
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[var(--color-ink-light)]">
             <div>
                <div className="text-3xl font-serif text-[var(--color-rust-light)] mb-2">100%</div>
                <div className="text-sm text-[var(--color-pencil)]">Structured AI explanations</div>
             </div>
             <div>
                <div className="text-3xl font-serif text-[var(--color-rust-light)] mb-2">∞</div>
                <div className="text-sm text-[var(--color-pencil)]">Topics supported globally</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
