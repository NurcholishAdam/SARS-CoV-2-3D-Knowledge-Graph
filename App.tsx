
import React, { useState, useEffect, useMemo } from 'react';
import GraphViewer from './components/GraphViewer';
import Sidebar from './components/Sidebar';
import ControlPanel from './components/ControlPanel';
import HypothesisPanel from './components/HypothesisPanel';
import HubPanel from './components/HubPanel';
import BenchmarkPanel from './components/BenchmarkPanel';
import { DOMAIN_DATA } from './constants';
import { GraphNode, EnrichmentData, NodeType, HypothesisResult, GraphData, HubProposal, GraphDomain, LayoutMode } from './types';
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
    // Reset transient states
    setSelectedNode(null);
    setHypothesisResult(null);
    setHighlightedNodeIds(new Set());
    setHighlightedLinkPair(new Set());
    setPathSource(null);
    setPathTarget(null);
    setDynamicGraphData(DOMAIN_DATA[currentDomain]);
    // Note: In a real app we might want to preserve dynamic nodes added per domain
  }, [currentDomain]);

  // Handle Window Resize for Graph
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simple BFS Pathfinding for Stage 5
  const calculatePath = (startId: string, endId: string) => {
      const queue = [[startId]];
      const visited = new Set();
      const adjacency: Record<string, string[]> = {};

      // Build adjacency list
      dynamicGraphData.links.forEach((link: any) => {
        const s = link.source.id || link.source;
        const t = link.target.id || link.target;
        if (!adjacency[s]) adjacency[s] = [];
        if (!adjacency[t]) adjacency[t] = [];
        adjacency[s].push(t);
        adjacency[t].push(s);
      });

      while (queue.length > 0) {
          const path = queue.shift()!;
          const node = path[path.length - 1];

          if (node === endId) return path;

          if (!visited.has(node) && adjacency[node]) {
              visited.add(node);
              for (const neighbor of adjacency[node]) {
                  const newPath = [...path, neighbor];
                  queue.push(newPath);
              }
          }
      }
      return null;
  };

  // Handle Node Selection & Enrichment
  const handleNodeClick = async (node: GraphNode) => {
    if (isPathfindingMode) {
        if (!pathSource) {
            setPathSource(node);
            setHighlightedNodeIds(new Set([node.id]));
        } else if (!pathTarget && node.id !== pathSource.id) {
            setPathTarget(node);
            const path = calculatePath(pathSource.id, node.id);
            if (path) {
                setHighlightedNodeIds(new Set(path));
                const linkPairs = new Set<string>();
                for(let i=0; i<path.length-1; i++) {
                    linkPairs.add(`${path[i]}-${path[i+1]}`);
                    linkPairs.add(`${path[i+1]}-${path[i]}`);
                }
                setHighlightedLinkPair(linkPairs);
            }
        } else {
            // Reset if clicking again or trying to set 3rd
            setPathSource(node);
            setPathTarget(null);
            setHighlightedNodeIds(new Set([node.id]));
            setHighlightedLinkPair(new Set());
        }
        return;
    }

    setSelectedNode(node);
    
    // Calculate Neighbors for Highlighting
    const neighbors = new Set<string>();
    neighbors.add(node.id);
    dynamicGraphData.links.forEach((link: any) => {
        const sourceId = link.source.id || link.source;
        const targetId = link.target.id || link.target;
        if (sourceId === node.id) neighbors.add(targetId);
        if (targetId === node.id) neighbors.add(sourceId);
    });
    setHighlightedNodeIds(neighbors);

    // Check Cache
    if (enrichmentCache[node.id]) return; 
    
    // Skip enrichment for interactive nodes
    if (node.type === NodeType.QUERY || node.type === NodeType.HYPOTHESIS) return;

    setLoadingEnrichment(true);
    try {
        const data = await enrichNodeWithGemini(node, currentDomain);
        if (data) {
            setEnrichmentCache(prev => ({ ...prev, [node.id]: data }));
        }
    } catch (e) {
        console.error("Error in app enrichment flow", e);
    } finally {
        setLoadingEnrichment(false);
    }
  };

  // Derive related literature for the sidebar
  const relatedLiterature = useMemo(() => {
    if (!selectedNode) return [];

    const connectedNodeIds = new Set<string>();
    dynamicGraphData.links.forEach((link: any) => {
        const sourceId = link.source.id || link.source;
        const targetId = link.target.id || link.target;
        
        // Check connections to the selected node
        if (sourceId === selectedNode.id) connectedNodeIds.add(targetId);
        if (targetId === selectedNode.id) connectedNodeIds.add(sourceId);
    });

    // Filter nodes that are connected AND are of type LITERATURE
    return dynamicGraphData.nodes.filter(n => 
        connectedNodeIds.has(n.id) && n.type === NodeType.LITERATURE
    );
  }, [selectedNode, dynamicGraphData]);

  const handleCloseSidebar = () => {
      setSelectedNode(null);
      setHighlightedNodeIds(new Set()); // Clear highlights
  };

  const handleHypothesisAnalysis = async (query: string) => {
    if (!query) {
        setHypothesisResult(null);
        setDynamicGraphData(DOMAIN_DATA[currentDomain]);
        setHighlightedNodeIds(new Set());
        return;
    }

    setAnalyzingHypothesis(true);
    setHypothesisResult(null);
    setHighlightedNodeIds(new Set());
    
    // Reset graph to initial before adding new hypothesis
    setDynamicGraphData(DOMAIN_DATA[currentDomain]);

    try {
        const result = await analyzeEvidence(query, DOMAIN_DATA[currentDomain].nodes, currentDomain);
        if (result) {
            setHypothesisResult(result);

            const queryNodeId = 'UserQuery';
            const hypothesisNodeId = 'AIHypothesis';

            const newNodes: GraphNode[] = [
                { id: queryNodeId, label: 'Evidence', type: NodeType.QUERY, description: query, val: 20 },
                { id: hypothesisNodeId, label: 'Hypothesis', type: NodeType.HYPOTHESIS, description: result.hypothesis, val: 30 }
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
            setDynamicGraphData(prev => ({
                nodes: [...prev.nodes, ...newNodes],
                links: [...prev.links, ...newLinks]
            }));

            setHighlightedNodeIds(new Set([queryNodeId, hypothesisNodeId, ...result.relevantNodeIds]));
        }
    } catch (e) {
        console.error("Hypothesis error", e);
    } finally {
        setAnalyzingHypothesis(false);
    }
  };

  const handleApproveProposal = (proposal: HubProposal) => {
      // Inject the new node into the graph dynamically
      const newNode: GraphNode = {
          id: proposal.id,
          label: proposal.nodeLabel,
          type: proposal.nodeType,
          description: proposal.description,
          val: 20,
      };

      // Find a suitable target to link to (just for visualization)
      const targetId = dynamicGraphData.nodes[0]?.id || 'root';

      const newLink = {
          source: proposal.id,
          target: targetId,
          label: 'PROPOSED_CONNECTION'
      };

      setDynamicGraphData(prev => ({
          nodes: [...prev.nodes, newNode],
          links: [...prev.links, newLink]
      }));

      // Focus on it
      handleNodeClick(newNode);
  };

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/20 via-black to-black pointer-events-none z-0"></div>

      <div className="z-0">
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
      </div>

      <ControlPanel 
        nodes={dynamicGraphData.nodes} 
        onSearchSelect={handleNodeClick}
        onToggleHypothesis={() => { setIsHypothesisMode(!isHypothesisMode); setIsHubOpen(false); }}
        isHypothesisMode={isHypothesisMode}
        onToggleQuantum={() => setIsQuantumMode(!isQuantumMode)}
        isQuantumMode={isQuantumMode}
        onToggleHub={() => { setIsHubOpen(!isHubOpen); setIsHypothesisMode(false); }}
        isHubOpen={isHubOpen}
        onToggleBenchmark={() => setIsBenchmarkOpen(!isBenchmarkOpen)}
        isBenchmarkOpen={isBenchmarkOpen}
        currentDomain={currentDomain}
        onDomainChange={setCurrentDomain}
        layoutMode={layoutMode}
        onLayoutChange={setLayoutMode}
        isPathfindingMode={isPathfindingMode}
        onTogglePathfinding={() => { 
            setIsPathfindingMode(!isPathfindingMode); 
            // Reset path state when toggling off
            if(isPathfindingMode) {
                setPathSource(null);
                setPathTarget(null);
                setHighlightedNodeIds(new Set());
                setHighlightedLinkPair(new Set());
            }
        }}
      />

      {isHypothesisMode && (
        <HypothesisPanel 
            onAnalyze={handleHypothesisAnalysis}
            onClose={() => setIsHypothesisMode(false)}
            result={hypothesisResult}
            isLoading={analyzingHypothesis}
        />
      )}

      {isHubOpen && (
          <HubPanel 
            onClose={() => setIsHubOpen(false)}
            onApproveProposal={handleApproveProposal}
            currentDomain={currentDomain}
          />
      )}
      
      {isBenchmarkOpen && (
          <BenchmarkPanel onClose={() => setIsBenchmarkOpen(false)} />
      )}

      {selectedNode && (
        <Sidebar 
            node={selectedNode}
            relatedLiterature={relatedLiterature}
            enrichment={enrichmentCache[selectedNode.id] || null}
            isLoading={loadingEnrichment && !enrichmentCache[selectedNode.id]}
            onClose={handleCloseSidebar}
        />
      )}

      {isPathfindingMode && !pathTarget && (
           <div className="absolute bottom-20 left-0 right-0 text-center pointer-events-none z-20">
               <div className="inline-block bg-orange-900/80 border border-orange-500/50 rounded-full px-4 py-2 text-orange-200 text-sm animate-bounce">
                   {!pathSource ? "Select START node" : "Select TARGET node"}
               </div>
           </div>
      )}

      {!selectedNode && !isHypothesisMode && !isHubOpen && !isBenchmarkOpen && !isPathfindingMode && (
        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
            <p className="text-gray-500 text-sm animate-pulse">
                Exploring Domain: <span className="text-purple-400 font-bold">{currentDomain}</span>
            </p>
        </div>
      )}
    </div>
  );
};

export default App;
