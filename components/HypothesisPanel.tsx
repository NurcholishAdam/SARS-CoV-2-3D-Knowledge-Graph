
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, X, BrainCircuit, ArrowRight, Activity, Globe, Zap, Scale, Network, ShieldCheck, Binary, Cpu, Workflow, Layers, Radio } from 'lucide-react';
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
  const [activeStage, setActiveStage] = useState<keyof HypothesisResult['reasoning']['quantumStages'] | 'none'>('none');
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
          <h3 className="font-bold tracking-wide text-sm">URM HYBRID FUSION ENGINE</h3>
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
            <p className="mb-2">Execute multi-intent reasoning audited by the <strong>Universal Reasoning Model (URM) Hybrid</strong> architecture.</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-blue-500/5 p-2 rounded border border-blue-500/10">
                    <span className="block text-[10px] font-bold text-blue-400 uppercase mb-1">Local Graph</span>
                    <span className="text-[9px] text-gray-500">Ontological Grounding & Paths</span>
                </div>
                <div className="bg-amber-500/5 p-2 rounded border border-amber-500/10">
                    <span className="block text-[10px] font-bold text-amber-400 uppercase mb-1">Global Search</span>
                    <span className="text-[9px] text-gray-500">Real-time Literature & Facts</span>
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
                <div className="text-xs text-blue-400 font-mono tracking-widest animate-pulse uppercase">Bridging URM Hybrid Logic...</div>
            </div>
        )}

        {/* Result Display */}
        {result && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* URM Hybrid Reasoning Stages */}
                <div className="grid grid-cols-5 gap-1 mb-2">
                    {Object.keys(result.reasoning.quantumStages).map((stage) => (
                        <button
                            key={stage}
                            onClick={() => setActiveStage(stage as any)}
                            className={`p-2 rounded-lg border transition-all flex flex-col items-center gap-1 ${activeStage === stage ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}
                            title={stage.charAt(0).toUpperCase() + stage.slice(1)}
                        >
                            <Radio size={12} className={activeStage === stage ? 'animate-pulse' : ''} />
                            <span className="text-[8px] font-bold uppercase">{stage.slice(0, 4)}</span>
                        </button>
                    ))}
                </div>

                {activeStage !== 'none' && (
                    <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-lg p-3 animate-in slide-in-from-top-2 duration-300">
                        <span className="block text-[9px] font-bold text-indigo-400 uppercase mb-1">{activeStage} Process</span>
                        <p className="text-[10px] text-gray-300 leading-tight italic">
                            {result.reasoning.quantumStages[activeStage as keyof typeof result.reasoning.quantumStages]}
                        </p>
                    </div>
                )}

                {/* Architecture Bridge */}
                <div className="bg-slate-900/80 border border-indigo-500/30 rounded-xl p-4 shadow-xl relative overflow-hidden">
                    <h4 className="flex items-center gap-2 text-[10px] font-bold text-indigo-300 uppercase mb-3 tracking-[0.2em]">
                         <Layers size={14} className="text-indigo-400" /> Hybrid Logic Bridge
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                        <p className="text-[11px] text-indigo-100 leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5 italic">
                            "{result.architectureBridge.urmHybridLogic}"
                        </p>
                    </div>
                </div>

                {/* Synthesis */}
                <div className="bg-gradient-to-br from-slate-900/80 to-blue-950/20 rounded-xl p-5 border border-white/10 shadow-lg">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-white uppercase mb-3 tracking-widest border-b border-white/5 pb-2">
                        <Activity size={14} className="text-blue-400" /> Hybrid Synthesis
                    </h4>
                    <div className="prose prose-invert prose-sm max-w-none text-xs text-gray-200 leading-relaxed font-light prose-strong:text-blue-300">
                        <ReactMarkdown>{displayedSynthesis}</ReactMarkdown>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase mb-1">
                            <Binary size={10} className="text-cyan-500" /> LORE Audit
                        </div>
                        <div className="text-[10px] font-mono text-cyan-200">{result.lore.laws.compositionalityScore.toFixed(2)} Comp. Score</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase mb-1">
                            <Scale size={10} className="text-amber-500" /> Certainty
                        </div>
                        <div className="text-sm font-mono text-amber-200">{(result.universalReasoning.certaintyScore * 100).toFixed(1)}%</div>
                    </div>
                </div>

                {/* Sources */}
                {result.sources && result.sources.length > 0 && (
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="block text-[9px] font-bold text-gray-500 uppercase mb-2">Grounding Signals</span>
                    <div className="flex flex-wrap gap-2">
                      {result.sources.map((s, idx) => (
                        <a key={idx} href={s.uri} target="_blank" rel="noreferrer" className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/20 transition-all border border-blue-500/20">
                          {s.title.slice(0, 20)}...
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                    onClick={() => { setEvidence(''); onAnalyze(''); }}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                   <ArrowRight size={14} /> New Hybrid Inference
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default HypothesisPanel;
