
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, X, BrainCircuit, ArrowRight, Activity, Globe, Zap, Scale, Network, ShieldCheck, Binary } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { HypothesisResult } from '../types';

interface HypothesisPanelProps {
  onAnalyze: (query: string) => void;
  onClose: () => void;
  result: HypothesisResult | null;
  isLoading: boolean;
}

const HypothesisPanel: React.FC<HypothesisPanelProps> = ({ onAnalyze, onClose, result, isLoading }) => {
  const [evidence, setEvidence] = useState('');
  const [displayedSynthesis, setDisplayedSynthesis] = useState('');
  const synthesisIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (result?.synthesis) {
        if (synthesisIntervalRef.current) clearInterval(synthesisIntervalRef.current);
        setDisplayedSynthesis('');
        let i = 0;
        const text = result.synthesis;
        synthesisIntervalRef.current = setInterval(() => {
            if (i < text.length) {
                setDisplayedSynthesis(text.slice(0, i + 1)); 
                i++;
            } else {
                if (synthesisIntervalRef.current) clearInterval(synthesisIntervalRef.current);
            }
        }, 12);
    } else {
        setDisplayedSynthesis('');
    }
    return () => { if (synthesisIntervalRef.current) clearInterval(synthesisIntervalRef.current); };
  }, [result]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (evidence.trim()) onAnalyze(evidence);
  };

  return (
    <div className="absolute bottom-6 right-6 w-full max-w-lg bg-slate-950/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-20 animate-in slide-in-from-bottom-10 fade-in duration-300 max-h-[85vh]">
      
      {/* Header */}
      <div className="p-4 bg-blue-900/20 border-b border-blue-500/20 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 text-blue-400">
          <BrainCircuit size={20} className="animate-pulse" />
          <h3 className="font-bold tracking-wide text-sm">LORE REASONING ENGINE</h3>
        </div>
        <div className="flex items-center gap-3">
          {result && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${result.lore.compliance.status === 'High' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              <ShieldCheck size={12} /> LORE: {result.lore.compliance.status}
            </div>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 overflow-y-auto custom-scrollbar">
        {!result && !isLoading && (
          <div className="text-gray-400 text-sm mb-4">
            <p className="mb-2">Execute complex scientific queries using the <strong>Laws of Reasoning Framework</strong>.</p>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-500">
              <li>Input Complexity Sampling</li>
              <li>Compute Monotonicity Audit</li>
              <li>Compositional Accuracy Laws</li>
            </ul>
          </div>
        )}

        {/* Input Form */}
        {!result && !isLoading && (
            <form onSubmit={handleSubmit} className="relative">
            <textarea
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="E.g., Compare viral entry mechanisms of B.1.1.7 vs. BA.1 through the lens of air quality-induced inflammation."
                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none text-sm transition-all"
            />
            <button 
                type="submit" 
                disabled={!evidence.trim()}
                className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
                <Send size={16} />
            </button>
            </form>
        )}

        {/* Loading State */}
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-900/30 rounded-full animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <Network size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-ping" />
                </div>
                <div className="text-xs text-blue-400 font-mono tracking-widest animate-pulse uppercase">Auditing Reasoning Laws...</div>
            </div>
        )}

        {/* Result Display */}
        {result && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* LORE Metrics / Complexity Block */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase mb-1">
                            <Binary size={10} className="text-cyan-500" /> Circuit Depth
                        </div>
                        <div className="text-sm font-mono text-cyan-200">{result.lore.complexity.quantumCircuitDepth} Gates</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase mb-1">
                            <Scale size={10} className="text-amber-500" /> Spearman ρ
                        </div>
                        <div className="text-sm font-mono text-amber-200">{result.lore.compliance.spearman.toFixed(3)}</div>
                    </div>
                </div>

                {/* Universal Reasoning Block */}
                <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4 space-y-4 shadow-inner">
                    <div className="flex items-center justify-between border-b border-blue-500/10 pb-2">
                        <h4 className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-widest">
                             Abstract Logic Mapping
                        </h4>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 font-bold uppercase">First Principles</p>
                        <div className="flex flex-wrap gap-1">
                            {result.universalReasoning.firstPrinciples.map((p, i) => (
                                <span key={i} className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/10 italic">
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black/20 p-2 rounded text-[11px] text-blue-100/80 border-l-2 border-blue-500/40">
                        {result.universalReasoning.abstractLogicMapping}
                    </div>
                </div>

                {/* Main Synthesis */}
                <div className="bg-gradient-to-br from-slate-900/80 to-blue-950/20 rounded-xl p-5 border border-white/10 shadow-lg">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-white uppercase mb-3 tracking-widest border-b border-white/5 pb-2">
                        <Activity size={14} className="text-blue-400" /> Synthesis Result
                    </h4>
                    
                    <div className="prose prose-invert prose-sm max-w-none text-xs text-gray-200 leading-relaxed font-light prose-strong:text-blue-300 prose-ul:list-disc prose-li:marker:text-blue-500/50">
                        <ReactMarkdown>{displayedSynthesis}</ReactMarkdown>
                    </div>
                </div>

                {/* Sources */}
                {result.sources && result.sources.length > 0 && (
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-white/5">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase mb-2">
                      <Globe size={14} /> Grounded Sources
                    </h4>
                    <ul className="space-y-1">
                      {result.sources.map((source, i) => (
                        <li key={i}>
                          <a href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] text-gray-400 hover:text-sky-300 transition-colors truncate">
                            <span className="truncate">{source.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button 
                    onClick={() => { setEvidence(''); onAnalyze(''); }}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                   <ArrowRight size={14} /> New Prompt
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default HypothesisPanel;
