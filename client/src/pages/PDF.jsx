import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { gsap } from '../lib/gsap';
import toast from 'react-hot-toast';
import { Upload, FileText, Loader2, CheckCircle2, XCircle, BrainCircuit } from 'lucide-react';
import Button from '../components/Button';
import AppHeader from '../components/AppHeader';

export default function PDFPage() {
  const location = useLocation();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const [pdfData, setPdfData] = useState(location.state?.pdf || null);

  const [quizLoading, setQuizLoading] = useState(false);
  const [quiz, setQuiz] = useState(location.state?.pdf?.quiz || []);
  const [quizGenerated, setQuizGenerated] = useState(location.state?.pdf?.quizGenerated || false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const summaryRef = useRef(null);
  const quizRef = useRef(null);
  const optionsRef = useRef([]);

  /* ── Drag & Drop ── */
  const handleDragOver = (e) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragActive(false); };
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileSelection(e.dataTransfer.files[0]);
  };
  const handleFileInput = (e) => { if (e.target.files?.[0]) handleFileSelection(e.target.files[0]); };
  const handleFileSelection = (f) => {
    if (f.type !== 'application/pdf') { toast.error('Please upload a PDF file'); return; }
    setFile(f);
  };

  /* ── Upload ── */
  const handleUpload = async (e) => {
    e.preventDefault(); if (!file) return;
    setLoading(true); setPdfData(null); setQuiz([]); setQuizGenerated(false);
    const formData = new FormData(); formData.append('pdf', file);
    try {
      const { data } = await api.post('/pdf/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setPdfData(data); setFile(null);
    } catch (err) {
      if (err.response?.status === 429) toast.error("Rate limited — wait a moment.", { duration: 5000 });
      else toast.error(err.response?.data?.message || 'Failed to upload PDF');
    } finally { setLoading(false); }
  };

  /* ── Quiz generation ── */
  const generateQuiz = async () => {
    if (!pdfData) return; setQuizLoading(true);
    try {
      const { data } = await api.post(`/pdf/${pdfData._id}/quiz`);
      setQuiz(data.quiz); setQuizGenerated(true);
      setCurrentQuestionIdx(0); setAnswers({}); setQuizCompleted(false);
      setTimeout(() => {
        if (quizRef.current) gsap.fromTo(quizRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
      }, 100);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to generate quiz'); }
    finally { setQuizLoading(false); }
  };

  useEffect(() => {
    if (pdfData && summaryRef.current) {
      gsap.fromTo(summaryRef.current.children,
        { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' });
    }
  }, [pdfData]);

  const handleAnswerSelect = (option) => {
    if (answers[currentQuestionIdx]) return;
    const isCorrect = option === quiz[currentQuestionIdx].answer;
    setAnswers(prev => ({ ...prev, [currentQuestionIdx]: { selected: option, isCorrect } }));
    setTimeout(() => {
      if (currentQuestionIdx < quiz.length - 1) setCurrentQuestionIdx(prev => prev + 1);
      else setQuizCompleted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col selection:bg-[var(--color-rust)] selection:text-white">
      <AppHeader />

      <main className="flex-1 w-full max-w-[900px] mx-auto px-6 lg:px-0 py-10 flex flex-col gap-10">

        {/* ── Upload zone ── */}
        {!pdfData && !loading && (
          <section className="py-8 md:py-16">
            <div className="mb-10">
              <h1 className="text-3xl md:text-5xl font-serif text-[var(--color-ink)] mb-3">Upload a PDF</h1>
              <p className="text-[var(--color-graphite)] text-base md:text-lg max-w-lg">
                Drop your lecture notes, textbook chapters, or study material. We'll extract the key ideas instantly.
              </p>
            </div>

            <form onSubmit={handleUpload}>
              <div
                className={`border-2 border-dashed p-16 md:p-20 flex flex-col items-center justify-center text-center transition-all duration-200 ${
                  isDragActive
                    ? 'border-[var(--color-rust)] bg-[var(--color-rust)]/5'
                    : 'border-[var(--color-eraser)] hover:border-[var(--color-pencil)] bg-[var(--color-cream)]/50'
                }`}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              >
                <input type="file" accept="application/pdf" onChange={handleFileInput} className="hidden" id="pdf-upload" />

                {file ? (
                  <div className="flex flex-col items-center">
                    <FileText size={40} className="text-[var(--color-rust)] mb-4" />
                    <p className="text-lg font-medium text-[var(--color-ink)] mb-1">{file.name}</p>
                    <p className="text-sm text-[var(--color-pencil)] mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <Button type="submit" disabled={loading}>
                      {loading ? <Loader2 className="animate-spin" /> : 'Process Document'}
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-paper-dark)] flex items-center justify-center mb-5">
                      <Upload size={24} className="text-[var(--color-pencil)]" />
                    </div>
                    <p className="text-lg font-serif text-[var(--color-ink)] mb-2">Drag and drop your PDF here</p>
                    <p className="text-sm text-[var(--color-pencil)]">or click to browse files</p>
                  </label>
                )}
              </div>
            </form>
          </section>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-2 border-[var(--color-eraser)] rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-[var(--color-rust)] rounded-full animate-spin" />
            </div>
            <p className="text-[var(--color-graphite)] font-serif text-lg">Reading document...</p>
          </div>
        )}

        {/* ── Results ── */}
        {pdfData && (
          <div className="space-y-12 pt-4">
            {/* File header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-eraser)]">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-pencil)] mb-1">Document Analysis</div>
                <h1 className="text-2xl md:text-3xl font-serif text-[var(--color-ink)]">{pdfData.filename}</h1>
              </div>
              <button onClick={() => { setPdfData(null); setFile(null); setQuiz([]); setQuizGenerated(false); }}
                className="text-sm text-[var(--color-rust)] font-medium hover:underline underline-offset-4 shrink-0">
                Upload another
              </button>
            </div>

            {/* Summary & Key Points */}
            <div ref={summaryRef} className="space-y-10">
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--color-pencil)] mb-4">Summary</h2>
                <p className="text-[var(--color-graphite)] text-base md:text-lg leading-[1.8]">{pdfData.summary}</p>
              </div>
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--color-pencil)] mb-5">Key Points</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pdfData.keyPoints?.map((point, i) => (
                    <div key={i} className="flex gap-3 p-4 bg-[var(--color-paper-dark)] border border-[var(--color-eraser)]">
                      <span className="text-sm font-mono text-[var(--color-rust)] shrink-0 pt-0.5">{(i+1).toString().padStart(2, '0')}</span>
                      <span className="text-sm text-[var(--color-ink)] leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quiz section */}
            <section className="bg-[var(--color-ink)] text-[var(--color-paper)] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(245,240,232,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(245,240,232,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              <div className="relative z-10">
                {!quizGenerated ? (
                  <div className="text-center py-6">
                    <BrainCircuit size={36} className="mx-auto text-[var(--color-rust)] mb-5" />
                    <h2 className="text-2xl md:text-3xl font-serif mb-3">Test your knowledge</h2>
                    <p className="text-[var(--color-pencil)] mb-8 max-w-md mx-auto text-sm leading-relaxed">
                      Generate a 5-question quiz based on this document to check your understanding.
                    </p>
                    <Button variant="primary" onClick={generateQuiz} disabled={quizLoading}>
                      {quizLoading ? <Loader2 className="animate-spin" /> : 'Generate Quiz'}
                    </Button>
                  </div>
                ) : (
                  <div ref={quizRef}>
                    {quizCompleted ? (
                      <div className="text-center py-10">
                        <div className="text-5xl font-serif text-[var(--color-rust-light)] mb-3">
                          {Object.values(answers).filter(a => a.isCorrect).length} / {quiz.length}
                        </div>
                        <h3 className="text-xl font-serif mb-2">Quiz complete</h3>
                        <p className="text-[var(--color-pencil)] text-sm">Well done. Review your results above.</p>
                      </div>
                    ) : (
                      <div className="max-w-2xl mx-auto">
                        <div className="flex justify-between items-center mb-6 text-xs font-mono text-[var(--color-pencil)] pb-3 border-b border-[var(--color-ink-light)]">
                          <span>Question {currentQuestionIdx + 1} / {quiz.length}</span>
                          <span>Score: {Object.values(answers).filter(a => a.isCorrect).length}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-serif leading-snug mb-8">{quiz[currentQuestionIdx]?.question}</h3>
                        <div className="space-y-2">
                          {quiz[currentQuestionIdx]?.options?.map((option, i) => {
                            const answered = answers[currentQuestionIdx];
                            const isSelected = answered?.selected === option;
                            const isCorrect = option === quiz[currentQuestionIdx].answer;
                            let style = 'border-[var(--color-ink-light)] hover:border-[var(--color-pencil)]';
                            let icon = null;
                            if (answered) {
                              if (isSelected && isCorrect) { style = 'border-green-500 bg-green-500/10'; icon = <CheckCircle2 size={18} className="text-green-400" />; }
                              else if (isSelected && !isCorrect) { style = 'border-red-500 bg-red-500/10'; icon = <XCircle size={18} className="text-red-400" />; }
                              else if (isCorrect) { style = 'border-green-500/40'; }
                              else { style = 'border-[var(--color-ink-light)] opacity-50'; }
                            }
                            return (
                              <button key={i} ref={el => optionsRef.current[i] = el}
                                onClick={() => handleAnswerSelect(option)} disabled={!!answered}
                                className={`w-full text-left p-4 border transition-all duration-200 flex justify-between items-center ${style}`}>
                                <span className="text-[15px]">{option}</span>
                                {icon}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
