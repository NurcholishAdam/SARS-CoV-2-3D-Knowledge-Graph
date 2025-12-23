
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, X, BrainCircuit, ArrowRight, Activity, Globe, Zap, Scale, Network, ShieldCheck, Binary, Cpu, Workflow } from 'lucide-react';
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
          <h3 className="font-bold tracking-wide text-sm">LORE-UR FUSION ENGINE</h3>
        </div>
        <div className="flex items-center gap-3">
          {result && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${result.lore.compliance.status === 'High' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              <ShieldCheck size={12} /> LORE-Verified
            </div>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 overflow-y-auto custom-scrollbar space-y-4">
        {!result && !isLoading && (
          <div className="text-gray-400 text-sm mb-4">
            <p className="mb-2">Execute multi-intent reasoning audited by the <strong>Laws of Reasoning (LORE)</strong> and <strong>Universal Reasoning (UR)</strong> architecture.</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-blue-500/5 p-2 rounded border border-blue-500/10">
                    <span className="block text-[10px] font-bold text-blue-400 uppercase mb-1">Universal (UR)</span>
                    <span className="text-[9px] text-gray-500">First Principles & Cross-Domain Synergy</span>
                </div>
                <div className="bg-amber-500/5 p-2 rounded border border-amber-500/10">
                    <span className="block text-[10px] font-bold text-amber-400 uppercase mb-1">Laws (LORE)</span>
                    <span className="text-[9px] text-gray-500">Compositionality & Monotonicity Audits</span>
                </div>
            </div>
          </div>
        )}

        {/* Input Form */}
        {!result && !isLoading && (
            <form onSubmit={handleSubmit} className="relative">
            <textarea
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="State your evidence or inquiry..."
                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-none text-sm transition-all"
            />
            <button 
                type="submit" 
                disabled={!evidence.trim()}
                className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-lg"
            >
                <Send size={16} />
            </button>
            </form>
        )}

        {/* Loading State */}
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Workflow size={32} className="text-blue-500 animate-spin" />
                <div className="text-xs text-blue-400 font-mono tracking-widest animate-pulse uppercase">Synthesizing Laws & Principles...</div>
            </div>
        )}

        {/* Result Display */}
        {result && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Architecture Bridge: The Unified Artifact */}
                <div className="bg-slate-900/80 border border-indigo-500/30 rounded-xl p-4 shadow-xl overflow-hidden relative">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
                    <h4 className="flex items-center gap-2 text-[10px] font-bold text-indigo-300 uppercase mb-3 tracking-[0.2em]">
                         <Cpu size={14} className="text-indigo-400" /> Architecture Blueprint
                    </h4>
                    <div className="grid grid-cols-1 gap-3 relative">
                        <div className="bg-white/5 p-3 rounded-lg border-l-2 border-indigo-500">
                            <span className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Logic-to-Law Mapping</span>
                            <p className="text-[11px] text-indigo-100 leading-relaxed italic">
                                "{result.architectureBridge.coreSynthesis}"
                            </p>
                        </div>
                        <div className="flex gap-2">
                             <div className="flex-1 bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="block text-[8px] text-gray-500 uppercase font-bold">Critical Law</span>
                                <span className="text-[10px] text-amber-300">{result.architectureBridge.lawAlignment}</span>
                             </div>
                             <div className="flex-1 bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="block text-[8px] text-gray-500 uppercase font-bold">Scaling Impact</span>
                                <span className="text-[10px] text-cyan-300">{result.architectureBridge.universalImpact}</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Main Synthesis */}
                <div className="bg-gradient-to-br from-slate-900/80 to-blue-950/20 rounded-xl p-5 border border-white/10 shadow-lg">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-white uppercase mb-3 tracking-widest border-b border-white/5 pb-2">
                        <Activity size={14} className="text-blue-400" /> Evidence Synthesis
                    </h4>
                    <div className="prose prose-invert prose-sm max-w-none text-xs text-gray-200 leading-relaxed font-light prose-strong:text-blue-300">
                        <ReactMarkdown>{displayedSynthesis}</ReactMarkdown>
                    </div>
                </div>

                {/* Metrics / Law Audit Block */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase mb-1">
                            <Binary size={10} className="text-cyan-500" /> Circuit Depth
                        </div>
                        <div className="text-sm font-mono text-cyan-200">{result.lore.complexity.quantumCircuitDepth} Gates</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase mb-1">
                            <Scale size={10} className="text-amber-500" /> Certainty
                        </div>
                        <div className="text-sm font-mono text-amber-200">{(result.universalReasoning.certaintyScore * 100).toFixed(1)}%</div>
                    </div>
                </div>

                <button 
                    onClick={() => { setEvidence(''); onAnalyze(''); }}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                   <ArrowRight size={14} /> Reset Inference Cycle
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default HypothesisPanel;
