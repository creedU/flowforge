import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';

const MAX_HISTORY = 50;

const useWorkflowStore = create((set, get) => ({
  // Core workflow state
  nodes: [],
  edges: [],

  // Undo/Redo history (past/present/future pattern)
  past: [],
  future: [],

  // UI state
  selectedNode: null,
  executionLogs: [],
  executingNodeId: null,
  theme: 'dark',

  // ─── Snapshot helper (call before any mutation) ───────────────────────────
  _snapshot: () => {
    const { nodes, edges, past } = get();
    const newPast = [...past, { nodes, edges }];
    if (newPast.length > MAX_HISTORY) newPast.shift();
    set({ past: newPast, future: [] });
  },

  // ─── Node & Edge Operations ───────────────────────────────────────────────
  onNodesChange: (changes) => {
    // position drags don't need snapshot (too frequent); deletions do
    const hasDeletion = changes.some((c) => c.type === 'remove');
    if (hasDeletion) get()._snapshot();
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) }));
  },

  onEdgesChange: (changes) => {
    const hasDeletion = changes.some((c) => c.type === 'remove');
    if (hasDeletion) get()._snapshot();
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) }));
  },

  onConnect: (connection) => {
    get()._snapshot();
    set((state) => ({
      edges: addEdge(
        { ...connection, animated: true, style: { stroke: '#6ee7b7', strokeWidth: 2 } },
        state.edges
      ),
    }));
  },

  addNode: (type, label, color, icon) => {
    get()._snapshot();
    const { v4: uuidv4 } = require('uuid');
    const { nodes } = get();
    const newNode = {
      id: uuidv4(),
      type: 'workflowNode',
      position: {
        x: 120 + Math.random() * 300,
        y: 80 + nodes.length * 100,
      },
      data: { label, nodeType: type, color, icon, config: {} },
    };
    set({ nodes: [...nodes, newNode] });
  },

  deleteNode: (id) => {
    get()._snapshot();
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNode: state.selectedNode?.id === id ? null : state.selectedNode,
    }));
  },

  updateNodeData: (id, data) => {
    get()._snapshot();
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
      selectedNode:
        state.selectedNode?.id === id
          ? { ...state.selectedNode, data: { ...state.selectedNode.data, ...data } }
          : state.selectedNode,
    }));
  },

  selectNode: (node) => set({ selectedNode: node }),
  clearSelection: () => set({ selectedNode: null }),

  // ─── Undo / Redo ──────────────────────────────────────────────────────────
  undo: () => {
    const { past, nodes, edges, future } = get();
    if (!past.length) return;
    const previous = past[past.length - 1];
    set({
      nodes: previous.nodes,
      edges: previous.edges,
      past: past.slice(0, -1),
      future: [{ nodes, edges }, ...future],
    });
  },

  redo: () => {
    const { future, nodes, edges, past } = get();
    if (!future.length) return;
    const next = future[0];
    set({
      nodes: next.nodes,
      edges: next.edges,
      future: future.slice(1),
      past: [...past, { nodes, edges }],
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  // ─── Execution ────────────────────────────────────────────────────────────
  setExecutingNodeId: (id) => set({ executingNodeId: id }),

  addLog: (log) =>
    set((state) => ({
      executionLogs: [
        ...state.executionLogs,
        { ...log, timestamp: new Date().toLocaleTimeString() },
      ],
    })),

  clearLogs: () => set({ executionLogs: [] }),

  // ─── Theme ────────────────────────────────────────────────────────────────
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  // ─── Persistence ──────────────────────────────────────────────────────────
  saveToLocalStorage: () => {
    const { nodes, edges } = get();
    localStorage.setItem('flowforge_workflow', JSON.stringify({ nodes, edges }));
  },

  loadFromLocalStorage: () => {
    try {
      const saved = localStorage.getItem('flowforge_workflow');
      if (saved) {
        const { nodes, edges } = JSON.parse(saved);
        set({ nodes, edges });
      }
    } catch (e) {
      console.error('Failed to load workflow:', e);
    }
  },

  exportJSON: () => {
    const { nodes, edges } = get();
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  },

  importJSON: (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { nodes, edges } = JSON.parse(e.target.result);
        get()._snapshot();
        set({ nodes, edges });
      } catch {
        alert('Invalid workflow JSON file.');
      }
    };
    reader.readAsText(file);
  },

  clearWorkflow: () => {
    get()._snapshot();
    set({ nodes: [], edges: [], selectedNode: null });
  },
}));

export default useWorkflowStore;
