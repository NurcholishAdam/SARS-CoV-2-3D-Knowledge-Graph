
import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { GraphData, GraphNode, GraphLink, NodeType, LayoutMode } from '../types';
import { NODE_COLORS } from '../constants';

interface GraphViewerProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
  width: number;
  height: number;
  highlightedNodeIds?: Set<string>;
  highlightedLinkPair?: Set<string>; // For Pathfinding: Set of "source-target" strings
  selectedNodeId?: string;
  isQuantumMode: boolean;
  quantumLinkDensity: number;
  layoutMode: LayoutMode;
}

const GraphViewer: React.FC<GraphViewerProps> = ({ 
    data, 
    onNodeClick, 
    width, 
    height, 
    highlightedNodeIds, 
    highlightedLinkPair,
    selectedNodeId, 
    isQuantumMode,
    quantumLinkDensity,
    layoutMode
}) => {
  const fgRef = useRef<any>(null);
  const [tick, setTick] = useState(0);
  const [quantumLinks, setQuantumLinks] = useState<any[]>([]);
  const [isLegendExpanded, setIsLegendExpanded] = useState(true);

  // Animation Loop for Quantum Effects & Random Sampling
  useEffect(() => {
    let frameId: number;
    if (isQuantumMode) {
        const animate = () => {
            setTick(t => t + 0.05);
            
            setQuantumLinks(prevLinks => {
                // 1. Decay existing links (fade out)
                const decayedLinks = prevLinks
                    .map(link => ({ ...link, opacity: (link.opacity || 1) - 0.01 }))
                    .filter(link => link.opacity > 0);

                // 2. Probabilistically add new transient links based on UI density
                // Higher density = lower threshold for random selection
                // Max density (100) -> 0.85 threshold (15% chance/frame)
                // Min density (0) -> 1.0 threshold (0% chance/frame)
                const threshold = 1.0 - (quantumLinkDensity / 600); // Maps 0-100 to roughly 1.0-0.83
                
                if (Math.random() > threshold && data.nodes.length > 5) {
                    const source = data.nodes[Math.floor(Math.random() * data.nodes.length)];
                    const target = data.nodes[Math.floor(Math.random() * data.nodes.length)];
                    
                    if (source.id !== target.id) {
                        decayedLinks.push({ 
                            source: source.id, 
                            target: target.id, 
                            isQuantum: true, 
                            opacity: 1.0 
                        });
                    }
                }
                return decayedLinks;
            });

            frameId = requestAnimationFrame(animate);
        };
        animate();
    } else {
        setTick(0);
        setQuantumLinks([]);
    }
    return () => cancelAnimationFrame(frameId);
  }, [isQuantumMode, quantumLinkDensity, data.nodes]);

  // Merge real links with transient quantum links
  const displayLinks = isQuantumMode 
    ? [...data.links, ...quantumLinks] 
    : data.links;

  // Check if highlighting is active
  const isHighlighting = (highlightedNodeIds && highlightedNodeIds.size > 0) || !!selectedNodeId;

  // Helper to handle node color
  const getNodeColor = (node: GraphNode) => {
    const baseColor = NODE_COLORS[node.type] || '#ffffff';
    
    // Quantum Effect: Superposition
    if (isQuantumMode) {
        return baseColor;
    }

    if (isHighlighting) {
        // If specific node is selected, keep it and neighbors (highlightedIds) bright
        if (selectedNodeId === node.id) return baseColor; // Selected node is full brightness
        if (highlightedNodeIds?.has(node.id)) return baseColor; // Neighbors are full brightness
        return 'rgba(255, 255, 255, 0.1)'; // Others dimmed
    }
    
    return baseColor;
  };

  const getNodeVal = (node: GraphNode) => {
      let baseVal = (node.val || 5) * 1.5;
      
      if (isQuantumMode) {
          // Quantum Pulse
          const pulse = Math.sin(tick * 2 + (node.id.charCodeAt(0))) * 3;
          baseVal = Math.max(1, baseVal + pulse);
      }

      if (selectedNodeId === node.id) {
          return baseVal * 1.5; // Make selected node significantly larger
      }

      return baseVal;
  };

  const getLinkColor = (link: any) => {
    if (link.isQuantum) {
        // Fade out based on opacity state
        return `rgba(6,182,212,${(link.opacity || 1) * 0.8})`; 
    }

    if (isQuantumMode) {
        // Quantum Entanglement visual
        const phase = Math.sin(tick + (link.source.id?.length || 0));
        return phase > 0 ? 'rgba(6,182,212,0.4)' : 'rgba(217,70,239,0.4)';
    }

    if (isHighlighting) {
        const sourceId = link.source.id || link.source;
        const targetId = link.target.id || link.target;
        
        // Pathfinding Highlight
        if (highlightedLinkPair) {
             const key1 = `${sourceId}-${targetId}`;
             const key2 = `${targetId}-${sourceId}`;
             if (highlightedLinkPair.has(key1) || highlightedLinkPair.has(key2)) {
                 return '#f97316'; // Orange for path
             }
        }

        // Highlight links connected to the selected node or between highlighted nodes
        const isConnectedToSelection = selectedNodeId && (sourceId === selectedNodeId || targetId === selectedNodeId);
        const isInHighlightSet = highlightedNodeIds?.has(sourceId) && highlightedNodeIds?.has(targetId);

        if (isConnectedToSelection || isInHighlightSet) {
            return '#ffffff'; // Brighter links for direct connections
        }
        return 'rgba(255, 255, 255, 0.02)'; // Fade other links
    }
    return 'rgba(255,255,255,0.2)';
  };

  const getLinkWidth = (link: any) => {
    if (link.isQuantum) {
        return 0; // Hide the solid line to create a "dotted" effect with particles
    }

    if (isQuantumMode) {
        return Math.abs(Math.sin(tick + (link.target.id?.length || 0))) * 2 + 0.5;
    }
    if (isHighlighting) {
        const sourceId = link.source.id || link.source;
        const targetId = link.target.id || link.target;
        
        // Pathfinding Highlight
        if (highlightedLinkPair) {
             const key1 = `${sourceId}-${targetId}`;
             const key2 = `${targetId}-${sourceId}`;
             if (highlightedLinkPair.has(key1) || highlightedLinkPair.has(key2)) {
                 return 3; 
             }
        }

        const isConnectedToSelection = selectedNodeId && (sourceId === selectedNodeId || targetId === selectedNodeId);
        
        if (isConnectedToSelection) {
            return 2.5; // Thicker links for direct connections
        }
        if (highlightedNodeIds?.has(sourceId) && highlightedNodeIds?.has(targetId)) {
            return 1.5;
        }
        return 0; // Hide irrelevant links almost completely
    }
    return 1;
  };

  const getLinkDirectionalParticles = (link: any) => {
      if (link.isQuantum) return 6; // Dotted effect (stream of particles)

      if (isQuantumMode) return 2; 

      if (isHighlighting) {
        const sourceId = link.source.id || link.source;
        const targetId = link.target.id || link.target;
        
        if (highlightedLinkPair) {
             const key1 = `${sourceId}-${targetId}`;
             const key2 = `${targetId}-${sourceId}`;
             if (highlightedLinkPair.has(key1) || highlightedLinkPair.has(key2)) {
                 return 6; 
             }
        }

        if (selectedNodeId && (sourceId === selectedNodeId || targetId === selectedNodeId)) {
            return 4; // Particles on active connections
        }
      }
      return 0;
  };

  const getLinkDirectionalParticleWidth = (link: any) => {
      if (link.isQuantum) {
          // Pulse effect based on tick and decay opacity
          // Uses sin wave for pulse + base size from opacity
          const pulse = Math.sin(tick * 8) * 1.5;
          return Math.max(0, ((link.opacity || 1) * 3) + pulse);
      }
      return isQuantumMode ? 2 : 4;
  };

  const handleClick = useCallback((node: any) => {
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    if (fgRef.current) {
        fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node, 
        3000 
        );
    }
    onNodeClick(node as GraphNode);
  }, [onNodeClick]);

  // Calculate present types dynamically
  const presentNodeTypes = useMemo(() => {
    const types = new Set(data.nodes.map(n => n.type));
    return Object.entries(NODE_COLORS).filter(([type]) => types.has(type as NodeType));
  }, [data.nodes]);

  return (
    <div className="relative overflow-hidden bg-black">
      <ForceGraph3D
        ref={fgRef}
        width={width}
        height={height}
        graphData={{ nodes: data.nodes, links: displayLinks }}
        nodeLabel="label"
        nodeColor={(node: any) => getNodeColor(node)}
        nodeVal={(node: any) => getNodeVal(node)}
        nodeResolution={16}
        
        // Layouts (Stage 6)
        dagMode={layoutMode === 'dag-td' ? 'td' : layoutMode === 'dag-lr' ? 'lr' : layoutMode === 'radial' ? 'radialout' : undefined}
        
        // Link Styling
        linkColor={getLinkColor}
        linkWidth={getLinkWidth}
        linkOpacity={1}
        
        // Particle Effects
        linkDirectionalParticles={getLinkDirectionalParticles}
        linkDirectionalParticleWidth={getLinkDirectionalParticleWidth}
        linkDirectionalParticleSpeed={isQuantumMode ? 0.01 : 0.005}
        
        onNodeClick={handleClick}
        backgroundColor="#000000"
        enableNodeDrag={false}
        showNavInfo={false}
        
        // Quantum Physics settings (simulated)
        d3AlphaDecay={isQuantumMode ? 0.01 : 0.0228} // Slower decay = more movement
        d3VelocityDecay={isQuantumMode ? 0.6 : 0.4} // Higher friction in quantum mode to prevent explosion while moving
      />
      
      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 pointer-events-auto select-none transition-all duration-300 min-w-[160px]">
        <button 
            onClick={() => setIsLegendExpanded(!isLegendExpanded)}
            className="flex items-center justify-between w-full p-3 hover:bg-white/5 transition-colors rounded-t-lg focus:outline-none"
        >
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Legend</h3>
            {isLegendExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronUp size={14} className="text-gray-400" />}
        </button>
        
        {isLegendExpanded && (
            <div className="px-3 pb-3 flex flex-col gap-2 max-h-[40vh] overflow-y-auto custom-scrollbar">
            {presentNodeTypes.length > 0 ? (
                presentNodeTypes.map(([type, color]) => (
                    <div key={type} className={`flex items-center gap-2 transition-opacity duration-300 ${isHighlighting && type !== NodeType.HYPOTHESIS && type !== NodeType.QUERY ? 'opacity-50' : 'opacity-100'}`}>
                    <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] shrink-0" style={{ backgroundColor: color }}></span>
                    <span className="text-[11px] text-gray-300 leading-tight">{type}</span>
                    </div>
                ))
            ) : (
                <span className="text-[10px] text-gray-500 italic px-1">No nodes loaded</span>
            )}
            </div>
        )}
      </div>
      
      {/* Quantum Mode Indicator */}
      {isQuantumMode && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-none text-center">
              <div className="px-4 py-1 bg-cyan-500/10 border border-cyan-500/50 rounded-full text-cyan-400 text-xs font-mono uppercase tracking-widest animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-2">
                  Quantum Sampling Active
              </div>
              <p className="text-[10px] text-cyan-500/70">Visualizing probabilistic connections & design space</p>
          </div>
      )}
    </div>
  );
};

export default GraphViewer;
