
import React, { useState, useEffect, useMemo } from 'react';
import GraphViewer from './components/GraphViewer';
import Sidebar from './components/Sidebar';
import ControlPanel from './components/ControlPanel';
import HypothesisPanel from './components/HypothesisPanel';
import HubPanel from './components/HubPanel';
import LoreDashboard from './components/LoreDashboard';
import BenchmarkPanel from './components/BenchmarkPanel';
import { DOMAIN_DATA } from './constants';
import { GraphNode, EnrichmentData, NodeType, HypothesisResult, GraphData, HubProposal, GraphDomain, LayoutMode, LoreMetrics } from './types';
import { enrichNodeWithGemini, analyzeEvidence } from './services/gemini';

const App: React.FC = () => {
  const [currentDomain, setCurrentDomain] = useState<GraphDomain>(GraphDomain.SARS_COV_2);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [enrichmentCache, setEnrichmentCache] = useState<Record<string, EnrichmentData>>({});
  const [loadingEnrichment, setLoadingEnrichment] = useState(false);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Modes State
  const [isHypothesisMode, setIsHypothesisMode] = useState(false);
  const [isQuantumMode, setIsQuantumMode] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [isLoreOpen, setIsLoreOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('3d-force');
  
  // Pathfinding State
  const [isPathfindingMode, setIsPathfindingMode] = useState(false);
  const [pathSource, setPathSource] = useState<GraphNode | null>(null);
  const [pathTarget, setPathTarget] = useState<GraphNode | null>(null);
  const [highlightedLinkPair, setHighlightedLinkPair] = useState<Set<string>>(new Set());

  // Data State
  const [hypothesisResult, setHypothesisResult] = useState<HypothesisResult | null>(null);
  const [analyzingHypothesis, setAnalyzingHypothesis] = useState(false);
  const [dynamicGraphData, setDynamicGraphData] = useState<GraphData>(DOMAIN_DATA[currentDomain]);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<Set<string>>(new Set());

  // Handle Domain Change
  useEffect(() => {
    setSelectedNode(null);
    setHypothesisResult(null);
    setHighlightedNodeIds(new Set());
    setHighlightedLinkPair(new Set());
    setPathSource(null);
    setPathTarget(null);
    setDynamicGraphData(DOMAIN_DATA[currentDomain]);
  }, [currentDomain]);

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNodeClick = async (node: GraphNode) => {
    if (isPathfindingMode) {
        if (!pathSource) {
            setPathSource(node);
            setHighlightedNodeIds(new Set([node.id]));
        } else if (!pathTarget && node.id !== pathSource.id) {
            setPathTarget(node);
            // Simulating pathfinding
            setHighlightedNodeIds(new Set([pathSource.id, node.id]));
        } else {
            setPathSource(node);
            setPathTarget(null);
            setHighlightedNodeIds(new Set([node.id]));
        }
        return;
    }

    setSelectedNode(node);
    const neighbors = new Set<string>();
    neighbors.add(node.id);
    dynamicGraphData.links.forEach((link: any) => {
        const sourceId = link.source.id || link.source;
        const targetId = link.target.id || link.target;
        if (sourceId === node.id) neighbors.add(targetId);
        if (targetId === node.id) neighbors.add(sourceId);
    });
    setHighlightedNodeIds(neighbors);

    if (enrichmentCache[node.id]) return; 
    if (node.type === NodeType.QUERY || node.type === NodeType.HYPOTHESIS) return;

    setLoadingEnrichment(true);
    try {
        const data = await enrichNodeWithGemini(node, currentDomain);
        if (data) setEnrichmentCache(prev => ({ ...prev, [node.id]: data }));
    } catch (e) { console.error(e); } finally { setLoadingEnrichment(false); }
  };

  const handleHypothesisAnalysis = async (query: string) => {
    if (!query) {
        setHypothesisResult(null);
        setDynamicGraphData(DOMAIN_DATA[currentDomain]);
        return;
    }

    setAnalyzingHypothesis(true);
    setHypothesisResult(null);
    try {
        const result = await analyzeEvidence(query, DOMAIN_DATA[currentDomain].nodes, currentDomain);
        if (result) {
            setHypothesisResult(result);
            const queryNodeId = 'UserQuery';
            const hypothesisNodeId = 'AIHypothesis';

            const newNodes: GraphNode[] = [
                { id: queryNodeId, label: 'Evidence', type: NodeType.QUERY, description: query },
                { id: hypothesisNodeId, label: 'LORE Hypothesis', type: NodeType.HYPOTHESIS, description: result.hypothesis }
            ];

            const newLinks = [
                { source: queryNodeId, target: hypothesisNodeId, label: 'INPUT' },
                ...result.relevantNodeIds.map(targetId => ({ source: hypothesisNodeId, target: targetId, label: 'INFERENCE' }))
            ];

            setDynamicGraphData(prev => ({ nodes: [...prev.nodes, ...newNodes], links: [...prev.links, ...newLinks] }));
            setHighlightedNodeIds(new Set([queryNodeId, hypothesisNodeId, ...result.relevantNodeIds]));
        }
    } catch (e) { console.error(e); } finally { setAnalyzingHypothesis(false); }
  };

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/20 via-black to-black pointer-events-none z-0"></div>

      <GraphViewer 
        data={dynamicGraphData} 
        onNodeClick={handleNodeClick} 
        width={dimensions.width}
        height={dimensions.height}
        highlightedNodeIds={highlightedNodeIds}
        highlightedLinkPair={highlightedLinkPair}
        selectedNodeId={selectedNode?.id}
        isQuantumMode={isQuantumMode}
        layoutMode={layoutMode}
      />

      <ControlPanel 
        nodes={dynamicGraphData.nodes} 
        onSearchSelect={handleNodeClick}
        onToggleHypothesis={() => { setIsHypothesisMode(!isHypothesisMode); setIsHubOpen(false); }}
        isHypothesisMode={isHypothesisMode}
        onToggleQuantum={() => setIsQuantumMode(!isQuantumMode)}
        isQuantumMode={isQuantumMode}
        onToggleHub={() => { setIsHubOpen(!isHubOpen); setIsHypothesisMode(false); }}
        isHubOpen={isHubOpen}
        onToggleBenchmark={() => setIsLoreOpen(!isLoreOpen)}
        isBenchmarkOpen={isLoreOpen}
        currentDomain={currentDomain}
        onDomainChange={setCurrentDomain}
        layoutMode={layoutMode}
        onLayoutChange={setLayoutMode}
        isPathfindingMode={isPathfindingMode}
        onTogglePathfinding={() => { setIsPathfindingMode(!isPathfindingMode); setPathSource(null); setPathTarget(null); setHighlightedNodeIds(new Set()); }}
      />

      {isHypothesisMode && (
        <HypothesisPanel 
            onAnalyze={handleHypothesisAnalysis}
            onClose={() => setIsHypothesisMode(false)}
            result={hypothesisResult}
            isLoading={analyzingHypothesis}
        />
      )}

      {isLoreOpen && (
          <LoreDashboard 
            onClose={() => setIsLoreOpen(false)}
            metrics={hypothesisResult?.lore || null}
          />
      )}

      {isHubOpen && (
          <HubPanel onClose={() => setIsHubOpen(false)} onApproveProposal={() => {}} currentDomain={currentDomain} />
      )}
      
      {selectedNode && (
        <Sidebar 
            node={selectedNode}
            enrichment={enrichmentCache[selectedNode.id] || null}
            isLoading={loadingEnrichment && !enrichmentCache[selectedNode.id]}
            onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
};

export default App;
