
import React, { useState } from 'react';
import { X, ExternalLink, Sparkles, FileText, BookOpen, Box, Layers } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GraphNode, EnrichmentData } from '../types';
import { NODE_COLORS } from '../constants';

interface SidebarProps {
  node: GraphNode | null;
  relatedLiterature?: GraphNode[];
  enrichment: EnrichmentData | null;
  isLoading: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ node, relatedLiterature, enrichment, isLoading, onClose }) => {
  const [showStructure, setShowStructure] = useState(false);

  if (!node) return null;

  const color = NODE_COLORS[node.type];
  const hasPdb = !!node.metadata?.pdbId;

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
        
        {/* Stage 4: Structure Integration Button */}
        {hasPdb && (
             <button 
                onClick={() => setShowStructure(!showStructure)}
                className={`mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${showStructure ? 'bg-indigo-600 text-white' : 'bg-white/10 text-indigo-300 hover:bg-white/20'}`}
             >
                 {showStructure ? <Layers size={14}/> : <Box size={14}/>}
                 {showStructure ? 'Hide Molecular Model' : `View 3D Structure (${node.metadata?.pdbId})`}
             </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Stage 4: Structure Viewer Embed */}
        {showStructure && node.metadata?.pdbId && (
            <div className="rounded-xl overflow-hidden border border-white/20 h-64 bg-black relative animate-in fade-in duration-500">
                <iframe 
                    src={`https://molstar.org/viewer/?pdb=${node.metadata.pdbId}&hide-controls=1`}
                    className="w-full h-full"
                    title="Molecular Viewer"
                    loading="lazy"
                />
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-[9px] text-gray-400 rounded pointer-events-none">
                    Powered by Mol* & RCSB PDB
                </div>
            </div>
        )}

        {/* Related Literature Section */}
        {relatedLiterature && relatedLiterature.length > 0 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-indigo-400 mb-3 uppercase tracking-wider">
                <BookOpen size={16} /> Related Literature
                </h3>
                <ul className="space-y-3">
                {relatedLiterature.map(lit => (
                    <li key={lit.id} className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                            <span className="text-sm text-gray-200 font-medium">{lit.label}</span>
                            {lit.metadata?.doi && (
                                <a href={`https://doi.org/${lit.metadata.doi}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 shrink-0 flex items-center gap-1">
                                    DOI <ExternalLink size={10} />
                                </a>
                            )}
                        </div>
                         {lit.metadata && (
                            <div className="mt-1 text-xs text-gray-500 font-mono flex flex-col gap-0.5">
                                {lit.metadata.authors && <span>{lit.metadata.authors}</span>}
                                <div className="flex gap-2">
                                     {lit.metadata.journal && <span className="text-gray-400">{lit.metadata.journal}</span>}
                                     {lit.metadata.year && <span className="text-gray-600">({lit.metadata.year})</span>}
                                </div>
                            </div>
                        )}
                        <p className="mt-2 text-xs text-gray-400 leading-relaxed border-l-2 border-indigo-500/30 pl-2">
                            {lit.description}
                        </p>
                    </li>
                ))}
                </ul>
            </div>
        )}

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
