# FlowForge — Visual Workflow Builder

A frontend-only visual workflow automation builder built with React + JavaScript.

## Features

- **Drag & Drop Canvas** — Add, move, connect, and delete nodes visually
- **6 Node Types** — Trigger, Action, Condition, Delay, Notification, Transform
- **Validation Engine** — Checks for trigger nodes, cycles, disconnected nodes, missing labels
- **Execution Simulation** — Topological sort + async step-by-step execution with visual highlighting
- **Undo / Redo** — Full history with Ctrl+Z / Ctrl+Y keyboard shortcuts
- **Auto-save** — Persists to localStorage automatically
- **Import / Export** — Save/load workflows as JSON
- **Light & Dark Mode** — Toggle from the toolbar
- **Execution Logs** — Real-time log panel with timestamps and status icons

## Setup

### Prerequisites
- Node.js 16+ installed
- VS Code

### Installation

```bash
# Clone or create the project
npx create-react-app flowforge
cd flowforge

# Install dependencies
npm install zustand reactflow uuid

# Copy all source files from this project into src/
# (replace the default App.js with App.jsx and add all components)

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── store/
│   └── useWorkflowStore.js     # Zustand store — all state, undo/redo, persistence
├── engine/
│   ├── validator.js             # Graph validation (cycle detection, trigger check)
│   └── executor.js              # Topological sort + async simulation engine
├── nodes/
│   └── WorkflowNode.jsx         # Custom ReactFlow node component
├── components/
│   ├── Sidebar.jsx              # Left panel — node library
│   ├── Canvas.jsx               # Center — ReactFlow canvas
│   ├── ConfigPanel.jsx          # Right panel — node configuration
│   ├── Toolbar.jsx              # Top bar — run/validate/undo buttons
│   ├── ExecutionLog.jsx         # Bottom — live execution logs
│   └── ValidationModal.jsx     # Validation results popup
└── App.jsx                      # Root component — wires everything together
```

## How to Use

1. **Add nodes** — Click any node type in the left sidebar
2. **Connect nodes** — Drag from the bottom handle of one node to the top handle of another
3. **Configure nodes** — Click a node to open the config panel on the right
4. **Validate** — Click "Validate" to check for errors before running
5. **Run** — Click "Run" to simulate execution (watch nodes highlight in sequence)
6. **Undo/Redo** — Use buttons in toolbar or Ctrl+Z / Ctrl+Y
7. **Export** — Click "Export JSON" in the sidebar to download your workflow
8. **Import** — Click "Import JSON" to load a saved workflow

## Architecture

### State Management (Zustand)
All state lives in `useWorkflowStore.js`. The undo/redo system uses the **past/present/future** pattern — before any mutation, a snapshot of `{nodes, edges}` is pushed to `past[]`. Undo pops from past and pushes to future. Redo does the reverse.

### Validation Engine
`validator.js` runs three checks:
- Trigger node presence
- Cycle detection via depth-first search (DFS)
- Disconnected node detection

### Execution Engine
`executor.js` uses **Kahn's algorithm** (BFS-based topological sort) to determine execution order, then simulates each node with an async delay. The currently executing node is highlighted on the canvas via the `executingNodeId` state.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Delete | Delete selected node/edge |
| Scroll | Zoom canvas |
| Middle click drag | Pan canvas |
