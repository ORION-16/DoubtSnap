import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { gsap } from '../lib/gsap';
import toast from 'react-hot-toast';
import { Camera, Send, Loader2, Sparkles, BookOpen, FileText } from 'lucide-react';
import Button from '../components/Button';
import AppHeader from '../components/AppHeader';

export default function Dashboard() {
  const { user } = useAuth();

  const [question, setQuestion] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const responseContainerRef = useRef(null);
  const badgeRef = useRef(null);
  const conceptRef = useRef(null);
  const explanationRef = useRef(null);
  const stepsRef = useRef(null);
  const resourcesRef = useRef(null);

  /* ── Image handlers ── */
  const handleDragOver = (e) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragActive(false); };
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragActive(false);
    if (e.dataTransfer.files?.[0]) handleImageSelection(e.dataTransfer.files[0]);
  };
  const handleFileInput = (e) => {
    if (e.target.files?.[0]) handleImageSelection(e.target.files[0]);
  };

  const handleImageSelection = (file) => {
    if (!file.type.startsWith('image/')) { toast.error('Please select a valid image'); return; }
    setPreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = (e) => setImage({ base64: e.target.result.split(',')[1], mimeType: file.type });
    reader.readAsDataURL(file);
  };

  const clearImage = () => { setImage(null); setPreview(null); };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() && !image) { toast.error('Ask a question or upload an image'); return; }
    setLoading(true); setResponse(null);
    try {
      const payload = { question: question.trim() };
      if (image) { payload.imageBase64 = image.base64; payload.mimeType = image.mimeType; }
      const { data } = await api.post('/doubt/solve', payload);
      setResponse(data.response);
      setQuestion(''); clearImage();
    } catch (err) {
      if (err.response?.status === 429) toast.error("Rate limited — wait a moment and try again.", { duration: 5000 });
      else toast.error(err.response?.data?.message || 'Failed to resolve doubt');
    } finally { setLoading(false); }
  };

  /* ── GSAP response reveal ── */
  useEffect(() => {
    if (response && responseContainerRef.current) {
      const els = [badgeRef, conceptRef, explanationRef, stepsRef, resourcesRef].map(r => r.current).filter(Boolean);
      gsap.timeline().fromTo(els,
        { opacity: 0, y: 30, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.15, ease: 'power3.out' }
      );
    }
  }, [response]);

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col selection:bg-[var(--color-rust)] selection:text-white">
      <AppHeader />

      <main className="flex-1 w-full max-w-[900px] mx-auto px-6 lg:px-0 py-10 flex flex-col gap-10">

        {/* ── Welcome headline (only when no response is showing) ── */}
        {!response && !loading && (
          <div className="pt-6 md:pt-12">
            <h1 className="text-3xl md:text-5xl font-serif text-[var(--color-ink)] leading-tight mb-3">
              Hey {user?.name?.split(' ')[0] || 'there'}, <br className="hidden md:block" />
              <span className="text-[var(--color-pencil)]">what are you studying?</span>
            </h1>
            <p className="text-[var(--color-graphite)] text-base md:text-lg max-w-xl">
              Type a question, paste an image, or describe what you're stuck on. I'll break it down step by step.
            </p>
          </div>
        )}

        {/* ── Input card ── */}
        <section className="w-full">
          <form onSubmit={handleSubmit} className="bg-[var(--color-cream)] border border-[var(--color-eraser)] overflow-hidden transition-all focus-within:border-[var(--color-rust)]/40 focus-within:shadow-[0_0_0_3px_rgba(196,72,42,0.08)]">
            <div className="px-5 pt-5 pb-3">
              <label htmlFor="doubt-input" className="sr-only">Ask your doubt</label>
              <textarea
                id="doubt-input"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What are you struggling to understand?"
                rows={4}
                className="w-full bg-transparent text-lg md:text-xl font-serif text-[var(--color-ink)] placeholder-[var(--color-eraser)] resize-none focus:outline-none leading-relaxed"
              />
            </div>

            {/* Image preview */}
            {preview && (
              <div className="px-5 pb-3">
                <div className="relative inline-block">
                  <img src={preview} alt="Upload preview" className="h-28 rounded border border-[var(--color-eraser)] bg-white object-contain" />
                  <button type="button" onClick={clearImage}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-ink)] text-white rounded-full flex items-center justify-center text-[10px] hover:bg-[var(--color-rust)] transition-colors">
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Bottom toolbar */}
            <div className="flex items-center justify-between px-5 py-3 bg-[var(--color-paper-dark)]/60 border-t border-[var(--color-eraser)]">
              <div
                className={`relative overflow-hidden flex items-center gap-2 px-3 py-2 cursor-pointer border border-dashed transition-colors rounded ${isDragActive ? 'border-[var(--color-rust)] bg-[var(--color-rust)]/5' : 'border-[var(--color-eraser)] hover:border-[var(--color-pencil)]'}`}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              >
                <input type="file" accept="image/*" onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <Camera size={16} className="text-[var(--color-pencil)]" />
                <span className="text-sm text-[var(--color-pencil)] hidden sm:inline">Attach Image</span>
              </div>

              <Button type="submit" disabled={loading} className="!py-2.5 !px-5 !text-sm gap-2">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} /> Resolve</>}
              </Button>
            </div>
          </form>
        </section>

        {/* ── Quick action cards (only when empty state) ── */}
        {!response && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Sparkles, title: 'Ask anything', desc: 'Math, physics, code, history — any subject.' },
              { icon: Camera, title: 'Snap a photo', desc: 'Take a picture of your textbook or whiteboard.' },
              { icon: FileText, title: 'Upload a PDF', desc: 'Get summaries & quizzes from lecture notes.', link: '/pdf' },
            ].map((card, i) => (
              <button
                key={i}
                onClick={card.link ? () => window.location.href = card.link : undefined}
                className="text-left p-5 bg-[var(--color-paper-dark)]/50 border border-[var(--color-eraser)] hover:border-[var(--color-pencil)] transition-colors group"
              >
                <card.icon size={20} className="text-[var(--color-rust)] mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-medium text-[var(--color-ink)] mb-1">{card.title}</div>
                <div className="text-xs text-[var(--color-pencil)] leading-relaxed">{card.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* ── Loading state ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-2 border-[var(--color-eraser)] rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-[var(--color-rust)] rounded-full animate-spin" />
            </div>
            <p className="text-[var(--color-graphite)] font-serif text-lg">Thinking...</p>
          </div>
        )}

        {/* ── AI Response ── */}
        {response && (
          <section ref={responseContainerRef} className="space-y-8">
            {/* Subject badge */}
            <div ref={badgeRef}>
              <span className="inline-block px-3 py-1 bg-[var(--color-ink)] text-[var(--color-paper)] text-[11px] font-mono uppercase tracking-widest">
                {response.subject}
              </span>
            </div>

            {/* Concept */}
            <div ref={conceptRef}>
              <h2 className="text-2xl md:text-4xl font-serif text-[var(--color-ink)] leading-snug border-l-[3px] border-[var(--color-rust)] pl-5">
                {response.concept}
              </h2>
            </div>

            {/* Explanation */}
            <div ref={explanationRef}>
              <p className="text-[var(--color-graphite)] text-base md:text-lg leading-[1.8]">
                {response.explanation}
              </p>
            </div>

            {/* Steps */}
            {response.steps?.length > 0 && (
              <div ref={stepsRef} className="space-y-3">
                <h3 className="text-xs font-mono text-[var(--color-pencil)] uppercase tracking-widest mb-4">
                  Step-by-step breakdown
                </h3>
                {response.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start p-5 bg-[var(--color-paper-dark)] border border-[var(--color-eraser)]">
                    <span className="text-lg font-serif text-[var(--color-rust)] opacity-60 shrink-0 leading-none pt-0.5">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="text-[var(--color-ink)] leading-relaxed text-[15px]">{step}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Resources */}
            {response.resources?.length > 0 && (
              <div ref={resourcesRef} className="pt-6 border-t border-[var(--color-eraser)]">
                <h3 className="text-xs font-mono text-[var(--color-pencil)] uppercase tracking-widest mb-4">Study next</h3>
                <div className="flex flex-wrap gap-2">
                  {response.resources.map((res, i) => (
                    <span key={i} className="px-3 py-1.5 border border-[var(--color-eraser)] text-[var(--color-ink)] text-sm hover:border-[var(--color-ink)] transition-colors">
                      {res}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ask another */}
            <div className="pt-4">
              <button
                onClick={() => { setResponse(null); document.getElementById('doubt-input')?.focus(); }}
                className="text-sm text-[var(--color-rust)] font-medium hover:underline underline-offset-4"
              >
                ← Ask another question
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
