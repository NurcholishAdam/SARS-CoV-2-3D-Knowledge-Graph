import React, { useState, useEffect, useMemo } from 'react';
import GraphViewer from './components/GraphViewer';
import Sidebar from './components/Sidebar';
import ControlPanel from './components/ControlPanel';
import { INITIAL_GRAPH_DATA } from './constants';
import { GraphNode, EnrichmentData } from './types';
import { enrichNodeWithGemini } from './services/gemini';

const App: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [enrichmentCache, setEnrichmentCache] = useState<Record<string, EnrichmentData>>({});
  const [loadingEnrichment, setLoadingEnrichment] = useState(false);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Handle Window Resize for Graph
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle Node Selection & Enrichment
  const handleNodeClick = async (node: GraphNode) => {
    setSelectedNode(node);
    
    // Check Cache
    if (enrichmentCache[node.id]) {
        return; 
    }

    // Fetch from Gemini
    setLoadingEnrichment(true);
    try {
        const data = await enrichNodeWithGemini(node);
        if (data) {
            setEnrichmentCache(prev => ({
                ...prev,
                [node.id]: data
            }));
        }
    } catch (e) {
        console.error("Error in app enrichment flow", e);
    } finally {
        setLoadingEnrichment(false);
    }
  };

  const handleCloseSidebar = () => {
    setSelectedNode(null);
  };

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
      
      {/* Background Gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/20 via-black to-black pointer-events-none z-0"></div>

      {/* Main 3D Graph */}
      <div className="z-0">
          <GraphViewer 
            data={INITIAL_GRAPH_DATA} 
            onNodeClick={handleNodeClick} 
            width={dimensions.width}
            height={dimensions.height}
          />
      </div>

      {/* Heads-Up Display (HUD) Layers */}
      <ControlPanel 
        nodes={INITIAL_GRAPH_DATA.nodes} 
        onSearchSelect={handleNodeClick} 
      />

      {/* Detail Sidebar */}
      {selectedNode && (
        <Sidebar 
            node={selectedNode}
            enrichment={enrichmentCache[selectedNode.id] || null}
            isLoading={loadingEnrichment && !enrichmentCache[selectedNode.id]}
            onClose={handleCloseSidebar}
        />
      )}

      {/* Intro Overlay (Disappears on interaction usually, keeping simple here) */}
      {!selectedNode && (
        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
            <p className="text-gray-500 text-sm animate-pulse">
                Click on a node to analyze biological context
            </p>
        </div>
      )}
    </div>
  );
};

export default App;