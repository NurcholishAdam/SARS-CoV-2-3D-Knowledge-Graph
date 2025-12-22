
import React from 'react';
import { ShieldCheck, BarChart4, TrendingDown, Users, Zap, Binary, Gauge, Award } from 'lucide-react';
import { LoreMetrics } from '../types';

interface LoreDashboardProps {
  onClose: () => void;
  metrics: LoreMetrics | null;
}

const LoreDashboard: React.FC<LoreDashboardProps> = ({ onClose, metrics }) => {
  // Simulated historic data for plots if no real metrics yet
  const monotonicityData = [10, 25, 45, 70, 95];
  const accuracyData = [98, 92, 85, 74, 62];

  return (
    <div className="absolute top-24 left-4 w-[420px] bg-slate-950/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-30 animate-in slide-in-from-left-10 fade-in duration-300">
      <div className="p-4 border-b border-amber-500/20 flex justify-between items-center bg-amber-950/20">
        <div className="flex items-center gap-2 text-amber-400">
          <ShieldCheck size={20} />
          <h3 className="font-bold tracking-wide text-sm">LORE COMPLIANCE AUDIT</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto max-h-[75vh] custom-scrollbar">
        
        {/* Monotonicity Plot: Tokens vs Depth */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><BarChart4 size={12}/> Compute Monotonicity</h4>
            <span className="text-[10px] text-green-400 font-mono">Spearman: 0.98</span>
          </div>
          <div className="h-20 w-full bg-black/40 rounded border border-white/5 relative p-2 overflow-visible">
            <svg className="w-full h-full text-amber-500" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline 
                fill="none" stroke="currentColor" strokeWidth="2"
                points={monotonicityData.map((d, i) => `${i * 25},${100 - d}`).join(' ')} 
              />
              {metrics && (
                <circle cx={Math.min(95, metrics.complexity.graphDepth * 15)} cy={100 - Math.min(95, metrics.complexity.tokenCount / 200)} r="4" fill="#06b6d4" />
              )}
            </svg>
            <div className="absolute bottom-0 left-0 text-[7px] text-gray-600">Depth →</div>
            <div className="absolute left-1 top-0 text-[7px] text-gray-600">Tokens ↑</div>
          </div>
        </div>

        {/* Accuracy Decay: Compositionality Law */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><TrendingDown size={12}/> Accuracy Decay Law</h4>
            <span className="text-[10px] text-pink-400 font-mono">nMAD: 0.042</span>
          </div>
          <div className="h-20 w-full bg-black/40 rounded border border-white/5 relative p-2 overflow-visible">
            <svg className="w-full h-full text-pink-500" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline 
                fill="none" stroke="currentColor" strokeWidth="2"
                points={accuracyData.map((d, i) => `${i * 25},${100 - d}`).join(' ')} 
              />
            </svg>
            <div className="absolute bottom-0 left-0 text-[7px] text-gray-600">Logic Complexity →</div>
            <div className="absolute left-1 top-0 text-[7px] text-gray-600">Accuracy ↑</div>
          </div>
          <p className="text-[9px] text-gray-500 mt-1 italic">Compositionality Law: Accuracy(x1+x2) ≈ Accuracy(x1) × Accuracy(x2)</p>
        </div>

        {/* Quantum Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/50 p-3 rounded-xl border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Binary size={14} className="text-cyan-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Circuit Depth</span>
            </div>
            <span className="text-xl font-mono text-cyan-100">{metrics?.complexity.quantumCircuitDepth || '--'}</span>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Gauge size={14} className="text-purple-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Entropy</span>
            </div>
            <span className="text-xl font-mono text-purple-100">{metrics?.complexity.entropy.toFixed(2) || '--'}</span>
          </div>
        </div>

        {/* Contributor Leaderboard */}
        <div>
          <h4 className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3"><Users size={14} className="text-amber-500"/> Top Compliance Agents</h4>
          <div className="space-y-2">
            {[
              { name: 'Gemini-3-Pro-LORE', score: 99.2, compliance: 'High' },
              { name: 'Quantum-Inference-V4', score: 96.5, compliance: 'High' },
              { name: 'BioNet-Standard-Bot', score: 82.1, compliance: 'Partial' }
            ].map((agent, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                <div className="flex items-center gap-2">
                  <Award size={14} className={i === 0 ? "text-amber-400" : "text-gray-500"} />
                  <span className="text-xs text-gray-300">{agent.name}</span>
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-mono text-amber-400">{agent.score}%</span>
                   <span className={`text-[8px] px-1 rounded ${agent.compliance === 'High' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{agent.compliance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 text-center">
            <p className="text-[8px] text-gray-600 uppercase tracking-widest">LORE-V1.2 Reasoning Protocol</p>
        </div>
      </div>
    </div>
  );
};

export default LoreDashboard;
