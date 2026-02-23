import useWorkflowStore from '../store/useWorkflowStore';

const NODE_TYPES = [
  {
    type: 'trigger',
    label: 'Trigger',
    icon: '⚡',
    color: '#22c55e',
    description: 'Starts the workflow',
  },
  {
    type: 'action',
    label: 'Action',
    icon: '⚙️',
    color: '#3b82f6',
    description: 'Performs a task',
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: '◈',
    color: '#f59e0b',
    description: 'Branches on logic',
  },
  {
    type: 'delay',
    label: 'Delay',
    icon: '⏱',
    color: '#a855f7',
    description: 'Waits before next step',
  },
  {
    type: 'notification',
    label: 'Notify',
    icon: '🔔',
    color: '#06b6d4',
    description: 'Sends an alert',
  },
  {
    type: 'transform',
    label: 'Transform',
    icon: '⟳',
    color: '#ef4444',
    description: 'Processes data',
  },
];

export default function Sidebar({ theme }) {
  const { addNode, nodes, edges, clearWorkflow, exportJSON, importJSON } = useWorkflowStore();

  const isDark = theme === 'dark';

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) importJSON(file);
    e.target.value = '';
  };

  return (
    <aside
      style={{
        width: 220,
        background: isDark ? '#0a0f1a' : '#f0f4ff',
        borderRight: `1px solid ${isDark ? '#1e293b' : '#c7d2fe'}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        gap: 8,
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: isDark ? '#475569' : '#6366f1',
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          Node Library
        </div>
        <div
          style={{
            fontSize: 11,
            color: isDark ? '#334155' : '#94a3b8',
            fontFamily: "'Courier New', monospace",
          }}
        >
          Click to add to canvas
        </div>
      </div>

      {/* Node cards */}
      {NODE_TYPES.map((node) => (
        <button
          key={node.type}
          onClick={() => addNode(node.type, node.label, node.color, node.icon)}
          title={node.description}
          style={{
            background: isDark ? '#0f172a' : '#fff',
            border: `1px solid ${node.color}44`,
            borderRadius: 10,
            padding: '10px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            transition: 'all 0.15s ease',
            textAlign: 'left',
            width: '100%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = `1px solid ${node.color}`;
            e.currentTarget.style.background = isDark ? '#1e293b' : '#eef2ff';
            e.currentTarget.style.transform = 'translateX(3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = `1px solid ${node.color}44`;
            e.currentTarget.style.background = isDark ? '#0f172a' : '#fff';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `${node.color}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {node.icon}
          </span>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: node.color,
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.05em',
              }}
            >
              {node.label}
            </div>
            <div
              style={{
                fontSize: 10,
                color: isDark ? '#475569' : '#94a3b8',
                fontFamily: "'Courier New', monospace",
                marginTop: 1,
              }}
            >
              {node.description}
            </div>
          </div>
        </button>
      ))}

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: isDark ? '#1e293b' : '#e2e8f0',
          margin: '12px 0',
        }}
      />

      {/* Stats */}
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 11,
          color: isDark ? '#475569' : '#94a3b8',
          lineHeight: 1.8,
        }}
      >
        <div>
          Nodes: <span style={{ color: isDark ? '#6ee7b7' : '#059669' }}>{nodes.length}</span>
        </div>
        <div>
          Edges: <span style={{ color: isDark ? '#93c5fd' : '#3b82f6' }}>{edges.length}</span>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: isDark ? '#1e293b' : '#e2e8f0',
          margin: '4px 0',
        }}
      />

      {/* File actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button
          onClick={exportJSON}
          style={secondaryBtn(isDark, '#22c55e')}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#052e16')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          ↓ Export JSON
        </button>

        <label
          style={{ ...secondaryBtn(isDark, '#3b82f6'), cursor: 'pointer', textAlign: 'center' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#0c1a4a')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          ↑ Import JSON
          <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </label>

        <button
          onClick={clearWorkflow}
          style={secondaryBtn(isDark, '#ef4444')}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#1f0a0a')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          ✕ Clear All
        </button>
      </div>
    </aside>
  );
}

function secondaryBtn(isDark, color) {
  return {
    background: 'transparent',
    border: `1px solid ${color}44`,
    borderRadius: 8,
    padding: '7px 10px',
    cursor: 'pointer',
    color: color,
    fontSize: 11,
    fontFamily: "'Courier New', monospace",
    fontWeight: 700,
    letterSpacing: '0.05em',
    transition: 'all 0.15s ease',
    width: '100%',
  };
}
