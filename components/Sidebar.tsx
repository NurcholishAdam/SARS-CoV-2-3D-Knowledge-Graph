import React from 'react';
import { X, ExternalLink, Sparkles, Database, Activity, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GraphNode, EnrichmentData, NodeType } from '../types';
import { NODE_COLORS } from '../constants';

interface SidebarProps {
  node: GraphNode | null;
  enrichment: EnrichmentData | null;
  isLoading: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ node, enrichment, isLoading, onClose }) => {
  if (!node) return null;

  const color = NODE_COLORS[node.type];

  return (
    <div className="absolute top-0 right-0 h-full w-full md:w-[480px] bg-slate-950/90 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-300 overflow-hidden flex flex-col z-20">
      {/* Header */}
      <div className="p-6 border-b border-white/10 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-1 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-3 mb-2">
            <span 
                className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded text-black"
                style={{ backgroundColor: color }}
            >
                {node.type}
            </span>
            <span className="text-xs text-gray-400 font-mono">ID: {node.id}</span>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">{node.label}</h2>
        <p className="text-sm text-gray-300 leading-relaxed">{node.description}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Relationships Section (Conceptual Placeholder for enriched relations) */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wider">
            <Activity size={16} /> Known Interactions
          </h3>
          <div className="bg-white/5 rounded-lg p-4 border border-white/5">
             <p className="text-sm text-gray-400 italic">Select connected nodes in the 3D view to explore specific pathways.</p>
          </div>
        </div>

        {/* AI Enrichment Section */}
        <div>
           <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-purple-400 uppercase tracking-wider">
                <Sparkles size={16} /> Gemini Intelligence
              </h3>
              {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-purple-300 animate-pulse">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      Analyzing Literature...
                  </div>
              )}
           </div>

           <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {enrichment ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-purple-200 prose-a:text-purple-400">
                        <ReactMarkdown>{enrichment.summary}</ReactMarkdown>
                    </div>
                ) : !isLoading && (
                    <div className="text-sm text-gray-500 py-8 text-center border border-dashed border-white/10 rounded-lg">
                        Processing enrichment data...
                    </div>
                )}
           </div>
        </div>

        {/* Sources / Evidence */}
        {enrichment && enrichment.sources.length > 0 && (
            <div>
                 <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-400 mb-3 uppercase tracking-wider">
                    <FileText size={16} /> Evidence & Sources
                 </h3>
                 <ul className="space-y-2">
                    {enrichment.sources.map((source, idx) => (
                        <li key={idx} className="bg-slate-900/50 border border-white/5 rounded p-3 hover:border-blue-500/30 transition-colors group">
                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2">
                                <ExternalLink size={14} className="mt-1 text-blue-500 shrink-0 group-hover:text-blue-400" />
                                <span className="text-xs text-gray-300 group-hover:text-white line-clamp-2">{source.title}</span>
                            </a>
                        </li>
                    ))}
                 </ul>
            </div>
        )}

      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-slate-950/50">
        <p className="text-[10px] text-gray-500 text-center">
            AI-generated content can be inaccurate. Verify with primary sources.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;