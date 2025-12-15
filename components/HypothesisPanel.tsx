import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, X, BrainCircuit, ArrowRight, ShieldCheck, ListChecks, Activity, Split, ExternalLink, Globe } from 'lucide-react';
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

  // Typewriter effect for Synthesis
  useEffect(() => {
    if (result?.synthesis) {
        // Clear previous interval if any
        if (synthesisIntervalRef.current) clearInterval(synthesisIntervalRef.current);
        
        setDisplayedSynthesis('');
        let i = 0;
        const text = result.synthesis;
        
        synthesisIntervalRef.current = setInterval(() => {
            if (i < text.length) {
                // Slice is safer than append for maintaining markdown integrity during updates
                setDisplayedSynthesis(text.slice(0, i + 1)); 
                i++;
            } else {
                if (synthesisIntervalRef.current) clearInterval(synthesisIntervalRef.current);
            }
        }, 15); // Typing speed
    } else {
        setDisplayedSynthesis('');
    }

    return () => {
        if (synthesisIntervalRef.current) clearInterval(synthesisIntervalRef.current);
    };
  }, [result]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (evidence.trim()) {
      onAnalyze(evidence);
    }
  };

  return (
    <div className="absolute bottom-6 right-6 w-full max-w-md bg-slate-950/95 backdrop-blur-xl border border-fuchsia-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-20 animate-in slide-in-from-bottom-10 fade-in duration-300 max-h-[80vh]">
      
      {/* Header */}
      <div className="p-4 bg-fuchsia-900/20 border-b border-fuchsia-500/20 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 text-fuchsia-400">
          <BrainCircuit size={20} />
          <h3 className="font-bold tracking-wide text-sm">META-COGNITIVE ENGINE</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 overflow-y-auto custom-scrollbar">
        {!result && !isLoading && (
          <div className="text-gray-400 text-sm mb-4">
            <p className="mb-2">Enter queries for the active domain. Supports <strong>multi-intent</strong> reasoning.</p>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-500">
              <li>"How does X affect Y?" + "What are the alternatives?"</li>
              <li>Analyze bias and confidence</li>
              <li>Synthesize a hypothesis</li>
            </ul>
          </div>
        )}

        {/* Input Form */}
        {!result && !isLoading && (
            <form onSubmit={handleSubmit} className="relative">
            <textarea
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="E.g., What resistance genes are in SE Asia and what are the alternatives to carbapenems?"
                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 resize-none text-sm transition-all"
            />
            <button 
                type="submit" 
                disabled={!evidence.trim()}
                className="absolute bottom-3 right-3 p-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
                <Send size={16} />
            </button>
            </form>
        )}

        {/* Loading State */}
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-fuchsia-900 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-fuchsia-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div className="text-xs text-fuchsia-400 animate-pulse">Decomposing Intents & Reasoning...</div>
            </div>
        )}

        {/* Result Display */}
        {result && (
            <div className="space-y-4">
                {/* Reasoning Trace (Meta-Cognition) */}
                <div className="bg-slate-900/80 border border-white/10 rounded-xl p-3 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase">
                            <ListChecks size={14} /> Reasoning Trace
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${result.reasoning.confidenceScore > 75 ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                            Confidence: {result.reasoning.confidenceScore}%
                        </span>
                    </div>

                    {/* Intents Display */}
                    {result.reasoning.intentsDetected && result.reasoning.intentsDetected.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {result.reasoning.intentsDetected.map((intent, i) => (
                                <span key={i} className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-fuchsia-300 flex items-center gap-1">
                                    <Split size={10} /> {intent}
                                </span>
                            ))}
                        </div>
                    )}
                    
                    <ul className="space-y-2">
                        {result.reasoning.steps.map((step, idx) => (
                            <li key={idx} className="text-[11px] text-gray-300 flex gap-2">
                                <span className="text-blue-500/50">{idx + 1}.</span>
                                {step}
                            </li>
                        ))}
                    </ul>

                    <div className="pt-2 border-t border-white/5">
                        <h5 className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                            <ShieldCheck size={12} /> Bias Check & Critique
                        </h5>
                        <p className="text-[11px] text-gray-400 italic">
                            "{result.reasoning.biasCheck}"
                        </p>
                    </div>
                </div>

                {/* Hypothesis */}
                <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                        <Sparkles size={14} className="text-yellow-400" />
                        Scientific Hypothesis
                    </h4>
                    <p className="text-sm font-medium text-white leading-relaxed">
                        {result.hypothesis}
                    </p>
                </div>

                {/* Synthesis - Enhanced for Readability */}
                <div className="bg-gradient-to-br from-fuchsia-950/40 to-slate-900/40 rounded-xl p-5 border border-fuchsia-500/20 shadow-inner">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-fuchsia-300 uppercase mb-3 tracking-widest border-b border-white/5 pb-2">
                        <Activity size={14} className="text-fuchsia-400" /> Synthesis & Key Takeaways
                    </h4>
                    
                    {/* ReactMarkdown for formatting */}
                    <div className="prose prose-invert prose-sm max-w-none text-xs text-gray-200 leading-relaxed font-light prose-strong:text-fuchsia-300 prose-ul:list-disc prose-li:marker:text-fuchsia-500/50">
                        <ReactMarkdown>{displayedSynthesis}</ReactMarkdown>
                    </div>
                    
                    {!displayedSynthesis && (
                         <span className="flex items-center gap-2 text-[10px] text-gray-500 animate-pulse mt-1">
                            <span className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full"></span> Synthesizing insights...
                         </span>
                    )}
                </div>

                {/* Sources */}
                {result.sources && result.sources.length > 0 && (
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-white/5">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase mb-2">
                      <Globe size={14} /> Grounding Sources
                    </h4>
                    <ul className="space-y-1">
                      {result.sources.map((source, i) => (
                        <li key={i}>
                          <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[10px] text-gray-400 hover:text-sky-300 transition-colors truncate"
                          >
                            <ExternalLink size={10} className="shrink-0" />
                            <span className="truncate">{source.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button 
                    onClick={() => {
                        setEvidence('');
                        onAnalyze(''); 
                    }}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                   <ArrowRight size={14} /> New Query
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default HypothesisPanel;