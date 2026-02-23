import { useEffect, useRef } from 'react';

const statusColors = {
  info: '#6366f1',
  running: '#f59e0b',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f97316',
};

const statusIcons = {
  info: '◆',
  running: '▶',
  success: '✓',
  error: '✕',
  warning: '⚠',
};

export default function ExecutionLog({ logs, theme }) {
  const bottomRef = useRef(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const panelBg = isDark ? '#060d1a' : '#f8faff';
  const borderColor = isDark ? '#1e293b' : '#c7d2fe';
  const emptyColor = isDark ? '#1e293b' : '#cbd5e1';

  return (
    <div
      style={{
        height: 180,
        background: panelBg,
        borderTop: `1px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Log header */}
      <div
        style={{
          padding: '8px 16px',
          borderBottom: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            color: isDark ? '#475569' : '#6366f1',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          Execution Log
          {logs.length > 0 && (
            <span
              style={{
                background: '#22c55e22',
                color: '#22c55e',
                fontSize: 9,
                padding: '2px 6px',
                borderRadius: 4,
                border: '1px solid #22c55e44',
              }}
            >
              {logs.length} entries
            </span>
          )}
        </div>
      </div>

      {/* Log entries */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {logs.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              color: emptyColor,
              letterSpacing: '0.05em',
            }}
          >
            Run a workflow to see execution logs here…
          </div>
        ) : (
          logs.map((log, i) => {
            const color = statusColors[log.status] || '#475569';
            const icon = statusIcons[log.status] || '◆';

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  fontFamily: "'Courier New', monospace",
                  fontSize: 11,
                  lineHeight: 1.5,
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                {/* Timestamp */}
                <span style={{ color: isDark ? '#334155' : '#94a3b8', flexShrink: 0, marginTop: 1 }}>
                  {log.timestamp}
                </span>

                {/* Status icon */}
                <span style={{ color, flexShrink: 0, marginTop: 1 }}>{icon}</span>

                {/* Message */}
                <span style={{ color: isDark ? '#94a3b8' : '#475569' }}>{log.message}</span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
