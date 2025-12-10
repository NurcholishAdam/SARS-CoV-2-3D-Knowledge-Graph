import React, { useState } from 'react';
import { Send, Sparkles, X, BrainCircuit, ArrowRight } from 'lucide-react';
import { HypothesisResult } from '../types';

interface HypothesisPanelProps {
  onAnalyze: (query: string) => void;
  onClose: () => void;
  result: HypothesisResult | null;
  isLoading: boolean;
}

const HypothesisPanel: React.FC<HypothesisPanelProps> = ({ onAnalyze, onClose, result, isLoading }) => {
  const [evidence, setEvidence] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (evidence.trim()) {
      onAnalyze(evidence);
    }
  };

  return (
    <div className="absolute bottom-6 right-6 w-full max-w-md bg-slate-950/95 backdrop-blur-xl border border-fuchsia-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-20 animate-in slide-in-from-bottom-10 fade-in duration-300">
      
      {/* Header */}
      <div className="p-4 bg-fuchsia-900/20 border-b border-fuchsia-500/20 flex justify-between items-center">
        <div className="flex items-center gap-2 text-fuchsia-400">
          <BrainCircuit size={20} />
          <h3 className="font-bold tracking-wide text-sm">HYPOTHESIS GENERATOR</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {!result && !isLoading && (
          <div className="text-gray-400 text-sm mb-4">
            <p className="mb-2">Enter clinical observations, symptoms, or hypothetical scenarios. The AI will:</p>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-500">
              <li>Analyze your input</li>
              <li>Connect it to the Knowledge Graph</li>
              <li>Visualize the reasoning path</li>
            </ul>
          </div>
        )}

        {/* Input Form */}
        {!result && !isLoading && (
            <form onSubmit={handleSubmit} className="relative">
            <textarea
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="E.g., Patient presents with loss of smell and high fever..."
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
                <div className="text-xs text-fuchsia-400 animate-pulse">Synthesizing connections...</div>
            </div>
        )}

        {/* Result Display */}
        {result && (
            <div className="space-y-4">
                <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-fuchsia-400 uppercase mb-1">Evidence Provided</h4>
                    <p className="text-sm text-gray-300 italic">"{evidence}"</p>
                </div>

                <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                        <Sparkles size={14} className="text-yellow-400" />
                        AI Hypothesis
                    </h4>
                    <p className="text-sm font-medium text-white leading-relaxed">
                        {result.hypothesis}
                    </p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-3 border border-white/5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Synthesis</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                        {result.synthesis}
                    </p>
                </div>

                <button 
                    onClick={() => {
                        setEvidence('');
                        onAnalyze(''); // Hack to reset in parent if needed, but here just UI reset
                    }}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                   <ArrowRight size={14} /> Start New Query
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default HypothesisPanel;