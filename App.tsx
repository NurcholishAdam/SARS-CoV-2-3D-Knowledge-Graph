import React, { useState, useEffect, useMemo } from 'react';
import GraphViewer from './components/GraphViewer';
import Sidebar from './components/Sidebar';
import ControlPanel from './components/ControlPanel';
import HypothesisPanel from './components/HypothesisPanel';
import { INITIAL_GRAPH_DATA } from './constants';
import { GraphNode, EnrichmentData, NodeType, HypothesisResult, GraphData } from './types';
import { enrichNodeWithGemini, analyzeEvidence } from './services/gemini';

const App: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [enrichmentCache, setEnrichmentCache] = useState<Record<string, EnrichmentData>>({});
  const [loadingEnrichment, setLoadingEnrichment] = useState(false);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Hypothesis State
  const [isHypothesisMode, setIsHypothesisMode] = useState(false);
  const [hypothesisResult, setHypothesisResult] = useState<HypothesisResult | null>(null);
  const [analyzingHypothesis, setAnalyzingHypothesis] = useState(false);
  const [dynamicGraphData, setDynamicGraphData] = useState<GraphData>(INITIAL_GRAPH_DATA);

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
    // If clicking the query or hypothesis node, we don't strictly need detailed sidebar enrichment,
    // but we can allow it if we wanted. For now, let's just select it.
    setSelectedNode(node);
    
    // Check Cache
    if (enrichmentCache[node.id]) {
        return; 
    }
    
    // Skip enrichment for dynamic nodes for now to save tokens, or implement specific logic
    if (node.type === NodeType.QUERY || node.type === NodeType.HYPOTHESIS) return;

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

  const handleHypothesisAnalysis = async (query: string) => {
    if (!query) {
        // Reset
        setHypothesisResult(null);
        setDynamicGraphData(INITIAL_GRAPH_DATA);
        return;
    }

    setAnalyzingHypothesis(true);
    setHypothesisResult(null);
    
    // Reset graph to initial before adding new hypothesis
    setDynamicGraphData(INITIAL_GRAPH_DATA);

    try {
        const result = await analyzeEvidence(query, INITIAL_GRAPH_DATA.nodes);
        if (result) {
            setHypothesisResult(result);

            // Construct Dynamic Graph Elements
            const queryNodeId = 'UserQuery';
            const hypothesisNodeId = 'AIHypothesis';

            const newNodes: GraphNode[] = [
                {
                    id: queryNodeId,
                    label: 'Evidence',
                    type: NodeType.QUERY,
                    description: query,
                    val: 20
                },
                {
                    id: hypothesisNodeId,
                    label: 'Hypothesis',
                    type: NodeType.HYPOTHESIS,
                    description: result.hypothesis,
                    val: 30
                }
            ];

            const newLinks = [
                { source: queryNodeId, target: hypothesisNodeId, label: 'GENERATES' },
                ...result.relevantNodeIds.map(targetId => ({
                    source: hypothesisNodeId,
                    target: targetId,
                    label: 'RELATES_TO'
                }))
            ];

            // Merge with initial data
            // IMPORTANT: Create new array references to trigger graph update
            setDynamicGraphData({
                nodes: [...INITIAL_GRAPH_DATA.nodes, ...newNodes],
                links: [...INITIAL_GRAPH_DATA.links, ...newLinks]
            });
        }
    } catch (e) {
        console.error("Hypothesis error", e);
    } finally {
        setAnalyzingHypothesis(false);
    }
  };

  const toggleHypothesisMode = () => {
    setIsHypothesisMode(!isHypothesisMode);
    if (isHypothesisMode) {
        // Closing mode, reset graph
        setDynamicGraphData(INITIAL_GRAPH_DATA);
        setHypothesisResult(null);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
      
      {/* Background Gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/20 via-black to-black pointer-events-none z-0"></div>

      {/* Main 3D Graph */}
      <div className="z-0">
          <GraphViewer 
            data={dynamicGraphData} 
            onNodeClick={handleNodeClick} 
            width={dimensions.width}
            height={dimensions.height}
          />
      </div>

      {/* Heads-Up Display (HUD) Layers */}
      <ControlPanel 
        nodes={INITIAL_GRAPH_DATA.nodes} 
        onSearchSelect={handleNodeClick}
        onToggleHypothesis={toggleHypothesisMode}
        isHypothesisMode={isHypothesisMode}
      />

      {/* Hypothesis Panel */}
      {isHypothesisMode && (
        <HypothesisPanel 
            onAnalyze={handleHypothesisAnalysis}
            onClose={toggleHypothesisMode}
            result={hypothesisResult}
            isLoading={analyzingHypothesis}
        />
      )}

      {/* Detail Sidebar */}
      {selectedNode && (
        <Sidebar 
            node={selectedNode}
            enrichment={enrichmentCache[selectedNode.id] || null}
            isLoading={loadingEnrichment && !enrichmentCache[selectedNode.id]}
            onClose={handleCloseSidebar}
        />
      )}

      {/* Intro Overlay */}
      {!selectedNode && !isHypothesisMode && (
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