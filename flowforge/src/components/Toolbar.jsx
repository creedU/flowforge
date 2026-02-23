import useWorkflowStore from '../store/useWorkflowStore';

export default function Toolbar({ theme, onRun, onValidate, isRunning }) {
  const { undo, redo, past, future, toggleTheme, saveToLocalStorage } = useWorkflowStore();
  const isDark = theme === 'dark';

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const bg = isDark ? '#080f1e' : '#fff';
  const border = isDark ? '#1e293b' : '#e2e8f0';
  const text = isDark ? '#94a3b8' : '#64748b';

  return (
    <div
      style={{
        height: 52,
        background: bg,
        borderBottom: `1px solid ${border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 8,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontWeight: 900,
          fontSize: 15,
          letterSpacing: '0.15em',
          color: '#22c55e',
          marginRight: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{ opacity: 0.8 }}>◈</span>
        FLOWFORGE
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: border }} />

      {/* Undo / Redo */}
      <ToolbarButton
        onClick={undo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        isDark={isDark}
      >
        ↩ Undo
      </ToolbarButton>

      <ToolbarButton
        onClick={redo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
        isDark={isDark}
      >
        ↪ Redo
      </ToolbarButton>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: border }} />

      {/* Validate */}
      <ToolbarButton onClick={onValidate} isDark={isDark} accentColor="#f59e0b" title="Validate workflow">
        ✔ Validate
      </ToolbarButton>

      {/* Run */}
      <ToolbarButton
        onClick={onRun}
        isDark={isDark}
        accentColor="#22c55e"
        title="Run workflow simulation"
        disabled={isRunning}
        filled
      >
        {isRunning ? '⏳ Running…' : '▶ Run'}
      </ToolbarButton>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Save indicator */}
      <ToolbarButton onClick={saveToLocalStorage} isDark={isDark} title="Save to browser storage">
        ⬡ Save
      </ToolbarButton>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: border }} />

      {/* Theme toggle */}
      <ToolbarButton onClick={toggleTheme} isDark={isDark} title="Toggle theme">
        {isDark ? '☀ Light' : '◑ Dark'}
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({ children, onClick, disabled, accentColor, filled, title, isDark }) {
  const color = accentColor || (isDark ? '#475569' : '#64748b');

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        background: filled ? color : 'transparent',
        border: `1px solid ${disabled ? (isDark ? '#1e293b' : '#e2e8f0') : `${color}44`}`,
        borderRadius: 7,
        padding: '5px 12px',
        color: disabled ? (isDark ? '#334155' : '#cbd5e1') : filled ? '#fff' : color,
        fontSize: 11,
        fontFamily: "'Courier New', monospace",
        fontWeight: 700,
        letterSpacing: '0.06em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = filled ? `${color}cc` : `${color}15`;
          e.currentTarget.style.borderColor = color;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = filled ? color : 'transparent';
          e.currentTarget.style.borderColor = `${color}44`;
        }
      }}
    >
      {children}
    </button>
  );
}
