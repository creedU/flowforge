export default function ValidationModal({ errors, warnings, onClose }) {
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0a0f1a',
          border: `1px solid ${hasErrors ? '#ef4444' : '#22c55e'}44`,
          borderRadius: 16,
          padding: 28,
          maxWidth: 460,
          width: '90%',
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${hasErrors ? '#ef444420' : '#22c55e20'}`,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 24 }}>{hasErrors ? '✕' : '✓'}</span>
          <div>
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.1em',
                color: hasErrors ? '#ef4444' : '#22c55e',
                textTransform: 'uppercase',
              }}
            >
              {hasErrors ? 'Validation Failed' : 'Workflow Valid'}
            </div>
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 11,
                color: '#475569',
                marginTop: 2,
              }}
            >
              {hasErrors
                ? `${errors.length} error${errors.length > 1 ? 's' : ''} must be fixed before running`
                : 'Workflow is ready to execute'}
            </div>
          </div>
        </div>

        {/* Errors */}
        {hasErrors && (
          <div style={{ marginBottom: 16 }}>
            {errors.map((err, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '10px 12px',
                  background: '#ef444410',
                  border: '1px solid #ef444433',
                  borderRadius: 8,
                  marginBottom: 8,
                  fontFamily: "'Courier New', monospace",
                  fontSize: 11,
                  color: '#fca5a5',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: '#ef4444', flexShrink: 0 }}>✕</span>
                {err}
              </div>
            ))}
          </div>
        )}

        {/* Warnings */}
        {hasWarnings && (
          <div style={{ marginBottom: 16 }}>
            {warnings.map((warn, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '10px 12px',
                  background: '#f59e0b10',
                  border: '1px solid #f59e0b33',
                  borderRadius: 8,
                  marginBottom: 8,
                  fontFamily: "'Courier New', monospace",
                  fontSize: 11,
                  color: '#fcd34d',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: '#f59e0b', flexShrink: 0 }}>⚠</span>
                {warn}
              </div>
            ))}
          </div>
        )}

        {!hasErrors && !hasWarnings && (
          <div
            style={{
              padding: '12px 16px',
              background: '#22c55e10',
              border: '1px solid #22c55e33',
              borderRadius: 8,
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              color: '#86efac',
              marginBottom: 16,
            }}
          >
            ✓ All checks passed. Click Run in the toolbar to execute.
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: hasErrors ? '#ef444422' : '#22c55e22',
            border: `1px solid ${hasErrors ? '#ef4444' : '#22c55e'}44`,
            borderRadius: 8,
            padding: '10px 16px',
            color: hasErrors ? '#ef4444' : '#22c55e',
            fontSize: 12,
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            letterSpacing: '0.08em',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
