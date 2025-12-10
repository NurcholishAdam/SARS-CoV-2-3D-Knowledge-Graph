import React, { useState } from 'react';
import { Search, Info, BookOpen, XCircle, FlaskConical } from 'lucide-react';
import { GraphNode, NodeType } from '../types';

interface ControlPanelProps {
  nodes: GraphNode[];
  onSearchSelect: (node: GraphNode) => void;
  onToggleHypothesis: () => void;
  isHypothesisMode: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ nodes, onSearchSelect, onToggleHypothesis, isHypothesisMode }) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [onlyLiterature, setOnlyLiterature] = useState(false);

  const filteredNodes = nodes.filter(n => {
    // 1. Filter by Literature Mode
    if (onlyLiterature && n.type !== NodeType.LITERATURE) return false;

    // 2. If no query, only show all if Literature Mode is active
    if (!query) return onlyLiterature;

    const lowerQuery = query.toLowerCase();
    
    // 3. Main Search Logic
    const matchesLabel = n.label.toLowerCase().includes(lowerQuery);
    const matchesId = n.id.toLowerCase().includes(lowerQuery);
    const matchesType = n.type.toLowerCase().includes(lowerQuery);
    
    // 4. Metadata Search (DOI, Authors)
    const matchesDoi = n.metadata?.doi?.toLowerCase().includes(lowerQuery);
    const matchesAuthors = n.metadata?.authors?.toLowerCase().includes(lowerQuery);

    return matchesLabel || matchesId || matchesType || matchesDoi || matchesAuthors;
  });

  const handleSelect = (node: GraphNode) => {
    onSearchSelect(node);
    setQuery('');
    setShowResults(false);
  };

  const toggleLiteratureMode = () => {
    setOnlyLiterature(!onlyLiterature);
    setShowResults(true);
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
      <div className="pointer-events-auto relative w-full max-w-md">
        <div className="relative group flex items-center gap-2">
            
            {/* Search Box */}
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                    <Search size={18} />
                </div>
                <input 
                    type="text" 
                    placeholder={onlyLiterature ? "Search DOI, authors, year..." : "Search proteins, drugs, phenotypes..."} 
                    className={`w-full pl-10 pr-4 py-3 bg-slate-900/80 backdrop-blur-md border ${onlyLiterature ? 'border-purple-500/50 ring-2 ring-purple-500/20' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 shadow-lg transition-all`}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                />
                {query && (
                    <button 
                        onClick={() => setQuery('')}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white"
                    >
                        <XCircle size={14} />
                    </button>
                )}
            </div>

            {/* Literature Toggle Button */}
            <button 
                onClick={toggleLiteratureMode}
                className={`p-3 rounded-xl border backdrop-blur-md transition-all shadow-lg ${
                    onlyLiterature 
                    ? 'bg-purple-600 border-purple-500 text-white' 
                    : 'bg-slate-900/80 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title="Toggle Literature Search"
            >
                <BookOpen size={20} />
            </button>

            {/* Hypothesis Mode Button */}
             <button 
                onClick={onToggleHypothesis}
                className={`p-3 rounded-xl border backdrop-blur-md transition-all shadow-lg ${
                    isHypothesisMode 
                    ? 'bg-fuchsia-600 border-fuchsia-500 text-white' 
                    : 'bg-slate-900/80 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title="Interactive Hypothesis Query"
            >
                <FlaskConical size={20} />
            </button>
        </div>

        {/* Search Results Dropdown */}
        {showResults && (query || onlyLiterature) && (
            <div className="absolute mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-[60vh] overflow-y-auto">
                {filteredNodes.length > 0 ? (
                    filteredNodes.map(node => (
                        <button 
                            key={node.id}
                            className="w-full text-left px-4 py-3 hover:bg-white/10 border-b border-white/5 last:border-0 transition-colors flex flex-col group"
                            onClick={() => handleSelect(node)}
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">{node.label}</span>
                                {node.type === NodeType.LITERATURE && (
                                    <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-gray-300 whitespace-nowrap">
                                        Paper
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">{node.type}</span>
                                {node.metadata?.doi && (
                                    <span className="text-[10px] text-gray-400 bg-black/30 px-1.5 py-0.5 rounded border border-white/5 font-mono">
                                        DOI: {node.metadata.doi}
                                    </span>
                                )}
                            </div>
                            {node.metadata?.authors && (
                                <span className="text-[10px] text-gray-500 mt-1 truncate">
                                    {node.metadata.authors} • {node.metadata.journal} {node.metadata.year}
                                </span>
                            )}
                        </button>
                    ))
                ) : (
                    <div className="px-4 py-8 text-center text-gray-500">
                        <p className="text-sm">No results found.</p>
                        {onlyLiterature && <p className="text-xs mt-1">Try searching for a different keyword or DOI.</p>}
                    </div>
                )}
            </div>
        )}
      </div>

      <div className="pointer-events-auto">
        <button className="p-3 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors shadow-lg">
            <Info size={20} />
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;