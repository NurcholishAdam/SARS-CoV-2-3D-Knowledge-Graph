import React, { useState } from 'react';
import { Search, Info } from 'lucide-react';
import { GraphNode } from '../types';

interface ControlPanelProps {
  nodes: GraphNode[];
  onSearchSelect: (node: GraphNode) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ nodes, onSearchSelect }) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredNodes = nodes.filter(n => 
    n.label.toLowerCase().includes(query.toLowerCase()) || 
    n.id.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (node: GraphNode) => {
    onSearchSelect(node);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
      <div className="pointer-events-auto relative w-full max-w-md">
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                <Search size={18} />
            </div>
            <input 
                type="text" 
                placeholder="Search proteins, drugs, phenotypes..." 
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 shadow-lg transition-all"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
            />
        </div>

        {/* Search Results Dropdown */}
        {showResults && query && (
            <div className="absolute mt-2 w-full bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                {filteredNodes.length > 0 ? (
                    filteredNodes.map(node => (
                        <button 
                            key={node.id}
                            className="w-full text-left px-4 py-3 hover:bg-white/10 border-b border-white/5 last:border-0 transition-colors flex flex-col"
                            onClick={() => handleSelect(node)}
                        >
                            <span className="text-sm font-medium text-white">{node.label}</span>
                            <span className="text-xs text-gray-500">{node.type}</span>
                        </button>
                    ))
                ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">No entities found.</div>
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