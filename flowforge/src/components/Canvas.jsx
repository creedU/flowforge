import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import useWorkflowStore from '../store/useWorkflowStore';
import WorkflowNode from '../nodes/WorkflowNode';

const nodeTypes = { workflowNode: WorkflowNode };

export default function Canvas({ theme }) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    clearSelection,
    executingNodeId,
  } = useWorkflowStore();

  const isDark = theme === 'dark';

  // Inject isExecuting flag into node data for visual highlight
  const enhancedNodes = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        data: { ...n.data, isExecuting: n.id === executingNodeId },
      })),
    [nodes, executingNodeId]
  );

  const handleNodeClick = useCallback(
    (_, node) => {
      selectNode(node);
    },
    [selectNode]
  );

  const handlePaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <ReactFlow
        nodes={enhancedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#6ee7b7', strokeWidth: 2 },
        }}
        style={{
          background: isDark ? '#060d1a' : '#f8faff',
        }}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color={isDark ? '#1e293b' : '#cbd5e1'}
        />
        <Controls
          style={{
            background: isDark ? '#0f172a' : '#fff',
            border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
            borderRadius: 10,
            boxShadow: 'none',
          }}
        />
        <MiniMap
          style={{
            background: isDark ? '#0a0f1a' : '#f0f4ff',
            border: `1px solid ${isDark ? '#1e293b' : '#c7d2fe'}`,
            borderRadius: 10,
          }}
          nodeColor={(n) => {
            const colorMap = {
              trigger: '#22c55e',
              action: '#3b82f6',
              condition: '#f59e0b',
              delay: '#a855f7',
              notification: '#06b6d4',
              transform: '#ef4444',
            };
            return colorMap[n.data?.nodeType] || '#475569';
          }}
          maskColor={isDark ? 'rgba(6,13,26,0.85)' : 'rgba(248,250,255,0.85)'}
        />
      </ReactFlow>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: 48,
              marginBottom: 16,
              opacity: 0.2,
            }}
          >
            ◈
          </div>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 13,
              color: isDark ? '#334155' : '#94a3b8',
              letterSpacing: '0.05em',
            }}
          >
            Add nodes from the sidebar to begin
          </div>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              color: isDark ? '#1e293b' : '#cbd5e1',
              marginTop: 6,
            }}
          >
            Start with a ⚡ Trigger node
          </div>
        </div>
      )}
    </div>
  );
}
