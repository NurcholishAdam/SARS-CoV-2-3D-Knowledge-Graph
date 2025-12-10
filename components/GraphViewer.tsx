import React, { useRef, useEffect, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { GraphData, GraphNode, GraphLink, NodeType } from '../types';
import { NODE_COLORS } from '../constants';

interface GraphViewerProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
  width: number;
  height: number;
  highlightedNodeIds?: Set<string>;
}

const GraphViewer: React.FC<GraphViewerProps> = ({ data, onNodeClick, width, height, highlightedNodeIds }) => {
  // Fix: Initialize useRef with null to satisfy TypeScript requirement for an initial value.
  const fgRef = useRef<any>(null);

  // Check if highlighting is active
  const isHighlighting = highlightedNodeIds && highlightedNodeIds.size > 0;

  // Helper to handle node color
  const getNodeColor = (node: GraphNode) => {
    const baseColor = NODE_COLORS[node.type] || '#ffffff';
    
    if (isHighlighting) {
        // If highlighting is active, dim non-highlighted nodes
        return highlightedNodeIds!.has(node.id) ? baseColor : 'rgba(255, 255, 255, 0.1)';
    }
    
    return baseColor;
  };

  // Helper to handle link color
  const getLinkColor = (link: any) => {
    if (isHighlighting) {
        const sourceId = link.source.id || link.source;
        const targetId = link.target.id || link.target;
        
        // Check if both ends of the link are highlighted
        if (highlightedNodeIds!.has(sourceId) && highlightedNodeIds!.has(targetId)) {
            return '#d946ef'; // Fuchsia for hypothesis path
        }
        return 'rgba(255, 255, 255, 0.05)'; // Very dim for others
    }
    return 'rgba(255,255,255,0.2)';
  };

  const getLinkWidth = (link: any) => {
    if (isHighlighting) {
        const sourceId = link.source.id || link.source;
        const targetId = link.target.id || link.target;
        if (highlightedNodeIds!.has(sourceId) && highlightedNodeIds!.has(targetId)) {
            return 2.5;
        }
    }
    return 1;
  };

  const getLinkDirectionalParticles = (link: any) => {
      if (isHighlighting) {
        const sourceId = link.source.id || link.source;
        const targetId = link.target.id || link.target;
        if (highlightedNodeIds!.has(sourceId) && highlightedNodeIds!.has(targetId)) {
            return 4;
        }
      }
      return 0;
  };

  const handleClick = useCallback((node: any) => {
    // Aim at node from outside it
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    if (fgRef.current) {
        fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        3000  // ms transition duration
        );
    }
    onNodeClick(node as GraphNode);
  }, [onNodeClick]);

  return (
    <div className="relative overflow-hidden bg-black">
      <ForceGraph3D
        ref={fgRef}
        width={width}
        height={height}
        graphData={data}
        nodeLabel="label"
        nodeColor={(node: any) => getNodeColor(node)}
        nodeVal={(node: any) => (node.val || 5) * 1.5}
        nodeResolution={16}
        
        // Link Styling
        linkColor={getLinkColor}
        linkWidth={getLinkWidth}
        linkOpacity={1} // We handle opacity in the color string
        
        // Particle Effects for Flow
        linkDirectionalParticles={getLinkDirectionalParticles}
        linkDirectionalParticleWidth={4}
        linkDirectionalParticleSpeed={0.005}
        
        onNodeClick={handleClick}
        backgroundColor="#000000"
        enableNodeDrag={false}
        showNavInfo={false}
      />
      
      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 p-4 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 pointer-events-none select-none">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Legend</h3>
        <div className="flex flex-col gap-2">
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <div key={type} className={`flex items-center gap-2 ${isHighlighting && type !== 'AI Hypothesis' && type !== 'User Evidence' ? 'opacity-30' : 'opacity-100'}`}>
              <span className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: color }}></span>
              <span className="text-xs text-gray-300">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraphViewer;