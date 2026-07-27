import { Link } from 'react-router';
import Button from '../components/Button';
import Navbar from '../components/Navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-8xl md:text-[10rem] font-serif text-[var(--color-ink)] mb-4">404</h1>
        <p className="text-2xl font-serif text-[var(--color-rust)] mb-8">Page not found.</p>
        <p className="text-[var(--color-graphite)] max-w-md mx-auto mb-12">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
