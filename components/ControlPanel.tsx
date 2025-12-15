
import React, { useState, useMemo } from 'react';
import { Search, Info, BookOpen, XCircle, FlaskConical, Atom, GitPullRequest, Globe, FileText, BarChart2, Waypoints, Layout } from 'lucide-react';
import { GraphNode, NodeType, GraphDomain, LayoutMode } from '../types';

interface ControlPanelProps {
  nodes: GraphNode[];
  onSearchSelect: (node: GraphNode) => void;
  onToggleHypothesis: () => void;
  isHypothesisMode: boolean;
  onToggleQuantum: () => void;
  isQuantumMode: boolean;
  onToggleHub: () => void;
  isHubOpen: boolean;
  onToggleBenchmark: () => void;
  isBenchmarkOpen: boolean;
  currentDomain: GraphDomain;
  onDomainChange: (domain: GraphDomain) => void;
  
  // Stage 5 & 6
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
  isPathfindingMode: boolean;
  onTogglePathfinding: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
    nodes, 
    onSearchSelect, 
    onToggleHypothesis, 
    isHypothesisMode,
    onToggleQuantum,
    isQuantumMode,
    onToggleHub,
    isHubOpen,
    onToggleBenchmark,
    isBenchmarkOpen,
    currentDomain,
    onDomainChange,
    layoutMode,
    onLayoutChange,
    isPathfindingMode,
    onTogglePathfinding
}) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [onlyLiterature, setOnlyLiterature] = useState(false);

  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
        const lowerQuery = query.toLowerCase();

        // Literature Mode Logic
        if (onlyLiterature) {
            if (n.type !== NodeType.LITERATURE) return false;
            if (!query) return true; // Show all literature if query is empty in lit mode

            const matchesLabel = n.label.toLowerCase().includes(lowerQuery);
            const matchesId = n.id.toLowerCase().includes(lowerQuery);
            
            // Search metadata if available
            const matchesDoi = n.metadata?.doi?.toLowerCase().includes(lowerQuery);
            const matchesAuthors = n.metadata?.authors?.toLowerCase().includes(lowerQuery);
            const matchesJournal = n.metadata?.journal?.toLowerCase().includes(lowerQuery);
            const matchesYear = n.metadata?.year?.includes(lowerQuery);

            return matchesLabel || matchesId || matchesDoi || matchesAuthors || matchesJournal || matchesYear;
        }

        // Standard Mode Logic
        if (!query) return false;
        
        const matchesLabel = n.label.toLowerCase().includes(lowerQuery);
        const matchesId = n.id.toLowerCase().includes(lowerQuery);
        return matchesLabel || matchesId;
    });
  }, [nodes, query, onlyLiterature]);

  const handleSelect = (node: GraphNode) => {
    onSearchSelect(node);
    setQuery('');
    setShowResults(false);
  };

  const toggleLiteratureMode = () => {
    setOnlyLiterature(!onlyLiterature);
    setShowResults(true); // Open dropdown immediately to show list if empty query
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-4 pointer-events-none">
        {/* Domain Switcher */}
        <div className="pointer-events-auto self-start flex gap-2">
             <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 backdrop-blur-md border border-white/20 rounded-full shadow-xl hover:border-purple-500 transition-all">
                    <Globe size={16} className="text-purple-400" />
                    <span className="text-sm font-bold text-white">{currentDomain}</span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-slate-950/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                    {Object.values(GraphDomain).map(domain => (
                        <button 
                            key={domain}
                            onClick={() => onDomainChange(domain)}
                            className={`w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors ${currentDomain === domain ? 'text-purple-400 bg-white/5' : 'text-gray-300'}`}
                        >
                            {domain}
                        </button>
                    ))}
                </div>
             </div>
        </div>

      <div className="flex justify-between w-full">
        <div className="pointer-events-auto relative w-full max-w-xl">
            <div className="relative group flex items-center gap-2">
                
                {/* Search Box */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text" 
                        placeholder={onlyLiterature ? "Search DOI, authors..." : (isPathfindingMode ? "Search path Start/End..." : "Search entities...")} 
                        className={`w-full pl-10 pr-4 py-3 bg-slate-900/80 backdrop-blur-md border ${onlyLiterature ? 'border-blue-500/50 ring-2 ring-blue-500/20' : (isPathfindingMode ? 'border-orange-500/50' : 'border-white/10')} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 shadow-lg transition-all`}
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

                {/* Main Action Buttons */}
                <button 
                    onClick={toggleLiteratureMode}
                    className={`p-3 rounded-xl border backdrop-blur-md transition-all shadow-lg ${onlyLiterature ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-900/80 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    title="Literature Search"
                >
                    <BookOpen size={20} />
                </button>

                <button 
                    onClick={onToggleHypothesis}
                    className={`p-3 rounded-xl border backdrop-blur-md transition-all shadow-lg ${isHypothesisMode ? 'bg-fuchsia-600 border-fuchsia-500 text-white' : 'bg-slate-900/80 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    title="Meta-Cognitive Query"
                >
                    <FlaskConical size={20} />
                </button>
                
                <button 
                    onClick={onToggleQuantum}
                    className={`p-3 rounded-xl border backdrop-blur-md transition-all shadow-lg ${isQuantumMode ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-slate-900/80 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    title="Quantum-Inspired Mode"
                >
                    <Atom size={20} className={isQuantumMode ? "animate-spin-slow" : ""} />
                </button>

                 <button 
                    onClick={onTogglePathfinding}
                    className={`p-3 rounded-xl border backdrop-blur-md transition-all shadow-lg ${isPathfindingMode ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-900/80 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    title="Pathfinding (Select 2 nodes)"
                >
                    <Waypoints size={20} />
                </button>

                <div className="relative group/layout">
                    <button 
                        className="p-3 bg-slate-900/80 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors shadow-lg"
                        title="Change Layout"
                    >
                        <Layout size={20} />
                    </button>
                    <div className="absolute top-full right-0 mt-2 w-40 bg-slate-950/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden hidden group-hover/layout:block">
                         {(['3d-force', 'dag-td', 'radial'] as LayoutMode[]).map(m => (
                             <button
                                key={m}
                                onClick={() => onLayoutChange(m)}
                                className={`w-full text-left px-4 py-2 text-xs hover:bg-white/10 ${layoutMode === m ? 'text-cyan-400 font-bold' : 'text-gray-300'}`}
                             >
                                {m === '3d-force' ? 'Force Directed' : m === 'dag-td' ? 'Tree (Top-Down)' : 'Radial'}
                             </button>
                         ))}
                    </div>
                </div>

                <button 
                    onClick={onToggleBenchmark}
                    className={`p-3 rounded-xl border backdrop-blur-md transition-all shadow-lg ${isBenchmarkOpen ? 'bg-cyan-900 border-cyan-500 text-white' : 'bg-slate-900/80 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    title="Show Benchmarks"
                >
                    <BarChart2 size={20} />
                </button>
                
                <button 
                    onClick={onToggleHub}
                    className={`p-3 rounded-xl border backdrop-blur-md transition-all shadow-lg ${isHubOpen ? 'bg-green-600 border-green-500 text-white' : 'bg-slate-900/80 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    title="Open Source Hub"
                >
                    <GitPullRequest size={20} />
                </button>
            </div>

            {/* Search Results Dropdown */}
            {showResults && (query || onlyLiterature) && (
                <div className="absolute mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {filteredNodes.length > 0 ? (
                        filteredNodes.map(node => (
                            <button 
                                key={node.id}
                                className="w-full text-left px-4 py-3 hover:bg-white/10 border-b border-white/5 last:border-0 transition-colors flex flex-col group"
                                onClick={() => handleSelect(node)}
                            >
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-medium text-white group-hover:text-purple-300 line-clamp-1">{node.label}</span>
                                    {node.type === NodeType.LITERATURE && (
                                        <div className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                                            <FileText size={10} />
                                            <span className="text-[10px] font-bold">LIT</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">{node.type}</span>
                                    {node.metadata?.year && <span className="text-xs text-gray-600">• {node.metadata.year}</span>}
                                    {node.metadata?.journal && <span className="text-xs text-gray-600 hidden sm:inline">• {node.metadata.journal}</span>}
                                </div>
                                {/* Literature Specific Metadata Display */}
                                {node.type === NodeType.LITERATURE && (
                                    <div className="mt-1.5 flex flex-col gap-0.5 border-t border-white/5 pt-1.5">
                                        {node.metadata?.authors && (
                                            <span className="text-[10px] text-gray-400 truncate">
                                                <span className="text-gray-600">Authors:</span> {node.metadata.authors}
                                            </span>
                                        )}
                                        {node.metadata?.doi && (
                                            <span className="text-[10px] text-gray-500 font-mono">
                                                DOI: {node.metadata.doi}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                            <p className="text-sm">No results found.</p>
                            {onlyLiterature && <p className="text-xs mt-1 text-gray-600">Try searching for authors, DOI, or keywords.</p>}
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
    </div>
  );
};

export default ControlPanel;
