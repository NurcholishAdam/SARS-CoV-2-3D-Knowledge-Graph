import React, { useRef, useEffect, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { GraphData, GraphNode, GraphLink, NodeType } from '../types';
import { NODE_COLORS } from '../constants';

interface GraphViewerProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
  width: number;
  height: number;
}

const GraphViewer: React.FC<GraphViewerProps> = ({ data, onNodeClick, width, height }) => {
  const fgRef = useRef<any>();

  // Helper to handle node color
  const getNodeColor = (node: GraphNode) => {
    return NODE_COLORS[node.type] || '#ffffff';
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
        linkColor={() => 'rgba(255,255,255,0.2)'}
        linkWidth={1}
        linkOpacity={0.5}
        onNodeClick={handleClick}
        backgroundColor="#000000"
        enableNodeDrag={false}
        showNavInfo={false}
        
        // Sprite Text for labels (optional, can be performance heavy, using hover label by default is lighter)
        // But for "coolness", let's leave it to hover
      />
      
      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 p-4 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 pointer-events-none select-none">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Legend</h3>
        <div className="flex flex-col gap-2">
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
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