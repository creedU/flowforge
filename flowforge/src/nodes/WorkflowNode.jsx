import { memo } from 'react';
import { Handle, Position } from 'reactflow';

const nodeIcons = {
  trigger: '⚡',
  action: '⚙️',
  condition: '◈',
  delay: '⏱',
  notification: '🔔',
  transform: '⟳',
};

const nodeColors = {
  trigger: { bg: '#052e16', border: '#22c55e', text: '#86efac', accent: '#22c55e' },
  action: { bg: '#0c1a4a', border: '#3b82f6', text: '#93c5fd', accent: '#3b82f6' },
  condition: { bg: '#2d1b00', border: '#f59e0b', text: '#fcd34d', accent: '#f59e0b' },
  delay: { bg: '#1a0c2e', border: '#a855f7', text: '#d8b4fe', accent: '#a855f7' },
  notification: { bg: '#0c2029', border: '#06b6d4', text: '#67e8f9', accent: '#06b6d4' },
  transform: { bg: '#1f0a0a', border: '#ef4444', text: '#fca5a5', accent: '#ef4444' },
};

function WorkflowNode({ data, selected }) {
  const colors = nodeColors[data.nodeType] || nodeColors.action;
  const icon = nodeIcons[data.nodeType] || '◆';
  const isExecuting = data.isExecuting;

  return (
    <div
      style={{
        background: colors.bg,
        border: `2px solid ${isExecuting ? '#fff' : selected ? colors.accent : colors.border}`,
        borderRadius: 12,
        padding: '10px 16px',
        minWidth: 160,
        maxWidth: 220,
        boxShadow: isExecuting
          ? `0 0 20px ${colors.accent}, 0 0 40px ${colors.accent}55`
          : selected
          ? `0 0 12px ${colors.accent}66`
          : `0 4px 16px rgba(0,0,0,0.4)`,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Executing pulse animation */}
      {isExecuting && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `${colors.accent}15`,
            animation: 'pulse 1s ease-in-out infinite',
            borderRadius: 10,
          }}
        />
      )}

      {/* Top handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: colors.accent,
          border: '2px solid #0f172a',
          width: 10,
          height: 10,
          top: -6,
        }}
      />

      {/* Node content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        <span
          style={{
            fontSize: 18,
            filter: isExecuting ? 'brightness(1.5)' : 'none',
          }}
        >
          {icon}
        </span>
        <div>
          <div
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: colors.accent,
              fontWeight: 700,
              fontFamily: "'Courier New', monospace",
              marginBottom: 2,
            }}
          >
            {data.nodeType}
          </div>
          <div
            style={{
              fontSize: 13,
              color: colors.text,
              fontWeight: 600,
              fontFamily: "'Courier New', monospace",
              maxWidth: 160,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.label}
          </div>
        </div>
      </div>

      {/* Status indicator */}
      {isExecuting && (
        <div
          style={{
            marginTop: 8,
            fontSize: 10,
            color: colors.accent,
            fontFamily: "'Courier New', monospace",
            letterSpacing: '0.1em',
          }}
        >
          ▶ EXECUTING…
        </div>
      )}

      {/* Bottom handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: colors.accent,
          border: '2px solid #0f172a',
          width: 10,
          height: 10,
          bottom: -6,
        }}
      />
    </div>
  );
}

export default memo(WorkflowNode);
