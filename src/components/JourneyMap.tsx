import { useMemo, memo } from 'react';
import { motion } from 'motion/react';
import { QueryNode } from '../types';

interface JourneyMapProps {
  nodes: QueryNode[];
  currentNodeId: string | null;
  onNodeClick: (nodeId: string) => void;
}

const JourneyMap = memo(function JourneyMap({ nodes, currentNodeId, onNodeClick }: JourneyMapProps) {
  const { positions, edges, width, height } = useMemo(() => {
    if (nodes.length === 0) return { positions: new Map(), edges: [], width: 280, height: 400 };

    const childrenMap = new Map<string, string[]>();
    nodes.forEach(n => {
      if (n.parentId) {
        if (!childrenMap.has(n.parentId)) childrenMap.set(n.parentId, []);
        childrenMap.get(n.parentId)!.push(n.id);
      }
    });

    const rootNodes = nodes.filter(n => !n.parentId);
    const posMap = new Map<string, {x: number, y: number}>();
    const levelHeight = 60;
    const nodeWidth = 100;

    let currentY = 40;
    
    const assignPositions = (nodeId: string, depth: number, xOffset: number) => {
      posMap.set(nodeId, { x: xOffset, y: currentY + depth * levelHeight });
      
      const children = childrenMap.get(nodeId) || [];
      if (children.length > 0) {
        const totalWidth = (children.length - 1) * nodeWidth;
        let startX = xOffset - totalWidth / 2;
        children.forEach(childId => {
          assignPositions(childId, depth + 1, startX);
          startX += nodeWidth;
        });
      }
    };

    let rootX = 140; // Center of sidebar
    rootNodes.forEach((root) => {
      assignPositions(root.id, 0, rootX);
      const getMaxDepth = (id: string): number => {
        const children = childrenMap.get(id) || [];
        if (children.length === 0) return 0;
        return 1 + Math.max(...children.map(getMaxDepth));
      };
      currentY += (getMaxDepth(root.id) + 1) * levelHeight + 40;
    });

    let maxY = 0;
    let minX = Infinity;
    let maxX = -Infinity;
    posMap.forEach(pos => {
      if (pos.y > maxY) maxY = pos.y;
      if (pos.x < minX) minX = pos.x;
      if (pos.x > maxX) maxX = pos.x;
    });

    const w = Math.max(280, maxX - minX + 100);
    const h = Math.max(400, maxY + 100);
    const xOffset = w / 2 - rootX;

    // Adjust all X positions by xOffset
    posMap.forEach(pos => {
      pos.x += xOffset;
    });

    const edgeList: { id: string, d: string }[] = [];
    nodes.forEach(node => {
      if (node.parentId && posMap.has(node.id) && posMap.has(node.parentId)) {
        const pos = posMap.get(node.id)!;
        const parentPos = posMap.get(node.parentId)!;
        const d = `M ${parentPos.x} ${parentPos.y} C ${parentPos.x} ${parentPos.y + levelHeight/2}, ${pos.x} ${pos.y - levelHeight/2}, ${pos.x} ${pos.y}`;
        edgeList.push({ id: `${node.parentId}-${node.id}`, d });
      }
    });

    return { positions: posMap, edges: edgeList, width: w, height: h };
  }, [nodes]);

  return (
    <div className="w-full h-full overflow-auto">
      <svg width={width} height={height} className="min-w-full min-h-full">
        {edges.map(edge => (
          <motion.path
            key={edge.id}
            d={edge.d}
            fill="none"
            stroke="rgba(232, 220, 200, 0.2)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        ))}
        {nodes.map(node => {
          const pos = positions.get(node.id);
          if (!pos) return null;
          const isCurrent = node.id === currentNodeId;
          
          return (
            <g key={node.id} onClick={() => onNodeClick(node.id)} className="cursor-pointer">
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isCurrent ? 8 : 6}
                fill={isCurrent ? '#f0b429' : '#1a1a4e'}
                stroke={isCurrent ? '#f0b429' : '#e8dcc8'}
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
              {isCurrent && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={12}
                  fill="none"
                  stroke="#f0b429"
                  strokeWidth="1"
                  animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
              <text
                x={pos.x}
                y={pos.y + 20}
                fontSize="10"
                fill={isCurrent ? '#f0b429' : 'rgba(232, 220, 200, 0.7)'}
                textAnchor="middle"
                fontFamily="Inter"
              >
                {node.label.length > 15 ? node.label.substring(0, 15) + '...' : node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});

export default JourneyMap;
