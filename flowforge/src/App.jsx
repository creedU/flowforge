import { useEffect, useState, useCallback } from 'react';
import useWorkflowStore from './store/useWorkflowStore';
import { runWorkflow } from './engine/executor';
import { validateWorkflow, getWorkflowWarnings } from './engine/validator';

import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import ConfigPanel from './components/ConfigPanel';
import ExecutionLog from './components/ExecutionLog';
import Toolbar from './components/Toolbar';
import ValidationModal from './components/ValidationModal';

export default function App() {
  const {
    nodes,
    edges,
    theme,
    executionLogs,
    setExecutingNodeId,
    addLog,
    clearLogs,
    saveToLocalStorage,
    loadFromLocalStorage,
  } = useWorkflowStore();

  const [isRunning, setIsRunning] = useState(false);
  const [validationModal, setValidationModal] = useState(null);

  // Load saved workflow on startup
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // Auto-save on every change
  useEffect(() => {
    if (nodes.length > 0) {
      saveToLocalStorage();
    }
  }, [nodes, edges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        useWorkflowStore.getState().undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        useWorkflowStore.getState().redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleValidate = useCallback(() => {
    const errors = validateWorkflow(nodes, edges);
    const warnings = getWorkflowWarnings(nodes, edges);
    setValidationModal({ errors, warnings });
  }, [nodes, edges]);

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    clearLogs();

    await runWorkflow(
      nodes,
      edges,
      setExecutingNodeId,
      addLog,
      (success) => {
        setIsRunning(false);
      }
    );
  }, [nodes, edges, isRunning, clearLogs, setExecutingNodeId, addLog]);

  const isDark = theme === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: isDark ? '#060d1a' : '#f8faff',
        overflow: 'hidden',
        fontFamily: "'Courier New', monospace",
      }}
    >
      {/* Global styles */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ReactFlow overrides */
        .react-flow__controls button {
          background: ${isDark ? '#0f172a' : '#fff'} !important;
          border-color: ${isDark ? '#1e293b' : '#e2e8f0'} !important;
          color: ${isDark ? '#94a3b8' : '#64748b'} !important;
          border-radius: 6px !important;
        }
        .react-flow__controls button:hover {
          background: ${isDark ? '#1e293b' : '#f1f5f9'} !important;
        }
        .react-flow__attribution { display: none; }
      `}</style>

      {/* Toolbar */}
      <Toolbar
        theme={theme}
        onRun={handleRun}
        onValidate={handleValidate}
        isRunning={isRunning}
      />

      {/* Main layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left sidebar */}
        <Sidebar theme={theme} />

        {/* Center: Canvas + Log */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Canvas theme={theme} />
          <ExecutionLog logs={executionLogs} theme={theme} />
        </div>

        {/* Right config panel */}
        <ConfigPanel theme={theme} />
      </div>

      {/* Validation modal */}
      {validationModal && (
        <ValidationModal
          errors={validationModal.errors}
          warnings={validationModal.warnings}
          onClose={() => setValidationModal(null)}
        />
      )}
    </div>
  );
}
