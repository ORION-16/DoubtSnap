import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { gsap } from '../lib/gsap';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  useEffect(() => {
    gsap.to(navRef.current, {
      backgroundColor: scrolled ? 'var(--color-paper)' : 'transparent',
      borderBottomColor: scrolled ? 'var(--color-eraser)' : 'transparent',
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [scrolled]);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 transition-all border-b border-transparent py-4 px-6 md:px-12 flex items-center justify-between"
    >
      <Link to="/" className="text-3xl font-serif text-[var(--color-ink)] hover:text-[var(--color-rust)] transition-colors">
        DoubtSnap.
      </Link>
      
      <div className="flex items-center gap-6">
        <Link to="/login" className="text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-rust)] transition-colors">
          Log in
        </Link>
        <Link
          to="/register"
          className="text-sm font-medium bg-[var(--color-ink)] text-[var(--color-cream)] px-5 py-2.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-rust)] transition-colors border border-[var(--color-ink-light)]"
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
}
