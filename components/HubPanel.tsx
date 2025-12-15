
import React, { useState } from 'react';
import { X, GitPullRequest, CheckCircle, AlertTriangle, Loader2, Globe, ExternalLink, ShieldAlert } from 'lucide-react';
import { NodeType, HubProposal, GraphDomain } from '../types';
import { validateProposal } from '../services/gemini';

interface HubPanelProps {
  onClose: () => void;
  onApproveProposal: (proposal: HubProposal) => void;
  currentDomain: GraphDomain;
}

const HubPanel: React.FC<HubPanelProps> = ({ onClose, onApproveProposal, currentDomain }) => {
  const [formData, setFormData] = useState({ label: '', type: NodeType.VARIANT, description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProposal, setActiveProposal] = useState<HubProposal | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.label || !formData.description) return;

      setIsSubmitting(true);
      const tempId = `Prop-${Date.now()}`;
      
      // AI Validation Step
      const validation = await validateProposal({
          label: formData.label,
          type: formData.type,
          description: formData.description
      }, currentDomain);

      const newProposal: HubProposal = {
          id: tempId,
          nodeLabel: validation.refinedNode ? validation.refinedNode.label : formData.label,
          nodeType: formData.type as NodeType,
          description: validation.refinedNode ? validation.refinedNode.description : formData.description,
          status: validation.approved ? 'approved' : 'rejected',
          aiCritique: validation.critique,
          sources: validation.sources,
          provenanceScore: validation.provenanceScore
      };

      setActiveProposal(newProposal);
      setIsSubmitting(false);

      if (validation.approved) {
          onApproveProposal(newProposal);
      }
  };

  return (
    <div className="absolute top-0 left-0 h-full w-full md:w-[400px] bg-slate-950/95 backdrop-blur-xl border-r border-white/10 shadow-2xl transition-transform duration-300 overflow-hidden flex flex-col z-20 animate-in slide-in-from-left-10 fade-in">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-green-900/10">
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-green-400">
                    <GitPullRequest size={20} />
                    <h2 className="text-xl font-bold">Open-Source Hub</h2>
                </div>
                <span className="text-[10px] text-green-500/70 mt-1 uppercase tracking-wide">{currentDomain}</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            <p className="text-sm text-gray-400 mb-6">
                Contribute to the decentralized knowledge graph for <strong>{currentDomain}</strong>. Proposals undergo Meta-Cognitive Review & Provenance Checks.
            </p>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Entity Name</label>
                    <input 
                        type="text" 
                        value={formData.label}
                        onChange={e => setFormData({...formData, label: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 outline-none"
                        placeholder="e.g. New Gene, Policy, or Strain"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Entity Type</label>
                    <select 
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as NodeType})}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 outline-none"
                    >
                        {Object.values(NodeType).filter(t => typeof t === 'string').map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Scientific Description</label>
                    <textarea 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 outline-none h-24 resize-none"
                        placeholder="Describe mechanism, origin, impact, or evidence..."
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={isSubmitting || !formData.label}
                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <GitPullRequest size={16} />}
                    Submit Proposal
                </button>
            </form>

            {/* AI Feedback Area */}
            {activeProposal && (
                <div className={`rounded-xl p-4 border ${activeProposal.status === 'approved' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            {activeProposal.status === 'approved' ? (
                                <CheckCircle size={18} className="text-green-400" />
                            ) : (
                                <AlertTriangle size={18} className="text-red-400" />
                            )}
                            <h3 className={`font-bold text-sm ${activeProposal.status === 'approved' ? 'text-green-400' : 'text-red-400'}`}>
                                {activeProposal.status === 'approved' ? 'Proposal Accepted' : 'Proposal Rejected'}
                            </h3>
                        </div>
                    </div>
                    
                    {/* Governance Checkpoint */}
                    <div className="bg-black/30 rounded p-2 mb-3 border border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold">
                             <ShieldAlert size={12} /> Governance Checkpoint
                         </div>
                         <div className="text-[10px] font-mono">
                             <span className={activeProposal.provenanceScore && activeProposal.provenanceScore >= 2 ? "text-green-400" : "text-red-400"}>
                                 {activeProposal.provenanceScore || 0}
                             </span>
                             <span className="text-gray-500"> / 2 Studies</span>
                         </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed italic">
                        "{activeProposal.aiCritique}"
                    </p>
                    
                    {/* Sources */}
                    {activeProposal.sources && activeProposal.sources.length > 0 && (
                        <div className="mt-3 border-t border-white/10 pt-2">
                             <h4 className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase mb-1">
                                <Globe size={10} /> Verified Sources
                             </h4>
                             <ul className="space-y-1">
                                {activeProposal.sources.map((s, i) => (
                                    <li key={i}>
                                        <a href={s.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-blue-400 hover:underline">
                                            <ExternalLink size={8} /> {s.title}
                                        </a>
                                    </li>
                                ))}
                             </ul>
                        </div>
                    )}

                    {activeProposal.status === 'approved' && (
                        <div className="mt-3 text-[10px] text-green-300/70 border-t border-green-500/20 pt-2">
                            Added to local {currentDomain} graph.
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default HubPanel;
