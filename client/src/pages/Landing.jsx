import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gsap } from '../lib/gsap';
import Button from '../components/Button';
import { Sparkles } from 'lucide-react';
import { ScrollVelocity } from '../components/reactbits/ScrollVelocity';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const headlineRef = useRef(null);
  const textRef = useRef(null);
  const buttonsRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Reveal text elements
    if (headlineRef.current && textRef.current && buttonsRef.current) {
      tl.fromTo(
        [headlineRef.current, textRef.current, buttonsRef.current],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
      );
    }
    
    // Reveal image
    if (imageRef.current) {
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
        '-=1'
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col selection:bg-[var(--color-rust)] selection:text-white overflow-hidden">
      
      {/* ── Navbar ── */}
      <nav className="w-full px-8 py-6 z-50 flex justify-between items-center bg-[var(--color-paper)]">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="DoubtSnap Logo" className="w-8 h-8 rounded-md" />
          <span className="font-sans font-medium text-lg tracking-wide uppercase text-[var(--color-ink)]">DoubtSnap AI</span>
        </div>
        <div className="hidden md:flex gap-6">
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="text-[var(--color-ink)] hover:text-[var(--color-rust)] transition-colors">Go to Dashboard</button>
          ) : (
            <button onClick={() => navigate('/login')} className="text-[var(--color-ink)] hover:text-[var(--color-rust)] transition-colors">Sign In</button>
          )}
        </div>
      </nav>

      {/* ── Main Content Split ── */}
      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1300px] mx-auto px-6 md:px-12 gap-10 lg:gap-16 items-center">
        
        {/* Left Side: Image container with cozy rounded corners and soft shadow */}
        <div className="w-full lg:w-1/2 flex justify-center py-6 lg:py-12">
          <div ref={imageRef} className="w-full max-w-[460px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-[var(--color-rust)]/5 border-4 border-[var(--color-paper)] ring-1 ring-[var(--color-eraser)]">
            <img 
              src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2670&auto=format&fit=crop" 
              alt="Aesthetic study desk with laptop and warm lighting"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* Right Side: Text & CTA */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-[480px] pb-12 lg:pb-0 text-center lg:text-left items-center lg:items-start">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-rust)]/10 text-[var(--color-rust)] text-sm font-medium mb-6">
            <Sparkles size={16} />
            <span>AI-Powered Study Assistant</span>
          </div>

          <h1 
            ref={headlineRef}
            className="text-[3rem] leading-[1.05] md:text-[3.8rem] font-sans font-medium text-[var(--color-ink)] mb-6 tracking-tight"
          >
            Clarity, instantly for every exam.
          </h1>
          
          <p 
            ref={textRef}
            className="text-[var(--color-ink-light)] text-lg md:text-xl leading-relaxed mb-10 opacity-90"
          >
            Explore our collection of AI-powered study tools, designed to elevate your daily learning. Upload lecture PDFs or snap a photo of a doubt for structured explanations.
          </p>
          
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 items-start">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} className="!px-8 !py-3">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate('/register')} className="!px-8 !py-3">
                  Start Studying Free
                </Button>
                <Button variant="outline" onClick={() => navigate('/login')} className="!px-8 !py-3">
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </main>

      {/* ── Scrolling Ticker Banner ── */}
      <div className="border-t border-[var(--color-eraser)] py-4 bg-[var(--color-paper)] mt-auto overflow-hidden whitespace-nowrap flex">
        <ScrollVelocity
          texts={['FREE FOR STUDENTS • UPLOAD LECTURE PDFS • INSTANT DOUBT RESOLUTION • ACE YOUR EXAMS • ']}
          velocity={30}
          className="text-sm font-sans uppercase tracking-widest text-[var(--color-ink-light)] opacity-60 whitespace-nowrap inline-block"
        />
      </div>
    </div>
  );
}
