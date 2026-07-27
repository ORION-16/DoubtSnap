import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import api from '../api/axios';
import { gsap } from '../lib/gsap';
import toast from 'react-hot-toast';
import { Trash2, ChevronDown, FileText, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import AppHeader from '../components/AppHeader';

export default function History() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('doubts');
  const [doubts, setDoubts] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const listRef = useRef(null);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const [doubtsRes, pdfsRes] = await Promise.all([api.get('/doubt/history'), api.get('/pdf/history')]);
      setDoubts(doubtsRes.data); setPdfs(pdfsRes.data);
    } catch { toast.error('Failed to load history'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!loading && listRef.current?.children?.length) {
      gsap.fromTo(listRef.current.children,
        { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out' });
    }
  }, [loading, activeTab]);

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  const handleDeleteDoubt = async (id, e) => {
    e.stopPropagation();
    const prev = [...doubts];
    setDoubts(doubts.filter(d => d._id !== id));
    toast((t) => (
      <div className="flex items-center gap-4">
        <span>Deleted</span>
        <button onClick={() => { toast.dismiss(t.id); setDoubts(prev); }} className="text-[var(--color-rust)] font-medium hover:underline">Undo</button>
      </div>
    ), { duration: 4000 });
    try { await api.delete(`/doubt/${id}`); }
    catch { setDoubts(prev); toast.error('Failed to delete'); }
  };

  const handleDeletePDF = async (id, e) => {
    e.stopPropagation();
    const prev = [...pdfs];
    setPdfs(pdfs.filter(p => p._id !== id));
    toast((t) => (
      <div className="flex items-center gap-4">
        <span>Deleted</span>
        <button onClick={() => { toast.dismiss(t.id); setPdfs(prev); }} className="text-[var(--color-rust)] font-medium hover:underline">Undo</button>
      </div>
    ), { duration: 4000 });
    try { await api.delete(`/pdf/${id}`); }
    catch { setPdfs(prev); toast.error('Failed to delete'); }
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col selection:bg-[var(--color-rust)] selection:text-white">
      <AppHeader />

      <main className="flex-1 w-full max-w-[900px] mx-auto px-6 lg:px-0 py-10">
        {/* Title & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[var(--color-ink)] mb-1">History</h1>
            <p className="text-[var(--color-pencil)] text-sm">Your past doubts and document uploads.</p>
          </div>
          <div className="flex p-1 bg-[var(--color-paper-dark)] border border-[var(--color-eraser)] w-fit">
            {['doubts', 'pdfs'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-[var(--color-ink)] text-[var(--color-paper)]'
                    : 'text-[var(--color-pencil)] hover:text-[var(--color-ink)]'
                }`}>
                {tab === 'doubts' ? `Doubts (${doubts.length})` : `PDFs (${pdfs.length})`}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-[var(--color-rust)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div ref={listRef} className="space-y-3">

            {/* DOUBTS — empty */}
            {activeTab === 'doubts' && doubts.length === 0 && (
              <div className="text-center py-24 border border-dashed border-[var(--color-eraser)]">
                <Sparkles className="mx-auto text-[var(--color-eraser)] mb-4" size={40} />
                <p className="text-[var(--color-pencil)]">No doubts asked yet. Go solve something!</p>
              </div>
            )}

            {/* DOUBTS — list */}
            {activeTab === 'doubts' && doubts.map(doubt => (
              <div key={doubt._id} className="bg-[var(--color-cream)] border border-[var(--color-eraser)] overflow-hidden hover:border-[var(--color-pencil)] transition-colors">
                <div className="p-5 cursor-pointer flex justify-between items-start gap-4" onClick={() => toggleExpand(doubt._id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest bg-[var(--color-ink)] text-[var(--color-paper)] px-2 py-0.5">
                        {doubt.response?.subject || 'General'}
                      </span>
                      <span className="text-xs text-[var(--color-pencil)]">{new Date(doubt.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-base font-serif text-[var(--color-ink)] truncate">{doubt.question || 'Image doubt'}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={(e) => handleDeleteDoubt(doubt._id, e)} className="p-1.5 text-[var(--color-eraser)] hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <ChevronDown size={18} className={`text-[var(--color-pencil)] transition-transform duration-200 ${expandedId === doubt._id ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${expandedId === doubt._id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 border-t border-[var(--color-eraser)]">
                      <div className="pt-4 space-y-4">
                        <div>
                          <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-pencil)] mb-1">Concept</div>
                          <p className="font-serif text-[var(--color-ink)]">{doubt.response?.concept}</p>
                        </div>
                        <div>
                          <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-pencil)] mb-1">Explanation</div>
                          <p className="text-sm text-[var(--color-graphite)] leading-relaxed">{doubt.response?.explanation}</p>
                        </div>
                        {doubt.response?.steps?.length > 0 && (
                          <div className="bg-[var(--color-paper-dark)] p-4">
                            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-pencil)] mb-2">Steps</div>
                            <ol className="list-decimal list-inside space-y-1.5 text-sm text-[var(--color-ink)]">
                              {doubt.response.steps.map((step, i) => <li key={i}>{step}</li>)}
                            </ol>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* PDFS — empty */}
            {activeTab === 'pdfs' && pdfs.length === 0 && (
              <div className="text-center py-24 border border-dashed border-[var(--color-eraser)]">
                <FileText className="mx-auto text-[var(--color-eraser)] mb-4" size={40} />
                <p className="text-[var(--color-pencil)]">No PDFs uploaded yet.</p>
              </div>
            )}

            {/* PDFS — list */}
            {activeTab === 'pdfs' && pdfs.map(pdf => (
              <div key={pdf._id}
                className="bg-[var(--color-cream)] border border-[var(--color-eraser)] hover:border-[var(--color-pencil)] transition-colors p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <FileText size={14} className="text-[var(--color-rust)] shrink-0" />
                    <span className="text-xs text-[var(--color-pencil)]">{new Date(pdf.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-base font-serif text-[var(--color-ink)] truncate mb-1">{pdf.filename}</h3>
                  <p className="text-xs text-[var(--color-pencil)] line-clamp-1">{pdf.summary}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                  <button onClick={(e) => handleDeletePDF(pdf._id, e)} className="p-1.5 text-[var(--color-eraser)] hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                  <Button variant="outline" className="!py-2 !px-4 !text-xs flex-1 sm:flex-none"
                    onClick={() => navigate('/pdf', { state: { pdf } })}>
                    {pdf.quizGenerated ? 'Review Quiz' : 'View & Quiz'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
