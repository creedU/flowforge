import { useState, useEffect } from 'react';
import useWorkflowStore from '../store/useWorkflowStore';

const nodeColors = {
  trigger: '#22c55e',
  action: '#3b82f6',
  condition: '#f59e0b',
  delay: '#a855f7',
  notification: '#06b6d4',
  transform: '#ef4444',
};

const nodeIcons = {
  trigger: '⚡',
  action: '⚙️',
  condition: '◈',
  delay: '⏱',
  notification: '🔔',
  transform: '⟳',
};

export default function ConfigPanel({ theme }) {
  const { selectedNode, updateNodeData, deleteNode, clearSelection } = useWorkflowStore();
  const isDark = theme === 'dark';

  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('1');

  // Sync form when selectedNode changes
  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label || '');
      setDescription(selectedNode.data.description || '');
      setDuration(selectedNode.data.config?.duration || '1');
    }
  }, [selectedNode?.id]);

  const handleSave = () => {
    if (!selectedNode) return;
    updateNodeData(selectedNode.id, {
      label,
      description,
      config: { duration },
    });
  };

  const handleDelete = () => {
    if (!selectedNode) return;
    deleteNode(selectedNode.id);
  };

  const color = nodeColors[selectedNode?.data?.nodeType] || '#6366f1';
  const icon = nodeIcons[selectedNode?.data?.nodeType] || '◆';

  const panelBg = isDark ? '#0a0f1a' : '#f0f4ff';
  const borderColor = isDark ? '#1e293b' : '#c7d2fe';
  const textPrimary = isDark ? '#e2e8f0' : '#1e293b';
  const textMuted = isDark ? '#475569' : '#94a3b8';
  const inputBg = isDark ? '#0f172a' : '#fff';
  const inputBorder = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <aside
      style={{
        width: 260,
        background: panelBg,
        borderLeft: `1px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 16px 12px',
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: isDark ? '#475569' : '#6366f1',
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
          }}
        >
          Config Panel
        </div>
      </div>

      {!selectedNode ? (
        // Empty state
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.2 }}>◱</div>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 12,
              color: textMuted,
              lineHeight: 1.6,
            }}
          >
            Click a node on the canvas to configure it
          </div>
        </div>
      ) : (
        // Node config form
        <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
          {/* Node type badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              background: `${color}15`,
              border: `1px solid ${color}44`,
              borderRadius: 10,
            }}
          >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: color,
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {selectedNode.data.nodeType}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: textMuted,
                  fontFamily: "'Courier New', monospace",
                  marginTop: 2,
                }}
              >
                ID: {selectedNode.id.slice(0, 8)}…
              </div>
            </div>
          </div>

          {/* Label field */}
          <div>
            <label style={labelStyle(textMuted)}>Node Label *</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Send Email"
              style={inputStyle(inputBg, inputBorder, textPrimary, color)}
              onFocus={(e) => (e.currentTarget.style.borderColor = color)}
              onBlur={(e) => (e.currentTarget.style.borderColor = inputBorder)}
            />
          </div>

          {/* Description field */}
          <div>
            <label style={labelStyle(textMuted)}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description…"
              rows={3}
              style={{
                ...inputStyle(inputBg, inputBorder, textPrimary, color),
                resize: 'vertical',
                minHeight: 64,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = color)}
              onBlur={(e) => (e.currentTarget.style.borderColor = inputBorder)}
            />
          </div>

          {/* Delay-specific config */}
          {selectedNode.data.nodeType === 'delay' && (
            <div>
              <label style={labelStyle(textMuted)}>Duration (seconds)</label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={inputStyle(inputBg, inputBorder, textPrimary, color)}
                onFocus={(e) => (e.currentTarget.style.borderColor = color)}
                onBlur={(e) => (e.currentTarget.style.borderColor = inputBorder)}
              />
            </div>
          )}

          {/* Condition-specific config */}
          {selectedNode.data.nodeType === 'condition' && (
            <div
              style={{
                padding: '10px 12px',
                background: `#f59e0b15`,
                border: `1px solid #f59e0b44`,
                borderRadius: 8,
                fontFamily: "'Courier New', monospace",
                fontSize: 11,
                color: '#f59e0b',
                lineHeight: 1.6,
              }}
            >
              ◈ Condition nodes evaluate to TRUE or FALSE during execution. Connect two outgoing edges for branching.
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            style={{
              background: color,
              border: 'none',
              borderRadius: 8,
              padding: '10px 16px',
              color: '#fff',
              fontSize: 12,
              fontFamily: "'Courier New', monospace",
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            ✓ Save Changes
          </button>

          {/* Divider */}
          <div style={{ height: 1, background: borderColor }} />

          {/* Delete button */}
          <button
            onClick={handleDelete}
            style={{
              background: 'transparent',
              border: '1px solid #ef444444',
              borderRadius: 8,
              padding: '9px 16px',
              color: '#ef4444',
              fontSize: 12,
              fontFamily: "'Courier New', monospace",
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1f0a0a';
              e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = '#ef444444';
            }}
          >
            ✕ Delete Node
          </button>

          <button
            onClick={clearSelection}
            style={{
              background: 'transparent',
              border: 'none',
              color: textMuted,
              fontSize: 11,
              fontFamily: "'Courier New', monospace",
              cursor: 'pointer',
              padding: '4px 0',
              letterSpacing: '0.05em',
            }}
          >
            ← Deselect
          </button>
        </div>
      )}
    </aside>
  );
}

function labelStyle(color) {
  return {
    display: 'block',
    fontSize: 10,
    fontFamily: "'Courier New', monospace",
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color,
    marginBottom: 6,
  };
}

function inputStyle(bg, border, text, focusColor) {
  return {
    width: '100%',
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 8,
    padding: '8px 10px',
    color: text,
    fontSize: 12,
    fontFamily: "'Courier New', monospace",
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  };
}
